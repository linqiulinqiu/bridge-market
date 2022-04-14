<template>
  <el-col id="lplink">
    <!-- <el-button class="lp-style">
      <router-link to="/Swap">Buy PBP</router-link>
    </el-button> -->
    <!-- <el-button class="lp-style" @click="watchPBP">Add PBP To Wallet</el-button> -->
    <el-button v-if="this.coinInfo" class="lp-style">
      <router-link to="/Swap">Buy {{ this.coinInfo.bsymbol }}</router-link>

      <!-- <a :href="this.pre_link + 'swap?outputCurrency=' + this.coinInfo.address"
        >Buy {{ coinInfo.bsymbol }}</a
      > -->
    </el-button>
    <el-button v-if="this.coinInfo" class="lp-style">
      <a
        target="_"
        :href="this.pre_link + 'add/' + pbpAddr + '/' + this.coinInfo.address"
        >Add LP {{ this.coinInfo.bsymbol }}</a
      >
    </el-button>
  </el-col>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "LPLink",
  props: ["coinInfo"],
  computed: mapState({
    pbpAddr(state) {
      return state.bsc.ctrs.pbp.address;
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
#lplink .lp-style {
  background-color: #2b2c33;
  border: 1px solid #38f2af;
  border-radius: 5px;
  color: #38f2af;
}
.lp-style a {
  color: #38f2af;
  text-decoration: none;
}
#lplink .lp-style:hover {
  background-color: #373943;
}
</style>