<template>
  <el-col id="redeem">
    <el-col v-if="current.coinType == '2'">{{ this.$t("no-redeem") }} </el-col>
    <el-col v-else>
      <h3>{{ $t("redeem") }}</h3>
      <el-col>
        <p>{{ $t("balance") }}:{{ this.redeemBalance[bcoin] }}</p>
        <el-col>
          <el-input
            type="text"
            v-model="redeemNum"
            clearable
            maxlength="20"
            suffix-icon="el-icon-edit"
          ></el-input>
          <el-col v-if="needApprove">
            <el-button
              @click="approve"
              :loading="approve_loading"
              type="primary"
            >
              {{ this.$t("approve") }}
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
      try {
        const res = await market.tokenApprove(this.bcoin, commit);
        const obj = this;
        market.waitEventDone(res, async function (evt) {
          obj.approve_loading = false;
        });
      } catch (e) {
        console.log("approve err", e);
        this.approve_loading = false;
      }

      //TODO: watch tokenRedeem events
    },
    redeem: async function () {
      this.redeem_loading = true;
      const obj = this;
      try {
        const res = await market.tokenRedeem(this.bcoin, this.redeemNum);
        market.waitEventDone(res, async function (evt) {
          obj.redeem_loading = false;
        });
      } catch (e) {
        console.log("redeem err", e);
        this.redeem_loading = false;
      }

      //TODO: watch tokenRedeem events
    },
  },
};
</script>
<style>
#redeem {
  font-size: 20px;
}
#redeem .el-input {
  width: 200px;
  float: left;
  margin: 20px;
}
</style>