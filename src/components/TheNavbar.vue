<template>
  <nav class="navBar">
    <router-link class="nav-item" :to="{ name: 'home' }">Home</router-link>
    <router-link class="nav-item" :to="{ name: 'new-note' }">New</router-link>
    <span class="nav-item">
      <GoogleLogin
        class="signout"
        :params="params"
        :onSuccess="onSuccess"
        :onFailure="onFailure"
        :logoutButton="true"
        >Signout</GoogleLogin
      ></span
    >
  </nav>
</template>

<script>
import GoogleLogin from 'vue-google-login'
import { CLIENT_ID } from '@/asyncActions'

export default {
  data() {
    return {
      params: {
        client_id: CLIENT_ID
      }
    }
  },
  components: {
    GoogleLogin
  },
  methods: {
    onSuccess() {
      localStorage.removeItem('token')
      this.$router.push({ name: 'index' })
    },
    onFailure(error) {
      console.log(error)
    },
    onSignout() {
      localStorage.removeItem('token')
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
  margin-right: 25px;
}
.navBar .nav-item:last-child {
  float: right;
  margin-right: 0;
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
