<template>
  <div class="content">
    <el-aside width="250px">
      <mynft />
    </el-aside>
    <el-main>Main</el-main>
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
.content {
  display: flex;
}
.el-main {
  /* background-color: red; */
  height: calc(100vh - 140px);
  width: calc(100vw - 250px);
}
</style>