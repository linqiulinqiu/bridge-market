<template>
  <div class="content">
    <!-- <plotheader/>
    <h2>Doc</h2>
    <plotfooter/> -->
    <!-- <el-container>
      <el-header style ='height:70px'>
        <plotheader/>
      </el-header> -->
    <!-- <el-container> -->
    <!-- <el-aside width="250px">
          <mynft/>
        </el-aside> -->
    <el-main>Main</el-main>
    <!-- </el-container> -->
    <!-- <el-footer style ='height:70px'>
        <plotfooter/>
      </el-footer>
    </el-container> -->
  </div>
</template>

<script>
import Plotheader from "../components/content/Plotheader.vue";
import Plotfooter from "../components/content/Plotfooter.vue";
import Mynft from "../components/content/nftpanel/Mynft.vue";

export default {
  name: "Doc",
  components: {
    Plotheader,
    Plotfooter,
    Mynft,
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.content {
  display: flex;
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

.el-aside {
  background-color: #d3dce6;
}

.el-main {
  /* background-color: red; */
  height: calc(100vh - 140px);
  width: 100vw;
  /* color: #333;
    text-align: center;
    line-height: 160px; */
}

body > .el-container {
  margin-bottom: 40px;
}
</style>