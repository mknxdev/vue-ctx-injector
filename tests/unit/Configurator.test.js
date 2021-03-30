import Vue from 'vue'
import Configurator from '@/Configurator.js'
import HelloWorld from './_components/HelloWorld.js'
import HelloCounter from './_components/HelloCounter.js'

// functions mocking
console.error = jest.fn()

// Global
const defaultOptions = {
  components: {},
  replaceRoot: true,
  componentPrefix: 'data-v-comp',
  propPrefix: 'data-v:',
}
const fmtOptionsTestSuite = (opts) => {
  const conf = new Configurator(Vue, opts)
  expect(conf.getFmtData()).toHaveProperty('opts')
  expect(conf.getFmtData().opts).toHaveProperty('components')
  expect(conf.getFmtData().opts).toHaveProperty('replaceRoot')
  expect(conf.getFmtData().opts).toHaveProperty('componentPrefix')
  expect(conf.getFmtData().opts).toHaveProperty('propPrefix')
  expect(conf.getFmtData().opts.components).toEqual(opts.components)
  expect(conf.getFmtData()).toHaveProperty('vue')
}
const validationTestSuite = (opts) => {
  const conf = new Configurator(Vue, opts)
  expect(conf.isValid()).toBeTruthy()
}

// Hooks

afterEach(() => {
  console.error.mockClear()
})

// Empty data

describe('Configurator: empty data', () => {
  const userOptions = {
    components: {}
  }

  it('should return well-formatted data', () => {
    fmtOptionsTestSuite(userOptions)
    const conf = new Configurator(Vue, userOptions)
    expect(conf.getFmtData().opts.replaceRoot).toBe(defaultOptions.replaceRoot)
    expect(conf.getFmtData().opts.componentPrefix).toBe(defaultOptions.componentPrefix)
    expect(conf.getFmtData().opts.propPrefix).toBe(defaultOptions.propPrefix)
  })

  it('should return truthy value for "valid" state', () => {
    validationTestSuite(userOptions)
  })
})

// Data: components

describe('Configurator data: `components`', () => {
  const userOptions = {
    components: {
      HelloWorld,
      HelloCounter,
    }
  }

  it('should return well-formatted data', () => {
    fmtOptionsTestSuite(userOptions)
    const conf = new Configurator(Vue, userOptions)
    expect(conf.getFmtData().opts.replaceRoot).toBe(defaultOptions.replaceRoot)
    expect(conf.getFmtData().opts.componentPrefix).toBe(defaultOptions.componentPrefix)
    expect(conf.getFmtData().opts.propPrefix).toBe(defaultOptions.propPrefix)
  })

  it('should return truthy value for "valid" state', () => {
    validationTestSuite(userOptions)
  })
})

// Data: replaceRoot

describe('Configurator data: `replaceRoot`', () => {
  const userOptions = {
    components: {},
    replaceRoot: true,
  }

  it('should return well-formatted data', () => {
    fmtOptionsTestSuite(userOptions)
    const conf = new Configurator(Vue, userOptions)
    expect(conf.getFmtData().opts.replaceRoot).toBe(userOptions.replaceRoot)
    expect(conf.getFmtData().opts.componentPrefix).toBe(defaultOptions.componentPrefix)
    expect(conf.getFmtData().opts.propPrefix).toBe(defaultOptions.propPrefix)
  })

  it('should return truthy value for "valid" state', () => {
    validationTestSuite(userOptions)
  })
})

// Data: componentPrefix

describe('Configurator data: `componentPrefix`', () => {
  const userOptions = {
    components: {},
    componentPrefix: 'v-component',
  }

  it('should return well-formatted data', () => {
    fmtOptionsTestSuite(userOptions)
    const conf = new Configurator(Vue, userOptions)
    expect(conf.getFmtData().opts.replaceRoot).toBe(defaultOptions.replaceRoot)
    expect(conf.getFmtData().opts.componentPrefix).toBe(`data-${userOptions.componentPrefix}`)
    expect(conf.getFmtData().opts.propPrefix).toBe(defaultOptions.propPrefix)
  })

  it('should return truthy value for "valid" state', () => {
    validationTestSuite(userOptions)
  })
})

// Data: propPrefix

describe('Configurator data: `propPrefix`', () => {
  const userOptions = {
    components: {},
    propPrefix: 'v-prop',
  }

  it('should return well-formatted data', () => {
    fmtOptionsTestSuite(userOptions)
    const conf = new Configurator(Vue, userOptions)
    expect(conf.getFmtData().opts.replaceRoot).toBe(defaultOptions.replaceRoot)
    expect(conf.getFmtData().opts.componentPrefix).toBe(defaultOptions.componentPrefix)
    expect(conf.getFmtData().opts.propPrefix).toBe(`data-${userOptions.propPrefix}`)
  })

  it('should return truthy value for "valid" state', () => {
    validationTestSuite(userOptions)
  })
})

// Data: full set

describe('Configurator: full data', () => {
  const userOptions = {
    components: {
      HelloWorld,
      HelloCounter,
    },
    replaceRoot: true,
    componentPrefix: 'v-component',
    propPrefix: 'v-prop',
  }

  it('should return well-formatted data', () => {
    fmtOptionsTestSuite(userOptions)
    const conf = new Configurator(Vue, userOptions)
    expect(conf.getFmtData().opts.replaceRoot).toBe(userOptions.replaceRoot)
    expect(conf.getFmtData().opts.componentPrefix).toBe(`data-${userOptions.componentPrefix}`)
    expect(conf.getFmtData().opts.propPrefix).toBe(`data-${userOptions.propPrefix}`)
  })

  it('should return truthy value for "valid" state', () => {
    validationTestSuite(userOptions)
  })
})

// Data: invalid data


describe('Configurator data - invalid format for `vue` instance', () => {
  const userOptions = {
    components: {},
    replaceRoot: true,
    componentPrefix: 'v-comp',
    propPrefix: 'v-prop',
  }

  it('should be invalid with: `null`', () => {
    const conf = new Configurator(null, userOptions)
    expect(conf.isValid()).toBeFalsy()
    expect(console.error).toHaveBeenCalledTimes(1)
  })
  it('should be invalid with: empty object', () => {
    const conf = new Configurator({}, userOptions)
    expect(conf.isValid()).toBeFalsy()
    expect(console.error).toHaveBeenCalledTimes(1)
  })
})

describe('Configurator data - empty object', () => {
  const userOptions = {}

  it('should be in invalid state', () => {
    const conf = new Configurator(Vue, userOptions)
    expect(conf.isValid()).toBeFalsy()
  })
  it('should log an error in the console (x2)', () => {
    const conf = new Configurator(Vue, userOptions)
    expect(console.error).toHaveBeenCalledTimes(2)
  })
})

describe('Configurator data - invalid format for: `componentPrefix`', () => {
  const userOptions = {
    components: {},
    replaceRoot: true,
    componentPrefix: 3,
    propPrefix: 'v-prop',
  }

  it('should be in invalid state', () => {
    const conf = new Configurator(Vue, userOptions)
    expect(conf.isValid()).toBeFalsy()
  })
  it('should log an error in the console (x2)', () => {
    const conf = new Configurator(Vue, userOptions)
    expect(console.error).toHaveBeenCalledTimes(2)
  })
})

describe('Configurator data - invalid format for: `propPrefix', () => {
  const userOptions = {
    components: {},
    replaceRoot: true,
    componentPrefix: 'v-comp',
    propPrefix: function () { console.log('Oops!') }
  }

  it('should be in invalid state', () => {
    const conf = new Configurator(Vue, userOptions)
    expect(conf.isValid()).toBeFalsy()
  })
  it('should log an error in the console (x2)', () => {
    const conf = new Configurator(Vue, userOptions)
    expect(console.error).toHaveBeenCalledTimes(2)
  })
})

describe('Configurator data - invalid format for: `componentPrefix`, `propPrefix`', () => {
  const userOptions = {
    components: {},
    replaceRoot: true,
    componentPrefix: 3,
    propPrefix: function () { console.log('Oops!') }
  }

  it('should be in invalid state', () => {
    const conf = new Configurator(Vue, userOptions)
    expect(conf.isValid()).toBeFalsy()
  })
  it('should log an error in the console (x3)', () => {
    const conf = new Configurator(Vue, userOptions)
    expect(console.error).toHaveBeenCalledTimes(3)
  })
})

describe('Configurator data - invalid format for: `replaceRoot`, `componentPrefix`, `propPrefix`', () => {
  const userOptions = {
    components: {},
    replaceRoot: 'test',
    componentPrefix: 3,
    propPrefix: function () { console.log('Oops!') }
  }

  it('should be in invalid state', () => {
    const conf = new Configurator(Vue, userOptions)
    expect(conf.isValid()).toBeFalsy()
  })
  it('should log an error in the console (x4)', () => {
    const conf = new Configurator(Vue, userOptions)
    expect(console.error).toHaveBeenCalledTimes(4)
  })
})

describe('Configurator data - invalid format for: all options', () => {
  const userOptions = {
    components: [],
    replaceRoot: 'test',
    componentPrefix: 3,
    propPrefix: function () { console.log('Oops!') }
  }

  it('should be in invalid state', () => {
    const conf = new Configurator(Vue, userOptions)
    expect(conf.isValid()).toBeFalsy()
  })
  it('should log an error in the console (x4)', () => {
    const conf = new Configurator(Vue, userOptions)
    expect(console.error).toHaveBeenCalledTimes(4)
  })
})
