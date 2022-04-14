<template>
  <el-col id="stake">
    <el-container v-if="'addr' in bsc">
      <el-main>
        <el-col
          class="stake-main"
          :lg="{ span: 10, offset: 7 }"
          :md="{ span: 12, offset: 6 }"
          :sm="{ span: 16, offset: 4 }"
          :xs="{ span: 22, offset: 1 }"
        >
         <el-col id="staketitle">
           <h2>Stake</h2>
         </el-col>
         <el-col id="stakeinput">
           <p>WXCC质押：1000 WXCC</p> <!-- 显示已质押金额 -->
           <span>WXCC已赚取：99 WXCC</span> <!-- 显示目前的收益 -->
           <el-button @click="claim">claim</el-button>
         </el-col>
         <el-col id="stakeapprove"> 
           <el-button @click="approve">approve</el-button>
           <el-button @click="dia_set_amount = true">stake</el-button>
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
        <p>stake： <span>balance：100WXCC</span></p><!-- 显示钱包中WXCC余额 -->
        <el-input  
        v-model="s_amount"
        clearable></el-input>
        <el-button @click="stake_token">confirm</el-button>
      </el-card>
    </el-dialog>
  </el-col>
</template>
<script>
import SwapMain from "../components/SwapMain.vue";
import { mapState } from "vuex";
export default {
  name: "Stake",
  computed: mapState({
    bsc: "bsc",
  }),
  data(){
    return{
      s_amount:'',
      dia_set_amount: false
    }
  },
  methods: {
    approve: function(){console.log('执行授权');},
    claim: function(){console.log('领取收益');},
    stake_token: function(){console.log('执行质押');},
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