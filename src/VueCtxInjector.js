import ErrorManager from './ErrorManager.js'
import CLink from './CLink.js'

/**
 * VueCtxInjector - Main VCI class.
 * Serves as entrypoint for components management processes.
 */

export default class VueCtxInjector {
  // core
  _vueInstance = null
  _compDefs = {}
  _compConstructors = {}
  _compInstances = {}
  _compElements = {}
  _errorManager = new ErrorManager()
  // default options
  _replaceRoot = true
  _componentPrefix = 'data-v-comp'
  _propPrefix = 'data-v:'

  /**
   * Constructor starting components' initializations.
   *
   * @param  {Object} Vue - The user-provided Vue instance.
   * @param  {Object} opts - Configuration options (see README for details)..
   * @return {void}
   */
  constructor (Vue, opts) {
    let validInit = true
    this._errorManager.encapsulate(() => {
      if (!this._validateVueInstance(Vue) || !this._validateInitOptions(opts)) {
        validInit = false
      }
    })

    if (validInit) {
      this._vueInstance = Vue
      this._compDefs = opts.components
      // set user-defined options
      this._storeFormattedUserOptions(opts)
      this._initStdlComponents()
    }
  }

  /**
   * Check for valid user-provided Vue instance.
   *
   * @param  {Object} vue - The provided Vue instance.
   * @return {Boolean}
   */
  _validateVueInstance (vue) {
    if (!vue) {
      this._errorManager.error('You need to provide the Vue instance as 1st argument.')
      return false
    }
    if (vue && (!vue.hasOwnProperty('extend') || !vue.hasOwnProperty('observable'))) {
      this._errorManager.error('This is not a valid Vue instance.')
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
      this._errorManager.error('This is not a valid options object.')
      return false
    }
    // arg: components
    if (!opts.components) {
      this._errorManager.error('This is not a valid options object.')
      return false
    }
    // arg: replaceRoot
    if (opts.replaceRoot && typeof opts.replaceRoot !== 'boolean') {
      this._errorManager.error('This is not a valid options object.')
      return false
    }
    // arg: componentPrefix
    if (opts.componentPrefix && typeof opts.componentPrefix !== 'string') {
      this._errorManager.error('This is not a valid options object.')
      return false
    }
    // arg: propPrefix
    if (opts.propPrefix && typeof opts.propPrefix !== 'string') {
      this._errorManager.error('This is not a valid options object.')
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
    this._replaceRoot = opts.replaceRoot === undefined ?
      this._replaceRoot : opts.replaceRoot
    this._componentPrefix = opts.componentPrefix === undefined ?
      this._componentPrefix : `data-${opts.componentPrefix}`
    this._propPrefix = opts.propPrefix === undefined ?
      this._propPrefix : `data-${opts.propPrefix}`
  }

  /**
   * Loops through all HTML-based "standalone component" then mounts and
   * attaches them to the DOM. Also starts watching for props' values updates.
   *
   * @return {void}
   */
  _initStdlComponents () {
    document.querySelectorAll(`[${this._componentPrefix}]`).forEach(stdlCompElement => {
      const componentName = stdlCompElement.getAttribute(this._componentPrefix)
      const cLink = new CLink()
      cLink.setComponentName(componentName)
      // check for well-formatted component name
      let validCName = true
      this._errorManager.encapsulate(() => {
        if (!cLink.isValidName) {
          validCName = false
          this._errorManager.error('No component name specified.')
        }
      })
      // store & mount component
      if (validCName) {
        this._compElements[componentName] = stdlCompElement
        cLink.setPropsData(this._getParsedElementProps(stdlCompElement))
        this._mountStdlComponent(cLink)
        this._watchStdlComponent(cLink)
      }
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
  _mountStdlComponent (cLink) {
    // check for existing component definition
    let validName = true
    this._errorManager.encapsulate(() => {
      if (cLink.componentName && !this._compDefs.hasOwnProperty(cLink.componentName)) {
        validName = false
        this._errorManager.error(`No component found with name: ${cLink.componentName}.`)
      }
    })
    // configuration/mounting
    if (validName) {
      const component = this._compDefs[cLink.componentName]
      const props = this._castProps(cLink.propsData, component)
      this._compConstructors[cLink.componentName] = this._vueInstance.extend(component)
      this._compInstances[cLink.componentName] = new this._compConstructors[cLink.componentName]({
        propsData: props,
      })
      this._compInstances[cLink.componentName]._props = this._vueInstance.observable(props)
      const vm = this._compInstances[cLink.componentName].$mount()
      if (this._replaceRoot) {
        this._mergeComponentWithRootElement(cLink.componentName, vm.$el)
      } else {
        this._compElements[cLink.componentName].appendChild(vm.$el)
      }
    }
  }

  /**
   * Uses the stored "root" element and merge it with the given
   * `componentElement`, by applying intelligent attributes merging strategy.
   *
   * @param  {String} name - The component name used to apply the merge.
   * @param  {HTMLElement} componentElement - The component rendered DOM element.
   * @return {void}
   */
  _mergeComponentWithRootElement (name, componentElement) {
    // Store receiving elements attrs before replacing
    let compElementId = componentElement.getAttribute('id')
    let compElementClasses = componentElement.classList
    let rootAttrCompName = this._compElements[name].getAttribute(this._componentPrefix)
    let rootElementId = this._compElements[name].getAttribute('id')
    let rootElementClasses = this._compElements[name].classList
    let rootProps = []
    for (const attr of this._compElements[name].attributes) {
      if (attr.name.includes(this._propPrefix)) {
        rootProps[attr.name] = attr.value
      }
    }
    // Replace the receiving element by a new one based on injected component
    // -- attributes parsing & merging
    if (compElementId) {
      componentElement.setAttribute('id', compElementId)
    } else if (rootElementId) {
      componentElement.setAttribute('id', rootElementId)
    }
    if (compElementClasses.length) {
      componentElement.classList = compElementClasses
    }
    for (const className of rootElementClasses) {
      if (!componentElement.classList.contains(className)) {
        componentElement.classList.add(className)
      }
    }
    componentElement.setAttribute(this._componentPrefix, rootAttrCompName)
    for (const key in rootProps) {
      componentElement.setAttribute(key, rootProps[key])
    }
    // -- DOM injecting
    const idComment = document.createComment(`[vci-comp] ${name}`)
    this._compElements[name].before(idComment)
    this._compElements[name].remove()
    this._compElements[name] = componentElement
    idComment.after(componentElement)
    idComment.remove()
  }

  /**
   * Starts the props' watching process on the component defined by the given
   * `name`.
   *
   * @param  {String} name - The component name.
   * @return {void}
   */
  _watchStdlComponent (cLink) {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes') {
          const newProps = this._getParsedElementProps(this._compElements[cLink.componentName])
          // TODO:  Look for another way to update props than re-instanciating
          // & mounting the whole component (needed because `propsData` is only
          // usable at instance creation).
          this._compInstances[cLink.componentName] = new this._compConstructors[cLink.componentName]({
            propsData: newProps,
          })
          const vm = this._compInstances[cLink.componentName].$mount()
          if (this._replaceRoot) {
            this._compElements[cLink.componentName].innerHTML = vm.$el.innerHTML
          } else {
            this._compElements[cLink.componentName].innerHTML = ''
            this._compElements[cLink.componentName].appendChild(vm.$el)
          }
        }
      })
    });
    observer.observe(this._compElements[cLink.componentName], { attributes: true, });
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
      if (attr.name && attr.name.includes(this._propPrefix)) {
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
