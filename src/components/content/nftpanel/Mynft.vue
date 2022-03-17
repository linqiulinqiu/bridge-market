<template>
  <el-col id="mynft">
    <el-col class="title">My NFTs</el-col>
    <el-col v-if="baddr">
      <el-col v-if="Object.keys(this.myList).length > 0" class="nftarea">
        <el-col class="nftlist">
          <keep-alive>
            <MylistPage
              v-bind:nftlist="nftlist"
              v-bind:open="openNFT"
              v-bind:current="current"
            />
          </keep-alive>
        </el-col>
        <el-col class="btn-bar">
          <el-pagination
            background
            layout="total,prev,pager,next"
            :total="Object.keys(this.myList).length"
            @current-change="handleCurrentChange"
            :current-page="this.pageNum"
            :page-size="this.pageSize"
          ></el-pagination>
        </el-col>
      </el-col>
      <el-col v-else class="content">
        You haven't got any NFTs. Please go to the market.
      </el-col>
      <el-col>
        <el-button class="bottom">Go to Market </el-button>
      </el-col>
    </el-col>
    <el-col v-else>{{ $t("look-info") }}</el-col>
    <NFTinfo
      ref="mainNftInfo"
      :curNFT="this.curNFT"
      :visible="this.nftinfo_show"
    />
  </el-col>
</template>

<script>
import { mapState } from "vuex";
import NFTinfo from "./NFTinfo.vue";

export default {
  name: "Mynft",
  components: {
    NFTinfo,
  },
  props: ["myList", "pageSize"],
  computed: mapState({
    baddr: "baddr",
    mode: "mode",
    bcoin: "bcoin",
    current: "current",
    curNFT(state) {
      if (state.current.pbtId) {
        const pbtId = String(state.current.pbtId);
        if (pbtId in this.myList) {
          return this.myList[pbtId];
        }
        if (pbtId in state.mySaleList) {
          return state.mySaleList[pbtId];
        }
      }
      return false;
    },
    nftlist() {
      let pageSize = this.pageSize;
      const start = this.pageNum * pageSize - pageSize;
      const down = this.pageNum * pageSize;
      this.listPage = Object.fromEntries(
        Object.entries(this.myList).slice(start, down)
      );
      return this.listPage;
    },
  }),
  watch: {
    myList: function (list) {
      this.$store.commit("setMylist", list);
      this.nftlist;
      this.curNFT;
      console.log("watch mynft", this.curNFT, this.listPage);
    },
  },
  data() {
    return {
      listPage: {},
      pageNum: 1,
      nftinfo_show: false,
      isAdd: 0,
      coinMap: {
        3: "XCC",
        2: "HDD",
        1: "XCH",
      },
    };
  },
  methods: {
    openNFT: async function (id) {
      this.$store.commit("setCurrentPbtId", id);
      this.$refs.mainNftInfo.show();
    },
    handleCurrentChange(newPage) {
      console.log("当前页:", newPage);
      this.pageNum = newPage;
    },
  },
  watch: {
    curNFT() {
      const loading = this.$loading({
        lock: true,
        spinner: "el-icon-loading",
        background: "rgba(200,230,200,0.6)",
      });

      if (this.curNFT) {
        const mo = location.hash.substr(2);
        if (this.mode == "bridge" || mo == "bridge") {
          this.isAdd = name;
        }
      }
      loading.close();
    },
    deep: true,
  },
};
</script>

<style scoped>
.container {
  color: #ffffff;
  background: #adefab25;
  height: calc(100vh - 235px);
}
.el-col,
#mynft {
  color: #ffffff;
  background-color: #25272e;
}
i {
  margin-right: 8px;
}
.title {
  height: 50px;
  font-size: 36px;
  line-height: 50px;
  text-align: center;
}
.nftlist {
  width: 300px;
  overflow: hidden;
}
.content {
  min-height: 550px;
  font-size: 24px;
  line-height: 36px;
  padding: 40px;
}
.bottom {
  background-color: #38f2af;
  width: 132px;
  font-size: 14px;
  color: #000000;
  float: right;
  margin: 0px 20px;
}
.addclass {
  background: rgb(173, 195, 235);
  width: 150px;
  height: 150px;
  transform: all 0.3 linear 0.2;
}
</style>
