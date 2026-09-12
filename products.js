/* ДАННЫЕ САЙТА — правится только этот файл.
   Чтобы добавить товар: скопируй блок { ... } и поменяй значения.
   Порядок в списке = порядок в ленте. Первым ставь то, что продвигаешь сейчас.
   Нет товара на площадке — просто удали её строку из «ссылки».
   Названия и ссылки удобнее менять в редакторе edit.html на сайте — он перепишет этот файл сам.

   ключ       — короткое латинское имя, из него собираются имена файлов
   название   — крупно на сцене, 1–3 слова
   герой      — вырезанный товар без фона, webp до 1200 px и ≤ 150 КБ
   миниатюра  — квадрат 200×200 для ленты справа, ≤ 18 КБ: товар целиком,
                у наборов — только насос, самая узнаваемая деталь
   сцена      — цельная картинка мира товара БЕЗ самого товара (photo/bg/), квадрат 1400 px, ≤ 130 КБ;
                герой вырезан из той же картинки и ставится на своё место по геройБокс
   геройБокс  — [x, y, ширина, высота] в долях квадрата сцены: где в кадре стоит герой
   палитра    — цвета этого товара:
                фон — глубокий тон вуали под текстом и логотипом: ТЕМНЕЕ самого товара,
                иначе товар сливается с ней (у мятного насоса — тёмно-бирюзовый, у жёлтого — коричневый),
                фон2 — ещё темнее (запас), акцент / акцент2 — два цвета деталей,
                текст / текст2 — основной и вторичный (контраст к фону ≥ 4,5:1 проверен),
                логотип — 'светлый' на тёмных вуалях, 'тёмный' на светлых
   ссылки     — кнопки под названием, по порядку: вид (wb, ozon, market — Яндекс Маркет,
                shop — dasdorrio.ru, other — любая другая), имя — подпись кнопки, адрес — https-ссылка */

/* Метка версии картинок: браузеры держат файлы сайта до 10 минут, поэтому при замене
   любой картинки метку нужно поднять — агент делает это сам при сборке. */
const ВЕРСИЯ_КАРТИНОК = '20260912-2';

const ТОВАРЫ = [
  {
    ключ: 'mashinka',
    название: 'Багги на радиоуправлении',
    герой: 'photo/mashinka-hero.webp',
    миниатюра: 'photo/mashinka-thumb.webp',
    сцена: 'photo/bg/mashinka.webp',
    геройБокс: [0.0908, 0.3594, 0.7695, 0.3428],
    палитра: { фон: '#1B2620', фон2: '#0F1915', акцент: '#B8F53C', акцент2: '#FFD400', текст: '#F4F8F2', текст2: '#A8BDB0', логотип: 'светлый' },
    ссылки: [
      { вид: 'wb', имя: 'Wildberries', адрес: 'https://wildberries.ru/catalog/0/search.aspx?search=WW1083369' },
      { вид: 'ozon', имя: 'Ozon', адрес: 'https://ozon.ru/product/3522577361/?hs=1&utm_campaign=vendor_org_446525&utm_medium=video&utm_source=site&utm_term=prokladka_baggi' },
      { вид: 'shop', имя: 'dasdorrio.ru', адрес: 'https://dasdorrio.ru/products/mashinka-na-pulte-upravleniya-dlya-malchika-100021?utm_source=prokladka' },
    ],
  },
  {
    ключ: 'wifi',
    название: 'Wi-Fi адаптер',
    герой: 'photo/wifi-hero.webp',
    миниатюра: 'photo/wifi-thumb.webp',
    сцена: 'photo/bg/wifi.webp',
    геройБокс: [0.3311, 0.1616, 0.332, 0.6074],
    палитра: { фон: '#F26A1B', фон2: '#D4550E', акцент: '#111111', акцент2: '#FFFFFF', текст: '#1B1006', текст2: '#331503', логотип: 'тёмный' },
    ссылки: [
      { вид: 'wb', имя: 'Wildberries', адрес: 'https://wildberries.ru/catalog/0/search.aspx?search=WW1083374' },
      { вид: 'ozon', имя: 'Ozon', адрес: 'https://ozon.ru/product/3673003479/?hs=1&utm_campaign=vendor_org_446525&utm_medium=video&utm_source=site&utm_term=prokladka_wifi' },
      { вид: 'shop', имя: 'dasdorrio.ru', адрес: 'https://dasdorrio.ru/products/vaiy-faiy-adapter-dlya-pk-dasdorrio-wi-fi-adapter-dlya-kompytera-i-dlya-noutbuka-usb-3-100082?utm_source=prokladka' },
    ],
  },
  {
    ключ: 'drakon',
    название: 'Реактивные машинки: дракон',
    герой: 'photo/drakon-hero.webp',
    миниатюра: 'photo/drakon-thumb.webp',
    сцена: 'photo/bg/drakon.webp',
    геройБокс: [0.3906, 0.1626, 0.4478, 0.6626],
    палитра: { фон: '#0A4F44', фон2: '#063A32', акцент: '#FFD23F', акцент2: '#2F7BE8', текст: '#FFFFFF', текст2: '#CDEBE3', логотип: 'светлый' },
    ссылки: [
      { вид: 'wb', имя: 'Wildberries', адрес: 'https://wildberries.ru/catalog/0/search.aspx?search=WW1083375' },
      { вид: 'ozon', имя: 'Ozon', адрес: 'https://ozon.ru/product/2129345617/?hs=1&utm_campaign=vendor_org_446525&utm_medium=video&utm_source=site&utm_term=prokladka_green_dragon' },
      { вид: 'shop', имя: 'dasdorrio.ru', адрес: 'https://dasdorrio.ru/products/reaktivnye-mashinki-s-vozdushnymi-sharikami-dasdorrio-igrushki-dlya-malchikov-2-3-4-goda-podarok-na-novyiy-god-i-na-den-rojdeniya-5-100068?utm_source=prokladka' },
    ],
  },
  {
    ключ: 'medved',
    название: 'Реактивные машинки: медведь',
    герой: 'photo/medved-hero.webp',
    миниатюра: 'photo/medved-thumb.webp',
    сцена: 'photo/bg/medved.webp',
    геройБокс: [0.3906, 0.1582, 0.4502, 0.6665],
    палитра: { фон: '#7A4300', фон2: '#5A3100', акцент: '#FFB300', акцент2: '#FF7A1A', текст: '#FFFFFF', текст2: '#F7DDB0', логотип: 'светлый' },
    ссылки: [
      { вид: 'wb', имя: 'Wildberries', адрес: 'https://wildberries.ru/catalog/0/search.aspx?search=WW1083376' },
      { вид: 'ozon', имя: 'Ozon', адрес: 'https://ozon.ru/product/2129370462/?hs=1&utm_campaign=vendor_org_446525&utm_medium=video&utm_source=site&utm_term=prokladka_medved' },
      { вид: 'shop', имя: 'dasdorrio.ru', адрес: 'https://dasdorrio.ru/products/reaktivnye-mashinki-s-vozdushnymi-sharikami-dasdorrio-igrushki-dlya-malchikov-2-3-4-goda-podarok-na-novyiy-god-i-na-den-rojdeniya-100036?utm_source=prokladka' },
    ],
  },
  {
    ключ: 'monstr',
    название: 'Реактивные машинки: зеленый монстр',
    герой: 'photo/monstr-hero.webp',
    миниатюра: 'photo/monstr-thumb.webp',
    сцена: 'photo/bg/monstr.webp',
    геройБокс: [0.3945, 0.1226, 0.417, 0.6602],
    палитра: { фон: '#1B5A14', фон2: '#123F0D', акцент: '#F5C531', акцент2: '#E23D28', текст: '#FFFFFF', текст2: '#D6F0CF', логотип: 'светлый' },
    ссылки: [
      { вид: 'wb', имя: 'Wildberries', адрес: 'https://wildberries.ru/catalog/0/search.aspx?search=WW1083382' },
      { вид: 'ozon', имя: 'Ozon', адрес: 'https://ozon.ru/product/2129364886/?hs=1&utm_campaign=vendor_org_446525&utm_medium=video&utm_source=site&utm_term=prokladka_green_monstr' },
      { вид: 'shop', имя: 'dasdorrio.ru', адрес: 'https://dasdorrio.ru/products/reaktivnye-mashinki-s-vozdushnymi-sharikami-dasdorrio-igrushki-dlya-malchikov-2-3-4-goda-podarok-na-novyiy-god-i-na-den-rojdeniya-1-100045?utm_source=prokladka' },
    ],
  },
];
