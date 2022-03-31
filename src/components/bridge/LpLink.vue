<template>
  <el-col>
    <el-button>
      <a target="_" :href="this.pre_link + this.pbpAddr">Buy PBP</a>
    </el-button>
    <el-button v-if="this.coinInfo">
      <a target="_" :href="this.pre_link + this.coinInfo.address">Buy {{ coinInfo.bsymbol }}</a>
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
      return state.bsc.ctrs.pbp.address
    },
    coinInfo(state){
        if(this.coinType&&this.coinType>0){
            const info = pbwallet.wcoin_info(this.coinType)
            info.address = state.bsc.ctrs[info.ctrname].address
            return info
        }
        return false
    }
  }),
  data() {
    return {
      pre_link: "https://pancake.kiemtienonline360.com/#/swap?outputCurrency=",
    };
  },
};
</script>
