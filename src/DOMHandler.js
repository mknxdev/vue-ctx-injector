import VCIComponent from './VCIComponent.js'
import ErrorManager from './ErrorManager.js'
import DOM from './helpers/DOM.js'

/**
 * DOMHandler - Used for all DOM manipulations.
 */

export default class DOMHandler {
  _errorManager = new ErrorManager()
  _conf = null

  constructor (configurator) {
    this._conf = configurator
  }

  /**
   * Loops through all HTML elements defined as "standalone component" to return
   * a list of `VCIComponent`s (object representation of an element/component
   * link).
   *
   * @return {Array<VCIComponent>}
   */
  getParsedVCIComponents () {
    const conf = this._conf.getFmtData()
    const compPrefix = conf.opts.componentPrefix
    const propPrefix = conf.opts.propPrefix
    let vciComps = []
    document.querySelectorAll(`[${compPrefix}]`).forEach(compElement => {
      let validComp = true
      // retrieve component raw informations then perform basic checkings
      const compName = compElement.getAttribute(compPrefix)
      this._errorManager.encapsulate(() => {
        if (!compName) {
          validComp = false
          this._errorManager.throwError('No component name specified.')
        }
        if (!conf.opts.components[compName]) {
          validComp = false
          this._errorManager.throwError(`No component found with name: ${compName}.`)
        }
      })

      // store informations into a VCI component if valid
      if (validComp) {
        const propsData = DOM.getVCIElementProps(propPrefix, compElement)
        const vciComp = new VCIComponent(conf.vue, {
          compPrefix: compPrefix,
          propPrefix: propPrefix,
          vComp: conf.opts.components[compName],
          rootElement: compElement,
          replaceRoot: conf.opts.replaceRoot
        })
        vciComp.setName(compName)
        vciComp.setPropsData(propsData)
        vciComps.push(vciComp)
      }
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
    const conf = this._conf.getFmtData()
    const prefix = conf.opts.propPrefix
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
