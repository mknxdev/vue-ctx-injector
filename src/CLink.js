/**
 * CLink - Represents VCI-managed data used for communication between DOM and
 * Vue components.
 */

export default class CLink {
  isValidName = false
  componentName = null
  propsData = {}

  setComponentName (name = null) {
    this.componentName = name
    this.isValidName = !!name
  }

  setPropsData (data) {
    for (let name in data) {
      this.propsData[name] = data[name]
    }
  }

}
