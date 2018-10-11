<template>
  <div>
    <b-form @submit.prevent="add">
      <table class="table">
        <thead>
        <tr>
          <th>Key</th>
          <th>Value</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(detail, v_key) in $store.state.crimeField" :key="v_key">
          <td>{{ v_key }}</td>
          <td><input v-model="form[v_key]" v-bind:type="detail.type" :disabled="!detail.editable" style="width: 100%"/></td>
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
    data() {
      return {
        form: {
          compnos: null,
          naturecode: null,
          incident_type_description: null,
          main_crimecode: null,
          reptdistrict: null,
          reportingarea: null,
          fromdate: null,
          weapontype: null,
          shooting: null,
          domestic: null,
          shift: null,
          year: null,
          month: null,
          day_week: null,
          ucrpart: null,
          x: null,
          y: null,
          streetname: null,
          xstreetname: null,
          location: null
        }
      }
    },
    methods: {
      add() {
        axios.post(`http://localhost:8000/crimes`, this.form, {headers: {"Authorization": `Bearer ${this.$store.state.auth.token}`}})
          .then((res) => {
          })
      }
    }
  }
</script>
