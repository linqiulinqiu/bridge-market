<template>
  <el-row id="bridge-main" type="flex" justify="center">
    <el-col class="fees" :span="14" v-if="baddr">
      <el-col v-if="Object.keys(myList).length == 0" class="mainpanel">
        <el-col style="color: #fff">
          <h1>Bridge Guide</h1>
          <el-col>
            <h4>1.请先点击选择一个NFT</h4>
            <h4>2.获取存款地址</h4>
            <h4>3.绑定取款地址</h4>
          </el-col>
        </el-col>
      </el-col>
      <el-col v-else>
        <el-col v-if="!current.pbtId" style="color: #fff">
          <h1>{{ $t("openNFT") }}</h1>
        </el-col>
        <el-col v-else>
          <el-col> <BridgeFee /> </el-col>
          <el-col id="balance">
            余额：<span class="font"> {{ WBalance[bcoin] }}</span>
            <span class="minifont"> w{{ bcoin }}</span>
            <el-button size="mini" type="primary" @click="addToken">
              {{ $t("add-token") }}
            </el-button>
          </el-col>
          <el-tabs>
            <el-tab-pane :label="$t('deposit')"><Deposit :curNFT="curNFT" /></el-tab-pane>
            <el-tab-pane :label="$t('withdraw')"><Withdraw :curNFT="curNFT"/></el-tab-pane>
            <el-tab-pane :label="$t('redeem')"><Redeem :curNFT="curNFT"/></el-tab-pane>
          </el-tabs>
        </el-col>
      </el-col>
    </el-col>
    <el-col v-else> {{ $t("connect") }} </el-col>
  </el-row>
</template>
<script>
import Deposit from "./bridge/Deposit.vue";
import Withdraw from "./bridge/Withdraw.vue";
import Redeem from "./bridge/Redeem.vue";
import BridgeFee from "./bridge/BridgeFee.vue";
import { mapState } from "vuex";
import market from "../market";

export default {
  name: "BridgeMain",
  components: {
    Deposit,
    Withdraw,
    Redeem,
    BridgeFee,
  },
  props: ["myList"],
  computed: mapState({
    WBalance: "WBalance",
    current: "current",
    bcoin: "bcoin",
    baddr: "baddr",
    curNFT(state) {
      if (state.current.pbtId) {
        const pbtId = state.current.pbtId;
        if (pbtId in state.myList) {
          console.log("this.current NFT", state.myList[pbtId]);
          return state.myList[pbtId];
        }
      }
      return false;
    },
  }),
  watch: {
    bcoin: function (newcoin) {
      console.log("coin", newcoin, this.bcoin);
      this.$store.commit("setBcoin", newcoin);
    },
    deep: true,
  },
  data() {
    return {
      balance: "",
    };
  },
  methods: {
    addToken: async function () {
      const coin = this.bcoin;
      const res = await market.watchToken(coin);
      console.log("add token", res);
    },
    coinBalance: function (coin) {
      const lcoin = coin.toString().toLowerCase();
      if (lcoin in this.WBalance && this.WBalance[lcoin]) {
        this.balance = this.WBalance[lcoin];
        return this.WBalance[lcoin];
      } else {
        this.balance = "---";
        return "---";
      }
    },
  },
};
</script>
