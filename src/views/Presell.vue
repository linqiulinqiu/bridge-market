<template>
  <el-container>
    <el-main v-if="bsc.addr">
      <el-col class="presale" :span="10">
        <PresellMain />
      </el-col>
    </el-main>
    <el-col v-else>
      {{ $t("look-info") }}
    </el-col>
  </el-container>
</template>
<script>
import PresellMain from "../components/PresellMain.vue";
import { mapState } from "vuex";
export default {
  components: {
    PresellMain,
  },
  computed: mapState({
    bsc: "bsc",
  }),
};
</script>
<style>
.presale {
  background: #383838;
}
</style>