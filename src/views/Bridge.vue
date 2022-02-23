<template>
  <div class="content">
    <el-aside width="250px"> <Mynft /></el-aside>
    <el-main>main</el-main>
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
  color: #ffffff;
}
.el-main {
  /* background-color: red; */
  height: calc(100vh - 70px);
  width: calc(100vw - 250px);
}
.el-aside {
  background: #25272E;
}
</style>