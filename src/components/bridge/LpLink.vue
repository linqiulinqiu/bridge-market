<template>
  <el-col id="lplink">
    <el-button>
      <a
        target="_"
        :href="this.pre_link + 'swap?outputCurrency=' + this.pbpAddr"
        >Buy PBP</a
      >
    </el-button>
    <el-button v-if="this.coinInfo">
      <a
        target="_"
        :href="this.pre_link + 'swap?outputCurrency=' + this.coinInfo.address"
        >Buy {{ coinInfo.bsymbol }}</a
      >
    </el-button>
    <el-button v-if="this.coinInfo">
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