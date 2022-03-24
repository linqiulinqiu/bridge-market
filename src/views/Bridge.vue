<template>
  <div>
    <el-container>
      <el-aside width="350px">
        <keep-alive v-if="Object.keys(myList).length > 0">
          <mynft :myList="myList" :pageSize="3" :curNFT="this.curNFT"
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
import Mynft from "../components/content/Mynft.vue";
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
          console.log("Bridge-curNFT", JSON.stringify(state.myList[pbtId]));
          return Object.assign({},state.myList[pbtId]);
        }
        if (pbtId in state.mySaleList) {
          return Object.assign({},state.mySaleList[pbtId]);
        }
      }
      console.log("Bridge-curNFT:nothing");
      return false;
    },
  }),
};
</script>

<style scoped>
.el-main {
  height: calc(100vh - 140px);
  width: calc(100vw - 250px);
}
</style>