<template>
  <el-row>
    <el-col class="main" v-if="baddr">
      <el-col v-if="!current.pbtId">
        <h2>PBT {{ $t("market") }}</h2>
        <el-col>
          <el-col class="cointy">
            <MarketList
              :marketList="this.marketList"
              :pageSize="this.pageSize"
            />
          </el-col>
          <el-col class="cointy">
            <MySale :mySaleList="this.mySaleList" :pageSize="this.pageSize" />
          </el-col>
        </el-col>
      </el-col>
      <el-col v-else>
        <el-button @click="clearCurrentId">Back</el-button>
        <el-col><NFTinfo :curNFT="curNFT" /></el-col>
      </el-col>
    </el-col>
    <el-col v-else>{{ $t("connect") }}</el-col>
  </el-row>
</template>
<script>
import MarketList from "./market/MarketList.vue";
import NFTinfo from "./content/nftpanel/NFTinfo.vue";
import MySale from "./market/MySale.vue";
import { mapState } from "vuex";
export default {
  name: "MarketMain",
  components: {
    MySale,
    MarketList,
    NFTinfo,
  },
  props: ["marketList", "mySaleList", "pageSize"],
  computed: mapState({
    baddr: "baddr",
    current: "current",
    curNFT(state) {
      if (state.current.pbtId) {
        const pbtId = String(state.current.pbtId);
        if (pbtId in state.myList) {
          return Object.assign({}, state.myList[pbtId]);
        }
        if (pbtId in state.mySaleList) {
          return Object.assign({}, state.mySaleList[pbtId]);
        }
        if (pbtId in state.marketList) {
          return Object.assign({}, state.marketList[pbtId]);
        }
      }
      return false;
    },
  }),
  methods: {
    clearCurrentId: function () {
      this.$store.commit("setCurrentPbtId", false);
    },
  },
};
</script>
<style>
.main {
  height: calc(100vh - 140px);
  padding: 40px 40px;
}
.content {
  display: flex;
}
.nftlist {
  margin: 15px;
}
.emptyImg {
  float: left;
}
</style>
