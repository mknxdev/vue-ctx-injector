/*!
 * VueCtxInjector v1.0.0
 * (c) 2021 Paul Guzda-Rivière
 * Released under the Apache-2.0 License.
 */
export default class VueCtxInjector {
  _vueInstance = null
  _compDefs = {}
  _compConstructors = {}
  _compInstances = {}
  _compElements = {}
  // default options
  _replaceRoot = true
  _componentPrefix = 'v-comp'
  _propPrefix = 'v:'

  /**
   * Constructor starting components' initializations.
   *
   * @param  {Object} Vue - The user-provided Vue instance.
   * @param  {Object} opts - Configuration options (see README for details)..
   * @return {void}
   */
  constructor (Vue, opts) {
    if (!this._validateVueInstance(Vue) || !this._validateInitOptions(opts)) {
      return
    }
    this._vueInstance = Vue
    this._compDefs = opts.components
    // set user-defined options
    this._storeFormattedUserOptions(opts)
    this._initStdlComponents()
  }

  /**
   * Check for valid user-provided Vue instance.
   *
   * @param  {Object} vue - The provided Vue instance.
   * @return {Boolean}
   */
  _validateVueInstance (vue) {
    if (!vue) {
      console.error(`[VueCtxInjector] You need to provide the Vue instance as 1st argument.`)
      return false
    }
    if (vue && (!vue.hasOwnProperty('extend') || !vue.hasOwnProperty('observable'))) {
      console.error(`[VueCtxInjector] This is not a valid Vue instance.`)
      return false
    }
    return true
  }

  /**
   * Check for valid user-provided options format.
   *
   * @param  {Object} opts - The provided options.
   * @return {Boolean}
   */
  _validateInitOptions (opts) {
    if (!opts) {
      console.error(`[VueCtxInjector] This is not a valid options object.`)
      return false
    }
    // arg: components
    if (!opts.components) {
      console.error(`[VueCtxInjector] This is not a valid options object.`)
      return false
    }
    // arg: replaceRoot
    if (opts.replaceRoot && typeof opts.replaceRoot !== 'boolean') {
      console.error(`[VueCtxInjector] This is not a valid options object.`)
      return false
    }
    return true
  }

  /**
   * -
   *
   * @param  {[type]} userOpts [description]
   * @return {[type]}          [description]
   */
  _storeFormattedUserOptions (opts) {
    this._replaceRoot = opts.replaceRoot === undefined ? true : opts.replaceRoot
    this._componentPrefix = opts.componentPrefix === undefined ? 'v-comp' : opts.componentPrefix
    this._propPrefix = opts.propPrefix === undefined ? 'v:' : opts.propPrefix
  }

  /**
   * Loops through all HTML-based "standalone component" then mounts and
   * attaches them to the DOM. Also starts watching for props' values updates.
   *
   * @return {void}
   */
  _initStdlComponents () {
    const compAttrName = `data-${this._componentPrefix}`
    document.querySelectorAll(`[${compAttrName}]`).forEach(stdlCompElement => {
      const componentName = stdlCompElement.getAttribute(compAttrName)
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
    this._compConstructors[name] = this._vueInstance.extend(component)
    this._compInstances[name] = new this._compConstructors[name]({
      propsData: props,
    })
    this._compInstances[name]._props = this._vueInstance.observable(props)
    const vm = this._compInstances[name].$mount()
    if (this._replaceRoot) {
      this._compElements[name].innerHTML = vm.$el.innerHTML
      // retrieve classes and id and inject them to the mounted element
      for (const i of vm.$el.classList) {
        if (!this._compElements[name].classList.contains(vm.$el.classList.item(i))) {
          this._compElements[name].classList.add(vm.$el.classList.item(i))
        }
      }
      if (vm.$el.getAttribute('id')) {
        this._compElements[name].setAttribute('id', vm.$el.getAttribute('id'))
      }
    } else {
      this._compElements[name].appendChild(vm.$el)
    }
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
          if (this._replaceRoot) {
            this._compElements[name].innerHTML = vm.$el.innerHTML
          } else {
            this._compElements[name].innerHTML = ''
            this._compElements[name].appendChild(vm.$el)
          }
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
      if (attr.name && attr.name.includes(`data-${this._propPrefix}`)) {
        // TODO:  Maybe find a tiny library other than lodash to do this job
        // (lodash's `camelCase` imported code is too big)
        const kcPropName = attr.name.substr(attr.name.indexOf(this._propPrefix) + this._propPrefix.length)
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
   * @return {Object} - The well-casted props.
   */
  _castProps (initialProps, component) {
    let castedProps = {}
    for (const name in initialProps) {
      if (component.props.hasOwnProperty(name)) {
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
