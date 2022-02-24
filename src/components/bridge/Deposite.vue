<template>
  <el-col id="deposite" class="tabs">
    <el-col v-if="baddr">
      <p>
        存入:<el-input
          type="text"
          clearable
          maxlength="40"
          class="amount-input"
          suffix-icon="el-icon-edit"
          v-model.trim="depAmount"
        />{{ bcoin }}币
      </p>
      <el-col>
        在以下的地址：
        <el-col class="aa">
          <el-col v-if="curNFT.pbxs">
            <span v-if="curNFT.pbxs['0']">请绑定PBX</span>
            <span v-else>
              <span v-if="bcoin == 'XCH'">
                <i v-if="curNFT.pbxs['1'].depositAddr">{{
                  curNFT.pbxs["1"].depositAddr
                }}</i>
              </span>
              <span v-if="bcoin == 'HDD'">
                <i v-if="curNFT.pbxs['2'].depositAddr">{{
                  curNFT.pbxs["2"].depositAddr
                }}</i>
              </span>
              <span v-if="bcoin == 'XCC'">
                <i v-if="curNFT.pbxs['3'].depositAddr">{{
                  curNFT.pbxs["3"].depositAddr
                }}</i>
              </span>
            </span>
          </el-col>
        </el-col>
      </el-col>
      <el-col>
        <p>
          你将会得到<span class="span">{{ getAmount }}</span> W{{ bcoin }}
          币，在你的bsc钱包中。
        </p>
        <p v-if="this.tips_amount">
          <i v-if="this.depAmount.length > 0">{{ this.tips_amount }}</i>
        </p>
      </el-col>
    </el-col>
  </el-col>
</template>
<script>
import { mapState } from "vuex";
import market from "../../market";
import BridgeFee from "./BridgeFee.vue";
export default {
  components: {
    BridgeFee,
  },
  computed: mapState({
    baddr: "baddr",
    bcoin: "bcoin",
    curNFT: "curNFT",
  }),
  data() {
    return {
      depAmount: "",
      getAmount: "",
      tips_amount: false,
    };
  },
  watch: {
    depAmount: async function () {
      var depamount = this.depAmount;
      console.log("depamount", this.bcoin, depamount);
      if (!depamount || isNaN(depamount) || depamount == "") {
        depamount = "0";
      }
      const after_fee = await market.afterFee(
        this.bcoin,
        "deposite",
        depamount
      );
      console.log("aftrerfee", after_fee);
      if (!after_fee) {
        this.getAmount = "";
        this.tips_amount = "数额过少，将什么都收不到呢！";
      } else if (after_fee == "fund") {
        this.getAmount = "";
        this.tips_amount = "数额过大，余额不够呢！";
      } else {
        this.getAmount = after_fee;
        this.tips_amount = false;
      }
      console.log("aft", after_fee, this.getAmount);
      return after_fee;
    },
  },
  methods: {},
};
</script>