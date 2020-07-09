<template>
  <div class="container">
    <h3>There was an error!</h3>
    <h1>{{ error }}</h1>
    <h3>
      Go back
      <router-link :to="{ name: 'home' }">home</router-link>
    </h3>
  </div>
</template>

<script>
export default {
  data() {
    return {
      error: this.$route.params.error || '404 Page Not Found'
    }
  },
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
