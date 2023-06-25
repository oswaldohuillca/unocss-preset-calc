# unocss-preset-calc

unocss-preset-calc is a [UnoCSS](https://unocss.dev/) plugin for working with the CSS calc property

```css
/*Example*/
.foo {
  width: calc(250 * clamp(375px,100vw,1920px) / var(--width-screen))
}
```

## Instalation

```bash
npm i unocss-preset-calc -D # with npm
yarn add unocss-preset-calc -D # with yarn
pnpm add unocss-preset-calc -D # with pnpm
```

```css
/*main.css*/
:root {
  --width-screen: 375
}

@media screen (min-width: 768px) {
  :root {
    --width-screen: 1920
  }
}
```

```typescript
// unocss.config.js
import { presetUno, defineConfig } from 'unocss'
import { presetCalc } from 'unocss-preset-calc'

export default defineConfig({
  presets: [
    presetUno(),
    presetCalc({ /** options */}),
  ],
})
```

## Preset Options
```typescript
interface Options {
  /**
   * @default 0
   */
  min?: number
  /**
   * @default 1920
   */
  max?: number
  /**
   * @default '--width-screen'
   */
  golbalVar?: string
}
```