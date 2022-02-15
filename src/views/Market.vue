<template>
  <div>
    <plotheader />
    <div class="main">
      <el-col >
        <h2>PBT Market</h2>
        <div >
          <ul class="content">
            <li v-for="(nft, name) in PBTSellingLists" :key="name">
              <el-button class="nftlist">
                <i>#{{ nft.id }}</i>
                <img v-if="nft.meta" :src="nft.meta.image" alt="img" />
                <el-badge
                  v-if="nft.pbxs"
                  :value="Object.keys(nft.pbxs).length"
                  class="item"
                >
                </el-badge>
              </el-button>
            </li>
          </ul>
        </div>
        
      <el-button @click="mintNFT" size="mini">Mint PBT</el-button>
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
    PBTlists: function (newLists) {
      this.$store.commit("setPBTlists", newLists);
    },
    deep: true,
    PBXlists: function (newLists) {
      this.$store.commit("setPBXlists", newLists);
    },
    deep: true,
  },
  data() {
    return {};
  },
  methods: {
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
.main{
  background-color: rgb(137, 180, 146);
  width: 84.7 vw;
  height: calc(100vh - 163px);
  margin-left: 15vw;
  padding: 40px 40px;
  overflow-x: hidden;
  overflow-y: scroll;
}
.content{
  display: flex;
}
.nftlist{
  margin: 15px;
}
</style>