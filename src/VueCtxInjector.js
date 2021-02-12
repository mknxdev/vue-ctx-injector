export default class VueCtxInjector {
  stdlComponents = []

  constructor (options) {
    console.log(options)
  }

  start () {
    document.addEventListener('DOMContentLoaded', () => {
      this.stdlComponents = document.querySelectorAll('[v-comp]')

      console.log(this.stdlComponents)
    })
  }
}
