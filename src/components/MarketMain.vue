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
            >{{ $t("mintPBT") }}</el-button
          >
        </h2>
        <el-col class="cointy">
          <MarketList :marketList="this.marketList" :pageSize="this.pageSize" />
        </el-col>
        <el-col class="cointy">
          <MySale :mySaleList="this.mySaleList" :pageSize="this.pageSize" />
        </el-col>
      </el-col>
    </el-col>
    <el-col v-else>{{ $t("connect") }}</el-col>
    <el-dialog :visible.sync="mintVisible">
      <el-card>
        <MintPBT :mintAbles="this.mintNumber" :mintFee="this.mintFee" />
      </el-card>
    </el-dialog>
  </el-row>
</template>
<script>
import MarketList from "./market/MarketList.vue";
import NFTinfo from "./content/nftpanel/NFTinfo.vue";
import MySale from "./market/MySale.vue";
import MintPBT from "./market/MintPBT.vue";
import { mapState } from "vuex";
import market from "../market";
export default {
  name: "MarketMain",
  components: {
    MySale,
    MarketList,
    NFTinfo,
    MintPBT,
  },
  props: ["marketList", "mySaleList", "pageSize"],
  computed: mapState({
    coin: "coin",
    baddr: "baddr",
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
    getMintfee: async function () {
      const fee = await market.getmintfee();
      this.mintFee.price = fee.price;
      this.mintFee.token = fee.ptName;
      const number = await market.getMintAbles();
      console.log("mint number", number);
      this.mintNumber = number;
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
.emptyImg {
  float: left;
}
</style>
