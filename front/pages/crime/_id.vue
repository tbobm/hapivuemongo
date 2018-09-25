<template>
  <div>
    <table>
      <thead>
      <tr>
        <th>Key</th>
        <th>Value</th>
      </tr>
      </thead>
      <tr v-for="(detail, v_key) in details" :key="v_key">
        <td>{{ v_key }}</td>
        <td>{{ detail }}</td>
      </tr>
    </table>
  </div>
</template>
<script>
  import axios from 'axios';
  export default {
    validate ({ params }) {
      return /^\d+$/.test(params.id)
    },
    asyncData ({ params }) {
      return axios.get(`http://localhost:8000/crime/${params.id}?access_token=1234`)
        .then((res) => {
          return { details: res.data }
        })
    }
  }
</script>
