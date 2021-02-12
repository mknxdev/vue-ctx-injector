import Vue from 'vue'

export default class VueCtxInjector {
  _stdlCompDefs = {}
  _stdlCompInstances = {}
  _stdlCompElements = {}

  constructor (componentDefs, options) {
    this._stdlCompDefs = componentDefs
    this._initStdlComponents()
  }

  _initStdlComponents () {
    document.querySelectorAll('[data-v-comp]').forEach(stdlCompElement => {
      const componentName = stdlCompElement.getAttribute('data-v-comp')
      // check for well-formatted component name
      if (!componentName) {
        console.error('[VueCtxInjector] No component name specified.')
        return
      }
      // store & mount component
      this._stdlCompElements[componentName] = stdlCompElement
      const props = this._getParsedElementProps(stdlCompElement)
      this._mountStdlComponent(componentName, props)
    })
  }

  _mountStdlComponent (name, propsData) {
    // check for existing component definition
    if (name && !this._stdlCompDefs.hasOwnProperty(name)) {
      console.error(`[VueCtxInjector] No component found with name: ${name}.`)
      return
    }
    // configuration/mounting
    const component = this._stdlCompDefs[name]
    const props = this._castProps(propsData, component)
    const Constructor = Vue.extend(component)
    this._stdlCompInstances[name] = new Constructor({
      propsData: props,
    })
    this._stdlCompInstances[name]._props = Vue.observable(props)
    let compInstance = this._stdlCompInstances[name]
    let vm = compInstance.$mount()
    this._stdlCompElements[name].appendChild(vm.$el)
  }

  _getParsedElementProps (compElement) {
    let props = {}
    for (const i in compElement.attributes) {
      const attr = compElement.attributes[i]
      if (attr.name && attr.name.includes('data-v:')) {
        // TODO:  Maybe find a tiny library other than lodash to do this job
        // (lodash's `camelCase` imported code is too big)
        const kcPropName = attr.name.substr(attr.name.indexOf('v:') + 2)
        const propName = kcPropName.substr().toLowerCase().replace(
          /(\-[a-z])/g,
          match => match.charAt(match.length - 1).toUpperCase()
        )
        props[propName] = attr.value
      }
    }
    return props
  }

  _castProps (initialProps, component) {
    let castedProps = {}
    for (const name in initialProps) {
      if (name in component.props) {
        const castType = component.props[name].type
        let castedProp = null
        if ([Object, Array].includes(castType)) {
          castedProp = JSON.parse(initialProps[name]);
        } else {
          castedProp = castType(initialProps[name]);
        }
        castedProps[name] = castedProp
      }
    }
    return castedProps
  }
}
