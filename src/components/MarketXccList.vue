<template>
  <el-col>
    <h3>Chives</h3>
    <ul class="content" v-for="(nft, name) in this.xcclist" :key="name">
      <li
        class="listLi"
        v-if="nft.market && nft.market.price && nft.market.price != '0.0'"
      >
        <el-button class="nftlist" @click="openNFT(nft)">
          <i>#{{ nft.id }}</i>
          <img v-if="nft.meta" :src="nft.meta.image" alt="img" />
          <i v-if="nft.market">
            <i v-if="'seller' in Object.keys(nft.market)">
              <el-badge
                v-if="nft.market.seller == '-self'"
                value="My Sale"
                class="item simbol"
              >
              </el-badge></i
          ></i>
        </el-button>
      </li>
    </ul>
    <el-col :offset="10">
      <el-pagination
        :total="Object.keys(PBTSellingLists).length"
        background
        @current-change="handleXccPaegChange"
        :current-page="this.xccpageNum"
        :page-size="10"
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
import market from "../market";
import NFTinfo from "../components/content/nftpanel/NFTinfo.vue";
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
  }),
  watch: {
    PBTSellingLists: function (newLists) {
      this.$store.commit("setPBTSellingLists", newLists);
      const start = this.xccpageNum * 10 - 10;
      const down = this.xccpageNum * 10;
      this.xcclist = Object.fromEntries(
        Object.entries(this.$store.state.PBTSellingLists).slice(start, down)
      );
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
      console.log("all pbtlist", this.xcclist);
      const start = this.xccpageNum * 10 - 10;
      const down = this.xccpageNum * 10;
      this.mylist = Object.fromEntries(
        Object.entries(this.$store.state.PBTSellingLists).slice(start, down)
      );
    },
    openNFT: function (nft) {
      this.$store.commit("setCurNFT", nft);
      console.log("curNFT", nft);
      this.nftinfo_dialog = true;
    },
  },
};
</script>