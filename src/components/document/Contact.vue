<template>
  <el-col>
    <h1>Contact us</h1>
    <el-col>
      <h2>联系我们:</h2>
      <el-col>
        <p>- Discord: <a href="https://discord.com/invite/xHC9fBfeVW" target="_blank">https://discord.com/invite/xHC9fBfeVW</a></p>
        <p>- 电报: <a href="https://t.me/PlotBridge" target="_blank">https://t.me/PlotBridge</a></p>
        <p>- 推特: <a href="https://twitter.com/plot_bridge" target="_blank">https://twitter.com/plot_bridge</a></p>
      </el-col>
     </el-col>
  </el-col>
</template>
<script>
export default {
  name: "Contact",
};
</script>
<style scoped>
.el-col {
  padding: 30px;
}
p {
  line-height: 35px;
  /* text-indent: 20px; */
}
a{
  text-decoration: none;
  color: aqua;
}
</style>