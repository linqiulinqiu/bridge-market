<template>
  <el-container>
    <el-main>
      <el-col class="presale" :span="10">
        <PresellMain />
      </el-col>
    </el-main>
  </el-container>
</template>
<script>
import PresellMain from "../components/PresellMain.vue";
export default {
  components: {
    PresellMain,
  },
};
</script>
<style>
.presale {
  background: #383838;
}
</style>