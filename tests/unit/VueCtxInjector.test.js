import Vue from 'vue'
import VueCtxInjector from '@/VueCtxInjector.js'
import HelloWorld from './_components/HelloWorld.vue'
import HelloCounter from './_components/HelloCounter.vue'

// functions mocking
console.error = jest.fn()

// DOM resetting function.
function resetDOM () {
  document.body.innerHTML = `
    <div
      data-v-comp="HelloWorld"
      data-v:first-name="Jacky"
      data-v:last-name="Chan"
      data-v:age="23"
    ></div>
  `
}

// Hooks

afterEach(() => {
  console.error.mockClear()
  resetDOM()
})

// Tests

describe('VueCtxInjector: initialization', () => {

  // success cases

  it("should init. successfully: empty options", () => {
    document.body.innerHTML = ''
    const userOptions = {
      components: {},
    }
    const vci = new VueCtxInjector(Vue, userOptions)
    expect(vci._isInitialized).toBeTruthy()
    expect(console.error).toHaveBeenCalledTimes(0)
  })

  it("should init. successfully: 1 component", () => {
    const userOptions = {
      components: { HelloWorld },
    }
    const vci = new VueCtxInjector(Vue, userOptions)
    expect(vci._isInitialized).toBeTruthy()
    expect(console.error).toHaveBeenCalledTimes(0)
  })

  it("should init. successfully: 1 component, replaceRoot", () => {
    const userOptions = {
      components: { HelloWorld },
      replaceRoot: true,
    }
    const vci = new VueCtxInjector(Vue, userOptions)
    expect(vci._isInitialized).toBeTruthy()
    expect(console.error).toHaveBeenCalledTimes(0)
  })

  it("should init. successfully: 1 component, replaceRoot, componentPrefix", () => {
    const userOptions = {
      components: { HelloWorld },
      replaceRoot: true,
      componentPrefix: 'v-comp',
    }
    const vci = new VueCtxInjector(Vue, userOptions)
    expect(vci._isInitialized).toBeTruthy()
    expect(console.error).toHaveBeenCalledTimes(0)
  })

  it("should init. successfully: 1 component, replaceRoot, componentPrefix, propPrefix", () => {
    const userOptions = {
      components: { HelloWorld },
      replaceRoot: true,
      componentPrefix: 'v-comp',
      propPrefix: 'v:',
    }
    const vci = new VueCtxInjector(Vue, userOptions)
    expect(vci._isInitialized).toBeTruthy()
    expect(console.error).toHaveBeenCalledTimes(0)
  })

  // error cases

  it("should init. with error: empty options", () => {
    const userOptions = {}
    const vci = new VueCtxInjector(Vue, userOptions)
    expect(vci._isInitialized).toBeFalsy()
    expect(console.error).toHaveBeenCalledTimes(2)
  })

  it("should init. with error: invalid `components`", () => {
    const userOptions = {
      components: {
        HelloWorld: 'test',
      },
    }
    const vci = new VueCtxInjector(Vue, userOptions)
    expect(vci._isInitialized).toBeFalsy()
    expect(console.error).toHaveBeenCalledTimes(1)
  })

  it("should init. with error: invalid `replaceRoot`", () => {
    const userOptions = {
      components: { HelloWorld },
      replaceRoot: 'test',
    }
    const vci = new VueCtxInjector(Vue, userOptions)
    expect(vci._isInitialized).toBeFalsy()
    expect(console.error).toHaveBeenCalledTimes(2)
  })

  it("should init. with error: invalid `componentPrefix`", () => {
    const userOptions = {
      components: { HelloWorld },
      componentPrefix: 12,
    }
    const vci = new VueCtxInjector(Vue, userOptions)
    expect(vci._isInitialized).toBeFalsy()
    expect(console.error).toHaveBeenCalledTimes(2)
  })

  it("should init. with error: invalid `propPrefix`", () => {
    const userOptions = {
      components: { HelloWorld },
      propPrefix: 12,
    }
    const vci = new VueCtxInjector(Vue, userOptions)
    expect(vci._isInitialized).toBeFalsy()
    expect(console.error).toHaveBeenCalledTimes(2)
  })

  it("should init. with error: invalid `replaceRoot`, `componentPrefix`, `propPrefix`", () => {
    const userOptions = {
      components: { HelloWorld },
      replaceRoot: 'test',
      componentPrefix: 12,
      propPrefix: 12,
    }
    const vci = new VueCtxInjector(Vue, userOptions)
    expect(vci._isInitialized).toBeFalsy()
    expect(console.error).toHaveBeenCalledTimes(4)
  })

})

describe('VueCtxInjector: methods', () => {

  it('[parse] should parse the newly added component in DOM', () => {
    resetDOM()
    const userOptions = {
      components: {
        HelloWorld,
        HelloCounter,
      },
    }
    const vci = new VueCtxInjector(Vue, userOptions)
    expect(vci._vciComps).toHaveLength(1)
    document.body.innerHTML = `
      <div
        data-v-comp="HelloWorld"
        data-v:first-name="Jacky"
        data-v:last-name="Chan"
        data-v:age="23"
      ></div>
      <div
        data-v-comp="HelloCounter"
        data-v:nb="15"
      ></div>
    `
    vci.parse()
    expect(vci._vciComps).toHaveLength(2)
  })

})
