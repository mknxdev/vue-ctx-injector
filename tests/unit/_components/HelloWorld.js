import Vue from 'vue'

export default Vue.component('HelloWorld', {
  template: `
    <span class="test" id="example-hello">
      <h3>[HelloWorld]</h3>
      <span v-show="firstName && lastName">Hello, <b style="text-transform: uppercase;">{{ name }}</b>!</span>
      <span v-show="!firstName || !lastName">Hello, World!</span>
    </span>
  `,
  props: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  computed: {
    name () {
      return `${this.firstName} ${this.lastName}`
    }
  }
})
