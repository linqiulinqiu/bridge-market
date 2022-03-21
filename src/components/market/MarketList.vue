<template>
  <el-col>
    <h3>
      On Sale <span class="minifont">(价格为0的NFT将不会出现在市场列表中)</span>
    </h3>
    <ul class="content">
      <li class="marketlist" v-for="nft in this.mklist" :key="nft.id">
        <keep-alive>
          <SellingItem
            v-bind:info="nft"
            @click.native="openNFT(nft)"
            v-if="nft.market && nft.market.price != '0.0'"
          />
        </keep-alive>
      </li>
    </ul>
    <el-col :offset="10">
      <el-pagination
        :total="Object.keys(this.marketList).length"
        background
        @current-change="handleXccPaegChange"
        :current-page="this.xccpageNum"
        :page-size="4"
        layout="total,prev,pager,next"
      ></el-pagination>
    </el-col>
    <NFTinfo
      :approve="this.approve"
      :curNFT="curNFT"
      ref="mainNftInfo"
      :visible="this.nftinfo_show"
    />
  </el-col>
</template>
<script>
import { mapState } from "vuex";
import market from "../../market";
import NFTinfo from "../content/nftpanel/NFTinfo.vue";
export default {
  name: "MarketList",
  components: {
    NFTinfo,
  },
  props: ["marketList", "pageSize"],
  computed: mapState({
    coin: "coin",
    baddr: "baddr",
    // approve(state){

    // },
    curNFT(state) {
      if (state.current.pbtId) {
        const pbtId = String(state.current.pbtId);
        if (pbtId in this.marketList) {
          console.log("this.curNFT", this.marketList[pbtId]);
          return this.marketList[pbtId];
        }
        return false;
      }
    },
    mklist() {
      const start = this.xccpageNum * this.pageSize - this.pageSize;
      const down = this.xccpageNum * this.pageSize;
      const list = Object.fromEntries(
        Object.entries(this.marketList).slice(start, down)
      );
      console.log("mklist", list, this.marketList);
      return list;
    },
  }),
  watch: {
    marketList: function (newLists) {
      this.$store.commit("setMarketlist", newLists);
      this.mklist;
    },
    deep: true,
    curNFT: function () {
      this.curNFT;
    },
    deep: true,
  },
  data() {
    return {
      approve: true,
      xccpageNum: 1,
      nftinfo_show: false,
    };
  },
  methods: {
    handleXccPaegChange: function (page_xcc) {
      this.xccpageNum = page_xcc;
    },
    openNFT: async function (nft) {
      if (nft.market.seller == "") {
        if (nft.market.ptName == "BUSD") {
          this.approve = await market.checkAllowance(nft);
          console.log("checkAllowance", this.approve);
        }
      }
      this.$store.commit("setCurrentPbtId", nft.id);
      this.nftinfo_show = true;
      this.$refs.mainNftInfo.show();
    },
  },
};
</script>
<style scoped>
.content {
  min-height: 500px;
  /* display: flex; */
}
.marketlist {
  /* float: left; */
  /* position: relative; */
  /* height: 500px; */
}
</style>