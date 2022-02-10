<template>
  <div>
    <plotheader />
    <el-col>
      <p>PBT Market</p>
      <ul>
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
      <el-button @click="mintNFT" size="mini">Mint PBT</el-button>
    </el-col>
    <mynft />
    <pbx />
    <plotfooter />
  </div>
</template>

<script>
import Plotheader from "../components/content/Plotheader.vue";
import Mynft from "../components/content/nftpanel/Mynft.vue";
import Pbx from "../components/content/nftpanel/Pbx.vue";
import Plotfooter from "../components/content/Plotfooter.vue";
import { mapState } from "vuex";
import market from "../market";

export default {
  name: "Market",
  components: {
    Plotheader,
    Mynft,
    Pbx,
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

<style>
</style>