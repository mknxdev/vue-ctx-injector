import Configurator from './Configurator.js'
import ErrorManager from './ErrorManager.js'
import VCIComponent from './VCIComponent.js'
import DOMHandler from './DOMHandler.js'

/**
 * VueCtxInjector - Main VCI class.
 * Serves as entrypoint for components management processes.
 */

export default class VueCtxInjector {
  // core
  _vue = null
  _compDefs = {}
  _compConstructors = {}
  _compInstances = {}
  _compElements = {}
  _errorManager = new ErrorManager()
  _domHandler = null
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
    let conf = new Configurator(Vue, opts)

    if (conf.isValid()) {
      this._vue = Vue
      this._compDefs = opts.components
      // set user-defined options
      this._storeFormattedUserOptions(opts)
      this._domHandler = new DOMHandler(
        this._vue,
        this._compDefs,
        this._replaceRoot,
        this._componentPrefix,
        this._propPrefix,
      )
      // init components parsing
      this._initStdlComponents()
    }
  }

  /**
   * Takes the used-defined `opts` to format and store them into VCI internal
   * options.
   *
   * @param  {Object} opts - The use-defined options.
   * @return {void}
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
    const vciComps = this._domHandler.getParsedVCIComponents()
    for (const vciComp of vciComps) {
      let valid = true
      this._errorManager.encapsulate(() => {
        if (!vciComp.isValidName()) {
          valid = false
          this._errorManager.error('No component name specified.')
        }
        if (!vciComp.isValidComponent()) {
          valid = false
          this._errorManager.error(`No component found with name: ${vciComp.name}.`)
        }
      })
      if (valid) {
        vciComp.mount()
        vciComp.watch()
      }
    }
  }

  // API Methods ---------------------------------------------------------------

  /**
   * Triggers the DOM parsing for standalone components.
   *
   * TODO:  This method simply calls the init method, so the already instantiated
   * components are processed again. Improve this part to avoid re-parsing
   * non-needed components.
   *
   * @return {void}
   */
  parse () {
    this._initStdlComponents()
  }
}
