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
import Mynft from "../components/content/nftpanel/Mynft.vue";
import BridgeMain from "../components/BridgeMain.vue";
import { mapState } from "vuex";

export default {
  name: "Bridge",
  components: {
    Mynft,
    BridgeMain,
  },
};
</script>

<style scoped>
.el-main {
  height: calc(100vh - 140px);
  width: calc(100vw - 250px);
}
</style>