<template>
  <div class="container">
    <el-col class="area">
      <h2>
        MY PBT NFT
        <el-button
          circle
          icon="el-icon-refresh"
          size="small"
          class="btn"
        ></el-button>
      </h2>
      <div class="nftarea">
        <el-col class="nftlist">
          <ul>
            <li v-for="(nft, name) in this.mylist" :key="name">
              <el-button class="nftlist" @click="openNFT(nft)">
                <el-col>
                  <i>#{{ nft.id }}</i>
                  <img v-if="nft.meta" :src="nft.meta.image" alt="img" />
                </el-col>
                <el-badge
                  v-if="nft.pbxs.coinTypes == '3'"
                  value="Chives"
                  class="item"
                >
                </el-badge>
              </el-button>
            </li>
          </ul>
        </el-col>
        <el-col class="btn-bar">
          <el-pagination
            background
            layout="total,prev,pager,next"
            :total="Object.keys(PBTlists).length"
            @current-change="handleCurrentChange"
            :current-page="this.pageNum"
            :page-size="3"
          ></el-pagination>
        </el-col>
      </div>
    </el-col>
    <el-dialog title="curNFT info" :visible.sync="nftinfo_dialog" width="50%">
      <el-card>
        <NFTinfo />
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import NFTinfo from "./NFTinfo.vue";

export default {
  name: "Mynft",
  components: {
    NFTinfo,
  },
  computed: mapState({
    coin: "coin",
    baddr: "baddr",
    curNFT: "curNFT",
    PBTlists: "PBTlists",
    PBTSellingLists: "PBTSellingLists",
    PBTMySaleLists: "PBTMySaleLists",
    WBalance: "WBalance",
    mode: "mode",
  }),
  watch: {
    PBTlists: function (newLists) {
      this.$store.commit("setPBTlists", newLists);
      (this.mylist = Object.fromEntries(
        Object.entries(this.$store.state.PBTlists).slice(0, 3)
      )),
        console.log("wantch PBTlists", newLists);
    },
    deep: true,
    PBTMySaleLists: function (newLists) {
      this.$store.commit("setPBTMySaleLists", newLists);
    },
    deep: true,
  },
  data() {
    return {
      mylist: {},
      pageNum: 1,
      nftinfo_dialog: false,
    };
  },
  methods: {
    openNFT: async function (nft) {
      console.log("curNFT", nft);
      this.$store.commit("setCurNFT", nft);
      if (this.mode == "market") {
        this.nftinfo_dialog = true;
      }
    },
    handleCurrentChange(newPage) {
      console.log("当前页:", newPage);
      this.pageNum = newPage;
      console.log("all pbtlist", this.mylist);
      const start = newPage * 3 - 3;
      const down = newPage * 3;
      this.mylist = Object.fromEntries(
        Object.entries(this.$store.state.PBTlists).slice(start, down)
      );
    },
  },
};
</script>

<style scoped>
.area {
  width: 250px;
  height: calc(100vh - 140px);
  min-height: 674px;
}
h2 {
  padding: 20px 0 0 0;
  text-align: center;
}
.nftarea {
  height: 700px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* background-color: red; */
}
::-webkit-scrollbar {
  /*隐藏滚轮*/
  display: none;
}
.nftlist {
  margin: 15px 35px;
}
</style>