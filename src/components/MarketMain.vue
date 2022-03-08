<template>
  <el-row>
    <el-col class="main" v-if="baddr">
      <el-col>
        <h2>
          PBT Market
          <el-button
            @click="getMintfee"
            size="small"
            class="btn"
            v-if="baddr"
            type="primary"
            >铸造 PBT</el-button
          >
        </h2>
        <el-col class="cointy">
          <keep-alive>
            <MarketList />
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
        <el-row type="flex" justify="center">
          <el-col :sapn="10">
            <el-empty :image-size="100"></el-empty>
          </el-col>
          <el-col :span="12">
            <p>
              价格:
              <span>{{ this.mintFee.price }}</span>
              <span>{{ this.mintFee.token }}</span>
            </p>
            <p>支持币种: Chives（韭菜）</p>
            <p>
              <span>目前可铸造的NFT：{{ mintNumber }}个</span>
            </p>
            <p>
              <el-button
                @click="mintNFT"
                type="primary"
                v-if="this.mintNumber > 0"
                >铸造</el-button
              >
              <span v-else>目前可铸造数为0,不可铸造NFT，请等待</span>
            </p>
          </el-col>
        </el-row>
      </el-card>
    </el-dialog>
  </el-row>
</template>
<script>
import MarketList from "./market/MarketList.vue";
import NFTinfo from "./content/nftpanel/NFTinfo.vue";
import MySale from "./market/MySale.vue";
import { mapState } from "vuex";
import market from "../market";
export default {
  name: "MarketMain",
  components: {
    MySale,
    MarketList,
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
      mintNumber: "--",
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
      const number = await market.getMintAbles();
      console.log("mint number", number);
      this.mintNumber = number;
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
.emptyImg {
  float: left;
}
</style>