<template>
  <section class="container-fluid">
    <div class="row">
      Crime : add
    </div>
  </section>
</template>
<script>
  import axios from 'axios';

  export default {
    middleware: 'authenticated',
    asyncData({params}) {
      return axios.get(`http://localhost:8000/crime?access_token=1234`)
        .then((res) => {
          return {details: res.data}
        })
    }
  }
</script>
