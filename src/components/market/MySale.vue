<template>
  <el-col>
    <h3>My Selling PBT</h3>
    <ul class="content">
      <li v-for="nft in this.mslist" :key="nft.uri" class="marketlist">
        <el-button @click="openNFT(nft)" class="nftbtn">
          <i>#{{ nft.id }}</i>
          <img v-if="nft.meta" v-lazy="nft.meta.image" alt="img" />
        </el-button>
      </li>
    </ul>
    <el-col :offset="10">
      <el-pagination
        :total="Object.keys(this.mySaleList).length"
        background
        @current-change="handleCurPageChange()"
        :current-page="this.mypageNum"
        :page-size="10"
        layout="total,prev,pager,next"
      ></el-pagination>
    </el-col>
    <NFTinfo
      ref="mainNftInfo"
      :curNFT="this.curNFT"
      :visible="this.nftinfo_show"
    />
  </el-col>
</template>
<script>
import { mapState } from "vuex";
import NFTinfo from "../content/nftpanel/NFTinfo.vue";
export default {
  name: "MySale",
  components: {
    NFTinfo,
  },
  props: ["mySaleList", "pageSize"],
  computed: mapState({
    curNFT(state) {
      if (state.current.pbtId) {
        const pbtId = state.current.pbtId;
        if (pbtId in this.mySaleList) {
          return this.mySaleList[pbtId];
        }
        return false;
      }
    },
    mslist() {
      const start = this.mypageNum * this.pageSize - this.pageSize;
      const down = this.mypageNum * this.pageSize;
      if (start > 0) {
        const mylist = Object.fromEntries(
          Object.entries(this.mySaleList).slice(start, down)
        );
        return mylist;
      }
      return this.mySaleList;
    },
  }),
  watch: {
    mySaleList: function (newLists) {
      this.$store.commit("setMySalelist", newLists);
      this.mslist;
    },
    deep: true,
    curNFT: function () {
      this.curNFT;
    },
    deep: true,
  },
  data() {
    return {
      mypageNum: 1,
      nftinfo_show: false,
    };
  },
  methods: {
    handleCurPageChange(page) {
      console.log("当前页:", page);
      this.mypageNum = page;
    },
    openNFT: function (nft) {
      this.$store.commit("setCurrentPbtId", nft.id);
      console.log("curNFT", nft);
      this.nftinfo_show = true;
      this.$refs.mainNftInfo.show();
    },
  },
};
</script>
<style scoped>
.marketlist {
  /* margin: 10px; */
  float: left;
  position: relative;
}

.marketlist .el-button {
  height: 108px;
  width: 136px;
  box-sizing: border-box;
  margin: 10px;
}

.marketlist img {
  width: 80px;
  margin: 0;
}
</style>