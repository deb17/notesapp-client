<template>
  <div>
    <b-modal
      id="pass-reset-modal"
      title="Password Reset Request"
      @close="close"
      hide-footer
    >
      <b-alert variant="success" :show="showAlert"
        >Check your email for the instructions to reset your password</b-alert
      >
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
            :state="validateState"
            placeholder="Enter your email"
          ></b-form-input>
          <b-form-invalid-feedback v-if="!$v.form.email.required">
            This field is required
          </b-form-invalid-feedback>
          <b-form-invalid-feedback v-if="!$v.form.email.email">
            Email is invalid
          </b-form-invalid-feedback>
        </b-form-group>
        <div class="loader" v-show="loaderShow">
          <img src="../assets/white-bg-loader.gif" />
        </div>
        <b-button type="submit" variant="primary" block>Submit</b-button>
        <b-button type="button" variant="secondary" block @click="close"
          >Close</b-button
        >
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators'
import { passwordResetRequest } from '@/asyncActions'

export default {
  data() {
    return {
      form: {
        email: ''
      },
      showAlert: false,
      loaderShow: false
    }
  },
  validations: {
    form: {
      email: {
        required,
        email
      }
    }
  },
  computed: {
    validateState() {
      const { $dirty, $error } = this.$v.form.email
      return $dirty ? !$error : null
    }
  },
  methods: {
    onSubmit() {
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        return
      }
      this.showAlert = false
      this.loaderShow = true
      passwordResetRequest(this.form).then(() => {
        this.showAlert = true
        this.loaderShow = false
      })
    },
    show() {
      this.$bvModal.show('pass-reset-modal')
    },
    close() {
      this.form.email = ''
      this.$bvModal.hide('pass-reset-modal')
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
