<template>
  <div class="animated fadeIn">

    <b-row>
      <b-col lg="12">
        <b-col offset="3" cols="6">
          <b-button block variant="success">Add a new crime</b-button>
        </b-col>
        <c-table striped caption="<i class='fa fa-align-justify'></i> Crimes list"></c-table>
      </b-col><!--/.col-->
    </b-row><!--/.row-->
  </div>

</template>

<script>
import cTable from './Table.vue'

export default {
  name: 'crimes',
  components: {cTable}
}
</script>
