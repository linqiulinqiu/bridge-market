<template>
  <div class="container" id="Mynft">
    <el-col class="area" v-if="baddr">
      <h2>
        MY PBT NFT
        <el-button
          circle
          icon="el-icon-refresh"
          size="small"
          class="btn"
        ></el-button>
      </h2>
      <el-col class="nftarea" v-if="Object.keys(PBTlists).length > 0">
        <el-col class="nftlist">
          <ul>
            <li v-for="(nft, name) in this.mylist" :key="name">
              <el-button
                class="nftlist"
                :class="{ addclass: name == isAdd }"
                @click="openNFT(nft, name)"
              >
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
      </el-col>
      <el-col v-else>
        <h2>请去往市场购买NFT</h2>
      </el-col>
    </el-col>
    <el-col v-else>{{ $t("look-info") }}</el-col>
    <el-dialog title="curNFT info" :visible.sync="nftinfo_dialog" width="50%">
      <el-card>
        <NFTinfo />
      </el-card>
    </el-dialog>
  </div>
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
      isAdd: "",
      coinMap: {
        XCC: "3",
        XCH: "1",
        HDD: "2",
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
      if (this.mode == "bridge") {
        const cointy = Object.keys(nft.pbxs);
        let bridge_coin = "";
        if (cointy.length == 1) {
          if (cointy[0] == "3") {
            bridge_coin = "XCC";
          } else if (cointy[0] == "2") {
            bridge_coin = "HDD";
          } else if (cointy[0] == "3") {
            bridge_coin = "XCH";
          } else {
            return false;
          }
        }
        this.$store.commit("setBcoin", bridge_coin);

        if (!("depositeAddr" in nft.pbxs[cointy[0]])) {
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
      if (this.mode == "market") {
        this.nftinfo_dialog = true;
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
.addclass {
  background: rgb(173, 195, 235);
  width: 150px;
  height: 150px;
  transform: all 0.3 linear 0.2;
}
</style>