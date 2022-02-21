<template>
  <el-col id="redeem">
    <h3>Redeem</h3>
    <el-col>
      <p>balnce:XXX</p>
      <el-col>
        <el-input type="text" v-model.number="redeemNum"></el-input>
        <p>
          <el-button>All</el-button>
          <el-button>Redeem</el-button>
        </p>
      </el-col>
      <p>
        因为版本升级，现将以前的代币按照一比一兑换为现在的代币，如 50 PXCC
        转化为 50 WXCC
      </p>
    </el-col>
  </el-col>
</template>
<script>
import { mapState } from "vuex";
import market from "../../market";
export default {
  computed: mapState({
    baddr: "baddr",
    mcoin: "mcoin",
    curNFT: "curNFT",
    WBalance: "WBalance",
    redeemBalance: "0",
    redeemAllowance: "0",
  }),
  data() {
    return {
      redeemNum: 0,
    };
  },
  methods: {},
};
</script>