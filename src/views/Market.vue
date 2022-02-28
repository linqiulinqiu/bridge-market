<template>
  <div>
    <div class="content">
      <el-aside width="350px">
        <keep-alive> <mynft /></keep-alive>
      </el-aside>
      <el-main>
        <el-col class="main" v-if="baddr">
          <el-col>
            <h2>
              PBT Market
              <el-button
                @click="getMintfee"
                size="small"
                class="btn"
                v-if="baddr"
                >铸造 PBT</el-button
              >
            </h2>

            <el-col class="cointy">
              <keep-alive>
                <MarketXccList />
              </keep-alive>
            </el-col>
            <!-- <el-col style="height: 600px">
          <h2>nftinfo test</h2>
          <el-col v-if="curNFT"><NFTinfo /></el-col>
        </el-col> -->
            <el-col class="cointy"><h3>HDDcoin</h3></el-col>
            <el-col class="cointy"><h3>chia</h3></el-col>
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
      </el-main>
    </div>
  </div>
</template>

<script>
import Mynft from "../components/content/nftpanel/Mynft.vue";
import { mapState } from "vuex";
import market from "../market";
import MySale from "../components/market/MySale.vue";
import MarketXccList from "../components/market/MarketXccList.vue";
import NFTinfo from "../components/content/nftpanel/NFTinfo.vue";
export default {
  name: "Market",
  components: {
    Mynft,
    MySale,
    MarketXccList,
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

<style scoped>
::-webkit-scrollbar {
  display: none;
}
.content {
  display: flex;
}
.el-main {
  /* background-color: red; */
  height: calc(100vh - 140px);
  width: calc(100vw - 250px);
  padding: 0;
}
.main {
  /* background-color: rgb(137, 180, 146); */
  height: calc(100vh - 140px);
  padding: 40px 40px;
  /* overflow-x: hidden;
  overflow-y: scroll; */
}
.content {
  display: flex;
}
.nftlist {
  margin: 15px;
}
</style>