<template>
  <el-row>
    <el-col class="main" v-if="baddr">
      <el-col>
        <h2>
          PBT Market
          <el-button @click="getMintfee" size="small" class="btn" v-if="baddr"
            >铸造 PBT</el-button
          >
        </h2>
        <el-col class="cointy">
          <keep-alive>
            <MarketXccList />
          </keep-alive>
        </el-col>
        <el-col class="cointy">
          <keep-alive>
            <MarketHddList />
          </keep-alive>
        </el-col>
        <el-col class="cointy">
          <keep-alive>
            <MarketXchList />
          </keep-alive>
        </el-col>
        <el-col class="cointy">
          <keep-alive><MySale /></keep-alive>
        </el-col>
      </el-col>
    </el-col>
    <el-col v-else>连接钱包后查看</el-col>
    <el-dialog :visible.sync="mintVisible" title="MINT NFT" width="50%">
      <el-card>
        <el-empty :image-size="200"></el-empty>
        <el-col>
          <p>
            价格:
            <span>{{ this.mintFee.price }}</span>
            <span>{{ this.mintFee.token }}</span>
          </p>
          <p>支持币种: Chives（韭菜）</p>
          <el-button @click="mintNFT">铸造</el-button>
        </el-col>
      </el-card>
    </el-dialog>
  </el-row>
</template>
<script>
import MarketXccList from "./market/MarketXccList.vue";
import MarketHddList from "./market/MarketHddList.vue";
import MarketXchList from "./market/MarketXchList.vue";
import NFTinfo from "./content/nftpanel/NFTinfo.vue";
import MySale from "./market/MySale.vue";
import { mapState } from "vuex";
export default {
  name: "MarketMain",
  components: {
    MySale,
    MarketXccList,
    MarketHddList,
    MarketXchList,
    NFTinfo,
  },
  computed: mapState({
    coin: "coin",
    baddr: "baddr",
    curNFT: "curNFT",
    PBTSellingLists: "PBTSellingLists",
  }),
  data() {
    return {
      mintVisible: false,
      mintFee: {
        price: 0,
        token: "BNB",
      },
    };
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
    getMintfee: async function () {
      const fee = await market.getmintfee();
      this.mintFee.price = fee.price;
      this.mintFee.token = fee.ptName;
      this.mintVisible = true;
    },
  },
};
</script>
<style>
.main {
  height: calc(100vh - 140px);
  padding: 40px 40px;
}
.content {
  display: flex;
}
.nftlist {
  margin: 15px;
}
</style>