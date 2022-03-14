<template>
  <el-col>
    <h3>
      On Sale <span class="minifont">(价格为0的NFT将不会出现在市场列表中)</span>
    </h3>
    <ul class="content">
      <li class="marketlist" v-for="(nft, name) in this.saleList" :key="name">
        <keep-alive>
          <SellingItem
            v-if="nft.market && !(nft.market.price == '0.0')"
            v-bind:info="nft"
            @click.native="openNFT(nft, name)"
          />
        </keep-alive>
      </li>
    </ul>
    <el-col :offset="10">
      <el-pagination
        :total="Object.keys(PBTSellingLists).length"
        background
        @current-change="handleXccPaegChange"
        :current-page="this.xccpageNum"
        :page-size="4"
        layout="total,prev,pager,next"
      ></el-pagination>
    </el-col>
    <el-dialog title="curNFT info" :visible.sync="nftinfo_dialog" width="50%">
      <el-card>
        <NFTinfo />
      </el-card>
    </el-dialog>
  </el-col>
</template>
<script>
import { mapState } from "vuex";
import getAllData from "../../getAllData";
import market from "../../market";
import NFTinfo from "../content/nftpanel/NFTinfo.vue";
export default {
  name: "MarketXccList",
  components: {
    NFTinfo,
  },
  computed: mapState({
    coin: "coin",
    baddr: "baddr",
    curNFT: "curNFT",
    PBTSellingLists: "PBTSellingLists",
    saleList() {
      const start = this.xccpageNum * 4 - 4;
      const down = this.xccpageNum * 4;
      const xcclist = Object.fromEntries(
        Object.entries(this.PBTSellingLists).slice(start, down)
      );
      return xcclist;
    },
  }),
  watch: {
    PBTSellingLists: function (newLists) {
      this.$store.commit("setPBTSellingLists", newLists);

      console.log("selllist", this.$store.state.PBTSellingLists, newLists);
    },
    deep: true,
  },
  data() {
    return {
      xccpageNum: 1,
      xcclist: {},
      nftinfo_dialog: false,
    };
  },
  methods: {
    handleXccPaegChange: function (page_xcc) {
      console.log("当前页:", page_xcc);
      this.xccpageNum = page_xcc;
      // this.saleList();
      // console.log("all pbtlist", this.saleList());

      // const start = this.xccpageNum * 10 - 10;
      // const down = this.xccpageNum * 10;
      // this.mylist = Object.fromEntries(
      //   Object.entries(this.$store.state.PBTSellingLists).slice(start, down)
      // );
    },
    openNFT: async function (nft) {
      const loading = this.$loading({
        lock: true,
        spinner: "el-icon-loading",
        background: "rgba(200,230,200,0.6)",
      });
      if (!("market" in nft)) {
        const info = await getAllData.getMarketNFT("PBT", nft.id);
        nft.market = info;
      }
      this.$store.commit("setCurNFT", nft);
      console.log("curNFT", nft);
      this.nftinfo_dialog = true;
      loading.close();
    },
  },
};
</script>
<style scoped>
.content {
  height: 500px;
}
.marketlist {
  float: left;
  position: relative;
  height: 500px;
}
</style>