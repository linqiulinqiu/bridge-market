<template>
  <div>
    <div class="content">
      <el-aside width="280px">
        <keep-alive>
          <Mynft :myList="myList" :curNFT="this.curNFT" :pageSize="3" />
        </keep-alive>
      </el-aside>
      <el-main>
        <el-col :span="23">
          <MarketMain
            :marketList="marketList"
            :mySaleList="mySaleList"
            :pageSize="4"
          />
        </el-col>
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
  background-color: #2b2c33;
  color: #fff;
}
.el-main > .el-col {
  margin-left: 2%;
  /* padding-top: 10px; */
}
</style>