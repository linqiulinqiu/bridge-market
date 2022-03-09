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
          <el-col v-if="curNFT['pbxs'] == undefined">
            <el-button type="primary" class="getdeposte" @click="getDepositAddr"
              >获取{{ bcoin }}存款地址</el-button
            >
          </el-col>
          <el-col v-else>
            <span v-if="curNFT.pbxs[this.coinMap[bcoin]]">
              <span class="font">{{
                curNFT.pbxs[this.coinMap[bcoin]].depositAddr
              }}</span>
            </span>
            <span v-else>
              <el-button
                type="primary"
                class="getdeposte"
                @click="getDepositAddr"
                >获取{{ bcoin }}存款地址</el-button
              >
            </span>
          </el-col>
        </el-col>
        <!-- </el-col> -->
      </el-col>
      <el-col>
        <p>
          你将会得到<span class="span"
            ><span v-if="this.depAmount" class="font">
              {{ getAmount }}</span
            ></span
          >
          W{{ bcoin }}
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
      coinMap: {
        XCC: "3",
        XCH: "1",
        HDD: "2",
      },
    };
  },
  watch: {
    curNFT: function (newNFT) {
      this.$store.commit("setCurNFT", newNFT);
    },
    depAmount: async function () {
      var depamount = this.depAmount;
      console.log("depamount", this.bcoin, depamount);
      if (!depamount || isNaN(depamount) || depamount == "") {
        depamount = "0";
        this.tips_amount = "请输入正确的金额";
        return false;
      }
      const after_fee = await market.afterFee(
        this.bcoin,
        "deposite",
        depamount
      );
      console.log("aftrerfee", after_fee);
      if (!after_fee) {
        this.getAmount = "0";
        this.tips_amount = "数额过少，将什么都收不到呢！";
      } else if (after_fee == "fund") {
        this.getAmount = "0";
        this.tips_amount = "数额过大，余额不够呢！";
      } else {
        this.getAmount = after_fee;
        this.tips_amount = false;
      }
      console.log("aft", after_fee, this.getAmount);
      return after_fee;
    },
  },
  methods: {
    getDepositAddr: async function () {
      const nft = this.curNFT;
      try {
        const res = await market.getDepAddr(nft.id, this.bcoin);
        if (res == false) {
          this.$message("该类型存款地址已经获取了");
        }
      } catch (e) {
        console.log("deposit addr errr", e.message);
      }
    },
  },
};
</script>