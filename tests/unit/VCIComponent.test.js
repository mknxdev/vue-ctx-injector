import Vue from 'vue'
import VCIComponent from '@/VCIComponent.js'
import HelloWorld from './_components/HelloWorld.vue'

// Fake root element creation helper.
function createRootElement (vCompName, compPrefix, elementProps) {
  const element = document.createElement('div')
  element.setAttribute(`data-${compPrefix}`, vCompName)
  for (const key in elementProps) {
    element.setAttribute(`data-${key}`, elementProps[key])
  }
  return element
}

// Data

let vciData
const componentName = 'HelloWorld'
const propsData = {
  firstName: 'Jacky',
  lastName: 'Chan',
  age: '18',
}

// Hooks

beforeEach(() => {
  vciData = {
    compPrefix: 'v-comp',
    propPrefix: 'v:',
    vComp: HelloWorld,
    rootElement: createRootElement('HelloWorld', 'v-comp', {
      'v:first-name': 'Jacky',
      'v:last-name': 'Chan',
      'v:age': '18'
    }),
    replaceRoot: true,
  }
})

// Tests

describe('VCIComponent: setters', () => {

  it("should set object's `name` public property", () => {
    const vciComponent = new VCIComponent(Vue, vciData)
    vciComponent.setName(componentName)
    expect(vciComponent.name).toBe(componentName)
  })

  it("should set object's `propsData` public property with correct types", () => {
    const vciComponent = new VCIComponent(Vue, vciData)
    vciComponent.setPropsData(propsData)
    for (const key in propsData) {
      const castType = HelloWorld.props[key].type
      expect(castType(propsData[key])).toEqual(vciComponent.propsData[key])
    }
  })

})

describe('VCIComponent: validation', () => {

  it("should return the correct `valid` status for the `name` property", () => {
    const vciComponent = new VCIComponent(Vue, vciData)
    vciComponent.setName(componentName)
    expect(vciComponent.isValidName()).toBeTruthy()
    vciComponent.setName('')
    expect(vciComponent.isValidName()).toBeFalsy()
    vciComponent.setName(null)
    expect(vciComponent.isValidName()).toBeFalsy()
  })

  it("should return the correct `valid` status for the `vComp` property", () => {
    const vciComponent = new VCIComponent(Vue, vciData)
    expect(vciComponent.isValidComponent()).toBeTruthy()
    vciData.vComp = null
    const vciComponent2 = new VCIComponent(Vue, vciData)
    expect(vciComponent2.isValidComponent()).toBeFalsy()
  })

})

describe('VCIComponent: mounting', () => {

  it("should mount the component successfully", () => {
    const vciComponent = new VCIComponent(Vue, vciData)
    vciComponent.setPropsData(propsData)
    vciComponent.mount()
    expect(vciComponent._vCompInstance._isMounted).toBeTruthy()
  })

  it("should mount the component by merging it with the `rootElement`", () => {
    const vciComponent = new VCIComponent(Vue, vciData)
    vciComponent.setPropsData(propsData)
    vciComponent.mount()
    expect(vciComponent.rootElement.outerHTML).toMatch(vciComponent._vCompInstance.$el.outerHTML)
  })

  it("should mount the component by injecting it as a child of the `rootElement`", () => {
    vciData.replaceRoot = false
    const vciComponent = new VCIComponent(Vue, vciData)
    vciComponent.setPropsData(propsData)
    vciComponent.mount()
    expect(vciComponent.rootElement.innerHTML).toMatch(vciComponent._vCompInstance.$el.outerHTML)
  })

  it("should mount the component to the `rootElement` and update render at prop changes (replaceRoot: true)", () => {
    const vciComponent = new VCIComponent(Vue, vciData)
    vciComponent.setPropsData(propsData)
    vciComponent.mount()
    vciComponent.watch()
    expect(vciComponent.rootElement.outerHTML).toMatch(vciComponent._vCompInstance.$el.outerHTML)
    vciComponent.rootElement.setAttribute('data-v:first-name', 'Chuck')
    expect(vciComponent.rootElement.outerHTML).toMatch(vciComponent._vCompInstance.$el.outerHTML)
    vciComponent.rootElement.setAttribute('data-v:last-name', 'Norris')
    expect(vciComponent.rootElement.outerHTML).toMatch(vciComponent._vCompInstance.$el.outerHTML)
    vciComponent.rootElement.setAttribute('data-v:age', '45')
    expect(vciComponent.rootElement.outerHTML).toMatch(vciComponent._vCompInstance.$el.outerHTML)
  })

  it("should mount the component to the `rootElement` and update render at prop changes (replaceRoot: false)", () => {
    vciData.replaceRoot = false
    const vciComponent = new VCIComponent(Vue, vciData)
    vciComponent.setPropsData(propsData)
    vciComponent.mount()
    vciComponent.watch()
    expect(vciComponent.rootElement.innerHTML).toMatch(vciComponent._vCompInstance.$el.outerHTML)
    vciComponent.rootElement.setAttribute('data-v:first-name', 'Chuck')
    expect(vciComponent.rootElement.innerHTML).toMatch(vciComponent._vCompInstance.$el.outerHTML)
    vciComponent.rootElement.setAttribute('data-v:last-name', 'Norris')
    expect(vciComponent.rootElement.innerHTML).toMatch(vciComponent._vCompInstance.$el.outerHTML)
    vciComponent.rootElement.setAttribute('data-v:age', '45')
    expect(vciComponent.rootElement.innerHTML).toMatch(vciComponent._vCompInstance.$el.outerHTML)
  })

})
