<template>
  <div>
    <el-container>
      <el-aside width="350px">
        <keep-alive> <mynft /></keep-alive>
      </el-aside>
      <el-main><BridgeMain /></el-main>
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
  overflow: hidden;
}
.el-main {
  /* background-color: red; */
  height: calc(100vh - 140px);
  width: calc(100vw - 250px);
}
</style>