import { describe, expect, it } from 'vitest'
import { calculate, options } from '../src/preset-calc'

describe('calculate', () => {
  it('should create a calc', () => {
    expect(calculate(100, options)).toBe('calc(100 * clamp(0px,100vw,1920px) / var(--width-screen))')
    expect(calculate(50, options)).toBe('calc(50 * clamp(0px,100vw,1920px) / var(--width-screen))')
  })
})