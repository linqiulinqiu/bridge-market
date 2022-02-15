<template>
  <div>
    <header>
      <div class="logo">
        <img class="m-logo" src="../../assets/image/big-logo.svg" alt="LOGO" />
      </div>
      <el-col><h2>version: 2/15 2.0</h2></el-col>
      <nav>
        <div class="navi">
          <ul class="navi-content">
            <li
              v-for="(item, index) in this.nav"
              :key="index"
              @click="liclick(item.link)"
            >
              {{ item.tag }}
            </li>
          </ul>
        </div>
        <div class="linkto">
          <a href=""
            ><img class="l-coin" src="../../assets/image/discord.png" alt=""
          /></a>
          <a href=""
            ><img class="l-coin" src="../../assets/image/twitter.png" alt=""
          /></a>
          <a href=""
            ><img class="l-coin" src="../../assets/image/facebook.png" alt=""
          /></a>
          <a href=""
            ><img class="l-coin" src="../../assets/image/linkedin.png" alt=""
          /></a>
        </div>
        <div class="start">
          <el-button v-if="!baddr" type="primary" @click="connect_wallet"
            >start</el-button
          >
          <span v-else>{{
            baddr.substr(0, 6) + "..." + baddr.substr(-4, 4)
          }}</span>
        </div>
      </nav>
    </header>
  </div>
</template>

<script>
import { mapState } from "vuex";
import market from "../../market";
import allData from "../../getAllData";

export default {
  name: "Plotheader",
  computed: mapState({
    baddr: "baddr",
    PBTlists: "PBTlists",
    PBTSellingLists: "PBTSellingLists",
  }),
  watch: {
    PBTlists: function (new_list) {
      this.$store.commit("setPBTlists", new_list);
    },
    deep: true,

    PBTSellingLists: function (newLists) {
      this.$store.commit("setPBTSellingLists", newLists);
    },
    deep: true,
  },
  data() {
    return {
      nav: [
        { tag: "Home", link: "/home" },
        { tag: "Bridge", link: "/bridge" },
        { tag: "Market", link: "/market" },
        { tag: "Doc", link: "/doc" },
      ],
    };
  },
  // mounted() {
  //   this.getPBmarketList();
  //   this.getMarketInfo();
  // },
  methods: {
    liclick(link) {
      this.$router.push(link).catch((err) => err); //加catch,在router.push的时候捕获异常，防止重复点击报错
    },
    getPBmarketList: async function () {
      const tSaleList = await allData.getMarketList("PBT");
      this.$store.commit("setPBTSellingLists", tSaleList);
      console.log("PBTSellingLists", tSaleList);
    },
    getBrieflist: async function () {
      // 获取my PBT NFT 简单信息
      const tlist = await allData.getMyList("PBT");
      this.$store.commit("setPBTlists", tlist);
      //获取 matket PBT NFT 简单信息

      console.log("PBT-nft-brief-info ", tlist);
    },
    getMarketInfo: async function () {
      const saleList = await allData.getSaleList("PBT");
      this.$store.commit("setPBTSellingLists", saleList);
      console.log("market detail info=", saleList);
    },
    get_lists: async function () {
      //获取PBT nft 详细信息
      //my list
      const mylist = await allData.getMyTokenList("PBT");
      this.$store.commit("setPBTlists", mylist);

      // My sale list
      const mySaleList = await allData.getMySaleList("PBT");
      this.$store.commit("setPBTMySaleLists", mySaleList);

      console.log("PBT all-Lists", mylist, saleList, mySaleList);

      const oldToken = "0x134315EF3D11eEd8159fD1305af32119a046375A";
      const otBalance = await market.tokenBalance(oldToken);
      const otAllowance = await market.tokenAllowance(oldToken);
      this.$store.commit("setRedeemBalance", otBalance);
      this.$store.commit("setRedeemAllowance", otAllowance);
    },

    connect_wallet: async function () {
      const commit = this.$store.commit;
      const loading = this.$loading({
        lock: true,
        spinner: "el-icon-loading",
        background: "rgba(200,230,200,0.6)",
      });
      try {
        const bsc = await allData.connectW();
        // const obj = this;
        if (bsc) {
          commit("setBaddr", this.$store.state.bsc.addr);
          await this.getBrieflist();
          loading.close();
          await this.getPBmarketList();
          console.log("down");
        }
        await this.getMarketInfo();
        await this.get_lists();
        console.log("downnnnnnnnnnn");
      } catch (e) {
        console.log(e.message);
        this.$message(e.message);
      }
      loading.close();
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.m-logo {
  height: 65px;
  margin-left: 20px;
}
header {
  height: 70px;
  width: 100%;
  background-color: #616161;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
nav {
  display: flex;
}
.navi {
  /* background-color: red; */
  display: flex;
  align-items: center;
}
.navi-content {
  /* background-color: blue; */
  list-style: none;
  display: flex;
  color: #ffffff;
}
li {
  margin: 0 20px;
  cursor: pointer;
}
.linkto {
  width: 180px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  /* background-color: green; */
}
.l-coin {
  height: 32px;
}
.start {
  /* background-color: yellow; */
  margin-right: 30px;
}
</style>
