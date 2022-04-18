<template>
  <el-col id="stake">
    <el-col
      class="stake-main"
      :lg="{ span: 10, offset: 7 }"
      :md="{ span: 12, offset: 6 }"
      :sm="{ span: 16, offset: 4 }"
      :xs="{ span: 22, offset: 1 }"
    >
      <el-col id="staketitle">
        <h2>Earn by Staking</h2>
        <el-button @click="refresh">refresh</el-button>
      </el-col>
      <el-col id="stakeinput"
      :lg="22"
      :md="22"
      :sm="22"
      :xs="22">
        <p v-if="locktime>0">锁定时间：{{locktime}}(秒)</p>
        <p>总质押：{{ hformat(lp_amount) }} {{ stk_symbol }}</p>
        <p>APY：{{ hformat(apy) }} %</p>
        <p>质押中：{{ hformat(farm_amount) }} &nbsp;{{ stk_symbol }} <span>{{hformat(farm_amount*100/lp_amount)}} %</span></p>
        <!-- 显示已质押金额 -->
        <span>已赚取：{{ hformat(earned_amount) }}PBP</span>
        <!-- 显示目前的收益 -->
        <el-button @click="claim">claim</el-button>
      </el-col>
      <el-col id="stakeapprove">
        <el-button @click="dia_set_amount = true">stake</el-button>
        <el-button @click="dia_withdraw = true">withdraw</el-button>
      </el-col>
    </el-col>
    <el-dialog :visible.sync="dia_set_amount">
      <el-card>
        <h2>设置质押数量</h2>
        <p>
          <span>balance：{{ stk_balance }}{{ stk_symbol }}</span
          ><el-button @click="stake_amount = stk_balance">all</el-button>
        </p>
        <!-- 显示钱包中WXCC余额 -->
        <el-input v-model="stake_amount" clearable></el-input>
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
        <h2>Withdraw</h2>
        <p>
         <span>balance：{{ farm_amount }}{{ stk_symbol }}</span>
          <el-button @click="withdraw_amount = farm_amount">all</el-button>
         </p>
        <el-input v-model="withdraw_amount" clearable></el-input>
        <el-button v-if="withdraw_wait==0" @click="withdraw">withdraw</el-button>
        <el-col v-else>
            <p>锁定中，请等待{{this.withdraw_wait}}秒，或强制提取</p>
            <el-button @click="force_withdraw">force withdraw</el-button>
        </el-col>
      </el-card>
    </el-dialog>
  </el-col>
</template>
<script>
import tokens from "../tokens";
import { ethers } from "ethers";
import hformat from 'human-format';
import ApproveButton from "./lib/ApproveButton.vue";
import { mapState } from "vuex";
export default {
  name: "Stake",
  components: {
    ApproveButton,
  },
  props: ["pid", "stakeAddr","locktime", "lpamount", "rpshare"],
  computed: mapState({
    bsc: "bsc",
  }),
  data() {
    return {
      apy: "-",
      farm_amount: "",
      earned_amount: "",
      lp_amount: "",
      stk_symbol: "-",
      stk_balance: "",
      stk_balance_bn: 0,
      stake_amount: 0,
      withdraw_amount: 0,
      withdraw_wait: 0,
      dia_set_amount: false,
      dia_withdraw: false,
    };
  },
  methods: {
    hformat: function(val){
        console.log('hformat', val)
        if(isNaN(val)||val==''){
            return ''
        }else if(typeof(val)=='number'){
            return hformat(val)
        }else if(typeof(val)=='string'){
            return hformat(parseFloat(val))
        }else{
            return hformat(val.toNumber())
        }
    },
    refresh: async function () {
      this.stk_symbol = await tokens.symbol(this.stakeAddr);
      this.stk_balance_bn = await tokens.balance(this.stakeAddr);
      this.stk_balance = await tokens.format(
        this.stakeAddr,
        this.stk_balance_bn
      );
      const stakeds = await this.bsc.ctrs.staking.staked(
        ethers.BigNumber.from(this.pid),
        this.bsc.addr
      )
      const staked = stakeds[0]
      this.withdraw_wait = stakeds[1].toNumber()
      this.farm_amount = await tokens.format(this.stakeAddr, staked);
      const earnval = await this.bsc.ctrs.staking.earned(
        ethers.BigNumber.from(this.pid),
        this.bsc.addr
      );
      this.earned_amount = await tokens.format(
        this.bsc.ctrs.pbp.address,
        earnval
      );
      this.apy = ethers.utils.formatEther(this.rpshare.mul(365*86400*100))
      this.lp_amount = await tokens.format(this.stakeAddr, this.lpamount)
      console.log("earned val", earnval);
    },
    withdraw: async function () {
      const amount = await tokens.parse(this.stakeAddr, this.withdraw_amount);
      if (amount.gt(0)) {
        const receipt = await this.bsc.ctrs.staking.withdraw(this.pid, amount);
        console.log("withdraw receipt", receipt);
        console.log("TODO: close withdraw window when done")
      }
    },
    force_withdraw: async function () {
      const amount = await tokens.parse(this.stakeAddr, this.withdraw_amount);
      if (amount.gt(0)) {
        const receipt = await this.bsc.ctrs.staking.forceWithdraw(this.pid, amount);
        console.log("force withdraw receipt", receipt);
        console.log("TODO: close withdraw window when done")
      }
    },
    claim: async function () {
      const receipt = await this.bsc.ctrs.staking.withdraw(this.pid, ethers.BigNumber.from(0));
      console.log("claim receipt", receipt);
      console.log("TODO: close withdraw window when done")
    },
    deposit: async function () {
      const amount = await tokens.parse(this.stakeAddr, this.stake_amount);
      if (amount.gt(0) && amount.lte(this.stk_balance_bn)) {
        const receipt = await this.bsc.ctrs.staking.deposit(this.pid, amount);
        console.log("stake receipt", receipt);
        console.log("TODO: close deposit window when done")
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
#stakeinput .el-button{
  position: absolute;
  right: 15%;
  top: 45%;
}
#stakeapprove {
  padding: 0 5% 0 55%;
}
.info {
  margin-top: 300px;
}
h2 {
  text-align: center;
}
</style>
