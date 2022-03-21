<template>
  <el-col id="redeem" class="tabs">
    <h3>{{ $t("redeem") }}</h3>
    <el-col>
      <p>{{ $t("balance") }}:{{ balance[bcoin] }}</p>
      <el-col>
        <el-input type="text" v-model.trim="redeemNum"></el-input>
        <el-col v-if="needApprove">
          <el-button @click="approve">Approve</el-button>
        </el-col>
        <el-col v-else>
          <el-button @click="redeemNum = this.balance">{{
            $t("all")
          }}</el-button>
          <el-button @click="redeem">{{ $t("redeem") }}</el-button>
        </el-col>
      </el-col>
      <p>
        {{ $t("rd-info", { bcoin: bcoin }) }}
      </p>
    </el-col>
  </el-col>
</template>
<script>
import { mapState } from "vuex";
import market from "../../market";
export default {
  name: "Redeem",
  props: ["curNFT"],
  computed: mapState({
    bcoin: "bcoin",
    current: "current",
    WBalance: "WBalance",
    balance: "redeemBalance",
    redeemAllowance: "redeemAllowance",
    needApprove(state) {
      const a = parseFloat(state.redeemAllowance[state.bcoin]);
      const b = parseFloat(state.redeemBalance[state.bcoin]);
      if (a == 0 || b >= a) {
        return true;
      }
      return false;
    },
  }),
  data() {
    return {
      redeemNum: 0,
    };
  },
  methods: {
    approve: async function () {
      const bcoin = this.bcoin;
      const res = await market.tokenApprove("XCC");
      console.log("res", res);
      //TODO: watch tokenRedeem events
    },
    redeem: async function () {
      // const bcoin = this.bcoin;
      const bcoin = "XCC";
      await market.tokenRedeem(bcoin, this.rAmount);
      //TODO: watch tokenRedeem events
    },
  },
};
</script>