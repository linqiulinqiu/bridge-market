<template>
  <el-col id="stake">
    <el-container v-if="bsc.addr">
      <el-main>
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
         <el-col id="stakeinput">
           <p>质押：{{farm_amount }}{{stk_symbol}}</p> <!-- 显示已质押金额 -->
           <span>已赚取：{{ earned_amount }}PBP</span> <!-- 显示目前的收益 -->
           <el-button @click="claim">claim</el-button>
         </el-col>
         <el-col id="stakeapprove"> 
           <el-button @click="dia_set_amount = true">stake</el-button>
           <el-button @click="dia_withdraw= true">withdraw</el-button>
         </el-col>
        </el-col>
      </el-main>
    </el-container>
    <el-col class="info" v-else>
      <h2>{{ $t("look-info") }}</h2>
    </el-col>
    <el-dialog :visible.sync="dia_set_amount">
      <el-card>
        <h2>设置质押数量</h2>
        <p><span>balance：{{ stk_balance }}{{stk_symbol}}</span><el-button @click="stake_amount=stk_balance">all</el-button></p><!-- 显示钱包中WXCC余额 -->
        <el-input  
        v-model="stake_amount"
        clearable></el-input>
        <ApproveButton
          v-if="stk_balance"
          :bsc="bsc"
          :token="bsc.ctrs.wxcc.address"
          :spender="bsc.ctrs.staking.address"
          :min-req="stk_balance_bn"
        >
            <el-button @click="stake_token">deposit</el-button>
        </ApproveButton>
      </el-card>
    </el-dialog>
    <el-dialog :visible.sync="dia_withdraw">
      <el-card>
        <h2>Withdraw</h2>
        <el-input  
        v-model="withdraw_amount"
        clearable></el-input>
        <el-button @click="withdraw">withdraw</el-button>
      </el-card>
    </el-dialog>

  </el-col>
</template>
<script>
import tokens from '../tokens';
import {ethers} from 'ethers';
import ApproveButton from "./lib/ApproveButton.vue";
import { mapState } from "vuex";
export default {
  name: "Stake",
  components: {
    ApproveButton,
  },
  props: ['pid','stakeAddr'],
  computed: mapState({
    bsc: "bsc"
  }),
  data(){
    return{
      farm_amount:'',
      earned_amount:'',
      stk_symbol:'-',
      stk_balance:'',
      stk_balance_bn: 0,
      stake_amount:0,
      withdraw_amount:0,
      dia_set_amount: false,
      dia_withdraw: false
    }
  },
  methods: {
    refresh: async function(){
        this.stk_symbol = await tokens.symbol(this.stakeAddr)
        this.stk_balance_bn = await tokens.balance(this.stakeAddr)
        this.stk_balance = await tokens.format(this.stakeAddr, this.stk_balance_bn)
        const staked = await this.bsc.ctrs.staking.staked(ethers.BigNumber.from(this.pid), this.bsc.addr)
        this.farm_amount = await tokens.format(this.stakeAddr, staked)
        const earnval = await this.bsc.ctrs.staking.earned(ethers.BigNumber.from(this.pid), this.bsc.addr)
        this.earned_amount = await tokens.format(this.bsc.ctrs.pbp.address, earnval)
        console.log('earned val', earnval)
    },
    withdraw: async function(){
        const amount = await tokens.parse(this.stakeAddr, this.withdraw_amount)
        if(amount.gt(0)){
            const receipt = await this.bsc.ctrs.staking.withdraw(this.pid, amount)
            console.log('withdraw receipt',receipt)
        }
    },
    claim: async function(){
        const receipt = await this.bsc.ctrs.staking.claimReward(this.pid)
        console.log('claim receipt', receipt)
        console.log('领取收益');
    },
    stake_token: async function(){
        const amount = await tokens.parse(this.stakeAddr, this.stake_amount)
        if(amount.gt(0)&&amount.lte(this.stk_balance_bn)){
            const receipt = await this.bsc.ctrs.staking.stake(this.pid, amount)
            console.log('stake receipt', receipt)
        }else{
            console.log('Invalid amount', amount);
        }
    },
  }
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
.info{
  margin-top: 300px;
}
h2 {
  text-align: center;
}
</style>
