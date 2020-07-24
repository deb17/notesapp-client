<template>
  <div id="signin-modal-div">
    <b-modal id="signin-modal" title="Sign In" @close="close" hide-footer>
      <b-alert variant="danger" :show="showAlert">{{ alertMsg }}</b-alert>
      <b-form @submit.prevent="onSubmit">
        <b-form-group
          id="input-group-1"
          label="Email address:"
          label-for="input-1"
        >
          <b-form-input
            id="input-1"
            size="lg"
            v-model="$v.form.email.$model"
            type="email"
            :state="validateState('email')"
          ></b-form-input>
          <b-form-invalid-feedback v-if="!$v.form.email.required">
            This field is required
          </b-form-invalid-feedback>
          <b-form-invalid-feedback v-if="!$v.form.email.email">
            Email is invalid
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group id="input-group-2" label="Password:" label-for="input-2">
          <b-form-input
            id="input-2"
            v-model="$v.form.password.$model"
            type="password"
            :state="validateState('password')"
          ></b-form-input>
          <b-form-invalid-feedback>
            This field is required
          </b-form-invalid-feedback>
        </b-form-group>
        <div class="loader" v-show="loaderShow">
          <img src="../assets/white-bg-loader.gif" />
        </div>
        <b-button type="submit" variant="primary" block>Sign in</b-button>
        <b-button type="button" variant="secondary" block @click="close"
          >Close</b-button
        >
      </b-form>
      <div class="mt-2 text">
        Forgot password?
        <a href="#" @click.prevent="showPassResetModal">Reset it</a>
      </div>
      <div class="text">
        No account? <a href="#" @click.prevent="showSignUpModal">Sign up</a>
      </div>
      <div class="separator mb-3">Or</div>
      <div class="loader" v-show="googleLoader">
        <img src="../assets/white-bg-loader.gif" />
      </div>
    </b-modal>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import { CLIENT_ID, signin } from '@/asyncActions'

export default {
  data() {
    return {
      params: {
        client_id: CLIENT_ID
      },
      renderParams: {
        width: 250,
        height: 50,
        longtitle: true
      },
      form: {
        email: '',
        password: ''
      },
      loaderShow: false,
      googleLoader: false,
      showAlert: false,
      alertMsg: ''
    }
  },
  components: {},
  validations: {
    form: {
      email: {
        required,
        email
      },
      password: {
        required
      }
    }
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name]
      return $dirty ? !$error : null
    },
    onSuccess(googleUser) {
      const authData = googleUser.getAuthResponse()
      const obj = { idToken: authData.id_token }
      this.googleLoader = true
      this.showAlert = false
      signin(obj).then(msg => {
        this.googleLoader = false
        this.showAlert = true
        this.alertMsg = msg
      })
    },
    onFailure(error) {
      console.log(error)
    },
    onSubmit() {
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        return
      }
      this.loaderShow = true
      this.showAlert = false
      signin(this.form).then(msg => {
        this.loaderShow = false
        this.showAlert = true
        this.alertMsg = msg
      })
    },
    show() {
      this.$bvModal.show('signin-modal')
    },
    close() {
      this.form.email = ''
      this.form.password = ''
      this.showAlert = false
      this.$bvModal.hide('signin-modal')
      this.$nextTick(() => {
        this.$v.$reset()
      })
    },
    showSignUpModal() {
      this.close()
      this.$emit('showSignUpModal')
    },
    showPassResetModal() {
      this.close()
      this.$emit('showPassResetModal')
    }
  }
}
</script>

<style scoped>
#signin-modal-div {
  text-align: left;
}
.signin >>> .abcRioButton {
  margin: auto;
  background-color: lightblue;
  border-radius: 20px;
}
.text {
  font-size: 0.8rem;
}
.loader {
  text-align: center;
  margin: 5px 0;
}
.separator {
  display: flex;
  align-items: center;
  text-align: center;
  font-style: italic;
  color: gray;
}
.separator::before,
.separator::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid gray;
}
.separator::before {
  margin-right: 5px;
}
.separator::after {
  margin-left: 5px;
}
</style>
