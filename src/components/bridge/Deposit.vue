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
          <el-col v-if="curNFT['pbxs'] == undefined">
            <el-button
              type="primary"
              class="getdeposte"
              @click="getDepositAddr"
              >{{ $t("dep-addr", { bcoin: bcoin }) }}</el-button
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
                :loading="getDep_loading"
                >{{ $t("dep-addr", { bcoin: bcoin }) }}</el-button
              >
            </span>
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
  computed: mapState({
    baddr: "baddr",
    bcoin: "bcoin",
    curNFT(state) {
      console.log("call curNFT", state.current);
      if (state.current.pbtId) {
        const pbtId = state.current.pbtId;
        if (pbtId in state.PBTlists) {
          console.log("this.current NFT", state.PBTlists[pbtId]);
          return state.PBTlists[pbtId];
        } else {
          console.log("current NFT not exists", Object.keys(state.PBTlists));
        }
      } else {
        console.log("no current pbtId", state.current);
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
      console.log("depamount", this.bcoin, depamount);
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
      const nft = this.curNFT;
      try {
        const res = await market.getDepAddr(nft.id, this.bcoin);
        if (res == false) {
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