<template>
  <el-col>
    <p v-if="time_msg">质押奖励开始：{{ time_msg }}</p>
    <ul v-if="stakeTokens.length">
      <li v-for="item in this.stakeTokens" :key="item.pid">
        <el-col
          :lg="{ span: 11, offset: 1 }"
          :md="{ span: 12 }"
          :sm="{ span: 16 }"
          :xs="{ span: 22 }"
        >
          <StakeItem
            :stakeAddr="item.stakeAddr"
            :pid="item.pid"
            :lpamount="item.lpamount"
            :poolreward="item.reward_speed"
            :locktime="item.locktime"
            :key="item.pid"
          />
        </el-col>
      </li>
    </ul>
    <p v-else>{{ $t("data") }}</p>
  </el-col>
</template>
<script>
import StakeItem from "./stake/StakeItem.vue";
import { mapState } from "vuex";
import { DateTime } from "luxon";
import swap from "../swap";
import tokens from "../tokens";
export default {
  name: "StakeMain",
  components: {
    StakeItem,
  },
  computed: mapState({
    bsc: "bsc",
  }),
  mounted() {
    this.refresh();
  },
  data() {
    return {
      stakeTokens: [],
      time_msg: "",
      total_alloc: 1,
    };
  },
  methods: {
    refresh: async function () {
      const stakeStart = await this.bsc.ctrs.pbp.stakeStart();
      console.log("stake-start time", stakeStart.toNumber());
      const sstime = DateTime.fromSeconds(stakeStart.toNumber());
      this.time_msg = sstime.toRelative({ locale: "zh" });
      const pools = await this.bsc.ctrs.staking.pools();
      const stk = [];
      let total_alloc = 0;
      const now = parseInt(DateTime.now().toSeconds());
      const reward_speed_a = await this.bsc.ctrs.pbp.stakeRewardIn(
        now,
        now + 1
      );
      const reward_speed = parseFloat(
        await tokens.format(this.bsc.ctrs.pbp.address, reward_speed_a)
      );
      for (let i in pools[0]) {
        const lpamount = await tokens.format(pools[0][i], pools[2][i]);
        stk.push({
          stakeAddr: pools[0][i],
          pid: i,
          alloc: pools[1][i].toNumber(),
          lpamount: lpamount,
          locktime: pools[4][i].toNumber(),
        });
        total_alloc += pools[1][i].toNumber();
      }
      for (let i in stk) {
        const price = await swap.price(this.bsc, stk[i].stakeAddr);
        console.log("price", await tokens.symbol(stk[i].stakeAddr), price);
        stk[i].reward_speed =
          (stk[i].alloc * reward_speed) / price / total_alloc;
        console.log("stk", i, "reward_speed", stk[i].reward_speed);
      }
      this.stakeTokens = stk;
      console.log("stake tokens", this.stakeTokens);
    },
  },
};
</script>
<style>
/* .stake-main {
  background-color: #373943;
  border-radius: 20px;
  padding: 50px;
  box-sizing: border-box;
  margin-top: 100px;
}
#stakeinput {
  position: relative;
  padding: 30px 30px;
  border-radius: 20px;
  margin-top: 25px;
  background-color: rgba(43, 44, 51, 0.8);
}
#stakeinput .el-col {
  margin: 10px;
}
#stakeinput .el-button {
  position: absolute;
  right: 10%;
  height: 24px;
  line-height: 24px; 
}
#stake .el-main {
  min-height: 830px;
}
.info {
  margin-top: 300px;
}
h2 {
  text-align: center; 
} */
</style>
