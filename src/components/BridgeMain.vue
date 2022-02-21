<template>
  <el-row id="bridge-main" type="flex" :justify="center">
    <!-- <el-col><BridgeFee /></el-col> -->
    <el-col class="fees" :span="12">
      <el-col :span="14"
        ><BridgeFee />
        <el-tabs type="border-card">
          <el-tab-pane label="存款"><Deposite /></el-tab-pane>
          <el-tab-pane label="取款"><Withdraw /></el-tab-pane>
          <el-tab-pane label="兑换"><Redeem /></el-tab-pane> </el-tabs
      ></el-col>
    </el-col>
  </el-row>
</template>
<script>
import Deposite from "./bridge/Deposite.vue";
import Withdraw from "./bridge/Withdraw.vue";
import Redeem from "./bridge/Redeem.vue";
import BridgeFee from "./bridge/BridgeFee.vue";

export default {
  components: {
    Deposite,
    Withdraw,
    Redeem,
    BridgeFee,
  },
};
</script>