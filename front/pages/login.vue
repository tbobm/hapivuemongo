<template>
  <section class="container-fluid">
    <div class="row">
      <div class="col-sm-12">

        <b-alert variant="danger" :show="loginFailed" dismissible>{{ this.errorMessage }}</b-alert>
        <b-form @submit.prevent="postLogin" novalidate>
          <b-form-group label="Username">
            <b-form-input type="text" name="username" v-model="form.username"></b-form-input>
          </b-form-group>
          <b-form-group label="Password">
            <b-form-input type="password" name="password" v-model="form.password"></b-form-input>
          </b-form-group>
          <b-button variant="primary" size="lg" type="submit">Login</b-button>
        </b-form>
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
          username: '',
          password: ''
        },
        loginFailed: false,
        errorMessage: null
      }
    },
    methods: {
      postLogin() {
        axios.post(`http://localhost:8000/login`, this.form)
          .then((res) => {
            if (!res.data || res.data.error){
              this.loginFailed = true;
              this.errorMessage = res.data.error;
              return;
            }
            this.$store.commit('update', res.data);
            this.$router.push('/')
          })
      }
    }
  }
</script>
