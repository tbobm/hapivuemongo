<template>
  <div class="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom box-shadow">
    <h5 class="my-0 mr-md-auto font-weight-normal">Boston police</h5>
    <nav class="my-2 my-md-0 mr-md-3">
      <nuxt-link :to="{ name: 'crime'}" class="p-2 text-dark">Crimes</nuxt-link>
      <nuxt-link :to="{ name: 'user'}" class="p-2 text-dark">Users</nuxt-link>
    </nav>
    <a class="btn btn-outline-primary" v-on:click="logout">Logout</a>
  </div>
</template>
<script>
  export default {
    methods: {
      logout() {
        this.$store.commit('logout');
        this.$router.push('/')
      }
    }
  }
</script>
