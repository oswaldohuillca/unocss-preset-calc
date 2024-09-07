import type { Preset, Rule } from 'unocss'

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
  CSSglobalVar?: string

  /**
   * @default 375
   */
  mobileBreakpoint?: number

  /**
  * @default 768
  */
  desktopBreakpoint?: number
}

export const calculate = (value: string, options: Options): string => {
  return `calc(${value} * clamp(${options.min}px,100vw,${options.max}px) / var(${options.CSSglobalVar}))`
}

const setProperties = (value: string, properties: string | string[], options: Options) => {
  if (Array.isArray(properties)) {
    return properties.map(item => ({ [item]: calculate(value, options) }))
  }
  if (typeof properties === 'string') {
    return { [properties]: calculate(value, options) }
  }
  throw new Error('properties must be string or string[]')
}

export const createRule = (test: RegExp, properties: string | string[], options: Options): Rule => {
  return [test, ([_, num]) => setProperties(num, properties, options)]
}

export const options: Options = {
  CSSglobalVar: '--width-screen',
  min: 0,
  max: 1920,
  mobileBreakpoint: 375,
  desktopBreakpoint: 768
}

export const presetCalc = (defaultValues?: Options): Preset => {
  const presetOptions: Options = {
    ...options,
    ...defaultValues
  }

  return {
    name: 'unocss-preset-calc',
    preflights: [
      {
        getCSS: () => {
          return `
            :root {
              ${options.CSSglobalVar}: ${options.mobileBreakpoint};
            }
            @media (width >=${options.desktopBreakpoint}px) {
              :root {
                ${options.CSSglobalVar}: ${options.max};
              }
            }
          `
        }
      }
    ],
    rules: [

      //Text
      createRule(/^text-([\.\d]+)$/, 'font-size', presetOptions),
      createRule(/^leading-([\.\d]+)$/, 'line-height', presetOptions),

      createRule(/^w-([\.\d]+)$/, 'width', presetOptions),
      createRule(/^max-w-([\.\d]+)$/, 'max-width', presetOptions),
      createRule(/^min-w-([\.\d]+)$/, 'min-width', presetOptions),
      createRule(/^h-([\.\d]+)$/, 'height', presetOptions),
      createRule(/^max-h-([\.\d]+)$/, 'max-height', presetOptions),
      createRule(/^min-h-([\.\d]+)$/, 'min-height', presetOptions),
      createRule(/^size-([\.\d]+)$/, ['width', 'height'], presetOptions),

      //Gap
      createRule(/^gap-([\.\d]+)$/, 'gap', presetOptions),
      createRule(/^gap-x-([\.\d]+)$/, 'column-gap', presetOptions),
      createRule(/^gap-y-([\.\d]+)$/, 'row-gap', presetOptions),

      //border
      createRule(/^border-([\.\d]+)$/, 'border-width', presetOptions),
      createRule(/^border-t-([\.\d]+)$/, 'border-top-width', presetOptions),
      createRule(/^border-r-([\.\d]+)$/, 'border-right-width', presetOptions),
      createRule(/^border-b-([\.\d]+)$/, 'border-bottom-width', presetOptions),
      createRule(/^border-l-([\.\d]+)$/, 'border-left-width', presetOptions),
      createRule(/^border-y-([\.\d]+)$/, ['order-top-width', 'border-bottom-width'], presetOptions),
      createRule(/^border-x-([\.\d]+)$/, ['order-left-width', 'border-right-width'], presetOptions),

      //border-radius
      createRule(/^rounded-([\.\d]+)$/, 'border-radius', presetOptions),
      createRule(/^rounded-tl-([\.\d]+)$/, 'border-top-left-radius', presetOptions),
      createRule(/^rounded-tr-([\.\d]+)$/, 'border-top-right-radius', presetOptions),
      createRule(/^rounded-bl-([\.\d]+)$/, 'border-bottom-left-radius', presetOptions),
      createRule(/^rounded-br-([\.\d]+)$/, 'border-bottom-right-radius', presetOptions),
      createRule(/^rounded-t-([\.\d]+)$/, ['border-top-left-radius', 'border-top-right-radius'], presetOptions),
      createRule(/^rounded-l-([\.\d]+)$/, ['border-top-left-radius', 'border-bottom-left-radius'], presetOptions),
      createRule(/^rounded-r-([\.\d]+)$/, ['border-top-right-radius', 'border-bottom-right-radius'], presetOptions),
      createRule(/^rounded-b-([\.\d]+)$/, ['border-bottom-left-radius', 'border-bottom-right-radius'], presetOptions),

      //postisitons
      createRule(/^top-([\.\d]+)$/, 'top', presetOptions),
      createRule(/^left-([\.\d]+)$/, 'left', presetOptions),
      createRule(/^bottom-([\.\d]+)$/, 'bottom', presetOptions),
      createRule(/^right-([\.\d]+)$/, 'right', presetOptions),

      //margins
      createRule(/^m-([\.\d]+)$/, 'margin', presetOptions),
      createRule(/^mt-([\.\d]+)$/, 'margin-top', presetOptions),
      createRule(/^ml-([\.\d]+)$/, 'margin-left', presetOptions),
      createRule(/^mr-([\.\d]+)$/, 'margin-right', presetOptions),
      createRule(/^mb-([\.\d]+)$/, 'margin-bottom', presetOptions),
      createRule(/^mx-([\.\d]+)$/, ['margin-left', 'margin-right'], presetOptions),
      createRule(/^my-([\.\d]+)$/, ['margin-top', 'margin-bottom'], presetOptions),

      //paddings
      createRule(/^p-([\.\d]+)$/, 'padding', presetOptions),
      createRule(/^pt-([\.\d]+)$/, 'padding-top', presetOptions),
      createRule(/^pl-([\.\d]+)$/, 'padding-left', presetOptions),
      createRule(/^pr-([\.\d]+)$/, 'padding-right', presetOptions),
      createRule(/^pb-([\.\d]+)$/, 'padding-bottom', presetOptions),
      createRule(/^px-([\.\d]+)$/, ['padding-left', 'padding-right'], presetOptions),
      createRule(/^py-([\.\d]+)$/, ['padding-top', 'padding-bottom'], presetOptions),
    ],
  }
}
