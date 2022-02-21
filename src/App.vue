<template>
  <div id="app">
    <keep-alive>
      <el-container>
        <el-header style="height: 70px">
          <plotheader />
        </el-header>
        <el-container>
          <router-view></router-view>
        </el-container>
        <el-footer style="height: 70px">
          <plotfooter />
        </el-footer>
      </el-container>
    </keep-alive>
  </div>
</template>

<script>
import Plotheader from "./components/content/Plotheader.vue";
import Plotfooter from "./components/content/Plotfooter.vue";

export default {
  name: "app",
  components: {
    Plotheader,
    Plotfooter,
  },
};
</script>


<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.el-header {
  background-color: #616161;
  color: #333;
  text-align: center;
  line-height: 70px;
}

.el-footer {
  background-color: #d5d5d5;
  color: #333;
  text-align: center;
  line-height: 70px;
}

.el-main {
  background-color: #e9eef3;
  height: calc(100vh - 140px);
}

body > .el-container {
  margin-bottom: 40px;
}
</style>
