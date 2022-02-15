<template>
  <div>
    <plotheader />
    <div class="main">
      <el-col>
        <h2>
          PBT Market
          <el-button @click="mintNFT" size="small" class="btn"
            >Mint PBT</el-button
          >
        </h2>
        <el-col class="cointy">
          <h3>Chives</h3>
          <ul class="content">
            <li v-for="(nft, name) in this.xcclist" :key="name">
              <el-button class="nftlist">
                <i>#{{ nft.id }}</i>
                <img v-if="nft.meta" :src="nft.meta.image" alt="img" />
                <!-- <i v-if="nft.market.seller">
                   <el-badge
                    v-if="nft.market.seller == '-self'"
                    value="My Sale"
                    class="item simbol"
                  >
                  </el-badge 
                  ></i
                > -->
              </el-button>
            </li>
          </ul>
          <el-col :offset="10">
            <el-pagination
              :total="Object.keys(PBTSellingLists).length"
              background
              @current-change="handleCurrentChange_xcc"
              :current-page="this.xccpageNum"
              :page-size="10"
              layout="total,prev,pager,next"
            ></el-pagination>
          </el-col>
        </el-col>
        <el-col class="cointy"></el-col>
        <el-col class="cointy"></el-col>
      </el-col>
    </div>
    <mynft />

    <plotfooter />
  </div>
</template>

<script>
import Plotheader from "../components/content/Plotheader.vue";
import Mynft from "../components/content/nftpanel/Mynft.vue";
import Plotfooter from "../components/content/Plotfooter.vue";
import { mapState } from "vuex";
import market from "../market";

export default {
  name: "Market",
  components: {
    Plotheader,
    Mynft,
    Plotfooter,
  },
  computed: mapState({
    coin: "coin",
    baddr: "baddr",
    curNFT: "curNFT",
    PBTlists: "PBTlists",
    PBXlists: "PBXlists",
    PBXSellingLists: "PBXSellingLists",
    PBTSellingLists: "PBTSellingLists",
    PBTMySaleLists: "PBTMySaleLists",
    WBalance: "WBalance",
  }),
  watch: {
    PBTSellingLists: function (newLists) {
      this.$store.commit("setPBTSellingLists", newLists);
      const start = newPage * 10 - 10;
      const down = newPage * 10;
      this.mylist = Object.fromEntries(
        Object.entries(newLists).slice(start, down)
      );
      console.log("selllist", this.$store.state.PBTSellingLists, newLists);
    },
    deep: true,
  },
  data() {
    return {
      xccpageNum: 1,
      xcclist: {},
    };
  },
  methods: {
    handleCurrentChange_xcc(newPage) {
      console.log("当前页:", newPage);
      this.xccpageNum = newPage;
      console.log("all pbtlist", this.xcclist);
      const start = newPage * 10 - 10;
      const down = newPage * 10;
      this.mylist = Object.fromEntries(
        Object.entries(this.$store.state.PBTSellingLists).slice(start, down)
      );
    },
    mintNFT: async function () {
      try {
        await market.mintPBT();
      } catch (e) {
        this.$message(e.data.message);
        console.log("mint err", e.message);
      }
    },
  },
};
</script>

<style scoped>
::-webkit-scrollbar {
  /*隐藏滚轮*/
  display: none;
}
.main {
  background-color: rgb(137, 180, 146);
  width: 84.7 vw;
  height: calc(100vh - 163px);
  margin-left: 15vw;
  padding: 40px 40px;
  overflow-x: hidden;
  overflow-y: scroll;
}
.content {
  display: flex;
}
.nftlist {
  margin: 15px;
}
</style>