<template>
  <el-col id="redeem" class="tabs">
    <h3>{{ $t("redeem") }}</h3>
    <el-col>
      <p>{{ $t("balance") }}:{{ redeemBalance[bcoin] }}</p>
      <el-col>
        <el-input type="text" v-model="redeemNum"></el-input>
        <el-col v-if="needApprove">
          <el-button @click="approve">Approve</el-button>
        </el-col>
        <el-col v-else>
          <el-button @click="redeemAll">{{ $t("all") }}</el-button>
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
    redeemBalance: "redeemBalance",
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
      redeemNum: "",
    };
  },
  methods: {
    redeemAll: function () {
      this.redeemNum = this.redeemBalance[this.bcoin];
    },
    approve: async function () {
      const res = await market.tokenApprove("XCC");
      console.log("res", res);
      //TODO: watch tokenRedeem events
    },
    redeem: async function () {
      await market.tokenRedeem(this.bcoin, this.redeemNum);
      //TODO: watch tokenRedeem events
    },
  },
};
</script>