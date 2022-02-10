<template>
  <div>
    <plotheader/>
    <h2>Bridge</h2>
    <mynft/>
    <pbx/>
    <plotfooter/>
  </div>
</template>

<script>
import Plotheader from '../components/content/Plotheader.vue'
import Mynft from '../components/content/nftpanel/Mynft.vue'
import Pbx from '../components/content/nftpanel/Pbx.vue'
import Plotfooter from '../components/content/Plotfooter.vue'

export default {
  name: 'Bridge',
  components:{
    Plotheader,
    Mynft,
    Pbx,
    Plotfooter
  }
}
</script>

<style>

</style>