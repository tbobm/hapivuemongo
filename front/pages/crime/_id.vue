<template>
  <div>
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
    validate({params}) {
      return /^\d+$/.test(params.id)
    },
    asyncData({params}) {
      return axios.get(`http://localhost:8000/crime/${params.id}?access_token=1234`)
        .then((res) => {
          return {details: res.data}
        })
    }
  }
</script>
