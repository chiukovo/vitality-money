<template>
  <div class="container">
    <div>
      <h1 class="title">
        test page
        {{ this.$store.state.apiExampleData }}
      </h1>
    </div>
  </div>
</template>

<script>

export default {
  mounted() {
    this.$store.dispatch('CALL_API_EXAMPLE', { vm: this });
    console.log(this.testGlobal())
  }
}
</script>