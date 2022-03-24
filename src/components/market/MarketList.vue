<template>
  <el-col>
    <h3>
      On Sale <span class="minifont">(价格为0的NFT将不会出现在市场列表中)</span>
    </h3>
    <ul class="content">
      <li class="marketlist" v-for="nft in this.mklist" :key="nft.id">
        <SellingItem :info="nft" @click.native="openNFT(nft)" />
      </li>
    </ul>
    <el-col :offset="10">
      <el-pagination
        background
        :total="Object.keys(this.marketList).length"
        @current-change="handleXccPaegChange"
        :current-page="this.xccpageNum"
        :page-size="4"
        layout="total,prev,pager,next"
      ></el-pagination>
    </el-col>
  </el-col>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "MarketList",
  props: ["marketList", "pageSize"],
  computed: mapState({
    baddr: "baddr",
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
  data() {
    return {
      xccpageNum: 1,
      nftinfo_show: false,
    };
  },
  methods: {
    handleXccPaegChange: function (page_xcc) {
      this.xccpageNum = page_xcc;
    },
    openNFT: async function (nft) {
      this.$store.commit("setCurrentPbtId", nft.id);
    },
  },
};
</script>
<style scoped>
.content {
  min-height: 500px;
}
</style>