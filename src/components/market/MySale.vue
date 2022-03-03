<template>
  <el-col>
    <h3>My Selling PBT</h3>
    <ul class="content">
      <li v-for="nft in PBTMySaleLists" :key="nft.uri" class="marketlist">
        <el-button @click="openNFT(nft)">
          <i>#{{ nft.id }}</i>
          <img v-if="nft.meta" :src="nft.meta.image" alt="img" />
        </el-button>
      </li>
    </ul>
    <!-- <el-col :offset="10">
      <el-pagination
        :total="Object.keys(PBTMySaleLists).length"
        background
        @current-change="handleCurPageChange()"
        :current-page="this.mypageNum"
        :page-size="10"
        layout="total,prev,pager,next"
      ></el-pagination>
    </el-col> -->
    <el-dialog title="curNFT info" :visible.sync="nftinfo_dialog" width="50%">
      <el-card>
        <NFTinfo />
      </el-card>
    </el-dialog>
  </el-col>
</template>
<script>
import { mapState } from "vuex";
import market from "../../market";
import allData from "../../getAllData";
import NFTinfo from "../content/nftpanel/NFTinfo.vue";
export default {
  name: "MySale",
  components: {
    NFTinfo,
  },
  computed: mapState({
    PBTMySaleLists: "PBTMySaleLists",
    curNFT: "curNFT",
  }),
  watch: {
    PBTMySaleLists: function (newLists) {
      this.$store.commit("setPBTMySaleLists", newLists);
      //   const start = this.mypageNum * 10 - 10;
      //   const down = this.mypageNum * 10;
      //   this.mylist = Object.fromEntries(
      //     Object.entries(newLists).slice(start, down)
      //   );
        console.log("mysale list", newLists);
    },
    deep: true,
  },
  data() {
    return {
      mypageNum: 1,
      mylist: {},
      nftinfo_dialog: false,
    };
  },
  methods: {
    handleCurPageChange(page) {
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
      this.nftinfo_dialog = true;
    },
  },
};
</script>