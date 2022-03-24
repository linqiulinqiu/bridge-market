<template>
  <div>
    <div class="content">
      <el-aside width="350px">
        <keep-alive>
          <Mynft :myList="myList" :curNFT="this.curNFT" :pageSize="3"
        /></keep-alive>
      </el-aside>
      <el-main style="color: #fff">
        <MarketMain
          :marketList="marketList"
          :mySaleList="mySaleList"
          :pageSize="4"
        />
      </el-main>
    </div>
  </div>
</template>

<script>
import Mynft from "../components/content/Mynft.vue";
import { mapState } from "vuex";
import MarketMain from "../components/MarketMain.vue";
export default {
  name: "Market",
  components: {
    Mynft,
    MarketMain,
  },
  computed: mapState({
    baddr: "baddr",
    myList: "myList",
    marketList: "marketList",
    mySaleList: "mySaleList",
    curNFT(state) {
      if (state.current.pbtId) {
        const pbtId = String(state.current.pbtId);
        if (pbtId in state.myList) {
          return state.myList[pbtId];
        }
        if (pbtId in state.mySaleList) {
          return state.mySaleList[pbtId];
        }
        if (pbtId in state.marketList) {
          return state.marketList[pbtId];
        }
      }
      return false;
    },
  }),
  watch: {
    marketList: function (lists) {
      this.$store.commit("setMarketlist", lists);
      this.curNFT;
      console.log("this.curNFT in bridge", this.curNFT, lists);
      return this.$store.state.marketList;
    },
    deep: true,
    mySaleList: function (lists) {
      this.$store.commit("setMySalelist", lists);
      this.curNFT;
      console.log("this.curNFT in bridge", this.curNFT, lists);
      return this.$store.state.mySaleList;
    },
    deep: true,
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
.el-main {
  height: calc(100vh - 140px);
  width: calc(100vw - 250px);
  padding: 0;
}
</style>