<template>
  <div class="container" id="reset-page">
    <h3>Password Reset</h3>
    <b-alert :variant="variant" :show="showAlert">{{ alertMsg }}</b-alert>
    <b-form @submit.prevent="onSubmit">
      <b-form-group
        id="input-group-1"
        label="New Password:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="$v.form.password.$model"
          type="password"
          :state="validateState"
        ></b-form-input>
        <b-form-invalid-feedback v-if="!$v.form.password.required">
          This field is required
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-if="!$v.form.password.minLength">
          Password should have at least 6 characters
        </b-form-invalid-feedback>
      </b-form-group>
      <b-button type="submit" variant="primary">Change password</b-button>
      <img class="loader" v-show="loaderShow" src="../assets/item-loader.gif" />
    </b-form>
  </div>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'
import { passwordReset } from '@/asyncActions'

export default {
  props: {
    token: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      form: {
        password: ''
      },
      loaderShow: false,
      showAlert: false,
      alertMsg: '',
      variant: ''
    }
  },
  validations() {
    return {
      form: {
        password: {
          required,
          minLength: minLength(6)
        }
      }
    }
  },
  computed: {
    validateState() {
      const { $dirty, $error } = this.$v.form.password
      return $dirty ? !$error : null
    }
  },
  methods: {
    onSubmit() {
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        return
      }
      this.loaderShow = true
      this.showAlert = false
      passwordReset(this.form, this.token).then(res => {
        this.loaderShow = false
        this.showAlert = true
        if (res.data.error) {
          this.alertMsg = res.data.error
          this.variant = 'danger'
        } else {
          this.alertMsg = res.data.msg
          this.variant = 'success'
        }
      })
    }
  },
  created() {
    this.$emit('ready')
  }
}
</script>

<style scoped>
#reset-page {
  margin-top: 80px;
}
.loader {
  position: relative;
  bottom: 2px;
  margin-left: 10px;
}
</style>
