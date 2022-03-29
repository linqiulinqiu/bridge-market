<template>
  <el-row id="bridge-main" type="flex" justify="center">
    <el-col class="fees" :span="14" v-if="baddr">
      <el-col
        v-if="Object.keys(this.$store.state.myList).length == 0"
        class="mainpanel"
      >
        <el-col></el-col>
        <el-col style="color: #fff">
          <h1>Bridge Guide</h1>
          <el-col>
            <h4>1.请先点击选择一个NFT，并且选择一个币种。</h4>
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
          <el-col v-if="!current.coinType">
            <h4 style="color: #fff">请先选择一个币种</h4>
          </el-col>
          <el-col v-else>
            <el-col> <BridgeFee /> </el-col>
            <el-col id="balance">
              余额：<span class="font"> {{ WBalance[bcoin] }}</span>
              <span class="minifont"> {{ wcoin }}</span>
              <el-tooltip
                placement="bottom"
                content="添加当前代币信息到metaMask（小狐狸）钱包中"
                ><el-button size="mini" type="primary" @click="addToken">
                  {{ $t("add-token") }}
                </el-button>
              </el-tooltip>
            </el-col>
            <el-tabs>
              <el-tab-pane :label="$t('deposit')"
                ><Deposit :curNFT="this.curNFT"
              /></el-tab-pane>
              <el-tab-pane :label="$t('withdraw')"
                ><Withdraw :curNFT="this.curNFT"
              /></el-tab-pane>
              <el-tab-pane :label="$t('redeem')"
                ><Redeem :curNFT="this.curNFT"
              /></el-tab-pane>
            </el-tabs>
            <el-col class="lplink">
              <h3>
                <a
                  href="https://pancake.kiemtienonline360.com/#/swap?outputCurrency=0xCb7A587Ee1BBAF2385659D8ba8D3F4318601caE6"
                  >lp for PBP</a
                >
              </h3>
            </el-col>
          </el-col>
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
import pbwallet from "pbwallet";

export default {
  name: "BridgeMain",
  components: {
    Deposit,
    Withdraw,
    Redeem,
    BridgeFee,
  },
  props: ["curNFT"],
  computed: mapState({
    WBalance: "WBalance",
    bcoin: "bcoin",
    current: "current",
    wcoin: (state) => {
      const info = pbwallet.wcoin_info(state.current.coinType);
      if (info) return info.bsymbol;
      return "-";
    },
    baddr: "baddr",
  }),
  data() {
    return {};
  },
  methods: {
    addToken: async function () {
      const coin = this.bcoin;
      await market.watchToken(coin);
    },
  },
};
</script>
<style>
.lplink {
  position: absolute;
  z-index: 10;
  bottom: 15px;
  left: 15px;
  width: 150px;
  height: 50px;
  border: darkcyan 1px solid;
  text-align: center;
  border-radius: 20px;
  padding: 7px;
  box-shadow: -7px 6px 5px 5px cadetblue;
}
.lplink a {
  color: #668b66;
  text-decoration: none;
}
.lplink a:hover {
  color: blueviolet;
}
</style>