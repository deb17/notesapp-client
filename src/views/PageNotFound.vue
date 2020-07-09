<template>
  <div class="container">
    <h3>That page was not found.</h3>
    <h1>404 Not Found</h1>
    <h3>
      <router-link :to="{ name: 'home' }">Go back</router-link>
    </h3>
  </div>
</template>

<script>
export default {
  created() {
    this.$emit('ready')
  }
}
</script>

<style scoped>
div {
  margin-top: 80px;
}
</style>
