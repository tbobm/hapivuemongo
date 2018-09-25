<template>
  <div>
    Crime : index
    <table>
      <thead>
      <tr>
        <th>Case number</th>
        <th>Crime code</th>
        <th>Date</th>
      </tr>
      </thead>
      <tr v-for="(item, index) in details" :key="index">
        <td><nuxt-link  :to="{ name: 'crime-id', params: { id: item.compnos }}">{{ item.compnos }}</nuxt-link></td>
        <td>{{ item.main_crimecode }}</td>
        <td>{{ item.fromdate }}</td>
      </tr>
    </table>
  </div>
</template>
<script>
  import axios from 'axios';
  export default {
    asyncData ({ params }) {
      return axios.get(`http://localhost:8000/crime?access_token=1234`)
        .then((res) => {
          return { details: res.data }
        })
    }
  }
</script>
