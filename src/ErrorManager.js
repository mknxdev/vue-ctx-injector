/**
 * ErrorManager - Used to manage runtime-based errors in the script.
 */

export default class ErrorManager {

  /**
   * Executes the given `callback` in a safe `try/catch` context.
   * This method is used especially for critical operations such as
   * user-given options.
   *
   * @param  {Function} callback - The callback function to execute.
   * @return {mixed} The callback's return value.
   */
  encapsulate (callback) {
    try {
      return callback()
    } catch (e) {
      console.error(e)
      return false
    }
  }

  /**
   * Throw a new `Error` instance in the console.
   * This method must be used in conjunction with the `encapsulate` method and
   * called inside the `try/catch` block to avoid 'UncaughtErrors'.
   *
   * @param  {String} message - The error message to display in the console.
   * @return {void}
   */
  throwError (message) {
    throw new Error(`[VueCtxInjector] ${message}`)
  }

  /**
   * Throw a new `Error` instance in the console.
   * This method must be used in conjunction with the `encapsulate` method and
   * called inside the `try/catch` block to avoid 'UncaughtErrors'.
   *
   * @param  {String} message - The error message to display in the console.
   * @return {void}
   */
  logError (message) {
    console.error(`[VueCtxInjector] ${message}`)
  }

}
