<template>
  <el-col id="redeem">
    <el-col>
      <p v-if="this.curci.oldBalance">
        {{ $t("old-balance") }}:{{ this.oldBalanceStr }}
      </p>
      <el-col>
        <el-input
          type="text"
          v-model="amount"
          clearable
          maxlength="20"
          suffix-icon="el-icon-edit"
        ></el-input>

        <ApproveButton
          :bsc="bsc"
          :token="this.curci.oldctr"
          :spender="this.bsc.ctrs.tokenredeem.address"
          :min-req="this.curci.oldBalance"
        >
          <el-button @click="all">{{ $t("all") }}</el-button>
          <el-button @click="redeem" type="primary" :loading="redeeming">{{
            $t("redeem")
          }}</el-button>
        </ApproveButton>
      </el-col>
      <p>
        {{ $t("rd-info") }}
      </p>
      <p v-if="this.amount">
        {{
          $t("rd-rate", {
            amount: parseFloat(this.amount),
            oldsymbol: this.curci.oldSymbol,
            newsymbol: this.curci.newSymbol,
          })
        }}
      </p>
    </el-col>
  </el-col>
</template>
<script>
import { mapState } from "vuex";
import ApproveButton from "../lib/ApproveButton.vue";
import market from "../../market";
import pbwallet from "pbwallet";
import { ethers } from "ethers";
import keeper from "pbweb-nftkeeper";
// const redeemCache = {}; // new redeem created very unusual, so we assume it won't happen in a single web session

export default {
  name: "Redeem",
  props: ["bsc", "newToken"],
  components: {
    ApproveButton,
  },
  computed: {
    ...mapState({
      redeemBalance: "redeemBalance",
      bcoin: "bcoin",
    }),
    oldBalanceStr() {
      if (this.newToken in this.redeemCache) {
        const ci = this.redeemCache[this.newToken];
        const num = ethers.utils.formatUnits(ci.oldBalance, ci.decimals);
        const symbol = ci.oldSymbol;
        return `${num} ${symbol}`;
      }
      return false;
    },
  },
  data() {
    return {
      oBalance: false,
      minReq: 0,
      amount: 0,
      curci: { oldctr: false },
      redeeming: false,
      redeemCache: {},
    };
  },
  mounted() {
    this.loadRedeems();
  },
  watch: {
    deep: true,
    newToken: function () {
      this.updateOldBalance();
    },
    amount: async function (newv, oldv) {
      let reAmount = this.amount;
      if (!reAmount || isNaN(reAmount) || reAmount == "") {
        return false;
      }
      if ("oldBalance" in this.curci) {
        const newb = await keeper.parseToken(this.curci.oldctr.address, newv);
        if (newb.gt(this.curci.oldBalance)) {
          reAmount = await keeper.formatToken(this.curci.oldctr.address, newb);
          return reAmount;
        }
      }
    },
  },
  methods: {
    loadRedeems: async function () {
      const rds = await this.bsc.ctrs.tokenredeem.getRedeemList();
      for (let i in rds[0]) {
        const key = rds[1][i];
        if (!(key in this.redeemCache)) {
          const ci = {};
          const oldctr = pbwallet.erc20_contract(rds[0][i]);
          const newctr = pbwallet.erc20_contract(rds[1][i]);
          ci.oldBalance = await oldctr.balanceOf(this.bsc.addr);
          ci.decimals = await oldctr.decimals();
          ci.oldSymbol = await oldctr.symbol();
          ci.oldctr = oldctr;
          ci.newSymbol = await newctr.symbol();
          this.redeemCache[key] = ci;
        }
      }
      console.log("loadRedeems redeemCache", this.redeemCache);
      this.updateOldBalance();
    },
    updateOldBalance: function () {
      if (this.newToken in this.redeemCache) {
        this.curci = this.redeemCache[this.newToken];
      }
    },
    all: function () {
      this.amount = ethers.utils.formatUnits(
        this.curci.oldBalance,
        this.curci.decimals
      );
    },
    redeem: async function () {
      this.redeem_loading = true;
      const obj = this;
      try {
        const am = ethers.utils.parseUnits(this.amount, this.curci.decimals);
        const res = await this.bsc.ctrs.tokenredeem.redeem(
          this.curci.oldctr.address,
          am
        );
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
  margin: 20px 0px;
}
</style>
