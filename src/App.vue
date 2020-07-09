<template>
  <div id="app">
    <router-view
      v-show="showPage"
      :key="$route.path"
      @ready="showPage = true"
    />
    <div id="loader" v-show="!showPage">
      <img src="./assets/ajax-loader.gif" alt="Loading" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showPage: false
    }
  },
  created() {
    this.$router.beforeEach((to, from, next) => {
      this.showPage = false
      next()
    })
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
  background-color: lightblue;
}
.container {
  max-width: 800px;
  margin: auto;
  position: relative;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
  background-color: lightgray;
}
.slide-fade-leave-to {
  transform: translateX(-100px);
  opacity: 0;
}
#loader {
  margin-top: 200px;
  text-align: center;
}
</style>
