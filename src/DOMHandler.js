import VCIComponent from './VCIComponent.js'
import DOM from './helpers/DOM.js'

/**
 * DOMHandler - Used for all DOM manipulations.
 */

export default class DOMHandler {
  _vue = null
  _compDefs = {}
  _replaceRoot = true
  _prefixes = {
    component: null,
    prop: null,
  }

  constructor (vue, compDefs, replaceRoot, compPrefix = null, propPrefix = null) {
    this._vue = vue
    this._compDefs = compDefs
    this._replaceRoot = replaceRoot
    this._prefixes.component = compPrefix
    this._prefixes.prop = propPrefix
  }

  /**
   * Loops through all HTML elements defined as "standalone component" to return
   * a list of `VCIComponent`s (object representation of an element/component
   * link).
   *
   * @return {Array<VCIComponent>}
   */
  getParsedVCIComponents () {
    const compPrefix = this._prefixes.component
    const propPrefix = this._prefixes.prop
    let vciComps = []
    document.querySelectorAll(`[${compPrefix}]`).forEach(compElement => {
      // retrieve component raw informations
      const compName = compElement.getAttribute(compPrefix)
      const propsData = DOM.getVCIElementProps(propPrefix, compElement)
      // store informations into a VCI component
      const vciComp = new VCIComponent(this._vue, {
        compPrefix: compPrefix,
        propPrefix: propPrefix,
        vComp: this._compDefs[compName],
        rootElement: compElement,
        replaceRoot: this._replaceRoot
      })
      vciComp.setName(compName)
      vciComp.setPropsData(propsData)
      vciComps.push(vciComp)
    })
    return vciComps
  }

  /**
   * Parse props on the given `compElement` (HTML-based "standalone component").
   *
   * @param  {HTMLElement} compElement - The HTML element to parse for props.
   * @return {Object} - The parsed props.
   */
  _getParsedVCIElementProps (compElement) {
    let props = {}
    const prefix = this._prefixes.prop
    for (const i in compElement.attributes) {
      const attr = compElement.attributes[i]
      if (attr.name && attr.name.includes(prefix)) {
        // TODO:  Maybe find a tiny library other than lodash to do this job
        // (lodash's `camelCase` imported code is too big)
        const kcPropName = attr.name.substr(attr.name.indexOf(prefix) + prefix.length)
        const propName = kcPropName.substr().toLowerCase().replace(
          /(\-[a-z])/g,
          match => match.charAt(match.length - 1).toUpperCase()
        )
        props[propName] = attr.value
      }
    }
    return props
  }

}
