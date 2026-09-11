/* ДАННЫЕ САЙТА — правится только этот файл.
   Чтобы добавить товар: скопируй блок { ... } и поменяй значения.
   Порядок в списке = порядок в ленте. Первым ставь то, что продвигаешь сейчас.
   Нет товара на площадке — просто удали её строку из «ссылки».

   ключ       — короткое латинское имя, из него собираются имена файлов
   название   — крупно на сцене, 1–3 слова
   коротко    — одна строка под названием, до 45 знаков, без рекламных прилагательных
   герой      — вырезанный товар без фона, webp до 1200 px и ≤ 150 КБ
   миниатюра  — квадрат 160×160 для ленты справа, ≤ 15 КБ
   декор      — 2–5 летающих деталей без фона (photo/decor/), каждая ≤ 40 КБ
   палитра    — цвета сцены этого товара, берутся с самого товара:
                фон / фон2 — сцена и её тень, акцент / акцент2 — два цвета деталей,
                текст / текст2 — основной и вторичный (контраст к фону ≥ 4,5:1 проверен),
                логотип — 'светлый' на тёмных сценах, 'тёмный' на светлых
   ссылки     — wb, ozon, market (Яндекс Маркет), shop (dasdorrio.ru) */

const ТОВАРЫ = [
  {
    ключ: 'mashinka',
    название: 'Багги на радиоуправлении',
    коротко: 'Полный привод, до 70 км/ч, 30–40 минут хода',
    герой: 'photo/mashinka-hero.webp',
    миниатюра: 'photo/mashinka-thumb.webp',
    декор: [
      'photo/decor/mashinka-1.webp',   // пульт
      'photo/decor/mashinka-2.webp',   // аккумулятор 2000 мАч
      'photo/decor/mashinka-3.webp',   // запасные колёса
    ],
    палитра: { фон: '#1B2620', фон2: '#0F1915', акцент: '#B8F53C', акцент2: '#FFD400', текст: '#F4F8F2', текст2: '#A8BDB0', логотип: 'светлый' },
    ссылки: {
      wb: 'https://www.wildberries.ru/catalog/818290060/detail.aspx',
      ozon: 'https://www.ozon.ru/product/3522577361/',
      shop: 'https://dasdorrio.ru/products/mashinka-na-pulte-upravleniya-dlya-malchika-100021',
    },
  },
  {
    ключ: 'wifi',
    название: 'Wi-Fi адаптер',
    коротко: '2,4 и 5 ГГц, до 600 Мбит/с, USB',
    герой: 'photo/wifi-hero.webp',
    миниатюра: 'photo/wifi-thumb.webp',
    декор: [
      'photo/decor/wifi-1.webp',       // вид сбоку
      'photo/decor/wifi-2.webp',       // вид со спины
    ],
    палитра: { фон: '#F26A1B', фон2: '#D4550E', акцент: '#111111', акцент2: '#FFFFFF', текст: '#1B1006', текст2: '#331503', логотип: 'тёмный' },
    ссылки: {
      wb: 'https://www.wildberries.ru/catalog/1008544354/detail.aspx',
      ozon: 'https://www.ozon.ru/product/3673003479/',
      shop: 'https://dasdorrio.ru/products/vaiy-faiy-adapter-dlya-pk-dasdorrio-wi-fi-adapter-dlya-kompytera-i-dlya-noutbuka-usb-3-100082',
    },
  },
  {
    ключ: 'drakon',
    название: 'Реактивные машинки: дракон',
    коротко: 'Насос, шарики и машинки — едут от воздуха',
    герой: 'photo/drakon-hero.webp',
    миниатюра: 'photo/drakon-thumb.webp',
    декор: [
      'photo/decor/drakon-1.webp',     // ракета с шариком
      'photo/decor/drakon-2.webp',     // машинка
      'photo/decor/drakon-3.webp',     // машинка
      'photo/decor/drakon-4.webp',     // оранжевый шар из видео
      'photo/decor/drakon-5.webp',     // розовый шар из видео
    ],
    палитра: { фон: '#0B7C69', фон2: '#075A4C', акцент: '#FFD23F', акцент2: '#2F7BE8', текст: '#FFFFFF', текст2: '#DDF7EF', логотип: 'светлый' },
    ссылки: {
      wb: 'https://www.wildberries.ru/catalog/333934146/detail.aspx',
      ozon: 'https://www.ozon.ru/product/2129345617/',
      shop: 'https://dasdorrio.ru/products/reaktivnye-mashinki-s-vozdushnymi-sharikami-dasdorrio-igrushki-dlya-malchikov-2-3-4-goda-podarok-na-novyiy-god-i-na-den-rojdeniya-5-100068',
    },
  },
  {
    ключ: 'medved',
    название: 'Реактивные машинки: медведь',
    коротко: 'Тот же набор с насосом, персонаж — медведь',
    герой: 'photo/medved-hero.webp',
    миниатюра: 'photo/medved-thumb.webp',
    декор: [
      'photo/decor/medved-1.webp',     // машинка с шариком
      'photo/decor/medved-2.webp',     // ракета на станции
      'photo/decor/medved-3.webp',     // оранжевый шар из видео
      'photo/decor/medved-4.webp',     // голубой шар из видео
    ],
    палитра: { фон: '#F0A500', фон2: '#D48D00', акцент: '#7E3511', акцент2: '#FF7A1A', текст: '#3B1E06', текст2: '#5E3208', логотип: 'тёмный' },
    ссылки: {
      wb: 'https://www.wildberries.ru/catalog/333952078/detail.aspx',
      ozon: 'https://www.ozon.ru/product/2129370462/',
      shop: 'https://dasdorrio.ru/products/reaktivnye-mashinki-s-vozdushnymi-sharikami-dasdorrio-igrushki-dlya-malchikov-2-3-4-goda-podarok-na-novyiy-god-i-na-den-rojdeniya-100036',
    },
  },
  {
    ключ: 'monstr',
    название: 'Реактивные машинки: монстр',
    коротко: 'Тот же набор с насосом, персонаж — монстр',
    герой: 'photo/monstr-hero.webp',
    миниатюра: 'photo/monstr-thumb.webp',
    декор: [
      'photo/decor/monstr-1.webp',     // ракета
      'photo/decor/monstr-2.webp',     // фигурка на станции
      'photo/decor/monstr-3.webp',     // машинка-краб с шариком
      'photo/decor/monstr-4.webp',     // оранжевый шар из видео
      'photo/decor/monstr-5.webp',     // красный шар из видео
    ],
    палитра: { фон: '#2E7D22', фон2: '#1F5C17', акцент: '#E23D28', акцент2: '#F5C531', текст: '#FFFFFF', текст2: '#E4F6DE', логотип: 'светлый' },
    ссылки: {
      wb: 'https://www.wildberries.ru/catalog/333958215/detail.aspx',
      ozon: 'https://www.ozon.ru/product/2129364886/',
      shop: 'https://dasdorrio.ru/products/reaktivnye-mashinki-s-vozdushnymi-sharikami-dasdorrio-igrushki-dlya-malchikov-2-3-4-goda-podarok-na-novyiy-god-i-na-den-rojdeniya-1-100045',
    },
  },
];
