<template>
  <el-col>
    <el-tabs type="border-card">
      <el-tab-pane label="deposit"><Deposite /></el-tab-pane>
      <el-tab-pane label="withdraw"><Withdraw /></el-tab-pane>
      <el-tab-pane label="redeem"><Redeem /></el-tab-pane>
    </el-tabs>
  </el-col>
</template>
<script>
import Deposite from "./bridge/Deposite.vue";
import Withdraw from "./bridge/Withdraw.vue";
import Redeem from "./bridge/Redeem.vue";
export default {
  components: {
    Deposite,
    Withdraw,
    Redeem,
  },
};
</script>