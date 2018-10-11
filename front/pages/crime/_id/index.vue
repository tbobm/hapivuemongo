<template>
  <div>

      <nuxt-link class="col-sm-12 btn btn-outline-primary" :to="{ name: 'crime-id-edit', params: { id: details._id }}"
                 v-if="$store.state.auth && $store.state.auth.permissions.edit">Edit
      </nuxt-link>
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
        <td>{{ detail }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
  import axios from 'axios';

  export default {
    middleware: 'authenticated',
/*    validate({params}) {
      return /^\d+$/.test(params.id)
    },*/
    asyncData({store, params}) {
      return axios.get(`http://api:8000/crimes/${params.id}`, {headers: {"Authorization": `Bearer ${store.state.auth.token}`}})
        .then((res) => {
          return {details: res.data}
        })
    }
  }
</script>
