import { defineConfig } from 'unocss'
import presetUno from '@unocss/preset-uno'
import { presetCalc } from '../src/preset-calc'

export default defineConfig({
  // ...UnoCSS options
  presets: [
    presetUno(),
    presetCalc({
      max: 1200,
      container: {
        padding: {
          DEFAULT: '1rem',
          md: 50,
          lg: 100
        }
      }
    })
  ],
})