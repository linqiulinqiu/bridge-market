<template>
  <el-col>
    <el-button v-if="isApprove" :loading="a_loading" @click="approve">
      Approve
    </el-button>
    <el-button v-else :loading="buy_loading" @click="pay">pay</el-button>
  </el-col>
</template>
<script>
export default {
  name: ApproveButton,
  computed: {},
  props: [],
  data() {
    return {
      a_loading: false,
      buy_loading: false,
    };
  },
};
</script>