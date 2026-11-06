# WITHHELD

Сайт и бренд-документы ювелирного дома с Melrose Avenue, Лос-Анджелес.

```
cineris/
├── brand/
│   ├── STRATEGY.md        ← рынок, конкуренты, позиционирование, цены, юр. чек-лист, план на 12 мес.
│   ├── INSTAGRAM.md       ← рубрики, план на 30 дней, посев, шаблоны сообщений
│   └── IMAGE-PROMPTS.md   ← список кадров для фотосъёмки + промпты для генерации
└── site/
    ├── site.config.mjs    ← ВСЁ, что меняется: домен, email, Instagram, адрес, форма, статус Сожжения
    ├── src/
    │   ├── build.mjs      ← сборщик (Node, без зависимостей)
    │   ├── content/       ← тексты страниц: core / pieces / codex / journal
    │   └── assets/        ← css, js (движок цепей, конструктор, хранилище), img
    ├── public/            ← ГОТОВЫЙ САЙТ (52 страницы) — его и выкладывать
    └── netlify.toml
```

## Как посмотреть локально
```bash
cd cineris/site
node src/build.mjs          # пересобрать после правок
cd public && python3 -m http.server 8000   # открыть http://localhost:8000
```

## Как выложить в интернет (5 минут, без программирования)
**Вариант А — Netlify Drop:** зайти на https://app.netlify.com/drop и перетащить папку `cineris/site/public`. Сайт сразу получает адрес; потом в настройках подключить свой домен.

**Вариант Б — Netlify/Vercel из GitHub:** подключить этот репозиторий, base directory `cineris/site`, команда `node src/build.mjs`, папка `public`.

## Что заменить перед запуском (`site.config.mjs`)
- `url`: настоящий домен
- `email`, `instagram`, `phone`
- `address.street`: номер дома на Melrose, когда будет помещение
- `formEndpoint`: адрес Formspree (https://formspree.io), чтобы заявки приходили на почту. Пока он пуст, форма даёт посетителю скопировать текст заявки и отправить вам самому.
- `burning.status`: держать правдой («3 of 10 remain» только если это так)

## Что работает, а что пока демонстрация
| Функция | Статус |
|---|---|
| 52 страницы, SEO, schema.org, sitemap | ✅ готово |
| Фото: только фото Марлы (`src/assets/img/photos/`) | ✅ |
| Генерация фото через fal.ai: `node scripts/generate-images.mjs` | ⏳ нужен ключ fal.ai |
| Порог с лучом света, вещи выходят из темноты при прокрутке (GSAP ScrollTrigger) | ✅ готово |
| Опции на изделии: длина, волос/слеза, запечатанное послание до 1 года | ✅ готово |
| Формы заявок | ✅ работают (с `formEndpoint`) |
| Хранилище: проверка кода и отсчёт дней | 🟡 демо в браузере, нужен бэкенд |
| Загрузка посланий дарителем, NFC-паспорт | ⏳ этап 2 (см. STRATEGY.md §8) |
| Фото изделий | ⏳ после съёмки (см. IMAGE-PROMPTS.md) |

Цены изделий — в `src/content/pieces.mjs`; отрисовка звеньев — `src/assets/js/chain.js`.

## Подключить генерацию картинок (fal.ai)
1. Зарегистрироваться на https://fal.ai, пополнить баланс ($10–20 хватит на сотни кадров), создать ключ: Dashboard → API Keys.
2. С компьютера открыть эту сессию на claude.ai (мобильное приложение пока не показывает форму) и написать «подключай fal» — появится защищённая форма для ключа. Либо вручную: меню окружения → Edit → Network secrets: host `fal.run`, header `Authorization`, prefix `Key`.
3. Дальше `node scripts/generate-images.mjs` сгенерирует кадры в `src/assets/img/gen/`.
