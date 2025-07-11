import type { Preset, Rule, PresetUnoTheme as Theme } from 'unocss'

/**
 * Configuration options for the calc preset
 */
interface Options {
  /** Minimum viewport width in pixels @default 0 */
  min?: number
  /** Maximum viewport width in pixels @default 1920 */
  max?: number
  /** CSS custom property name for screen width @default '--width-screen' */
  CSSglobalVar?: string
  /** Mobile breakpoint width in pixels @default 375 */
  mobileWidth?: number
  /** Desktop breakpoint width in pixels @default 768 */
  desktopWidth?: number
  /** Container configuration @default {} */
  container?: {
    padding?: {
      DEFAULT?: string
      sm?: number
      md?: number
      lg?: number
      xl?: number
      '2xl'?: number
    }
  }
}

/**
 * Default configuration values
 */
const DEFAULT_OPTIONS = {
  CSSglobalVar: '--width-screen',
  min: 0,
  max: 1920,
  mobileWidth: 375,
  desktopWidth: 768,
  container: {
    padding: {
      DEFAULT: '1rem',
      md: 50
    }
  },
} as const satisfies Options

/**
 * Calculates responsive CSS value using clamp and CSS custom properties
 * @param value - The numeric value to calculate
 * @param options - Configuration options
 * @returns CSS calc expression
 * @throws Error if value is not a finite number
 */
export const calculate = (value: number, options: Options): string => {
  /* Validate that value is a finite number */
  if (isNaN(value) || !isFinite(value)) {
    throw new Error('Value must be a finite number')
  }

  const { min = 0, max = 1920, CSSglobalVar = '--width-screen' } = options

  return `calc(${value} * clamp(${min}px,100vw,${max}px) / var(${CSSglobalVar}))`
}

/**
 * Sets CSS properties with calculated values
 * @param value - The numeric value to calculate
 * @param properties - CSS property name(s) to apply
 * @param options - Configuration options
 * @returns Object with CSS properties and calculated values
 */
const setProperties = (value: number, properties: string | string[], options: Options) => {
  if (Array.isArray(properties)) {
    return properties.reduce((acc, prop) => {
      acc[prop] = calculate(value, options)
      return acc
    }, {} as Record<string, string>)
  }

  if (typeof properties === 'string') {
    return { [properties]: calculate(value, options) }
  }

  throw new Error(`Properties must be string or string[], received: ${typeof properties}`)
}

/**
 * Creates a UnoCSS rule for responsive calculations
 * @param test - Regular expression to match class names
 * @param properties - CSS property name(s) to apply
 * @param options - Configuration options
 * @returns UnoCSS rule tuple
 */
export const createRule = (test: RegExp, properties: string | string[], options: Options): Rule => {
  return [test, ([_, num]) => setProperties(Number(num), properties, options)]
}

/**
 * Default options export for backward compatibility
 */
export const options: Options = DEFAULT_OPTIONS

/**
 * Creates the UnoCSS preset with responsive calculations
 * @param defaultValues - Optional configuration to override defaults
 * @returns UnoCSS preset object
 */

export const presetCalc = (defaultValues?: Partial<Options>): Preset => {
  const presetOptions: Options = {
    ...DEFAULT_OPTIONS,
    ...defaultValues,
    container: {
      ...DEFAULT_OPTIONS.container,
      ...defaultValues?.container,
      padding: {
        ...DEFAULT_OPTIONS.container.padding,
        ...defaultValues?.container?.padding
      }
    }
  }

  /**
   * Helper function to build container padding configuration
   */
  const buildContainerPadding = (theme: Theme) => {
    const basePadding = theme.container?.padding || {}
    const newPadding: Record<string, string> = {}

    /* Copy existing padding values, converting numbers to strings */
    Object.entries(basePadding).forEach(([key, value]) => {
      newPadding[key] = typeof value === 'string' ? value : String(value)
    })

    if (presetOptions.container?.padding?.DEFAULT) {
      newPadding.DEFAULT = presetOptions.container.padding.DEFAULT
    }

    /* Apply calc to numeric padding values */
    const paddingKeys = ['sm', 'md', 'lg', 'xl', '2xl'] as const
    paddingKeys.forEach(key => {
      const value = presetOptions.container?.padding?.[key]
      if (typeof value === 'number') {
        newPadding[key] = calculate(value, presetOptions)
      }
    })

    return newPadding
  }

  return {
    name: 'unocss-preset-calc',
    preflights: [
      {
        getCSS: () => {
          const { CSSglobalVar, mobileWidth, desktopWidth, max } = presetOptions

          return `
            :root {
              ${CSSglobalVar}: ${mobileWidth};
            }
            @media (width >= ${desktopWidth}px) {
              :root {
                ${CSSglobalVar}: ${max};
              }
            }
          `
        }
      }
    ],
    rules: [
      /* Typography */
      createRule(/^text-([\.\d]+)$/, 'font-size', presetOptions),
      createRule(/^leading-([\.\d]+)$/, 'line-height', presetOptions),

      /* Width and Height */
      createRule(/^w-([\.\d]+)$/, 'width', presetOptions),
      createRule(/^max-w-([\.\d]+)$/, 'max-width', presetOptions),
      createRule(/^min-w-([\.\d]+)$/, 'min-width', presetOptions),
      createRule(/^h-([\.\d]+)$/, 'height', presetOptions),
      createRule(/^max-h-([\.\d]+)$/, 'max-height', presetOptions),
      createRule(/^min-h-([\.\d]+)$/, 'min-height', presetOptions),
      createRule(/^size-([\.\d]+)$/, ['width', 'height'], presetOptions),

      /* Gap */
      createRule(/^gap-([\.\d]+)$/, 'gap', presetOptions),
      createRule(/^gap-x-([\.\d]+)$/, 'column-gap', presetOptions),
      createRule(/^gap-y-([\.\d]+)$/, 'row-gap', presetOptions),

      /* Border Width */
      createRule(/^border-([\.\d]+)$/, 'border-width', presetOptions),
      createRule(/^border-t-([\.\d]+)$/, 'border-top-width', presetOptions),
      createRule(/^border-r-([\.\d]+)$/, 'border-right-width', presetOptions),
      createRule(/^border-b-([\.\d]+)$/, 'border-bottom-width', presetOptions),
      createRule(/^border-l-([\.\d]+)$/, 'border-left-width', presetOptions),
      createRule(/^border-y-([\.\d]+)$/, ['border-top-width', 'border-bottom-width'], presetOptions),
      createRule(/^border-x-([\.\d]+)$/, ['border-left-width', 'border-right-width'], presetOptions),

      /* Border Radius */
      createRule(/^rounded-([\.\d]+)$/, 'border-radius', presetOptions),
      createRule(/^rounded-tl-([\.\d]+)$/, 'border-top-left-radius', presetOptions),
      createRule(/^rounded-tr-([\.\d]+)$/, 'border-top-right-radius', presetOptions),
      createRule(/^rounded-bl-([\.\d]+)$/, 'border-bottom-left-radius', presetOptions),
      createRule(/^rounded-br-([\.\d]+)$/, 'border-bottom-right-radius', presetOptions),
      createRule(/^rounded-t-([\.\d]+)$/, ['border-top-left-radius', 'border-top-right-radius'], presetOptions),
      createRule(/^rounded-l-([\.\d]+)$/, ['border-top-left-radius', 'border-bottom-left-radius'], presetOptions),
      createRule(/^rounded-r-([\.\d]+)$/, ['border-top-right-radius', 'border-bottom-right-radius'], presetOptions),
      createRule(/^rounded-b-([\.\d]+)$/, ['border-bottom-left-radius', 'border-bottom-right-radius'], presetOptions),

      /* Positions */
      createRule(/^top-([\.\d]+)$/, 'top', presetOptions),
      createRule(/^left-([\.\d]+)$/, 'left', presetOptions),
      createRule(/^bottom-([\.\d]+)$/, 'bottom', presetOptions),
      createRule(/^right-([\.\d]+)$/, 'right', presetOptions),

      /* Margins (with negative value support) */
      createRule(/^-?m-([\.\d]+)$/, 'margin', presetOptions),
      createRule(/^-?mt-([\.\d]+)$/, 'margin-top', presetOptions),
      createRule(/^-?ml-([\.\d]+)$/, 'margin-left', presetOptions),
      createRule(/^-?mr-([\.\d]+)$/, 'margin-right', presetOptions),
      createRule(/^-?mb-([\.\d]+)$/, 'margin-bottom', presetOptions),
      createRule(/^-?mx-([\.\d]+)$/, ['margin-left', 'margin-right'], presetOptions),
      createRule(/^-?my-([\.\d]+)$/, ['margin-top', 'margin-bottom'], presetOptions),

      /* Paddings */
      createRule(/^p-([\.\d]+)$/, 'padding', presetOptions),
      createRule(/^pt-([\.\d]+)$/, 'padding-top', presetOptions),
      createRule(/^pl-([\.\d]+)$/, 'padding-left', presetOptions),
      createRule(/^pr-([\.\d]+)$/, 'padding-right', presetOptions),
      createRule(/^pb-([\.\d]+)$/, 'padding-bottom', presetOptions),
      createRule(/^px-([\.\d]+)$/, ['padding-left', 'padding-right'], presetOptions),
      createRule(/^py-([\.\d]+)$/, ['padding-top', 'padding-bottom'], presetOptions),
    ],
    extendTheme: (theme: Theme) => {
      return {
        ...theme,
        container: {
          ...(theme.container || {}),
          padding: buildContainerPadding(theme),
          maxWidth: Object.assign(
            {},
            theme.container?.maxWidth || {},
            {
              md: '100%',
              '2xl': `${presetOptions.max}px`,
            }
          ),
          center: true
        }
      }
    }
  }
}