<template>
  <el-col>
    <el-col v-if="checking">
      <p>Checking...</p>
    </el-col>
    <el-col v-else>
        <el-button v-if="needApprove" @click="approve" :loading="approving" type="primary">
          {{ this.$t("approve") }}
        </el-button>
        <slot v-else="needApprove"></slot>
    </el-col>
  </el-col>
</template>
<script>
import { ethers } from 'ethers'
export default {
  name: "ApproveButton",
  props: ["bsc","token","spender","minReq"],
  data() {
    return {
      checking: true,
      needApprove: true,
      approving: false
    };
  },
  mounted: function(){
      this.checkAllowance()
  },
  watch: {
      token(newt,oldt) {
          console.log('props', this.$props)
          this.checkAllowance()
      }
  },
  methods: {
      checkAllowance: async function (){
          console.log('checkAllowance', this.token.address, this.spender, this.minReq)
          if(this.token&&this.token.address==ethers.constants.AddressZero){ // no approval needed for BNB
              this.needApprove = false
              this.checking = false
          }else if(this.token&&this.token.allowance&&this.spender&&this.minReq) {
              const allow = await this.token.allowance(this.bsc.addr, this.spender)
              console.log('allowance token', this.token.address, this.spender)
              if(allow&&allow.gte(this.minReq)){
                  this.needApprove = true
              }else{
                  this.needApprove = false
              }
              this.checking = false
          }
      },
      approve: async function (){
          try{
              const receipt = await this.token.approve(this.spender, await this.token.totalSupply())

              this.approving = true
              if('hash' in receipt){
                await this.bsc.provider.waitTransaction(receipt.hash)
                await this.checkAllowance()
              }
              this.approving = false
          }catch(e){
              console.log('maybe rejected?',e)
          }
          console.log('approve:', this.token.address, this.spender)
      }
  }
};
</script>
<style>
</style>
