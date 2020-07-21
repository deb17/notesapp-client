<template>
  <div>
    <b-modal id="signup-modal" title="Sign Up" @close="close" hide-footer>
      <b-alert variant="danger" :show="showAlert">{{ alertMsg }}</b-alert>
      <b-form @submit.prevent="onSubmit">
        <b-form-group
          id="input-group-1"
          label="Email address:"
          label-for="input-1"
        >
          <b-form-input
            id="input-1"
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
          <b-form-invalid-feedback v-if="!$v.form.password.required">
            This field is required
          </b-form-invalid-feedback>
          <b-form-invalid-feedback v-if="!$v.form.password.minLength">
            Password should have at least 6 characters
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          id="input-group-3"
          label="Confirm Password:"
          label-for="input-3"
        >
          <b-form-input
            id="input-3"
            v-model="$v.form.confirmPassword.$model"
            type="password"
            :state="validateState('confirmPassword')"
          ></b-form-input>
          <b-form-invalid-feedback v-if="!$v.form.confirmPassword.required">
            This field is required
          </b-form-invalid-feedback>
          <b-form-invalid-feedback v-if="!$v.form.confirmPassword.sameAs">
            This field should match the password field
          </b-form-invalid-feedback>
        </b-form-group>
        <div class="loader" v-show="loaderShow">
          <img src="../assets/white-bg-loader.gif" />
        </div>
        <b-button type="submit" variant="primary" block>Sign up</b-button>
        <b-button type="button" variant="secondary" block @click="close"
          >Close</b-button
        >
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import { required, email, sameAs, minLength } from 'vuelidate/lib/validators'
import { signup } from '@/asyncActions'

export default {
  data() {
    return {
      form: {
        email: '',
        password: '',
        confirmPassword: ''
      },
      loaderShow: false,
      showAlert: false,
      alertMsg: ''
    }
  },
  validations: {
    form: {
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(6)
      },
      confirmPassword: {
        required,
        sameAs: sameAs('password')
      }
    }
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name]
      return $dirty ? !$error : null
    },
    onSubmit() {
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        return
      }
      this.loaderShow = true
      this.showAlert = false
      signup(this.form).then(msg => {
        this.loaderShow = false
        this.showAlert = true
        this.alertMsg = msg
      })
    },
    show() {
      this.$bvModal.show('signup-modal')
    },
    close() {
      this.form.email = ''
      this.form.password = ''
      this.form.confirmPassword = ''
      this.showAlert = false
      this.$bvModal.hide('signup-modal')
      this.$nextTick(() => {
        this.$v.$reset()
      })
    }
  }
}
</script>

<style scoped>
.loader {
  text-align: center;
  margin: 5px 0;
}
</style>
