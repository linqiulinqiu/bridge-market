<template>
  <div id="app">
    <keep-alive>
      <el-container>
        <el-header style="height: 70px">
          <plotheader/>
        </el-header>
        <el-container>
          <el-main style="padding: 0;">
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    </keep-alive>
  </div>
</template>

<script>
import Plotheader from './components/content/Plotheader.vue'

export default {
  name: "app",
  components: {
    Plotheader
  },
};
</script>


<style>
@import url('https://fonts.googleapis.com/css2?family=Oswald&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Oswald', sans-serif;
}
.el-header {
  background-color:#25272E;
  color: #FFFFFF;
  text-align: center;
  line-height: 70px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.el-main {
  background-color: #2B2C33;
  height: calc(100vh - 70px);
}

body > .el-container {
  margin-bottom: 40px;
}
</style>
