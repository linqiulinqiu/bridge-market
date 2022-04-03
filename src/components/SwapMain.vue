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
      <el-button @click="redeem" :loading="redeeming">{{
        $t("redeem")
      }}</el-button>
    </ApproveButton>
    <el-button>Swap</el-button>
  </el-col>
</template>
<script>
import { ethers } from 'ethers'
import { mapState } from "vuex";
import ApproveButton from "./lib/ApproveButton.vue";
import pbwallet from 'pbwallet'
export default {
  name: "SwapMain",
  components: {
    ApproveButton
  },
  computed: mapState({
    bsc: "bsc",
    from_val: function(){
        return ethers.utils.parseUnits(this.from_amount)    // TODO: use decimals
    }
  }),
  data(){
      return {
          from_balance: false,
          from_amount: 0,
          from_coin: false,
          from_ctr: {},
          to_balance: false,
          to_amount: 0,
          to_coin: false
      }
  },
  methods: {
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
          console.log('wsymbols', wsymbols)
          console.log('wlist', wlist)
          return wlist
      }
  }
};
</script>
