import { instrument } from 'storybook/internal/instrumenter'

function decorateHarnessFn(fn: ((...args: any) => Promise<any>), instrumentedFn: any) {
  return function(this: any, ...args: any[]) {
    return instrumentedFn(this.element, ...args).then(async () => {
      return await fn.apply(this, args)
    })
  }
}

export function UnitTestElementInstrumented(fnNames: string[]): ClassDecorator {
  // Make a function to instrument for each function that would be instrumented.
  // These functions will be a simple function that returns nothing but a
  // Promise. It will be instrumented and called before the original function,
  // because the original function doesn't take the HTMLElement as an argument
  // and I want it to be shown in the Interactions Panel.
  const toInstrumentObj: { [fnName: string]: any } = { }
  for (const x of fnNames) {
    toInstrumentObj[x] = (_element: Element, ..._args: any) => Promise.resolve()
  }

  // Instrument the functions.
  const instrumentedFns = instrument(
    toInstrumentObj,
    { intercept: true }
  )

  return function(type: any) {
    for (const x of fnNames) {
      type.prototype[x] = decorateHarnessFn(type.prototype[x], instrumentedFns[x])
    }
  }
}
