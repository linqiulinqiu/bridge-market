<template>
  <div>
    <div class="content">
      <el-aside width="350px">
        <keep-alive> <Mynft :myList="myList" :pageSize="3" /></keep-alive>
      </el-aside>
      <el-main style="color: #fff">
        <MarketMain
          :marketList="marketList"
          :mySaleList="mySaleList"
          :pageSize="4"
        />
      </el-main>
    </div>
  </div>
</template>

<script>
import Mynft from "../components/content/nftpanel/Mynft.vue";
import { mapState } from "vuex";
import MarketMain from "../components/MarketMain.vue";
export default {
  name: "Market",
  components: {
    Mynft,
    MarketMain,
  },
  computed: mapState({
    baddr: "baddr",
    myList: "myList",
    marketList: "marketList",
    mySaleList: "mySaleList",
  }),
  data() {
    return {
      pageSize: 3,
    };
  },
};
</script>

<style scoped>
::-webkit-scrollbar {
  display: none;
}
.el-main {
  height: calc(100vh - 140px);
  width: calc(100vw - 250px);
  padding: 0;
}
</style>