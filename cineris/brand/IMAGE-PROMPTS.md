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

## Промпты для генерации (Midjourney / Flux / любой генератор)

```
Editorial jewelry photograph, heavy oxidized sterling silver chain with mixed links — plain cable, Balinese granulated links, a tiny carved shell cameo, one 18k gold ring link, byzantine weave section — lying on a black cashmere crew-neck sweater worn by a man, face cropped at the jaw, single warm candle light from the left, deep shadows, dark silver with bright burnished high points, not shiny chrome, 85mm, f/2.8, film grain, luxury, mysterious --ar 4:5
```
```
Macro photograph of a sealed glass reliquary link with silver caps holding a lock of brown hair, part of an oxidized silver chain, black velvet background, rim light, extreme detail, antique Victorian mourning jewelry mood --ar 1:1
```
```
A Victorian black enamel mourning locket open on a dark wooden jeweler's bench, a folded handwritten note burning in a small silver dish beside it, ash and embers, candlelight, cinematic, secret society atmosphere --ar 16:9
```
```
Overhead flat lay of a handmade oxidized silver necklace arranged in a teardrop shape on black felt, box clasp at the top, a tiny ruby in a silver bezel, one gold ring link, jeweler's tools at the edge, moody studio light --ar 4:5
```
```
Long candlelit dinner table for twelve in a dark Los Angeles room, black tablecloth, silver candelabra, twelve sealed black envelopes on the plates, nobody present, cinematic, secret society --ar 16:9
```

> ⚠️ Сгенерированные картинки годятся для настроения (Сожжение, ужин, атмосфера). **Конкретные изделия на продажу показывайте только на реальных фото**: ИИ-картинка, выданная за фото товара, вводит покупателя в заблуждение и даёт повод для претензий.
