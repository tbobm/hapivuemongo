<template>
  <div>
    <table class="table">
      <thead>
      <tr>
        <th>ID</th>
        <th>Username</th>
        <th>Grade</th>
        <th v-if="$store.state.auth && $store.state.auth.permissions.validate">Enable</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in details.users" :key="index">
        <td>{{ item.id }}</td>
        <td>{{ item.username }}</td>
        <td>{{ item.grade }}</td>
        <td v-if="$store.state.auth && $store.state.auth.permissions.validate">
          <div class="col-sm-12 btn btn-outline-primary" v-on:click="validate(item)">
            Enable
          </div>
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
      return axios.get(`http://localhost:8000/users`, {headers: {"Authorization": `Bearer ${store.state.auth.token}`}})
        .then((res) => {
          return {details: res.data}
        })
    },
    methods: {
      validate(item, event) {
        axios.post(`http://localhost:8000/users/${item.id}/enable`, null, {headers: {"Authorization": `Bearer ${this.$store.state.auth.token}`}})
          .then((res) => {
            console.log(res.data);
          })
      }
    }
  }
</script>
