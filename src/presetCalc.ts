import type { Preset, Rule } from '@unocss/core'

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
}

const calculate = (value: string, options: Options): string => {
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

const createRule = (test: RegExp, properties: string | string[], options: Options): Rule => {
  return [test, ([_, num]) => setProperties(num, properties, options)]
}


export const presetCalc = (defaultValues?: Options): Preset => {
  const options: Options = {
    min: 0,
    max: 1920,
    CSSglobalVar: '--width-screen',
    ...defaultValues
  }

  return {
    name: 'unocss-preset-calc',
    rules: [

      //Text
      createRule(/^text-([\.\d]+)$/, 'font-size', options),
      createRule(/^leading-([\.\d]+)$/, 'line-height', options),

      createRule(/^w-([\.\d]+)$/, 'width', options),
      createRule(/^max-w-([\.\d]+)$/, 'max-width', options),
      createRule(/^min-w-([\.\d]+)$/, 'min-width', options),
      createRule(/^h-([\.\d]+)$/, 'height', options),
      createRule(/^max-h-([\.\d]+)$/, 'max-height', options),
      createRule(/^min-h-([\.\d]+)$/, 'min-height', options),

      //Gap
      createRule(/^gap-([\.\d]+)$/, 'gap', options),
      createRule(/^gap-x-([\.\d]+)$/, 'column-gap', options),
      createRule(/^gap-y-([\.\d]+)$/, 'row-gap', options),

      //border-radius
      createRule(/^rounded-([\.\d]+)$/, 'border-radius', options),
      createRule(/^rounded-tl-([\.\d]+)$/, 'border-top-left-radius', options),
      createRule(/^rounded-tr-([\.\d]+)$/, 'border-top-right-radius', options),
      createRule(/^rounded-bl-([\.\d]+)$/, 'border-bottom-left-radius', options),
      createRule(/^rounded-br-([\.\d]+)$/, 'border-bottom-right-radius', options),
      createRule(/^rounded-t-([\.\d]+)$/, ['border-top-left-radius', 'border-top-right-radius'], options),
      createRule(/^rounded-l-([\.\d]+)$/, ['border-top-left-radius', 'border-bottom-left-radius'], options),
      createRule(/^rounded-r-([\.\d]+)$/, ['border-top-right-radius', 'border-bottom-right-radius'], options),
      createRule(/^rounded-b-([\.\d]+)$/, ['border-bottom-left-radius', 'border-bottom-right-radius'], options),

      //postisitons
      createRule(/^top-([\.\d]+)$/, 'top', options),
      createRule(/^left-([\.\d]+)$/, 'left', options),
      createRule(/^bottom-([\.\d]+)$/, 'bottom', options),
      createRule(/^right-([\.\d]+)$/, 'right', options),

      //margins
      createRule(/^m-([\.\d]+)$/, 'margin', options),
      createRule(/^mt-([\.\d]+)$/, 'margin-top', options),
      createRule(/^ml-([\.\d]+)$/, 'margin-left', options),
      createRule(/^mr-([\.\d]+)$/, 'margin-right', options),
      createRule(/^mb-([\.\d]+)$/, 'margin-bottom', options),
      createRule(/^mx-([\.\d]+)$/, ['margin-left', 'margin-right'], options),
      createRule(/^my-([\.\d]+)$/, ['margin-top', 'margin-bottom'], options),

      //paddings
      createRule(/^p-([\.\d]+)$/, 'padding', options),
      createRule(/^pt-([\.\d]+)$/, 'padding-top', options),
      createRule(/^pl-([\.\d]+)$/, 'padding-left', options),
      createRule(/^pr-([\.\d]+)$/, 'padding-right', options),
      createRule(/^pb-([\.\d]+)$/, 'padding-bottom', options),
      createRule(/^px-([\.\d]+)$/, ['padding-left', 'padding-right'], options),
      createRule(/^py-([\.\d]+)$/, ['padding-top', 'padding-bottom'], options),
    ]
  }
}
