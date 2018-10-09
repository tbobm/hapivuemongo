<template>
  <div>
    <style>
      .filterChoice {
        float: right;
      }
    </style>
    <div>{{fieldFiltered}} : {{ filterValue }}</div>
    <div class="col-sm-12">
      <input type="text" name="filterValue" v-model="filterValue" @input="updateFilter">
    </div>
    <table class="table">
      <thead>
      <tr>
        <th>Case number <input type="radio" class="filterChoice" name="fieldFiltered" value="compnos" v-model="fieldFiltered"></th>
        <th>Year <input type="radio" class="filterChoice" name="fieldFiltered" value="year" v-model="fieldFiltered"></th>
        <th>Weapon type <input type="radio" class="filterChoice" name="fieldFiltered" value="weapontype" v-model="fieldFiltered"></th>
        <th>District <input type="radio" class="filterChoice" name="fieldFiltered" value="reptdistrict" v-model="fieldFiltered"></th>
        <th>Shooting <input type="radio" class="filterChoice" name="fieldFiltered" value="shooting" v-model="fieldFiltered"></th>
        <th>Domestic <input type="radio" class="filterChoice" name="fieldFiltered" value="domestic" v-model="fieldFiltered"></th>
        <td v-if="$store.state.auth && $store.state.auth.permissions.delete">Delete this crime</td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in details" :key="index">
        <td>
          <nuxt-link :to="{ name: 'crime-id', params: { id: item._id }}">{{ item.compnos }}</nuxt-link>
        </td>
        <td>{{ item.year }}</td>
        <td>{{ item.weapontype }}</td>
        <td>{{ item.reptdistrict }}</td>
        <td>{{ item.shooting }}</td>
        <td>{{ item.domestic }}</td>
        <td v-if="$store.state.auth && $store.state.auth.permissions.delete" style="cursor: pointer"
            v-on:click="deleteCrime(item)">Delete this
        </td>
      </tr>
      </tbody>
    </table>
    <nav>
      <ul class="pagination">
        <li class="page-item"><a class="page-link" href="#">Previous</a></li>
        <li class="page-item"><a class="page-link" href="#">1</a></li>
        <li class="page-item"><a class="page-link" href="#">2</a></li>
        <li class="page-item"><a class="page-link" href="#">3</a></li>
        <li class="page-item"><a class="page-link" href="#">Next</a></li>
      </ul>
    </nav>
  </div>
</template>
<script>
  import axios from 'axios';
  export default {
    middleware: 'authenticated',
    data(){
      return {
        fieldFiltered: null,
        filterValue: null
      }
    },
    asyncData({store}) {
      return axios.get(`http://localhost:8000/crimes`, {headers: {"Authorization": `Bearer ${store.state.auth.token}`}})
        .then((res) => {
          return {details: res.data}
        })
    },
    methods: {
      deleteCrime(item, event) {
        axios.delete(`http://localhost:8000/crimes/${item._id}`, {headers: {"Authorization": `Bearer ${this.$store.state.auth.token}`}})
          .then((res) => {
            console.log(res.data);
          })
      },
      updateFilter (e) {
        console.log(e.target.value);
      }
    }
  }
</script>
