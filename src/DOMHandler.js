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
      if (!compName) {
        validComp = false
        this._errorManager.logError('No component name specified.')
        return
      }
      if (!conf.opts.components[compName]) {
        validComp = false
        this._errorManager.logError(`No component found with name: ${compName}.`)
        return
      }

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
        if (!vciComp.isValidName()) {
          this._errorManager.logError(`The name "${compName}" is not valid.`)
        } else if (!vciComp.isValidComponent()) {
          this._errorManager.logError(`The component "${compName}" is not a valid Vue component definition.`)
        } else {
          vciComp.setPropsData(propsData)
        }
        vciComps.push(vciComp)
      }
    })
    return vciComps
  }

}
