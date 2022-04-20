<template>
  <el-col>
    <p>{{time_msg}}</p>
    <p>阶段：{{stage}}</p>
    <p>剩余：{{remain}}</p>
    <p>可购：{{buyable}}</p>
    <p>价格：{{price_str}} BNB</p>
    <p>预计支付：{{payment}} BNB</p>
    <p>余额：</p>
    <el-input v-model="amount" class="preinput"></el-input>
    <el-button @click="max_amount">最大购买量</el-button>
    <el-button @click="buy">购买</el-button>
  </el-col>
</template>
<script>
import { mapState } from "vuex";
import { DateTime } from "luxon";
import tokens from "../tokens";
export default {
  name: "Presale",
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
      stage: 0,
      amount:'',
      buyable:'',
      remain: '',
      price: '',
      price_str:'',
      payment:''
    };
  },
  watch:{
      amount: async function(newv, oldv){
        const token = this.bsc.ctrs.pbp.address
        if(isNaN(newv)){
            newv='0'
        }
        const am = await tokens.parse(token,newv)
        const price = await tokens.parse('', this.price)
        const payment = am.mul(price).div(1e9).div(1e9)
        this.payment = await tokens.format('', payment)
      }
  },
  methods: {
    refresh: async function () {
      const token = this.bsc.ctrs.pbp.address
      const toend = (await this.bsc.ctrs.presale.timeRemains()).toNumber()
      this.time_msg = `还剩 ${toend} 秒`
      const pkgs = await this.bsc.ctrs.presale.pkgs()
      for(let i in pkgs[0]){
          const remain = pkgs[0][i].sub(pkgs[1][i])
          if(remain.gt(0)){
              this.stage = i
              this.remain = await tokens.format(token,remain)
              this.price = await tokens.format('', pkgs[2][i])
              this.price_str = await tokens.format('', pkgs[2][i].div(1e9))
          }
      }
      const buyable = await this.bsc.ctrs.presale.buyable()
      this.buyable = await tokens.format(token, buyable)
    },
    max_amount: async function(){
        // TODO: can be more accurate
        this.amount = Math.min(this.remain, this.buyable)
    },
    buy: async function(){
        const token = this.bsc.ctrs.pbp.address
        const amount = await tokens.parse(token,this.amount)
        const payment = await tokens.parse('', this.payment)
        const receipt = await this.bsc.ctrs.presale.buy(amount, {value: payment})
        console.log('buy receipt', receipt)
    }
  },
};

</script>
<style>
.preinput {
  width: 200px;
  margin-right: 10px;
}
</style>
