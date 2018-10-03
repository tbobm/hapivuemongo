<template>
  <div>
    <table class="table">
      <thead>
      <tr>
        <th>ID</th>
        <th>Case number</th>
        <th>Crime code</th>
        <th>Date</th>
        <td v-if="$store.state.auth && $store.state.auth.permissions.delete">Delete this crime</td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in details" :key="index">
        <td>
          <nuxt-link :to="{ name: 'crime-id', params: { id: item._id }}">{{ item._id }}</nuxt-link>
        </td>
        <td>{{ item.compnos }}</td>
        <td>{{ item.main_crimecode }}</td>
        <td>{{ item.fromdate }}</td>
        <td v-if="$store.state.auth && $store.state.auth.permissions.delete" style="cursor: pointer"
            v-on:click="deleteCrime(item)">Delete this
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
  import axios from 'axios';

  export default {
    middleware: 'authenticated',
    asyncData({store}) {
      return axios.get(`http://localhost:8000/crime`, {headers: {"Authorization": `Bearer ${store.state.auth.token}`}})
        .then((res) => {
          return {details: res.data}
        })
    },
    methods: {
      deleteCrime(item, event) {
        axios.delete(`http://localhost:8000/crime/${item._id}?access_token=1234`)
          .then((res) => {
            console.log(res.data);
          })
      }
    }
  }
</script>
