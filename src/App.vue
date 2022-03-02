<template>
  <div id="app">
    <keep-alive>
      <el-container>
        <el-header style="height: 70px">
          <plotheader />
        </el-header>
        <el-container>
          <el-main style="padding: 0">
            <router-view></router-view>
          </el-main>
        </el-container>
        <el-footer style="height: 70px">
          <Plotfooter />
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
@import url("https://fonts.googleapis.com/css2?family=Oswald&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Oswald", sans-serif;
}
#app {
  min-height: 800px;
}
.el-header,
.el-footer {
  background-color: #25272e;
  color: #ffffff;
  text-align: center;
  line-height: 70px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  user-select: none;
}

.el-main {
  background-color: #2b2c33;
  height: calc(100vh - 140px);
  min-height: 650px;
}

body > .el-container {
  margin-bottom: 40px;
}
</style>
