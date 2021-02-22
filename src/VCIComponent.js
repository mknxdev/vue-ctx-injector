/**
 * VCIComponent - Represents a VCI-managed component used for communication
 * between DOM and Vue components.
 */

export default class VCIComponent {
  isValidName = false
  name = null
  propsData = {}
  vComp = null

  constructor (vComp) {
    this.vComp = vComp
  }

  /**
   * -
   *
   * @param {[type]} name [description]
   */
  setName (name = null) {
    this.name = name
    this.isValidName = !!name
  }

  /**
   * -
   *
   * @param {[type]} data [description]
   */
  setPropsData (data) {
    this.propsData = this._castProps(data)
  }

  /**
   * Use the props-level defined types of given internal vComp definition to
   * cast `initialProps` values.
   *
   * @param  {Object} initialProps - Initial string-based props.
   * @return {Object} - The well-casted props.
   */
  _castProps (initialProps) {
    let castedProps = {}
    for (const name in initialProps) {
      if (this.vComp && this.vComp.props.hasOwnProperty(name)) {
        const castType = this.vComp.props[name].type
        let castedProp = null
        if ([Object, Array].includes(castType)) {
          castedProp = JSON.parse(initialProps[name]);
        } else {
          castedProp = castType(initialProps[name]);
        }
        castedProps[name] = castedProp
      }
    }
    return castedProps
  }

}
