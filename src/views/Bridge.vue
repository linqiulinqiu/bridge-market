<template>
  <div>
    <plotheader />
    <el-col>
      <p>bridge</p>
    </el-col>
    <mynft />
    <pbx />
    <plotfooter />
  </div>
</template>

<script>
import Plotheader from "../components/content/Plotheader.vue";
import Mynft from "../components/content/nftpanel/Mynft.vue";
import Pbx from "../components/content/nftpanel/Pbx.vue";
import Plotfooter from "../components/content/Plotfooter.vue";

import { mapState } from "vuex";

export default {
  name: "Bridge",
  components: {
    Plotheader,
    Mynft,
    Pbx,
    Plotfooter,
  },
};
</script>

<style>
</style>