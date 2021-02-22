import VCIComponent from './VCIComponent.js'

/**
 * DOMHandler - Use for all DOM manipulations.
 */

export default class DOMHandler {
  _compDefs = {}
  _prefixes = {
    component: null,
    prop: null,
  }

  constructor (compDefs, compPrefix = null, propPrefix = null) {
    this._compDefs = compDefs
    this._prefixes.component = compPrefix
    this._prefixes.prop = propPrefix
  }

  getParsedVCIComponents () {
    const prefix = this._prefixes.component
    let vciComps = []
    document.querySelectorAll(`[${prefix}]`).forEach(compElement => {
      // retrieve component raw informations
      const compName = compElement.getAttribute(prefix)
      const propsData = this._getParsedVCIElementProps(compElement)
      // store informations into a VCI component
      const vciComp = new VCIComponent(this._compDefs[compName])
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
