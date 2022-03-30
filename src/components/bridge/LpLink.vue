<template>
  <el-col>
    <p>
      <a :href="this.pre_link + this.pbp_addr">PBP LP </a>
      <!-- <a :href="this.pre_link + this.wcoin_addr">{{ bcoin }} lp</a> -->
    </p>
  </el-col>
</template>
<script>
export default {
  name: "LPlink",
  computed: {
    pbp_addr() {
      return "f0xCb7A587Ee1BBAF2385659D8ba8D3F4318601caE6";
    },
    // wcoin_addr(){
    //   return
    // }
  },
  data() {
    return {
      pre_link: "https://pancake.kiemtienonline360.com/#/swap?outputCurrency=",
    };
  },
};
</script>