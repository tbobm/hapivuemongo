<template>
  <div>
    <b-form @submit.prevent="edit" novalidate>
      <table class="table">
        <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(detail, v_key) in details" :key="v_key">
          <td>{{ v_key }}</td>
          <td><input v-model="details[v_key]" style="width: 100%"/></td>
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
/*    validate({params}) {
      return /^\d+$/.test(params.id)
    },*/
    asyncData({params}) {
      return axios.get(`http://localhost:8000/crime/${params.id}?access_token=1234`)
        .then((res) => {
          return {details: res.data}
        })
    },
    methods: {
      edit() {
        axios.post(`http://localhost:8000/crime/${this.details.compnos}?access_token=1234`, this.details)
          .then((res) => {
            console.log(res.data);
          })
      }
    }
  }
</script>
