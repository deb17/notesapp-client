<template>
  <nav class="navBar">
    <router-link class="nav-item" :to="{ name: 'home' }">Home</router-link>
    <router-link class="nav-item" :to="{ name: 'new-note' }">New</router-link>
    <span class="nav-item"
      ><GoogleLogin
        class="signout"
        :params="params"
        :onSuccess="onSuccess"
        :onFailure="onFailure"
        :logoutButton="true"
        >Logout</GoogleLogin
      ></span
    >
  </nav>
</template>

<script>
import GoogleLogin from 'vue-google-login'
export default {
  data() {
    return {
      params: {
        client_id:
          '691323965407-j0d8hin5iv5jpphq22nkg098a60l0e2g.apps.googleusercontent.com'
      }
    }
  },
  components: {
    GoogleLogin
  },
  methods: {
    onSuccess() {
      this.$router.push({ name: 'index' })
    },
    onFailure(error) {
      console.log(error)
    }
  }
}
</script>

<style scoped>
.navBar {
  padding: 20px 0;
  margin-bottom: 20px;
  background-color: lightblue;
  position: sticky;
  top: 0;
  z-index: 10;
}
.navBar a.router-link-exact-active {
  color: green;
  border-bottom-width: 2px;
  border-bottom-style: solid;
  padding-bottom: 4px;
}
.nav-item {
  margin: 0 20px;
}
.navBar .nav-item:last-child {
  float: right;
}
.signout {
  background: none;
  border: none;
  outline: none;
  font-size: 1rem;
  cursor: pointer;
  color: darkblue;
  padding: 0;
}
a {
  text-decoration: none;
  color: darkblue;
}
a:hover,
.signout:hover {
  border-bottom-width: 2px;
  border-bottom-style: solid;
  padding-bottom: 4px;
}
</style>
