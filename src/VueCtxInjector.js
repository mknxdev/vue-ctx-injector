export default class VueCtxInjector {
  _stdlCompDefs = {}
  _stdlCompElements = []

  constructor (componentDefs, options) {
    this._stdlCompDefs = componentDefs
    this._initStdlComponents()
  }

  _initStdlComponents () {
    this._stdlCompElements = document.querySelectorAll('[data-v-comp]')
    this._stdlCompElements.forEach(stdlCompElement => {
      const componentName = stdlCompElement.getAttribute('data-v-comp')
      // check for well-formatted component name
      if (!componentName) {
        console.error('[VueCtxInjector] No component name specified.')
        return
      }
      // mount component
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
    console.log(component, props)
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
