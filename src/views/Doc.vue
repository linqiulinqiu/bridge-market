<template>
  <div>
    <plotheader/>
    <h2>Doc</h2>
    <plotfooter/>
  </div>
</template>

<script>
import Plotheader from '../components/content/Plotheader.vue'
import Plotfooter from '../components/content/Plotfooter.vue'

export default {
  name: 'Doc',
  components:{
    Plotheader,
    Plotfooter
  }
}
</script>

<style>

</style>