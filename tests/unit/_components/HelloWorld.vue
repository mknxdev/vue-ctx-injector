<template>
  <span class="test" id="example-hello">
    <h3>[HelloWorld]</h3>
    <span v-show="firstName && lastName">Hello, <b style="text-transform: uppercase;">{{ name }}</b>!</span>
    <span v-show="!firstName || !lastName">Hello, World!</span>
    <span>You are {{ age }} yo.</span>
  </span>
</template>

<script>
  export default {
    name: 'HelloWorld',

    props: {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      age: {
        type: Number,
        required: true,
      },
    },
    computed: {
      name () {
        return `${this.firstName} ${this.lastName}`
      }
    }
  }
</script>
