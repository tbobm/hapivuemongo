<template>
  <div>
    <b-form @submit.prevent="edit">
      <table class="table">
        <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(detail, v_key) in $store.state.crimeField" :key="v_key">
          <td>{{ v_key }}</td>
          <td><input v-model="details[v_key]" v-bind:type="detail.type" style="width: 100%" step="any"/></td>
        </tr>
        <tr>
          <td colspan="2">
            <b-button variant="primary" size="lg" type="submit">Edit</b-button>
          </td>
        </tr>
        </tbody>
      </table>
    </b-form>
  </div>
</template>
<script>
  import axios from 'axios';

  export default {
    middleware: 'authenticated',
    asyncData({store, params}) {
      return axios.get(`http://api:8000/crimes/${params.id}`, {headers: {"Authorization": `Bearer ${store.state.auth.token}`}})
        .then((res) => {
          return {details: res.data}
        })
    },
    methods: {
      edit() {
        axios.post(`http://api:8000/crimes/${this.details._id}`, this.details, {headers: {"Authorization": `Bearer ${this.$store.state.auth.token}`}})
          .then((res) => {
          })
      }
    }
  }
</script>
