import Vue from 'vue'
import Configurator from '@/Configurator.js'
import DOMHandler from '@/DOMHandler.js'
import HelloWorld from './_components/HelloWorld.js'
import HelloCounter from './_components/HelloCounter.js'

// functions mocking
console.error = jest.fn()

// Hooks

afterEach(() => {
  console.error.mockClear()
})

describe('DOM Handler', () => {

  // -> DOM: empty
  // -> Input object: empty

  it('should return an empty list', () => {
    const userOptions = {
      components: {},
    }
    const conf = new Configurator(Vue, userOptions)
    const domHandler = new DOMHandler(conf)

    expect(domHandler.getParsedVCIComponents()).toBeInstanceOf(Array)
    expect(domHandler.getParsedVCIComponents()).toHaveLength(0)
  })

  // -> DOM: 2 components
  // -> Input object: 2 components

  it('should return a list of 2 `VCIComponent`s', () => {
    document.body.innerHTML = `
      <div data-v-comp="HelloWorld"></div>
      <div data-v-comp="HelloCounter"></div>
    `
    const userOptions = {
      components: {
        HelloWorld,
        HelloCounter,
      },
    }
    const conf = new Configurator(Vue, userOptions)
    const domHandler = new DOMHandler(conf)
    expect(domHandler.getParsedVCIComponents()).toBeInstanceOf(Array)
    expect(domHandler.getParsedVCIComponents()).toHaveLength(2)
  })

  // -> DOM: 1 component with empty name
  // -> Input object: 1 component

  it('should log an error for a missing component name', () => {
    document.body.innerHTML = `
      <div data-v-comp=""></div>
    `
    const userOptions = {
      components: {
        HelloWorld,
      },
    }
    const conf = new Configurator(Vue, userOptions)
    const domHandler = new DOMHandler(conf)
    domHandler.getParsedVCIComponents()
    expect(console.error).toHaveBeenCalledTimes(1)
  })

  // -> DOM: 1 component with invalid name
  // -> Input object: 1 component

  it('should log an error for an invalid component name', () => {
    document.body.innerHTML = `
      <div data-v-comp="toto"></div>
    `
    const userOptions = {
      components: {
        HelloWorld,
      },
    }
    const conf = new Configurator(Vue, userOptions)
    const domHandler = new DOMHandler(conf)
    domHandler.getParsedVCIComponents()
    expect(console.error).toHaveBeenCalledTimes(1)
  })

  // -> DOM: 2 components
  // -> Input object: 1 component

  it('should log an error for a missing component definition', () => {
    document.body.innerHTML = `
      <div data-v-comp="HelloWorld"></div>
      <div data-v-comp="HelloCounter"></div>
    `
    const userOptions = {
      components: {
        HelloWorld,
      },
    }
    const conf = new Configurator(Vue, userOptions)
    const domHandler = new DOMHandler(conf)
    domHandler.getParsedVCIComponents()
    expect(console.error).toHaveBeenCalledTimes(1)
  })
})
