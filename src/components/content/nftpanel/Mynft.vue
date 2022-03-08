<template>
  <el-col id="mynft">
    <el-col class="title">My NFTs</el-col>
    <el-col v-if="baddr">
      <el-col v-if="Object.keys(PBTlists).length > 0" class="nftarea">
        <el-col class="nftlist">
          <ul>
            <li
              v-for="(nft, name) in Object.fromEntries(
                Object.entries(this.$store.state.PBTlists).slice(
                  pageNum * 3 - 3,
                  pageNum * 3
                )
              )"
              :key="name"
              class="nftli"
            >
              <el-button
                :class="{ addclass: name == isAdd }"
                @click="openNFT(nft, name)"
              >
                <el-col>
                  <i>#{{ nft.id }}</i>
                  <img v-if="nft.meta" :src="nft.meta.image" alt="img" />
                </el-col>
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
      </el-col>
      <el-col v-else class="content">
        You haven't got any NFTs. Please go to the market.
      </el-col>
      <el-col>
        <el-button class="bottom">Go to Market </el-button>
      </el-col>
    </el-col>

    <el-col v-else>{{ $t("look-info") }}</el-col>
    <el-dialog title="curNFT info" :visible.sync="nftinfo_dialog" width="50%">
      <el-card>
        <NFTinfo />
      </el-card>
    </el-dialog>
  </el-col>
</template>

<script>
import { mapState } from "vuex";
import getAllData from "../../../getAllData";
import NFTinfo from "./NFTinfo.vue";

export default {
  name: "Mynft",
  components: {
    NFTinfo,
  },
  computed: mapState({
    bcoin: "bcoin",
    mcoin: "mcoin",
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
      return this.PBTMySaleLists;
    },
    deep: true,
    curNFT: function (newNFT) {
      console.log("this.curNFT", newNFT);
      this.$store.commit("setCurNFT", newNFT);
      return this.curNFT;
    },
  },
  data() {
    return {
      mylist: {},
      pageNum: 1,
      nftinfo_dialog: false,
      isAdd: 0,
      coinMap: {
        3: "XCC",
        2: "HDD",
        1: "XCH",
      },
    };
  },
  methods: {
    openNFT: async function (nft, name) {
      const loading = this.$loading({
        lock: true,
        spinner: "el-icon-loading",
        background: "rgba(200,230,200,0.6)",
      });
      const mo = location.hash.substr(2);
      console.log("mode", mo);

      if (this.mode == "bridge" || mo == "bridge") {
        if (!("pbxs" in nft)) {
          console.log("open", nft);
          const nftinfo = await getAllData.nftAllinfo(nft);
          console.log("open nft", nftinfo);
          this.$store.commit("setCurNFT", nftinfo);
        } else {
          console.log("open nft", nft);
          this.$store.commit("setCurNFT", nft);
        }
        this.isAdd = name;
      }
      if (this.mode == "market" || mo == "market") {
        this.nftinfo_dialog = true;
        this.$store.commit("setCurNFT", nft);
      }
      loading.close();
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
.container {
  color: #ffffff;
  background: #adefab25;
}
.title {
  height: 50px;
  font-size: 36px;
  line-height: 50px;
  text-align: center;
}
.content {
  height: calc(100vh - 235px);
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