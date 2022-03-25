<template>
  <el-col id="redeem" class="tabs">
    <el-col v-if="current.coinType == '2'"> 没有此兑换 </el-col>
    <el-col v-else>
      <h3>{{ $t("redeem") }}</h3>
      <el-col>
        <p>{{ $t("balance") }}:{{ this.redeemBalance[bcoin] }}</p>
        <el-col>
          <el-input type="text" v-model="redeemNum"></el-input>
          <el-col v-if="needApprove">
            <el-button @click="approve" :loading="approve_loading">
              Approve
            </el-button>
          </el-col>
          <el-col v-else>
            <el-button @click="redeemAll">{{ $t("all") }}</el-button>
            <el-button @click="redeem" :loading="redeem_loading">{{
              $t("redeem")
            }}</el-button>
          </el-col>
        </el-col>
        <p>
          {{ $t("rd-info", { bcoin: bcoin }) }}
        </p>
      </el-col>
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
      approve_loading: false,
      redeem_loading: false,
    };
  },
  methods: {
    redeemAll: function () {
      this.redeemNum = this.redeemBalance[this.bcoin];
    },
    approve: async function () {
      this.approve_loading = true;
      const commit = this.$store.commit;
      const res = await market.tokenApprove(this.bcoin, commit);
      console.log("res1", res);

      const obj = this;
      market.waitEventDone(res, async function (evt) {
        console.log("approve res", res, evt);
        obj.approve_loading = false;
      });
      console.log("res", res);
      //TODO: watch tokenRedeem events
    },
    redeem: async function () {
      this.redeem_loading = true;
      const obj = this;
      const res = await market.tokenRedeem(this.bcoin, this.redeemNum);
      market.waitEventDone(res, async function (evt) {
        console.log("redeem res", res, evt);
        obj.redeem_loading = false;
      });
      //TODO: watch tokenRedeem events
    },
  },
};
</script>