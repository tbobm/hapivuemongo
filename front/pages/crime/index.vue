<template>
  <div>
    <style>
      .filterChoice {
        float: right;
      }
    </style>

    <div class="row">
      <div class="col-sm-8">
        <nuxt-link class="col-sm-12 btn btn-outline-primary" :to="{ name: 'crime-add', params: { id: details._id }}"
                   v-if="$store.state.auth && $store.state.auth.permissions.edit">Add
        </nuxt-link>
      </div>
      <div class="col-sm-4" v-if="fieldFiltered">
        <input v-bind:type="$store.state.crimeField[fieldFiltered].type" v-model="fieldFilteredValue" @change="updateFilter()" style="width: 100%;">
      </div>
    </div>
    <table class="table">
      <thead>
      <tr>
        <th>Case number <input type="radio" class="filterChoice" name="fieldFiltered" value="compnos"
                               v-model="fieldFiltered" @change="changeFilter()"></th>
        <th>Year <input type="radio" class="filterChoice" name="fieldFiltered" value="year" v-model="fieldFiltered"
                        @change="changeFilter()">
        </th>
        <th>Weapon type <input type="radio" class="filterChoice" name="fieldFiltered" value="weapontype"
                               v-model="fieldFiltered" @change="changeFilter()"></th>
        <th>District <input type="radio" class="filterChoice" name="fieldFiltered" value="reptdistrict"
                            v-model="fieldFiltered" @change="changeFilter()"></th>
        <th>Shooting <input type="radio" class="filterChoice" name="fieldFiltered" value="shooting"
                            v-model="fieldFiltered" @change="changeFilter()"></th>
        <th>Domestic <input type="radio" class="filterChoice" name="fieldFiltered" value="domestic"
                            v-model="fieldFiltered" @change="changeFilter()"></th>
        <td v-if="$store.state.auth && $store.state.auth.permissions.delete">
          Actions
        </td>
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
        <td v-if="$store.state.auth && $store.state.auth.permissions.delete" style="cursor: pointer">
          <div class="col-sm-12 btn btn-outline-primary" v-on:click="deleteCrime(item, $event)">
            Delete this
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <nav>
      <ul class="pagination justify-content-center">
        <li class="page-item"><a class="page-link" href="#" v-on:click="goToPage(1)" v-if="page > 3"> 1 </a></li>
        <li class="page-item"><a class="page-link" v-if="page > 3">...</a></li>
        <li class="page-item"><a class="page-link" href="#" v-on:click="goToPage(page - 2)" v-if="page > 2">{{ page - 2}}</a>
        </li>
        <li class="page-item"><a class="page-link" href="#" v-on:click="goToPage(page - 1)" v-if="page > 1"> {{ page - 1
          }} </a></li>
        <li class="page-item active"><a class="page-link">{{ page }}</a></li>
        <li class="page-item"><a class="page-link" href="#" v-on:click="goToPage(page + 1)"
                                 v-if="page < Math.ceil(length / limit) - 1"> {{ page + 1}} </a></li>
        <li class="page-item"><a class="page-link" href="#" v-on:click="goToPage(page + 2)"
                                 v-if="page < Math.ceil(length / limit) - 2">{{ page + 2}}</a></li>
        <li class="page-item"><a class="page-link" v-if="page < Math.ceil(length / limit) - 2">...</a></li>
        <li class="page-item"><a class="page-link" href="#" v-on:click="goToPage(Math.ceil(length / limit))"
                                 v-if="page < Math.ceil(length / limit)"> {{Math.ceil(length / limit)}} </a></li>
      </ul>
    </nav>
  </div>
</template>
<script>
  import axios from 'axios';

  export default {
    middleware: 'authenticated',
    data() {
      return {
        fieldFiltered: null,
        fieldFilteredValue: null,
        limit: 25,
        page: 1,
        length: null,
        details: []
      }
    },
    asyncData({store}) {
      return axios.post(`http://localhost:8000/crimes/search`, {}, {headers: {"Authorization": `Bearer ${store.state.auth.token}`}})
        .then((res) => {
          return {details: res.data.data, length: res.data.length}
        })
    },
    methods: {
      deleteCrime(item, event) {
        axios.delete(`http://localhost:8000/crimes/${item._id}`, {headers: {"Authorization": `Bearer ${this.$store.state.auth.token}`}})
          .then((res) => {
            this.reloadData(null);
          })
      },
      reloadData(event) {
        const params = {
          'field': this.fieldFiltered,
          'filter': this.fieldFilteredValue,
          'limit': this.limit,
          'offset': (this.page - 1) * this.limit
        }
        axios.post(`http://localhost:8000/crimes/search`, params, {
          headers: {"Authorization": `Bearer ${this.$store.state.auth.token}`}
        })
          .then((res) => {
            this.details = res.data.data;
            this.length = res.data.length;
          })
      },
      updateFilter(event) {
        if (this.fieldFiltered) {
          this.goToPage(1);
        }
      },
      changeFilter(event) {
        this.fieldFilteredValue = null;
        this.updateFilter(event);
      },
      goToPage(page, event) {
        this.page = page;
        this.reloadData(event);
      }
    }
  }
</script>
