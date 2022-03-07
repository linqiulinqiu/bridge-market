<template>
  <div>
    <div class="content">
      <el-aside width="350px">
        <keep-alive> <mynft /></keep-alive>
      </el-aside>
      <el-main style="color: #fff">
        <MarketMain />
      </el-main>
    </div>
  </div>
</template>

<script>
import Mynft from "../components/content/nftpanel/Mynft.vue";
import { mapState } from "vuex";
import market from "../market";
import MarketMain from "../components/MarketMain.vue";
export default {
  name: "Market",
  components: {
    Mynft,
    MarketMain,
  },
  computed: mapState({
    coin: "coin",
    baddr: "baddr",
    curNFT: "curNFT",
    PBTSellingLists: "PBTSellingLists",
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
  height: calc(100vh - 140px);
  width: calc(100vw - 250px);
  padding: 0;
}
</style>