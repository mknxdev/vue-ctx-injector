import DOM from './helpers/DOM.js'

/**
 * VCIComponent - Represents a VCI-managed object representation of a link
 * system between an HTML customized element and a Vue component.
 */

export default class VCIComponent {
  _vue = null
  _vCompConstructor = null
  _vCompInstance = null
  _componentPrefix = null
  _propPrefix = null
  name = null
  rootElement = null
  replaceRoot = true
  vComp = null
  propsData = {}

  constructor (vue, { compPrefix, propPrefix, vComp, rootElement, replaceRoot }) {
    this._vue = vue
    this._componentPrefix = compPrefix
    this._propPrefix = propPrefix
    this.vComp = vComp
    this.rootElement = rootElement
    this.replaceRoot = replaceRoot
  }

  /**
   * Sets the component name.
   *
   * @param {String} name - The component name to set.
   * @return {void}
   */
  setName (name = null) {
    this.name = name
  }

  /**
   * Sets the current props data.
   *
   * @param {String} data - Props data.
   * @return {void}
   */
  setPropsData (data) {
    this.propsData = this._castProps(data)
  }

  /**
   * Determines the component name validity status.
   *
   * @return {Boolean}
   */
  isValidName () {
    if (!this.name) {
      return false
    }
    return true
  }

  /**
   * Determines the component definition validity status.
   *
   * @return {Boolean}
   */
  isValidComponent () {
    if (!this.vComp) {
      return false
    }
    return true
  }

  /**
   * Starts the mounting process of the current component, by injecting to it
   * currently stored `propsData`.
   *
   * @return {void}
   */
  mount () {
    if (this.rootElement) {
      this._vCompConstructor = this._vue.extend(this.vComp)
      this._vCompInstance = new this._vCompConstructor({
        propsData: this.propsData,
      })
      this._vCompInstance._props = this._vue.observable(this.propsData)
      const vm = this._vCompInstance.$mount()
      if (this.replaceRoot) {
        this._mergeComponentWithRootElement(vm.$el)
      } else {
        this.rootElement.appendChild(vm.$el)
      }
    }
  }

  /**
   * Starts the props' watching process on the currently linked `rootElement`.
   *
   * @return {void}
   */
  watch () {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes') {
          const newProps = DOM.getVCIElementProps(this._propPrefix, this.rootElement)
          // TODO:  Look for another way to update props than re-instanciating
          // & mounting the whole component (needed because `propsData` is only
          // usable at instance creation).
          this._vCompInstance = new this._vCompConstructor({
            propsData: newProps,
          })
          const vm = this._vCompInstance.$mount()
          this.setPropsData(newProps)
          if (this.replaceRoot) {
            this.rootElement.innerHTML = vm.$el.innerHTML
          } else {
            this.rootElement.innerHTML = ''
            this.rootElement.appendChild(vm.$el)
          }
        }
      })
    });
    observer.observe(this.rootElement, { attributes: true, })
  }

  /**
   * Use the props-level defined types of given internal vComp definition to
   * cast `initialProps` values.
   *
   * @param  {Object} initialProps - Initial string-based props.
   * @return {Object} - The well-casted props.
   */
  _castProps (initialProps) {
    let castedProps = {}
    for (const name in initialProps) {
      if (this.vComp && this.vComp.props.hasOwnProperty(name)) {
        const castType = this.vComp.props[name].type
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

  /**
   * Uses the stored `rootElement` and merge it with the given
   * `element`, by applying intelligent attributes merging strategy.
   *
   * @param  {HTMLElement} element - The component rendered DOM element.
   * @return {void}
   */
  _mergeComponentWithRootElement (element) {
    // Store receiving elements attrs before replacing
    let compElementId = element.getAttribute('id')
    let compElementClasses = element.classList
    let rootAttrCompName = this.rootElement.getAttribute(this._componentPrefix)
    let rootElementId = this.rootElement.getAttribute('id')
    let rootElementClasses = this.rootElement.classList
    let rootProps = []
    for (const attr of this.rootElement.attributes) {
      if (attr.name.includes(this._propPrefix)) {
        rootProps[attr.name] = attr.value
      }
    }
    // Replace the receiving element by a new one based on injected component
    // -- attributes parsing & merging
    if (compElementId) {
      element.setAttribute('id', compElementId)
    } else if (rootElementId) {
      element.setAttribute('id', rootElementId)
    }
    if (compElementClasses.length) {
      element.classList = compElementClasses
    }
    for (const className of rootElementClasses) {
      if (!element.classList.contains(className)) {
        element.classList.add(className)
      }
    }
    element.setAttribute(this._componentPrefix, rootAttrCompName)
    for (const key in rootProps) {
      element.setAttribute(key, rootProps[key])
    }
    // -- DOM injecting
    const idComment = document.createComment(`[vci-comp] ${this.name}`)
    this.rootElement.before(idComment)
    this.rootElement.remove()
    this.rootElement = element
    idComment.after(element)
    idComment.remove()
  }

}
