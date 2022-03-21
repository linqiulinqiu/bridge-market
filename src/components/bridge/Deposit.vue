<template>
  <el-col id="deposite" class="tabs">
    <el-col v-if="baddr">
      <p>
        {{ $t("deposit") }}:<el-input
          type="text"
          clearable
          maxlength="40"
          class="amount-input"
          suffix-icon="el-icon-edit"
          v-model.trim="depAmount"
        />{{ bcoin }}
      </p>
      <el-col>
        {{ $t("addr") }} ：
        <el-col class="aa">
          <el-col v-if="this.depositAddr">
            <span class="font">{{
              this.curNFT.pbxs[this.coinMap[bcoin]].depositAddr
            }}</span>
          </el-col>
          <el-col v-else>
            <span> 暂时没有可获取的存款地址，请等待 </span>
            <el-button
              type="primary"
              class="getdeposte"
              @click="getDepositAddr"
              :loading="getDep_loading"
              >{{ $t("dep-addr", { bcoin: bcoin }) }}</el-button
            >
          </el-col>
        </el-col>
      </el-col>
      <el-col>
        <p>
          {{ $t("get")
          }}<span class="span"
            ><span v-if="this.depAmount" class="font">
              {{ getAmount }}</span
            ></span
          >
          w{{ bcoin }}，{{ $t("inbsc") }}。
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
  props: ["curNFT"],
  computed: mapState({
    baddr: "baddr",
    bcoin: "bcoin",
    current: "current",
    depositAddr(state) {
      const pbxs = this.curNFT.pbxs;
      const cointy = this.coinMap[state.bcoin];
      if (pbxs == undefined) {
        return false;
      } else if (cointy in pbxs && pbxs[cointy]["depositAddr"]) {
        return this.curNFT.pbxs[this.coinMap[state.bcoin]]["depositAddr"];
      }
      return false;
    },
  }),
  data() {
    return {
      depAmount: "",
      getAmount: "",
      tips_amount: false,
      getDep_loading: false,
      coinMap: {
        XCC: "3",
        XCH: "1",
        HDD: "2",
      },
    };
  },
  watch: {
    depAmount: async function () {
      var depamount = this.depAmount;
      if (!depamount || isNaN(depamount) || depamount == "") {
        depamount = "0";
        this.tips_amount = this.$t("correct-amount");
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
        this.tips_amount = this.$t("tips-amount1");
      } else if (after_fee == "fund") {
        this.getAmount = "0";
        this.tips_amount = this.$t("tips-amount1");
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
      this.getDep_loading = true;
      const id = this.current.pbtId;
      try {
        const res = await market.getDepAddr(id, this.bcoin);
        if (res == false) {
          console.log("存款地址没有了");
          this.$message(this.$t("getaddr"));
        }
        const obj = this;
        await market.waitEventDone(res, async function (evt) {
          obj.getDep_loading = false;
        });
      } catch (e) {
        this.getDep_loading = false;
        console.log("deposit addr errr", e.message);
      }
    },
  },
};
</script>