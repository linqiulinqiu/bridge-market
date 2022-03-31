<template>
  <el-col id="mynft">
    <el-col class="title">{{ $t("my-nfts") }}</el-col>
    <el-col v-if="baddr">
      <el-col v-if="Object.keys(this.myList).length > 0" class="nftarea">
        <el-col class="nftlist">
          <keep-alive>
            <MylistPage
              v-bind:nftlist="nftlist"
              v-bind:open="openNFT"
              v-bind:current="current"
            />
          </keep-alive>
        </el-col>
        <el-col class="btn-bar">
          <el-pagination
            background
            :total="Object.keys(this.myList).length"
            layout="total,prev,pager,next"
            @current-change="handleCurrentChange"
            :current-page="this.pageNum"
            :page-size="this.pageSize"
          ></el-pagination>
        </el-col>
      </el-col>
      <el-col v-else class="content">
        <el-col>
          {{ $t("no-nft") }}
        </el-col>
      </el-col>
      <el-col class="bottom-box">
        <router-link class="bottom" :to="this.market"
          >{{ $t("to-market") }}
        </router-link>
      </el-col>
    </el-col>
    <el-col v-else>{{ $t("look-info") }}</el-col>
  </el-col>
</template>

<script>
import { mapState } from "vuex";
import NFTinfo from "./nftpanel/NFTinfo.vue";

export default {
  name: "Mynft",
  components: {
    NFTinfo,
  },
  props: ["myList", "pageSize", "curNFT"],
  computed: mapState({
    baddr: "baddr",
    bcoin: "bcoin",
    current: "current",
    nftlist(state) {
      let pageSize = this.pageSize;
      const start = this.pageNum * pageSize - pageSize;
      const down = this.pageNum * pageSize;
      const listPage = Object.fromEntries(
        Object.entries(state.myList).slice(start, down)
      );
      return listPage;
    },
  }),
  data() {
    return {
      pageNum: 1,
      market: "/Market",
    };
  },
  methods: {
    openNFT: async function (id) {
      this.$store.commit("setCurrentPbtId", id);
    },
    handleCurrentChange(newPage) {
      this.pageNum = newPage;
    },
  },
};
</script>

<style scoped>
.container {
  color: #ffffff;
  background: #adefab25;
  height: calc(100vh - 235px);
}
.el-col,
#mynft {
  color: #ffffff;
  background-color: #25272e;
}
i {
  margin-right: 8px;
}
.title {
  height: 50px;
  font-size: 36px;
  line-height: 50px;
  text-align: center;
}
.nftlist {
  width: 300px;
  height: 600px;
}
.content {
  min-height: 550px;
  font-size: 24px;
  line-height: 36px;
  padding: 40px;
}
.bottom-box {
  padding: 0 110px;
  margin-top: 40px;
}
.bottom {
  background-color: #38f2af;
  width: 132px;
  font-size: 14px;
  color: #000000;
}
.btn-bar {
  margin: 20px 0;
  padding: 0 50px;
}
.addclass {
  background: rgb(173, 195, 235);
  width: 150px;
  height: 150px;
  transform: all 0.3 linear 0.2;
}
</style>
