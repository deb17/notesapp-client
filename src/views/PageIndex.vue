<template>
  <div class="index">
    <div id="content">
      <h1>Create and Persist your Personal Notes</h1>
      <GoogleLogin
        class="signin"
        :params="params"
        :renderParams="renderParams"
        :onSuccess="onSuccess"
        :onFailure="onFailure"
      ></GoogleLogin>
    </div>
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
  </div>
</template>

<script>
import GoogleLogin from 'vue-google-login'
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
    GoogleLogin
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
  },
  mounted() {
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
    window.addEventListener('resize', () => {
      let vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    })
  }
}
</script>

<style scoped>
.index {
  height: 100vh;
  height: calc(var(--vh, 1vh) * 100);
  background-image: url(../assets/nature.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}

#content {
  height: 90%;
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
