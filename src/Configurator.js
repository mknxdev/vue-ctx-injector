import ErrorManager from './ErrorManager.js'

/**
 * Configurator - Store, performs checks & format user-provided data (Vue
 * instance and Configuration object) for further use.
 */

export default class Configurator {
  _errorManager = new ErrorManager()
  _defaultData = {
    replaceRoot: true,
    componentPrefix: 'data-v-comp',
    propPrefix: 'data-v:',
  }
  _userDataConds = {
    components: { type: 'object', required: true, },
    replaceRoot: { type: 'boolean', required: false, },
    componentPrefix: { type: 'string', required: false, },
    propPrefix: { type: 'string', required: false, },
  }
  _userData = {
    vue: null,
    opts: null,
    _valid: true,
  }
  _fmtData = {
    vue: null,
    opts: null,
  }

  constructor (vue, userOpts) {
    this._userData.vue = vue
    this._userData.opts = userOpts

    let validData = true
    this._errorManager.encapsulate(() => {
      if (!this._validateVueInstance()) {
        validData = false
        this._errorManager.throwError('This is not a valid Vue instance.')
      }
      if (!this._validateUserOptions()) {
        validData = false
        this._errorManager.throwError('This is not a valid configuration object.')
      }
    })

    this._userData._valid = validData
    if (validData) {
      this._storeFmtData(vue, userOpts)
    }
  }

  /**
   * Perform necessary checks for valid user-provided Vue instance.
   *
   * @return {void}
   */
  _validateVueInstance () {
    let valid = true
    if (!this._userData.vue) {
      this._userData.valid = false
      valid = false
    }
    if (this._userData.vue && (!this._userData.vue.hasOwnProperty('extend') ||
        !this._userData.vue.hasOwnProperty('observable'))) {
      this._userData.valid = false
      valid = false
    }
    return valid
  }

  /**
   * Perform necessary checks for valid user-provided configuration options.
   *
   * @return {void}
   */
  _validateUserOptions () {
    let valid = true
    for (const key in this._userDataConds) {
      const cond = this._userDataConds[key]

      if (cond.required && !this._userData.opts[key]) {
        this._errorManager.logError(`The [options.${key}] option is required.`)
        valid = false
        this._userData._valid = false
      }
      if (this._userData.opts[key] && typeof this._userData.opts[key] !== cond.type) {
        this._errorManager.logError(`The [options.${key}] option must be of type: ${cond.type}.`)
        valid = false
        this._userData._valid = false
      }
    }
    return valid
  }

  /**
   * Takes the user-provided `vue` and `opts` arguments to format and store
   * them into a formatted internal options object.
   *
   * @param  {Object} vue - The user-provided Vue instance.
   * @param  {Object} opts - The user-defined options.
   * @return {void}
   */
  _storeFmtData (vue, opts) {
    this._fmtData.vue = vue
    this._fmtData.opts = {
      components: opts.components,
      replaceRoot: opts.replaceRoot === undefined ?
        this._defaultData.replaceRoot : opts.replaceRoot,
      componentPrefix: opts.componentPrefix === undefined ?
        this._defaultData.componentPrefix : `data-${opts.componentPrefix}`,
      propPrefix: opts.propPrefix === undefined ?
        this._defaultData.propPrefix : `data-${opts.propPrefix}`,
    }
  }

  /**
   * Return the well-formatted data, merged with default data for non-provided
   * options.
   *
   * @return {Object}
   */
  getFmtData () {
    return this._fmtData
  }

  /**
   * Check for `valid` status of user-provided data.
   *
   * @return {Boolean}
   */
  isValid () {
    return this._userData._valid
  }

}
