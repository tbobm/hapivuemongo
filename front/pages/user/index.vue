<template>
  <div>
    Users : index
    {{ details }}
  </div>
</template>

<script>
  import axios from 'axios';
  export default {
    middleware: 'authenticated',
    asyncData({store}) {
      return axios.get(`http://localhost:8000/user`, {headers: {"Authorization": `Bearer ${store.state.auth.token}`}})
        .then((res) => {
          return {details: res.data}
        })
    }
  }
</script>
