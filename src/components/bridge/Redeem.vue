<template>
  <el-col id="redeem" class="tabs">
    <h3>{{ $t("redeem") }}</h3>
    <el-col>
      <p>{{ $t("balance") }}:{{ balance }}</p>
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
  computed: mapState({
    bcoin: "bcoin",
    current: "current",
    WBalance: "WBalance",
    balance: "redeemBalance",
    redeemAllowance: "redeemAllowance",
    needApprove(state) {
      const a = parseFloat(state.redeemAllowance);
      const b = parseFloat(state.redeemBalance);
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
      const oldToken = "0x134315EF3D11eEd8159fD1305af32119a046375A";
      await market.tokenApprove(oldToken);
      //TODO: watch tokenRedeem events
    },
    redeem: async function () {
      const oldToken = "0x134315EF3D11eEd8159fD1305af32119a046375A";
      await market.tokenRedeem(oldToken, this.rAmount);
      //TODO: watch tokenRedeem events
    },
  },
};
</script>