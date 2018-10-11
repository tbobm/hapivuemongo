<template>
  <div>

    <div class="col-sm-12 btn btn-outline-primary" v-on:click="exportUsers()">Export
    </div>
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
          <div class="col-sm-12 btn btn-outline-primary" v-on:click="validate(item, $event)"
               v-if="item.username != $store.state.auth.user.username">
            {{ item.active ? 'Disable' : 'Enable'}}
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
      return axios.get(`http://api:8000/users`, {headers: {"Authorization": `Bearer ${store.state.auth.token}`}})
        .then((res) => {
          return {details: res.data}
        })
    },
    methods: {
      validate(item, event) {
        axios.post(`http://api:8000/users/${item.id}/enable`, null, {headers: {"Authorization": `Bearer ${this.$store.state.auth.token}`}})
          .then((res) => {
            event.target.innerText = res.data.active ? "Disable" : "Enable";
          })
      },
      exportUsers(event) {
        axios.get(`http://api:8000/users.csv`, {
          headers: {"Authorization": `Bearer ${this.$store.state.auth.token}`},
          responseType: 'blob'
        })
          .then((res) => {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'users.csv');
            document.body.appendChild(link);
            link.click();
          })
      },
    }
  }
</script>
