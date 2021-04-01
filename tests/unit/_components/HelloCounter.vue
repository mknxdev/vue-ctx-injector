<template>
  <div class="test" id="example-counter">
    <h3>[HelloCounter]</h3>
    <div>Counter: <b>{{ nb }}</b></div>
  </div>
</template>

<script>
  export default {
    name: 'HelloCounter',

    props: {
      nb: {
        type: Number,
        default: 0,
      },
    },
  }
</script>
