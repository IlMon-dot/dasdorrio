/* Цены площадок для кнопок сайта: node scripts/prices.mjs [--dry]
   Пишет prices.js (--dry — только лог, без записи). Из .github/workflows/prices.yml cron запускает его каждый час,
   а цены собираются только в часы из prices-settings.json (расписание.часыМСК); ручной и локальный запуск собирает всегда.
   Из products.js берёт у товаров только ключ и «площадки» — чистые идентификаторы; ссылки кнопок
   с метками статистики не читает и по ним не ходит. Настройки — prices-settings.json.
   Репозиторий публичный, лог запуска видят все: ключи Ozon берутся из окружения и никуда не печатаются,
   заголовки и тела ответов тоже — в лог и в prices.js идут только цены и короткие ошибки. */

import { readFileSync, writeFileSync } from 'node:fs';
import { execFile } from 'node:child_process';

const ROOT = new URL('../', import.meta.url);
const DRY = process.argv.includes('--dry');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
const ПЛОЩАДКИ = ['wb', 'ozon', 'shop'];
const ФОРМАТ = { wb: /^\d+$/, ozon: /^\d+$/, shop: /^https:\/\/dasdorrio\.ru\/products\/[^\s?#]+$/ };
// имя кандидата оценки цены с Ozon Картой = префикс + _mul (умножение) или _div (деление)
const ИНДЕКСЫ = [['ozon_index_data', 'ozon_index'], ['external_index_data', 'external'], ['self_marketplaces_index_data', 'self']];

const сейчас = () => new Date().toISOString();
const пауза = (мс) => new Promise((r) => setTimeout(r, мс));
const изФайла = (имя, что) => new Function(readFileSync(new URL(имя, ROOT), 'utf8') + '\n;return ' + что + ';')();
const строка = (п, ключ, текст) => console.log(п.padEnd(5) + ключ.padEnd(10) + текст);

/* ---------- входные данные ---------- */
let настройки = {};
try { настройки = JSON.parse(readFileSync(new URL('prices-settings.json', ROOT), 'utf8')) || {}; }
catch { console.log('prices-settings.json не прочитан — все площадки включены, регион WB — Москва, цены в 06:00 МСК'); }

let прежние = {}, обновлено;
try { const ц = изФайла('prices.js', 'ЦЕНЫ'); прежние = ц.товары || {}; обновлено = ц.обновлено; }
catch (e) { if (e.code !== 'ENOENT') console.log('Прежний prices.js не прочитан — прежние цены при сбое не сохранятся'); }

/* ---------- расписание: cron будит скрипт каждый час ---------- */
// слот — последний час из расписания, уже наступивший. Собрано не раньше слота — выходим без запросов и записи.
// Сравниваем с «обновлено», а не с текущим часом: запуск GitHub опаздывает, а повтор в том же слоте не нужен.
if (process.env.GITHUB_EVENT_NAME === 'schedule') {
  const ЧАС = 3600000, мск = (t) => new Date(t + 3 * ЧАС).toISOString();   // МСК — UTC+3 круглый год
  const р = настройки.расписание?.часыМСК;
  const часы = (Array.isArray(р) ? р : []).filter((ч) => Number.isInteger(ч) && ч >= 0 && ч <= 23);
  if (!часы.length) часы.push(6);
  const вСлот = (t) => часы.includes(new Date(t + 3 * ЧАС).getUTCHours());
  const час = Math.floor(Date.now() / ЧАС) * ЧАС;
  let слот = час, следующий = час + ЧАС;
  while (!вСлот(слот)) слот -= ЧАС;              // часы не пусты — оба цикла короче суток
  while (!вСлот(следующий)) следующий += ЧАС;
  const было = Date.parse(обновлено);           // нет или не дата — NaN, сбор
  // опоздавший запуск догоняем не дольше 3 часов после слота: упавший сбор или push не повторяется каждый час до следующего слота
  if (было >= слот || (было > 0 && Date.now() - слот >= 3 * ЧАС)) {
    const м = мск(было);
    console.log('Не время: последнее обновление ' + м.slice(8, 10) + '.' + м.slice(5, 7) + ' ' + м.slice(11, 16) + ' МСК, следующее — ' + мск(следующий).slice(11, 13) + ':00 МСК');
    process.exit(0);
  }
}

let товары;
try {
  товары = изФайла('products.js', 'ТОВАРЫ').map((т) => ({ ключ: String(т.ключ), площадки: т.площадки || {} }));
} catch (e) {
  console.error('Не прочитался products.js: ' + e.message);
  process.exit(1);
}

/* ---------- записи для prices.js ---------- */
const итоги = { wb: {}, ozon: {}, shop: {} };   // площадка → ключ товара → запись

function удача(п, ключ, запись) {
  итоги[п][ключ] = { ...запись, получено: сейчас() };
  строка(п, ключ, запись.цена + ' ₽' + (запись.сКартой ? ' ≈ с Ozon Картой' : ''));
}
// при сбое прежние цена и дата остаются, добавляются ошибка и время проверки
function сбой(п, ключ, ошибка) {
  const { ошибка: _о, проверено: _п, ...прежнее } = прежние[ключ]?.[п] || {};
  const есть = прежнее.цена != null;
  итоги[п][ключ] = { ...(есть ? прежнее : {}), ошибка, проверено: сейчас() };
  строка(п, ключ, 'ошибка: ' + ошибка + (есть ? ' (оставлена прежняя ' + прежнее.цена + ' ₽)' : ''));
}
// площадка сама сообщила, что товара нет, — цены нет, прежняя не сохраняется
function нетВНаличии(п, ключ) {
  итоги[п][ключ] = { ошибка: 'нет в наличии', проверено: сейчас() };
  строка(п, ключ, 'нет в наличии');
}

// товары с чистым идентификатором площадки; с «?», «#», utm или не в том формате — пропускаются
function список(п) {
  const out = [];
  for (const { ключ, площадки } of товары) {
    const id = String(площадки[п] ?? '').trim();
    if (!id) continue;
    if (/[?#]|utm/i.test(id) || !ФОРМАТ[п].test(id)) {
      итоги[п][ключ] = { ошибка: 'неверный идентификатор', проверено: сейчас() };
      строка(п, ключ, 'ошибка: идентификатор отвергнут — ' + (п === 'shop' ? 'нужен адрес https://dasdorrio.ru/products/… без «?», «#» и utm' : 'нужны только цифры'));
      continue;
    }
    out.push({ ключ, id });
  }
  return out;
}

// ошибки — только свой короткий текст и HTTP-код, без заголовков и тела ответа
async function запрос(url, имя, опции = {}, вид = 'json') {
  let r, тело;
  try {
    r = await fetch(url, { ...опции, headers: { 'User-Agent': UA, ...опции.headers }, signal: AbortSignal.timeout(20000) });
    тело = await r.text();
  } catch { throw new Error(имя + ' не ответил'); }
  if (!r.ok) throw Object.assign(new Error(имя + ' ответил HTTP ' + r.status), { код: r.status });
  if (вид !== 'json') return тело;
  try { return JSON.parse(тело); } catch { throw new Error(имя + ' прислал не JSON'); }
}

// WB отвечает 403 клиенту Node по отпечатку соединения (заголовки не помогают), а curl пускает;
// сообщение execFile содержит команду — его не печатаем
function черезCurl(url, имя) {
  return new Promise((ok, fail) => execFile('curl', ['-sS', '--max-time', '20', '-A', UA, '-w', '\n%{http_code}', url], { maxBuffer: 20 << 20 }, (e, out) => {
    if (e) return fail(new Error(имя + ' не ответил через curl'));
    const i = out.lastIndexOf('\n'), код = Number(out.slice(i + 1));
    if (код !== 200) return fail(new Error(имя + ' ответил HTTP ' + код));
    try { ok(JSON.parse(out.slice(0, i))); } catch { fail(new Error(имя + ' прислал не JSON')); }
  }));
}

/* ---------- Wildberries: цена со скидкой WB для региона, без Кошелька ---------- */
async function wb() {
  const список_ = список('wb');
  if (!список_.length) return;
  const регион = Number.isInteger(настройки.wb?.регион) ? настройки.wb.регион : -1257786;
  let продукты;
  try {
    const url = 'https://card.wb.ru/cards/v4/detail?appType=1&curr=rub&dest=' + регион + '&nm=' + список_.map((т) => т.id).join(';');
    let данные;
    try { данные = await запрос(url, 'WB'); }
    catch (e) {
      if (e.код !== 403) throw e;
      console.log('wb   WB не пустил Node (HTTP 403) — повтор через curl');
      данные = await черезCurl(url, 'WB');
    }
    продукты = данные?.products || данные?.data?.products;
    if (!Array.isArray(продукты)) throw new Error('WB прислал ответ без списка товаров');
  } catch (e) { for (const т of список_) сбой('wb', т.ключ, e.message); return; }

  for (const т of список_) {
    const п = продукты.find((x) => String(x?.id) === т.id);
    if (!п) { сбой('wb', т.ключ, 'нет в ответе WB'); continue; }
    // цены в копейках; у размера без остатка цены нет
    const копейки = Math.min(...(п.sizes || []).map((s) => (s?.price?.product > 0 ? s.price.product + (s.price.logistics || 0) : Infinity)));
    if (копейки < Infinity) удача('wb', т.ключ, { цена: Math.round(копейки / 100) });
    // «нет в наличии» — только если WB сам сообщил нулевой остаток; остаток есть, а цены нет — сбой, прежняя цена остаётся
    else if (п.totalQuantity === 0 || (п.sizes?.length && п.sizes.every((s) => s?.stocks?.length === 0))) нетВНаличии('wb', т.ключ);
    else сбой('wb', т.ключ, 'нет цены в ответе WB');
  }
}

/* ---------- Ozon: цена продавца из Seller API; с картой — только оценка по индексам цен ---------- */
function кандидаты(поз) {
  const out = {};
  for (const [поле, имя] of ИНДЕКСЫ) {
    const д = поз.price_indexes?.[поле], мин = Number(д?.minimal_price), инд = Number(д?.price_index_value);
    if (!(мин > 0 && инд > 0)) continue;
    out[имя + '_mul'] = Math.round(мин * инд);
    if (инд < 2) out[имя + '_div'] = Math.round(мин / (2 - инд));
  }
  return out;
}

async function ozon() {
  const список_ = список('ozon');
  if (!список_.length) return;
  const { OZON_CLIENT_ID: id, OZON_API_KEY: ключ } = process.env;
  if (!id || !ключ) { for (const т of список_) сбой('ozon', т.ключ, 'нет ключа'); return; }
  let позиции;
  try {
    const данные = await запрос('https://api-seller.ozon.ru/v3/product/info/list', 'Ozon', {
      method: 'POST',
      headers: { 'Client-Id': id, 'Api-Key': ключ, 'Content-Type': 'application/json' },
      body: JSON.stringify({ sku: список_.map((т) => Number(т.id)) }),
    });
    позиции = данные?.items || данные?.result?.items;
    if (!Array.isArray(позиции)) throw new Error('Ozon прислал ответ без списка товаров');
  } catch (e) { for (const т of список_) сбой('ozon', т.ключ, e.message); return; }

  const оценка = настройки.ozon?.оценкаКарты;
  for (const т of список_) {
    // sku лежит в items[].sku, в ответах постарше — только в items[].sources[].sku
    const поз = позиции.find((x) => [x?.sku, ...(x?.sources || []).map((s) => s?.sku)].some((s) => String(s) === т.id));
    if (!поз) { сбой('ozon', т.ключ, 'нет в ответе Ozon'); continue; }
    // остаток: has_stock, без него — сумма present по складам; поля stocks нет — считаем, что товар в наличии
    const склад = поз.stocks;
    if ((склад?.has_stock ?? (Array.isArray(склад?.stocks) ? склад.stocks.some((s) => s?.present > 0) : true)) === false) { нетВНаличии('ozon', т.ключ); continue; }
    const цена = Math.round(Number(поз.price));
    if (!(цена > 0)) { сбой('ozon', т.ключ, 'нет цены в ответе Ozon'); continue; }
    const к = кандидаты(поз);
    строка('ozon', т.ключ, 'sku ' + т.id + ', кандидаты с картой: ' + (Object.entries(к).map(([и, ч]) => и + '=' + ч).join(', ') || 'нет'));
    if (typeof оценка === 'string' && Object.hasOwn(к, оценка)) удача('ozon', т.ключ, { цена: к[оценка], сКартой: true, примерно: true });
    else удача('ozon', т.ключ, { цена, сКартой: false });
  }
}

/* ---------- dasdorrio.ru: цена со страницы товара ---------- */
// { цена } — у предложения в наличии есть цена, запасной — meta product:price:amount; без availability товар в наличии.
// { нет } — страница первого товара открылась, но availability OutOfStock / SoldOut / Discontinued либо цены нет вообще.
// null — не страница товара (нет Product в JSON-LD) или цена на месте есть, но числом не читается: это сбой, прежняя цена остаётся.
// Смотрим только ПЕРВЫЙ Product страницы: похожие товары в той же разметке не должны решать за основной.
function ценаСоСтраницы(html) {
  const число = (x) => Number(String(x ?? '').replace(/[\s\u00A0]/g, '').replace(',', '.'));
  let товар = null;
  for (const [, json] of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    let данные;
    try { данные = JSON.parse(json); } catch { continue; }
    const узлы = [данные].flat().flatMap((у) => (у?.['@graph'] ? [у['@graph']].flat() : [у]));
    товар = узлы.find((у) => [у?.['@type']].flat().includes('Product'));
    if (товар) break;
  }
  if (!товар) return null;
  let нет = false, порча = false;                 // порча — цена на месте есть, но числом не читается: разметка изменилась
  for (const o of [товар.offers].flat()) {
    if (!o) continue;
    if (/(OutOfStock|SoldOut|Discontinued)$/i.test(String(o.availability ?? ''))) { нет = true; continue; }
    const поле = o.price ?? o.lowPrice;
    if (поле === undefined || поле === null) continue;
    const цена = число(поле);
    if (цена > 0) return { цена: Math.round(цена) };
    порча = true;
  }
  if (нет) return { нет: true };
  const мета = html.match(/<meta[^>]*product:price:amount[^>]*>/i)?.[0].match(/content=["']([^"']+)/i);
  if (мета) {
    const цена = число(мета[1]);
    if (цена > 0) return { цена: Math.round(цена) };
    порча = true;
  }
  return порча ? null : { нет: true };
}

async function shop() {
  for (const [i, т] of список('shop').entries()) {
    if (i) await пауза(1000);
    try {
      const р = ценаСоСтраницы(await запрос(т.id, 'магазин', { headers: { Accept: 'text/html' } }, 'html'));
      if (!р) сбой('shop', т.ключ, 'не страница товара');
      else if (р.нет) нетВНаличии('shop', т.ключ);
      else удача('shop', т.ключ, { цена: р.цена });
    } catch (e) { сбой('shop', т.ключ, e.message); }
  }
}

/* ---------- запуск: сбой одной площадки не роняет остальные ---------- */
const сборщики = { wb, ozon, shop };
for (const п of ПЛОЩАДКИ) {
  if (настройки[п]?.показывать === false) { console.log(п + ': выключена в prices-settings.json'); continue; }
  try { await сборщики[п](); }
  catch { for (const { ключ, площадки } of товары) if (площадки[п] && !итоги[п][ключ]) сбой(п, ключ, 'сбой скрипта'); }
}

const цены = { обновлено: сейчас(), товары: {} };
for (const { ключ } of товары) {
  const запись = {};
  for (const п of ПЛОЩАДКИ) if (итоги[п][ключ]) запись[п] = итоги[п][ключ];
  if (Object.keys(запись).length) цены.товары[ключ] = запись;
}

const текст = `/* ЦЕНЫ ПЛОЩАДОК — файл пишет scripts/prices.mjs по расписанию, руками не править.
   цена — целые рубли, получено — когда взята; ошибка и проверено — последняя неудачная попытка,
   прежняя цена при этом остаётся. Сайт показывает цену, только если получено не старше 48 часов. */

const ЦЕНЫ = ${JSON.stringify(цены, null, 2)};
`;
if (DRY) console.log('--dry: prices.js не записан');
else { writeFileSync(new URL('prices.js', ROOT), текст); console.log('prices.js записан'); }
