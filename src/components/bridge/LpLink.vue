<template>
  <el-col id="lplink">
    <el-button class="lp-style">
      <router-link to="/Swap">Buy PBP</router-link>
    </el-button>
    <el-button v-if="this.coinInfo" class="lp-style">
      <router-link to="/Swap">Buy {{ coinInfo.bsymbol }}</router-link>

      <!-- <a :href="this.pre_link + 'swap?outputCurrency=' + this.coinInfo.address"
        >Buy {{ coinInfo.bsymbol }}</a
      > -->
    </el-button>
    <el-button v-if="this.coinInfo" class="lp-style">
      <a
        target="_"
        :href="this.pre_link + 'add/' + pbpAddr + '/' + this.coinInfo.address"
        >Add LP {{ coinInfo.bsymbol }}</a
      >
    </el-button>
  </el-col>
</template>
<script>
import { mapState } from "vuex";
import pbwallet from "pbwallet";

export default {
  name: "LPLink",
  props: ["coinType"],
  computed: mapState({
    pbpAddr(state) {
      return state.bsc.ctrs.pbp.address;
    },
    coinInfo(state) {
      if (this.coinType && this.coinType > 0) {
        const info = pbwallet.wcoin_info(this.coinType);
        info.address = state.bsc.ctrs[info.ctrname].address;
        return info;
      }
      return false;
    },
  }),
  data() {
    return {
      pre_link: "https://pancake.kiemtienonline360.com/#/",
    };
  },
};
</script>
<style scoped>
.lp-style {
  background-color: #2b2c33;
  border: 1px solid #38f2af;
  border-radius: 5px;
}
.lp-style a {
  color: #38f2af;
  text-decoration: none;
}
.lp-style:hover {
  background-color: #373943;
}
</style>