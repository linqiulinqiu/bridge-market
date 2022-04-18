<template>
  <el-col id="stake" :span="24">
    <el-col class="stake-main">
      <el-col id="stakeinput" :lg="22" :span="24">
        <el-button @click="refresh" icon="el-icon-refresh"></el-button>
        <p v-if="locktime > 0">{{ $t("lock-time") }}：{{ locktime_str }}</p>
        <p>总质押：{{ hformat(lpamount) }} {{ stk_symbol }}</p>
        <p>APR：{{ apy }} %</p>
        <p>
          质押中：{{ hformat(farm_amount) }} &nbsp; {{ stk_symbol }}
          <span>{{ hformat((farm_amount * 100) / lpamount) }} %</span>
        </p>
        <!-- 显示已质押金额 -->
        <span>已赚取：{{ hformat(earned_amount) }}PBP</span>
        <!-- 显示目前的收益 -->
        <el-button @click="claim">claim</el-button>
      </el-col>
      <el-col id="stakeapprove" 
      :lg="{ span: 14, offset: 12 }"
      :md="{ span: 14, offset: 12 }"
      :sm="{ span: 14, offset: 12 }"
      :xs="{ span: 14, offset: 12 }"
      >
        <el-button @click="dia_set_amount = true">stake</el-button>
        <el-button @click="dia_withdraw = true">withdraw</el-button>
      </el-col>
    </el-col>
    <el-dialog :visible.sync="dia_set_amount" width="40vw">
      <el-card class="amount-ipt">
        <h2>设置质押数量</h2>
        <p>
          <span>{{ $t("balance") }}：{{ stk_balance }}{{ stk_symbol }}</span
          ><el-button @click="stake_amount = stk_balance">all</el-button>
        </p>
        <!-- 显示钱包中WXCC余额 -->
        <el-input v-model="stake_amount" clearable maxlength="20">
          
        </el-input>
        <el-button 
          @click="stake_amount = stk_balance"  
          type="primary">all</el-button>
      
        <ApproveButton
          v-if="stk_balance"
          :bsc="bsc"
          :token="stakeAddr"
          :spender="bsc.ctrs.staking.address"
          :min-req="stk_balance_bn"
        >
          <el-button @click="deposit">deposit</el-button>
        </ApproveButton>
      </el-card>
    </el-dialog>
    <el-dialog :visible.sync="dia_withdraw">
      <el-card>
        <h2>{{ $t("withdraw") }}</h2>
        <p>
          <span>{{ $t("balance") }}：{{ farm_amount }}{{ stk_symbol }}</span>
          <el-button @click="withdraw_amount = farm_amount">{{
            $t("all")
          }}</el-button>
        </p>
        <el-input v-model="withdraw_amount" clearable></el-input>
        <el-button
          v-if="withdraw_wait == 0"
          @click="withdraw"
          :loading="w_loading"
          >{{ $t("withdraw") }}
        </el-button>
        <el-col v-else>
          <p>锁定中，请等待{{ this.withdraw_wait }}秒，或强制提取</p>
          <el-button @click="force_withdraw" :loading="force_w_loading"
            >force withdraw</el-button
          >
        </el-col>
      </el-card>
    </el-dialog>
  </el-col>
</template>
<script>
import tokens from "../../tokens";
import { ethers } from "ethers";
import pbwallet from "pbwallet";
import hformat from "human-format";
import ApproveButton from "../lib/ApproveButton.vue";
import { mapState } from "vuex";
import { Duration } from "luxon";
import market from "../../market";
export default {
  name: "Stake",
  components: {
    ApproveButton,
  },
  props: ["pid", "stakeAddr", "locktime", "lpamount", "poolreward"],
  computed: mapState({
    bsc: "bsc",
    locktime_str() {
      const lt = Duration.fromObject(
        { seconds: this.locktime },
        { locale: "zh" }
      );
      const lt_tohuman = lt.toHuman({ unitDisplay: "short" });
      return lt_tohuman;
    },
  }),
  mounted() {
    this.refresh();
    setInterval(this.refresh, 12000);
  },
  data() {
    return {
      apy: "-",
      farm_amount: "",
      earned_amount: "",
      stk_symbol: "-",
      stk_balance: "",
      stk_balance_bn: 0,
      stake_amount: 0,
      withdraw_amount: 0,
      withdraw_wait: 0,
      dia_set_amount: false,
      dia_withdraw: false,
      dep_loading: false,
      w_loading: false,
      force_w_loading: false,
    };
  },
  watch: {
    locktime: function () {},
  },
  methods: {
    hformat: function (val) {
      if (isNaN(val) || val == "") {
        return "";
      } else if (typeof val == "number") {
        return hformat(val);
      } else if (typeof val == "string") {
        return hformat(parseFloat(val));
      } else {
        return hformat(val.toNumber());
      }
    },

    refresh: async function () {
      const pid = ethers.BigNumber.from(this.pid);
      const stakeAddr = this.stakeAddr;
      const rewardAddr = this.bsc.ctrs.pbp.address;
      this.stk_symbol = await tokens.symbol(stakeAddr);
      this.stk_balance_bn = await tokens.balance(stakeAddr);
      this.stk_balance = await tokens.format(stakeAddr, this.stk_balance_bn);
      const stakeds = await this.bsc.ctrs.staking.staked(pid, this.bsc.addr);
      const staked = stakeds[0];
      this.withdraw_wait = stakeds[1].toNumber();
      this.farm_amount = await tokens.format(stakeAddr, staked);
      const earnval = await this.bsc.ctrs.staking.earned(pid, this.bsc.addr);
      this.earned_amount = await tokens.format(rewardAddr, earnval);
      // console.log("poolreward", this.poolreward);
      this.apy = (this.poolreward * 365 * 86400 * 100) / this.lpamount;
    },
    withdraw: async function () {
      this.w_loading = true;
      const amount = await tokens.parse(this.stakeAddr, this.withdraw_amount);
      if (amount.gt(0)) {
        const obj = this;
        try {
          const receipt = await this.bsc.ctrs.staking.withdraw(
            this.pid,
            amount
          );
          console.log("withdraw receipt", receipt);
          await market.waitEventDone(receipt, function (e) {
            obj.w_loading = false;
            obj.dia_withdraw = false;
          });
        } catch (e) {
          this.w_loading = false;
        }
      }
    },
    force_withdraw: async function () {
      this.force_w_loading = true;
      const amount = await tokens.parse(this.stakeAddr, this.withdraw_amount);
      if (amount.gt(0)) {
        try {
          const receipt = await this.bsc.ctrs.staking.forceWithdraw(
            this.pid,
            amount
          );
          console.log("force withdraw receipt", receipt);
          await market.waitEventDone(receipt, function (e) {
            obj.force_w_loading = false;
          });
        } catch (e) {
          this.force_w_loading = false;
          console.log("force withdraw err", e);
        }
      }
    },
    claim: async function () {
      const receipt = await this.bsc.ctrs.staking.withdraw(
        this.pid,
        ethers.BigNumber.from(0)
      );
      console.log("claim receipt", receipt);
      console.log("TODO: close withdraw window when done");
    },
    deposit: async function () {
      this.dep_loading = true;
      const amount = await tokens.parse(this.stakeAddr, this.stake_amount);
      if (amount.gt(0) && amount.lte(this.stk_balance_bn)) {
        try {
          const obj = this;
          const receipt = await this.bsc.ctrs.staking.deposit(this.pid, amount);
          console.log("stake receipt", receipt);
          await market.waitEventDone(receipt, function () {
            obj.dep_loading = false;
            obj.dia_set_amount = false;
          });
        } catch (e) {
          this.dep_loading = false;
          console.log("deposit in stake err", e);
        }
      } else {
        console.log("Invalid amount", amount);
      }
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
#stake .el-main {
  min-height: 830px;
}
#stakeinput {
  position: relative;
  padding: 20px;
  margin: 20px;
  background-color: #2b2c33;
  border-radius: 20px;
}
#stakeinput .el-button {
  position: absolute;
  right: 15%;
  top: 45%;
}
#stakeapprove {
  padding-right:0;
}
.info {
  margin-top: 300px;
}
.amount-ipt .el-input{
  width: 50%;
  min-width: 200px;
  margin: 10px;

}
h2 {
  text-align: center;
}
</style>
