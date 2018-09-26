<template>

  <div>
    <app-menu/>
    <div class="page">

      <main role="main">
        <nuxt/>
      </main>
    </div>
  </div>
</template>

<script>
  import AppMenu from "~/components/AppMenu.vue"

  export default {
    components: {AppMenu},
    mounted() {
    }
  }
</script>
