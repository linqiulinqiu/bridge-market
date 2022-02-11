<template>
  <div>
    <plotheader />
    <el-col>
      <p>bridge</p>
    </el-col>
    <mynft />
    <div class="main">
    </div>
    <plotfooter />
  </div>
</template>

<script>
import Plotheader from "../components/content/Plotheader.vue";
import Mynft from "../components/content/nftpanel/Mynft.vue";
import Plotfooter from "../components/content/Plotfooter.vue";

import { mapState } from "vuex";

export default {
  name: "Bridge",
  components: {
    Plotheader,
    Mynft,
    Plotfooter,
  },
};
</script>

<style scoped>
.main{
  background-color: rgb(137, 180, 146);
  width: 85vw;
  height: calc(100vh - 163px);
  margin-left: 15vw;
}
</style>