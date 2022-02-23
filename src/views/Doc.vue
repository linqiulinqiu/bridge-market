<template>
  <div class="content">
    <el-main>Docs</el-main>
  </div>
</template>

<script>

export default {
  name: "Doc",
  components: {
  },
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