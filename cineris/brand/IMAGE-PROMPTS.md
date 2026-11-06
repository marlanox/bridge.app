# Съёмка и генерация изображений

Сейчас вся графика цепей на сайте нарисована кодом (SVG, `site/src/assets/js/chain.js`), поэтому сайт выглядит законченным без фото. Когда появятся фото, кладите их сюда:

```
site/src/assets/img/og.jpg                     — 1200×630, превью для соцсетей и Google
site/src/assets/img/pieces/<slug>.jpg          — фото каждой модели (имена = slug в pieces.mjs)
```

## Список кадров (реальная съёмка)

1. **Hero:** мужчина в чёрном кашемировом свитере, лицо обрезано по подбородок, цепь 55 см лежит на свитере. Один тёплый источник света слева.
2. **Макро звеньев:** балийская грануляция, камея, рубин, золотое кольцо. Чёрный бархат, глубина резкости 2–3 мм.
3. **Цепь целиком в форме капли** на чёрном войлоке, вид сверху (как в конструкторе).
4. **Руки за верстаком:** клещи, горелка, плетение.
5. **Реликварий:** прядь волос в стекле на просвет.
6. **Сожжение:** медальон, записка, огонь, пепел в серебряной чаше.
7. **Дверь ателье на Melrose** ночью.
8. **Двое с двумя цепями** (Конкорданс): руки переплетены, цепи рядом.

## Промпты для генерации (по канону дома)

Главное в каждом кадре: **тонкая цепь → чёрное овальное звено с золотой точкой → резко массивные кованые овалы**, вес на левой стороне тела. Без крестов, черепов, крыльев, змей.

```
Editorial luxury jewelry photograph: a sterling silver necklace that is a very fine delicate 2mm cable chain on one side and abruptly becomes massive hand-forged hammered oval links (11mm) on the wearer's left side; exactly at the transition, one matte black oval link with a polished silver rim and a single small 18k gold rivet in its centre; worn by a man in a navy tailored blazer over a plain white T-shirt, face cropped at the jaw, soft window light, dark background, oxidized silver with burnished highlights, not shiny chrome, no pendant, no crosses, no skulls, 85mm, f/2.8, film grain --ar 4:5
```
```
Same necklace layered with a thin diamond tennis necklace on a woman's bare collarbone, black silk top, chiaroscuro light, quiet luxury, editorial, Vogue, --ar 4:5
```
```
Macro photograph of a single matte black oval chain link with a polished silver rim and one tiny 18k gold rivet at its centre, between fine silver cable chain and a heavy hammered silver oval link, on black velvet, rim light, extreme detail --ar 1:1
```
```
Overhead flat lay on black felt: an oxidized sterling silver necklace in a teardrop shape, fine chain on one side, three massive hammered oval links on the other, one matte black link with a gold dot at the transition, one antique old-mine cut diamond in a blackened bezel opposite, toggle clasp at top, museum lighting --ar 4:5
```
```
A Victorian black enamel mourning locket open on a dark wooden jeweler's bench, a folded handwritten note burning in a small silver dish beside it, ash and embers, candlelight, cinematic --ar 16:9
```

> ⚠️ Сгенерированные картинки годятся для настроения (Сожжение, ужин, атмосфера). **Конкретные изделия на продажу показывайте только на реальных фото**: ИИ-картинка, выданная за фото товара, вводит покупателя в заблуждение и даёт повод для претензий.
