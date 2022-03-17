<template>
  <el-col id="fee">
    <el-popover placement="left" trigger="click" title="fees">
      <p>
        {{ $t("dep-limit") }}{{ this.depAmount }}<br />
        {{ $t("w-limit") }}：{{ this.wAmount }}<br />
        {{ $t("beyond-limit") }}<br />
        {{ $t("dep-rate") }}{{ this.dFeeRate / 100 }}%，{{
          $t("dep-minFee")
        }}：{{ this.dFee }}{{ bcoin }}
        <br />
        {{ $t("w-rate") }}：{{ this.wFeeRate / 100 }}%，{{ $t("w-minFee") }}：{{
          this.wFee
        }}{{ bcoin }}
      </p>
      <el-button
        circle
        type="primary"
        slot="reference"
        class="el-icon-info btn-fee"
        @click="getAmountLimit"
      ></el-button>
    </el-popover>
  </el-col>
</template>
<script>
import { mapState } from "vuex";
import market from "../../market";
export default {
  computed: mapState({
    bcoin: "bcoin",
    baddr: "baddr",
  }),
  data() {
    return {
      depAmount: 0,
      wAmount: 0,
      wFeeRate: 0,
      wFee: 0,
      dFee: 0,
      dFeeRate: 0,
    };
  },
  methods: {
    getAmountLimit: async function () {
      const coin = this.bcoin;
      const amount = await market.getLimit(coin);
      this.depAmount = (amount[1] - amount[0]) / 2;
      this.wAmount = amount[0];
      const fees = await market.getfees(coin);
      this.wFeeRate = fees.withdrawFeeRate;
      this.wFee = fees.withdrawFee;
      this.dFee = fees.depositeFee;
      this.dFeeRate = fees.depositeFeeRate;
      console.log("feeeeeeee", fees);
    },
  },
};
</script>