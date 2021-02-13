import Vue from 'vue'

/**
 * Main VCI class, used to initialize, mount and updates "standalone components".
 */
export default class VueCtxInjector {
  _compDefs = {}
  _compConstructors = {}
  _compInstances = {}
  _compElements = {}

  /**
   * Constructor starting components' initializations.
   *
   * @param  {Object} componentDefs - An set of key-value pairs referencing all
   *                                  component definitions.
   * @return {void}
   */
  constructor (componentDefs) {
    this._compDefs = componentDefs
    this._initStdlComponents()
  }

  /**
   * Loops through all HTML-based "standalone component" then mounts and
   * attaches them to the DOM. Also starts watching for props' values updates.
   *
   * @return {void}
   */
  _initStdlComponents () {
    document.querySelectorAll('[data-v-comp]').forEach(stdlCompElement => {
      const componentName = stdlCompElement.getAttribute('data-v-comp')
      // check for well-formatted component name
      if (!componentName) {
        console.error('[VueCtxInjector] No component name specified.')
        return
      }
      // store & mount component
      this._compElements[componentName] = stdlCompElement
      const props = this._getParsedElementProps(stdlCompElement)
      this._mountStdlComponent(componentName, props)
      this._watchStdlComponent(componentName)
    })
  }

  /**
   * Starts the mounting process for the component defined by the given `name`,
   * by injecting given `propsData` into it.
   *
   * @param  {String} name - Name of the component to mount..
   * @param  {Object} propsData - Data used for component props.
   * @return {void}
   */
  _mountStdlComponent (name, propsData) {
    // check for existing component definition
    if (name && !this._compDefs.hasOwnProperty(name)) {
      console.error(`[VueCtxInjector] No component found with name: ${name}.`)
      return
    }
    // configuration/mounting
    const component = this._compDefs[name]
    const props = this._castProps(propsData, component)
    this._compConstructors[name] = Vue.extend(component)
    this._compInstances[name] = new this._compConstructors[name]({
      propsData: props,
    })
    this._compInstances[name]._props = Vue.observable(props)
    const vm = this._compInstances[name].$mount()
    this._compElements[name].appendChild(vm.$el)
  }

  /**
   * Starts the props' watching process on the component defined by the given
   * `name`.
   *
   * @param  {String} name - The component name.
   * @return {void}
   */
  _watchStdlComponent (name) {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes') {
          const newProps = this._getParsedElementProps(this._compElements[name])
          // TODO:  Look for another way to update props than re-instanciating
          // & mounting the whole component (needed because `propsData` is only
          // usable at instance creation).
          this._compInstances[name] = new this._compConstructors[name]({
            propsData: newProps,
          })
          const vm = this._compInstances[name].$mount()
          this._compElements[name].innerHTML = ''
          this._compElements[name].appendChild(vm.$el)
        }
      })
    });
    observer.observe(this._compElements[name], { attributes: true, });
  }

  /**
   * Parse props on the given `compElement` (HTML-based "standalone component").
   *
   * @param  {HTMLElement} compElement - The HTML element to parse for props.
   * @return {Object} - The parsed props.
   */
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

  /**
   * Use the props-level defined types of given `component` definition to cast
   * `initialProps` values.
   *
   * @param  {Object} initialProps - Initial string-based props.
   * @param  {Object} component - The base component definition.
   * @return {Object} - The well-caasted props.
   */
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
