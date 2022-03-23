<template>
  <div>
    <el-container>
      <el-aside width="350px">
        <keep-alive v-if="Object.keys(myList).length > 0">
          <mynft :myList="myList" :pageSize="3"
        /></keep-alive>
      </el-aside>
      <el-main><BridgeMain :curNFT="curNFT" /></el-main>
      <el-aside
        width="200px"
        style="float: right; background: #25272e"
        v-if="Object.keys(myList).length > 0"
      >
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
    curNFT(state) {
      if (state.current.pbtId) {
        const pbtId = String(state.current.pbtId);
        if (pbtId in state.myList) {
          return state.myList[pbtId];
        }
        if (pbtId in state.mySaleList) {
          return state.mySaleList[pbtId];
        }
      }
      return false;
    },
  }),
  watch: {
    "$store.state.myList"(lists) {
      this.$store.commit("setMylist", lists);
      this.curNFT;
      console.log("this.curNFT in bridge", this.curNFT);
      return this.myList;
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