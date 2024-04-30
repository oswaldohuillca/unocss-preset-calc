import { defineConfig } from 'unocss'
import presetUno from '@unocss/preset-uno'
import { presetCalc } from '../src/presetCalc'

export default defineConfig({
  // ...UnoCSS options
  presets: [
    presetUno(),
    presetCalc()
  ]
})