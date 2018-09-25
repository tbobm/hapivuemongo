<template>
  <div>
    Crime : id = {{ $route.params.id }}

    {{ details.args }}
  </div>
</template>
<script>
  import axios from 'axios';
  export default {
    validate ({ params }) {
      return /^\d+$/.test(params.id)
    },
    asyncData ({ params }) {
      return axios.get(`https://httpbin.org/get?id=${params.id}`)
        .then((res) => {
          return { details: res.data }
        })
    }
  }
</script>
https://httpbin.org/get
