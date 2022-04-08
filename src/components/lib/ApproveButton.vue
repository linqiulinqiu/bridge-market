<template>
  <el-col>
    <el-col v-if="checking">
      <p>Checking...</p>
    </el-col>
    <el-col v-else>
      <el-button
        v-if="needApprove"
        @click="approve"
        :loading="approving"
        type="primary"
      >
        {{ this.$t("approve") }}
      </el-button>
      <slot v-else>000</slot>
    </el-col>
  </el-col>
</template>
<script>
import { ethers } from "ethers";
import tokens from '../../tokens'

export default {
  name: "ApproveButton",
  props: ["bsc", "token", "spender", "minReq"],
  data() {
    return {
      checking: true,
      needApprove: true,
      approving: false,
    };
  },
  mounted: function () {
    this.checkAllowance();
  },
  watch: {
    token(newt, oldt) {
      console.log("props", this.$props);
      this.checkAllowance();
    },
    minReq(newm, oldm){
      this.checkAllowance();
    }
  },
  methods: {
    checkAllowance: async function () {
      console.log(
        "checkAllowance",
        this.token,
        this.spender,
        this.minReq
      );
      this.checking = true
      const allow = await tokens.allowance(this.token, this.spender)
      if (allow && allow.gte(this.minReq)) {
        this.needApprove = false;
      } else {
        this.needApprove = true;
      }
      this.checking = false;
    },
    approve: async function () {
      try {
        this.approving = true;
        const done = await tokens.approve(this.spender)
        if(done){
          await this.checkAllowance();
        }
        this.approving = false;
      } catch (e) {
        console.log("maybe rejected?", e);
      }
      console.log("approve:", this.token, this.spender);
    },
  },
};
</script>
<style>
</style>
