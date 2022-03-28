<template>
  <el-col id="home">
    <!-- <el-main> -->
    <el-col class="header-img">
      <el-button> PBT NFT </el-button>
    </el-col>
    <el-col class="introduction">
      <el-col class="brief-info">
        <h4>What problems are miners experiencing?</h4>
        <p>1. problem 1</p>
        <p>2. problem 2</p>
      </el-col>
      <el-col class="brief-info">
        <h4>How do we solve these problems?</h4>
        <p>1. we do ....</p>
        <p>2. we do ....</p>
      </el-col>
    </el-col>
    <!-- </el-main> -->
  </el-col>
</template>

<script>
export default {
  name: "Home",
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#home {
  color: #fff;
}
.header-img {
  width: 100%;
  min-width: 1200px;
  height: 400px;
  background: url("../assets/image/banner.jpg") no-repeat;
}
.header-img .el-button {
  width: 200px;
  height: 50px;
  margin: 150px auto;
  display: flex;
  font-size: 20px;
  font-weight: 600;
  justify-content: center;
}
.introduction {
  width: 100%;
  height: 300px;
}
.brief-info {
  margin: 0 auto 20px;
  height: 150px;
  text-align: center;
}
</style>