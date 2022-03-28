<template>
  <div class="content">
    <el-container>
      <el-aside width="300px">
        <h3>docs title</h3>
        <el-col>
          <el-menu
            default-active="1"
            text-color="#fff"
            background-color="#25272e"
          >
            <el-menu-item index="1">
              <i class="el-icon-document"></i>
              <span slot="title">导航一</span>
            </el-menu-item>
            <el-menu-item index="2">
              <i class="el-icon-document"></i>
              <span slot="title">导航二</span>
            </el-menu-item>
            <el-menu-item index="3">
              <i class="el-icon-document"></i>
              <span slot="title">导航三</span>
            </el-menu-item>
            <el-menu-item index="4">
              <i class="el-icon-document"></i>
              <span slot="title">导航四</span>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-aside>
      <el-main>Docs</el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Doc",
  components: {},
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.content {
  display: flex;
  color: #ffffff;
}
.el-main {
  height: calc(100vh - 70px);
  width: 100vw;
}
</style>