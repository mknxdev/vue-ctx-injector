/**
 * CLink - Represents VCI-managed data used for communication between DOM and
 * Vue components.
 */

export default class CLink {
  isValidName = false
  componentName = null
  propsData = {}

  /**
   * -
   *
   * @param {[type]} name [description]
   */
  setComponentName (name = null) {
    this.componentName = name
    this.isValidName = !!name
  }

  /**
   * -
   *
   * @param {[type]} data [description]
   */
  setPropsData (data) {
    for (let name in data) {
      this.propsData[name] = data[name]
    }
  }

}
