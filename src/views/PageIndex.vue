<template>
  <div class="index">
    <div id="content">
      <h1>Create and Persist your Personal Notes</h1>
      <sign-in-modal
        ref="child-1"
        @showSignUpModal="showSignUpModal"
        @showPassResetModal="showPassResetModal"
      />
      <sign-up-modal ref="child-2" />
      <password-reset-request-modal ref="child-3" />
      <b-button size="lg" variant="success" @click="showSignInModal"
        >Sign in</b-button
      >
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
import SignInModal from '@/components/SignInModal'
import SignUpModal from '@/components/SignUpModal'
import PasswordResetRequestModal from '@/components/PasswordResetRequestModal'
export default {
  components: {
    SignInModal,
    SignUpModal,
    PasswordResetRequestModal
  },
  methods: {
    showSignInModal() {
      this.$refs['child-1'].show()
    },
    showSignUpModal() {
      this.$refs['child-2'].show()
    },
    showPassResetModal() {
      this.$refs['child-3'].show()
    }
  },
  created() {
    this.$emit('ready')
  },
  mounted() {
    // Subtract 0.5 to remove possible scroll-bar
    let vh = (window.innerHeight - 0.5) * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
    window.addEventListener('resize', () => {
      let vh = (window.innerHeight - 0.5) * 0.01
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
  text-align: center;
}

h1 {
  margin: auto;
  max-width: 400px;
  padding: 100px 0 40px;
  font-family: 'Galada', cursive;
  font-size: 3rem;
  line-height: 3rem;
  text-align: center;
  color: #333;
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
