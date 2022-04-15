<template>
  <el-col id="stake">
    <el-container v-if="bsc.addr">
      <el-main v-if="stakeTokens.length">
        <stake-item
          v-for="item in stakeTokens"
          :stakeAddr="item.stakeAddr"
          :pid="item.pid"
          :key="item.pid"
        >
        </stake-item>
      </el-main>
      <el-button @click="refresh" v-else>Reload All</el-button>
    </el-container>
    <el-col v-else class="info">
      <h2>{{ $t("look-info") }}</h2>
    </el-col>
  </el-col>
</template>
<script>
import StakeItem from "../components/StakeItem.vue";
import { mapState } from "vuex";
export default {
  name: "Stake",
  components: {
    StakeItem,
  },
  computed: mapState({
    bsc: "bsc",
  }),
  data() {
    return {
      stakeTokens: [],
    };
  },
  methods: {
    refresh: async function () {
      const tokens = await this.bsc.ctrs.staking.pools();
      const stk = [];
      for (let i in tokens) {
        stk.push({ stakeAddr: tokens[i], pid: i });
      }
      this.stakeTokens = stk;
      console.log("stake tokens", this.stakeTokens);
    },
  },
};
</script>
<style>
.stake-main {
  background-color: #373943;
  border-radius: 20px;
  padding: 50px;
  box-sizing: border-box;
  margin-top: 100px;
}
/* .stake-panel{
    height: 300px;
    width: 300px;
} */
#stake .el-main {
  min-height: 830px;
}
.info {
  margin-top: 300px;
}
h2 {
  text-align: center;
}
</style>
