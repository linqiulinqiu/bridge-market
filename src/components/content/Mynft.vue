<template>
  <el-col id="mynft">
    <el-col class="my-title">
      {{ $t("my-nfts") }}
      <el-button
        @click="getMintfee"
        size="small"
        class="btn"
        v-if="baddr"
        type="primary"
        >{{ $t("mintPBT") }}
      </el-button>
    </el-col>
    <el-col v-if="Object.keys(this.myList).length > 0" class="nftarea">
      <el-col class="nftlist">
        <MylistPage
          v-bind:nftlist="nftlist"
          v-bind:open="openNFT"
          v-bind:current="current"
        />
      </el-col>
      <el-col class="btn-bar">
        <el-pagination
          background
          :total="Object.keys(this.myList).length"
          layout="prev,pager,next"
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

    <el-dialog :visible.sync="mintVisible">
      <el-card>
        <MintPBT :mintAbles="this.mintNumber" :mintFee="this.mintFee" />
      </el-card>
    </el-dialog>
  </el-col>
</template>

<script>
import { mapState } from "vuex";
import NFTinfo from "./nftpanel/NFTinfo.vue";
import MintPBT from "../market/MintPBT.vue";
import market from "../../market";

export default {
  name: "Mynft",
  components: {
    NFTinfo,
    MintPBT,
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
      mintNumber: "--",
      mintVisible: false,
      mintFee: {
        price: 0,
        token: "BNB",
      },
    };
  },
  methods: {
    openNFT: async function (id) {
      this.$store.commit("setCurrentPbtId", id);
    },
    getMintfee: async function () {
      const fee = await market.getmintfee();
      this.mintFee.price = fee.price;
      this.mintFee.token = fee.ptName;
      const number = await market.getMintAbles();
      console.log("mint number", number);
      this.mintNumber = number;
      this.mintVisible = true;
    },
    handleCurrentChange(newPage) {
      this.pageNum = newPage;
    },
  },
};
</script>

<style scoped>
#mynft {
  background-color: #25272e;
  min-height: 650px;
  padding-top: 20px;
  padding-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
}
i {
  margin-right: 8px;
}
.my-title {
  height: 40px;
  font-size: 20px;
  font-weight: 600;
  line-height: 40px;
  text-align: center;
}
.btn {
  position: relative;
  top: -5px;
}
.nftarea {
  margin-top: 5px;
  min-height: 500px;
}
.nftlist {
  height: 600px;
  padding: 0px 15px;
}
.content {
  min-height: 400px;
  line-height: 36px;
  padding: 40px;
}
.bottom-box {
  padding: 0 10px;
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
.btn-bar .el-pagination {
  background-color: #25272e;
}
.addclass {
  background: rgb(173, 195, 235);
  width: 150px;
  height: 150px;
  transform: all 0.3 linear 0.2;
}
</style>
