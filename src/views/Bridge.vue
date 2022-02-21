<template>
  <div>
    <el-container>
      <el-header> <plotheader /> </el-header>
      <el-aside width="400px"> <mynft /></el-aside>
      <el-main><BridgeMain /></el-main>
      <el-footer> <plotfooter /> </el-footer>
    </el-container>
  </div>
</template>

<script>
import Plotheader from "../components/content/Plotheader.vue";
import Mynft from "../components/content/nftpanel/Mynft.vue";
import Plotfooter from "../components/content/Plotfooter.vue";
import BridgeMain from "../components/BridgeMain.vue";

import { mapState } from "vuex";

export default {
  name: "Bridge",
  components: {
    Plotheader,
    Mynft,
    Plotfooter,
    BridgeMain,
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