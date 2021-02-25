import ErrorManager from './ErrorManager.js'

/**
 * Configurator - Performs checks & formatting on user-provided data
 * (Vue instance and Configuration object).
 */

export default class Configurator {
  _errorManager = new ErrorManager()
  _userDataConds = {
    components: { type: 'object', required: true, },
    replaceRoot: { type: 'boolean', required: false, },
    componentPrefix: { type: 'string', required: false, },
    propPrefix: { type: 'string', required: false, },
  }
  _userData = {
    vue: null,
    opts: null,
    valid: true,
  }

  constructor (vue, userOpts) {
    this._userData.vue = vue
    this._userData.opts = userOpts

    this._errorManager.encapsulate(() => {
      this._validateVueInstance()
      if (!this._validateUserOptions()) {
        this._errorManager.throwError('This is not a valid configuration object.')
      }
    })
  }

  /**
   * Perform necessary checks for valid user-provided Vue instance.
   *
   * @return {void}
   */
  _validateVueInstance () {
    if (!this._userData.vue) {
      this._errorManager.throwError('You need to provide the Vue instance as 1st argument.')
      this._userData.valid = false
    }
    if (this._userData.vue && (!this._userData.vue.hasOwnProperty('extend') ||
        !this._userData.vue.hasOwnProperty('observable'))) {
      this._errorManager.throwError('This is not a valid Vue instance.')
      this._userData.valid = false
    }
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
        this._userData.valid = false
      }
      if (this._userData.opts[key] && typeof this._userData.opts[key] !== cond.type) {
        this._errorManager.logError(`The [options.${key}] option must be of type: ${cond.type}.`)
        valid = false
        this._userData.valid = false
      }
    }
    return valid
  }

  /**
   * Check for `valid` status of user-provided data.
   *
   * @return {Boolean}
   */
  isValid () {
    return this._userData.valid
  }

}
