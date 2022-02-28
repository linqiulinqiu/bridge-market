<template>
  <el-row id="bridge-main" type="flex" justify="center">
    <el-col class="fees" :span="12" v-if="baddr">
      <el-col :span="14" v-if="PBTlists != null" class="mainpanel">
        <BridgeFee />
        <el-col id="balance">
          余额：{{ this.balance }}
          <span v-if="WBalance"></span>
          <span class="minifont"> w{{ bcoin }}</span>
          <el-button size="mini" type="primary" @click="addToken">
            添加代币
          </el-button>
        </el-col>
        <el-tabs>
          <el-tab-pane label="存款"><Deposite /></el-tab-pane>
          <el-tab-pane label="取款"><Withdraw /></el-tab-pane>
          <el-tab-pane label="兑换"><Redeem /></el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col v-else>
        <h1>Bridge Guide</h1>
        <el-col>
          <h4>1.</h4>
          <h4>2.</h4>
          <h4>3.</h4>
        </el-col>
      </el-col>
    </el-col>
    <el-col v-else> 请连接钱包 </el-col>
  </el-row>
</template>
<script>
import Deposite from "./bridge/Deposite.vue";
import Withdraw from "./bridge/Withdraw.vue";
import Redeem from "./bridge/Redeem.vue";
import BridgeFee from "./bridge/BridgeFee.vue";
import { mapState } from "vuex";
import market from "../market";

export default {
  components: {
    Deposite,
    Withdraw,
    Redeem,
    BridgeFee,
  },
  computed: mapState({
    WBalance: "WBalance",
    bcoin: "bcoin",
    baddr: "baddr",
    PBTlists: "PBTlists",
  }),
  watch: {
    bcoin: function (newcoin) {
      console.log("coin", newcoin, this.bcoin);
      const re = this.coinBalance(newcoin);
      this.$store.commit("setBcoin", newcoin);
      console.log("bcoin   ", re, newcoin);
      return this.bcoin;
    },
    WBalance: function (newb) {
      console.log("newb", newb);
      const re = this.coinBalance(this.bcoin);
      console.log("newbvvv", newb, re);
      return this.WBalance;
    },
    deep: true,
  },
  data() {
    return {
      balance: "",
    };
  },
  methods: {
    addToken: async function () {
      const coin = this.bcoin;
      const res = await market.watchToken(coin);
      console.log("add token", res);
    },
    coinBalance: function (coin) {
      const lcoin = coin.toString().toLowerCase();
      if (lcoin in this.WBalance && this.WBalance[lcoin]) {
        this.balance = this.WBalance[lcoin];
        return this.WBalance[lcoin];
      } else {
        // WBalance[coin] not exist or WBalance[coin] == false
        this.balance = "---";
        return "---";
      }
    },
  },
};
</script>
