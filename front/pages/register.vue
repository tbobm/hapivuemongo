<template>
  <section class="container-fluid">
    <div class="row">
      <div class="col-sm-12">

        <b-alert variant="danger" :show="registerStatus === false" dismissible>Sorry, invalid email or password.</b-alert>
        <b-alert variant="success" :show="registerStatus === true" dismissible>Registration successful ! You will be redirected to login page !</b-alert>
        <b-form @submit.prevent="register">
          <b-form-group label="Grade">
            <b-form-select type="text" name="grade" :options="options" v-model="form.grade" required></b-form-select>
          </b-form-group>
          <b-form-group label="User name">
            <b-form-input type="text" name="username" v-model="form.username" required></b-form-input>
          </b-form-group>
          <b-form-group label="Password">
            <b-form-input type="password" name="password" v-model="form.password" required></b-form-input>
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
          username: '',
          password: '',
          grade: null
        },
        options: [
          { value: null, text: 'Veuillez choisir votre grade' },
          { value: 1, text: 'Agent' },
          { value: 2, text: 'Détective' },
          { value: 3, text: 'Chef de la police' }
        ],
        registerStatus: null
      }
    },
    methods: {
      register() {
        axios.post(`http://api:8000/register`, this.form)
          .then((res) => {
            if (res.status !== 200) {
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
