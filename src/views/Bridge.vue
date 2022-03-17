<template>
  <div>
    <el-container>
      <el-aside width="350px">
        <keep-alive v-if="Object.keys(myList).length > 0">
          <mynft v-bind:myList="myList" v-bind:pageSize="3"
        /></keep-alive>
      </el-aside>
      <el-main><BridgeMain v-bind:myList="myList" /></el-main>
      <el-aside width="200px" style="float: right; background: #25272e">
        <SelectCoin />
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import Mynft from "../components/content/nftpanel/Mynft.vue";
import BridgeMain from "../components/BridgeMain.vue";
import SelectCoin from "../components/bridge/SelectCoin.vue";
import { mapState } from "vuex";

export default {
  name: "Bridge",
  components: {
    Mynft,
    BridgeMain,
    SelectCoin,
  },
  computed: mapState({
    myList: "myList",
  }),
  watch: {
    myList: function (lists) {
      this.$store.commit("setMylist", lists);
    },
  },
};
</script>

<style scoped>
.el-main {
  height: calc(100vh - 140px);
  width: calc(100vw - 250px);
}
</style>