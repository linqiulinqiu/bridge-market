<template>
  <div>
    <plotheader />
    <div class="main">
      <el-col>
        <h2>
          PBT Market
          <el-button @click="mintNFT" size="small" class="btn"
            >Mint PBT</el-button
          >
        </h2>
        <el-col class="cointy">
          <MarketXccList />
        </el-col>
        <el-col class="cointy"></el-col>
        <el-col class="cointy"></el-col>
        <el-col class="cointy">
          <MySale />
        </el-col>
      </el-col>
    </div>
    <mynft />

    <plotfooter />
  </div>
</template>

<script>
import Plotheader from "../components/content/Plotheader.vue";
import Mynft from "../components/content/nftpanel/Mynft.vue";
import Plotfooter from "../components/content/Plotfooter.vue";
import { mapState } from "vuex";
import market from "../market";
import MySale from "../components/MySale.vue";
import MarketXccList from "../components/MarketXccList.vue";

export default {
  name: "Market",
  components: {
    Plotheader,
    Mynft,
    Plotfooter,
    MySale,
    MarketXccList,
  },
  computed: mapState({
    coin: "coin",
    baddr: "baddr",
    curNFT: "curNFT",
    PBTSellingLists: "PBTSellingLists",
  }),

  methods: {
    mintNFT: async function () {
      try {
        await market.mintPBT();
      } catch (e) {
        this.$message(e.data.message);
        console.log("mint err", e.message);
      }
    },
  },
};
</script>

<style scoped>
::-webkit-scrollbar {
  /*隐藏滚轮*/
  display: none;
}
.main {
  background-color: rgb(137, 180, 146);
  width: 84.7 vw;
  height: calc(100vh - 163px);
  margin-left: 15vw;
  padding: 40px 40px;
  overflow-x: hidden;
  overflow-y: scroll;
}
.content {
  display: flex;
}
.nftlist {
  margin: 15px;
}
</style>