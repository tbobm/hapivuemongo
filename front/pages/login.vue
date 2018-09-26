<template>
  <section class="container-fluid">
    <div class="row">
      <div class="col-sm-12">

        <b-alert variant="danger" :show="loginFailed" dismissible>Sorry, invalid email or password.</b-alert>
        <b-form @submit.prevent="postLogin" novalidate>
          <b-form-group label="Email address">
            <b-form-input type="email" name="email" v-model="form.email"></b-form-input>
          </b-form-group>
          <b-form-group label="Password">
            <b-form-input type="password" name="password" v-model="form.password"></b-form-input>
          </b-form-group>
          <b-button variant="primary" size="lg" type="submit">Login</b-button>
        </b-form>
        <p>
          Use the email <strong>demo@gmail.com</strong> and password <strong>demo</strong> to login.
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
        loginFailed: false
      }
    },
    methods: {
      postLogin() {
        axios.post(`http://localhost:8000/login`, this.form)
          .then((res) => {
            if (!res.data || !res.data.accessToken){
              this.loginFailed = true;
              return;
            }
            this.$store.commit('update', res.data);
            this.$router.push('/')
          })
      }
    }
  }
</script>
