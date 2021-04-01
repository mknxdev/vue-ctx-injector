export default class DOM {

  /**
   * Parse props defined by the given `propPrefix` on the given `element`
   * (HTML-based "standalone component"), and returns their "camelCased"
   * version into an object.
   * Note: This method only returns parsed props as-is, but not casted to
   * Component-defined types; so values are only of `string` type.
   *
   * @param  {String} propPrefix - The prop prefix to use for parsing.
   * @param  {HTMLElement} compElement - The HTML element to parse for props.
   * @return {Object} - The parsed props.
   */
  static getVCIElementProps (propPrefix, element) {
    let props = {}
    for (const i in element.attributes) {
      const attr = element.attributes[i]
      if (attr.name && attr.name.includes(propPrefix)) {
        // TODO:  Maybe find a tiny library other than lodash to do this job
        // (lodash's `camelCase` imported code is too big)
        const kcPropName = attr.name.substr(attr.name.indexOf(propPrefix) + propPrefix.length)
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
