<template>
  <el-col>
    <h3>My Selling PBT</h3>
    <ul class="content">
      <li v-for="(nft, name) in this.mylist" :key="name">
        <el-button class="nftlist" @click="openNFT(nft)">
          <i>#{{ nft.id }}</i>
          <img v-if="nft.meta" :src="nft.meta.image" alt="img" />
        </el-button>
      </li>
    </ul>
    <el-col :offset="10">
      <el-pagination
        :total="Object.keys(PBTMySaleLists).length"
        background
        @current-change="myCurrentChange"
        :current-page="this.mypageNum"
        :page-size="10"
        layout="total,prev,pager,next"
      ></el-pagination>
    </el-col>
  </el-col>
</template>
<script>
import { mapState } from "vuex";
import market from "../market";
import allData from "../getAllData";
export default {
  name: "MySale",
  computed: mapState({
    PBTMySaleLists: "PBTMySaleLists",
    curNFT: "curNFT",
  }),
  watch: {
    PBTMySaleLists: function (newLists) {
      this.$store.commit("setPBTMySaleLists", newLists);
      const start = this.mypageNum * 10 - 10;
      const down = this.mypageNum * 10;
      this.mylist = Object.fromEntries(
        Object.entries(newLists).slice(start, down)
      );
      console.log("mysale list", newLists);
    },
    deep: true,
  },
  data() {
    return {
      mypageNum: 1,
      mylist: {},
    };
  },
  methods: {
    myCurrentChange(page) {
      console.log("当前页:", page);
      this.mypageNum = page;
      console.log("all pbtlist", this.mylist);
      const start = page * 10 - 10;
      const down = page * 10;
      this.mylist = Object.fromEntries(
        Object.entries(this.$store.state.PBTMySaleLists).slice(start, down)
      );
    },
    openNFT: function (nft) {
      this.$store.commit("setCurNFT", nft);
      console.log("curNFT", nft);
    },
  },
};
</script>