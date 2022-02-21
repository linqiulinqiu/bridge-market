<template>
  <el-col>
    <el-tabs type="border-card">
      <el-tab-pane label="存款"><Deposite /></el-tab-pane>
      <el-tab-pane label="取款"><Withdraw /></el-tab-pane>
      <el-tab-pane label="兑换"><Redeem /></el-tab-pane>
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