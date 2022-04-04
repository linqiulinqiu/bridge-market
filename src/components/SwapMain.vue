<template>
  <el-col v-if="'addr' in this.bsc">
    <el-col class='clearfix'>
        <h3>Simple Swap</h3>
        <p>Trade common tokens (powered by PancakeSwap)</p>
    </el-col>
    <el-col>
        <p>From<span class='clearfix'>Balance: {{this.from_balance}}</span></p>
        <el-input v-model='from_amount'></el-input>
        <el-select v-model='from_coin'>
            <el-option v-for='w in wlist()' :key='w.address' :label='w.bsymbol'
            :value='w.address'>
            </el-option>
        </el-select>
    </el-col>
    <el-col>
        <p>To<span class='clearfix'>Balance: {{this.to_balance}}</span></p>
        <el-input v-model='to_amount'></el-input>
        <el-select v-model='to_coin'>
            <el-option v-for='w in wlist()' :key='w.address' :label='w.bsymbol'
            :value='w.address'>
            </el-option>
        </el-select>
    </el-col>

    <ApproveButton :bsc="bsc" :token="this.from_ctr" :spender="this.bsc.ctrs.router.address" :min-req="this.from_val">
      <el-button @click="all">{{ $t("all") }}</el-button>
      <el-button @click="swap" :loading="swapping">{{
        $t("swap")
      }}</el-button>
    </ApproveButton>
  </el-col>
</template>
<script>
import { ethers } from 'ethers'
import { mapState } from "vuex";
import ApproveButton from "./lib/ApproveButton.vue";
import pbwallet from 'pbwallet'
import keeper from 'pbweb-nftkeeper'
import swap from '../swap'
export default {
  name: "SwapMain",
  components: {
    ApproveButton
  },
  computed: mapState({
    bsc: "bsc"
  }),
  data(){
      return {
          from_balance: false,
          from_amount: 0,
          from_val: 0,
          from_coin: ethers.constants.AddressZero,
          from_ctr: false,
          swapping: false,
          to_balance: false,
          to_amount: 0,
          to_val: 0,
          to_coin:false
      }
  },
  watch:{
      bsc: function (){
          this.to_coin = this.bsc.ctrs.pbp.address 
      },
      from_amount: async function(newa,olda){
          if(!newa){
              newa = '0'
          }
          console.log('from_amount', newa, this.from_coin)
          this.from_val = await keeper.parseToken(this.from_coin, newa)
          if(this.from_coin&&this.to_coin&&this.from_coin!=this.to_coin){
              try{
                  const est = await swap.estimate(this.bsc, this.from_coin, this.to_coin, this.from_val)
                  this.to_val = est
                  this.to_amount = await keeper.formatToken(this.to_coin, est)
              }catch(e){
                  console.log('estimate failed', e)
              }
          }
      },
      from_coin: async function(newc, oldc){
          if(newc){
              if(newc==ethers.constants.AddressZero){
                  this.from_ctr = {
                      address: newc
                  }
                  const fbalance = ethers.utils.formatEther(await this.bsc.provider.getBalance(this.bsc.addr))
                  this.from_balance = fbalance
              }else{
                  this.from_ctr = pbwallet.erc20_contract(newc)
                  const fbalance = await this.from_ctr.balanceOf(this.bsc.addr)
                  this.from_balance = await keeper.formatToken(newc, fbalance)
              }
          }
      },
      to_coin: async function(newc, oldc){
          if(newc){
              if(newc==ethers.constants.AddressZero){
                  this.to_ctr = {
                      address: newc
                  }
                  const fbalance = ethers.utils.formatEther(await this.bsc.provider.getBalance(this.bsc.addr))
                  this.to_balance = fbalance
              }else{
                  this.to_ctr = pbwallet.erc20_contract(newc)
                  const fbalance = await this.to_ctr.balanceOf(this.bsc.addr)
                  this.to_balance = await keeper.formatToken(newc, fbalance)
              }
          }
      }
  },
  methods: {
      all: function(){
          console.log('set all')
      },
      swap: async function (){
          const minreq = this.to_val.sub(this.to_val.div(100))
          console.log('signer', this.bsc.signer.address)
          console.log('swapping', this.from_coin, this.to_coin, this.from_val, minreq, 120)
          const receipt = await swap.swap(this.bsc, this.from_coin, this.to_coin, 
            this.from_val, minreq, 120)
          console.log('swap', receipt)
      },
      wlist: function(){
          const wsymbols = pbwallet.wcoin_list('bsymbol')
          const wlist = [{
              bsymbol: 'BNB',
              address: ethers.constants.AddressZero,
              decimals: 18
          },{
              bsymbol: 'PBP',
              address: this.bsc.ctrs.pbp.address,
              decimals: 9       // TODO: should call contract to obtain decimals
          }]
          for(let i in wsymbols){
              wlist.push(pbwallet.wcoin_info(wsymbols[i],'bsymbol'))
          }
          return wlist
      }
  }
};
</script>
