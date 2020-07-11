<template>
  <vue100vh class="index" :css="{ height: '100rvh' }">
    <marquee>
      <vue100vh :style="{ height: '90rvh' }">
        <marquee>
          <h1>Create and Persist your Personal Notes</h1>
          <GoogleLogin
            class="signin"
            :params="params"
            :renderParams="renderParams"
            :onSuccess="onSuccess"
            :onFailure="onFailure"
          ></GoogleLogin>
        </marquee>
      </vue100vh>
      <div id="credits">
        <span
          >Photo by
          <a
            href="https://unsplash.com/@markusspiske?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText"
            >Markus Spiske</a
          >
          on
          <a
            href="/t/nature?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText"
            >Unsplash</a
          ></span
        >
      </div>
    </marquee>
  </vue100vh>
</template>

<script>
import GoogleLogin from 'vue-google-login'
import vue100vh from 'vue-100vh'
export default {
  data() {
    return {
      params: {
        client_id:
          '691323965407-j0d8hin5iv5jpphq22nkg098a60l0e2g.apps.googleusercontent.com'
      },
      renderParams: {
        width: 250,
        height: 50,
        longtitle: true
      }
    }
  },
  components: {
    GoogleLogin,
    vue100vh
  },
  methods: {
    onSuccess() {
      this.$router.push({ name: 'home' })
    },
    onFailure(error) {
      console.log(error)
    }
  },
  created() {
    this.$emit('ready')
  }
}
</script>

<style scoped>
.index {
  background-image: url(../assets/nature.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}

h1 {
  margin: auto;
  max-width: 400px;
  padding: 100px 0 60px;
  font-family: 'Galada', cursive;
  font-size: 3rem;
  line-height: 3rem;
  text-align: center;
  color: #333;
}

.signin >>> .abcRioButton {
  margin: auto;
  background-color: lightblue;
  border-radius: 20px;
}

#credits span {
  color: white;
  font-size: 14px;
  float: right;
  margin: 10px;
}

#credits a {
  text-decoration: none;
  color: steelblue;
}
</style>
