import Vue from 'vue'

export default Vue.component('HelloCounter', {
  template: `
    <div class="test" id="example-counter">
      <h3>[HelloCounter]</h3>
      <div>Counter: <b>{{ nb }}</b></div>
    </div>
  `,
  props: {
    nb: {
      type: Number,
      default: 0,
    },
  },
})
