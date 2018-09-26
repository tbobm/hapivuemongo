<template>
  <section class="container-fluid">
    <div class="row">
      <div class="col-sm-12">

        <b-alert variant="danger" :show="registerStatus === false" dismissible>Sorry, invalid email or password.</b-alert>
        <b-alert variant="success" :show="registerStatus === true" dismissible>Registration successful !</b-alert>
        <b-form @submit.prevent="register" novalidate>
          <b-form-group label="Email address">
            <b-form-input type="email" name="email" v-model="form.email"></b-form-input>
          </b-form-group>
          <b-form-group label="Password">
            <b-form-input type="password" name="password" v-model="form.password"></b-form-input>
          </b-form-group>
          <b-button variant="primary" size="lg" type="submit">Register</b-button>
        </b-form>
        <p>
        </p>
      </div>
    </div>
  </section>
</template>
<script>
  import Cookie from 'js-cookie'
  import axios from 'axios';

  export default {
    middleware: 'notAuthenticated',
    data() {
      return {
        form: {
          email: '',
          password: ''
        },
        registerStatus: null
      }
    },
    methods: {
      register() {
        axios.post(`http://localhost:8000/register`, this.form)
          .then((res) => {
            if (!res.data || !res.data.success){
              this.registerStatus = false;
              return;
            }
            this.registerStatus = true;
            setTimeout(() => {
              this.$router.push('/')
            }, 2000)
          })
      }
    }
  }
</script>
