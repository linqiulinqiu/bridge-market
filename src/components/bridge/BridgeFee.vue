<template>
  <el-col id="fee">
    <el-popover placement="left" trigger="click" title="fees">
      <p>
        单次存款限额为：{{ this.depAmount }}<br />
        单次取款限额：{{ this.wAmount }}<br />
        存款费率：{{ this.dFeeRate / 100 }}%，存款最小手续费：{{ this.dFee
        }}{{ mcoin }}
        <br />
        取款费率：{{ this.wFeeRate / 100 }}%，取款最小手续费：{{ this.wFee
        }}{{ mcoin }}
      </p>
      <el-button
        circle
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
    mcoin: "mcoin",
    baddr: "baddr",
    curNFT: "curNFT",
  }),
  data() {
    return {
      depAmount: 0,
      wAmount: -1,
      wFeeRate: 0,
      wFee: 0,
      dFee: 0,
      dFeeRate: 0,
    };
  },
  methods: {
    getAmountLimit: async function () {
      console.log("getAmountLimit", this.curNFT);
      const amount = await market.getLimit();
      console.log("getamount", amount, typeof amount[0]);
      this.depAmount = (amount[1] - amount[0]) / 2;
      this.wAmount = amount[0];
      const fees = await market.getfees("XCC");
      this.wFeeRate = fees.withdrawFeeRate;
      this.wFee = fees.withdrawFee;
      this.dFee = fees.depositeFee;
      this.dFeeRate = fees.depositeFeeRate;
      console.log("feeeeeeee", fees);
    },
  },
};
</script>