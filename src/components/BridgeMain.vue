<template>
  <el-row id="bridge-main" type="flex" justify="center">
    <el-col class="fees" :span="12" v-if="baddr">
      <el-col :span="14" v-if="PBTlists != null"
        ><BridgeFee />
        <el-col id="balance"
          >余额：{{ WBalance }}{{ mcoin }}
          <el-button size="mini" type="primary" @click="addToken"
            >添加代币</el-button
          ></el-col
        >
        <el-tabs type="border-card">
          <el-tab-pane label="存款"><Deposite /></el-tab-pane>
          <el-tab-pane label="取款"><Withdraw /></el-tab-pane>
          <el-tab-pane label="兑换"><Redeem /></el-tab-pane> </el-tabs
      ></el-col>
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
    mcoin: "mcoin",
    baddr: "baddr",
    PBTlists: "PBTlists",
  }),
  methods: {
    addToken: async function () {
      const coin = this.mcoin;
      const res = await market.watchToken(coin);
      console.log("add token", res);
    },
  },
};
</script>
