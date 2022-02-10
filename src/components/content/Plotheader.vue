<template>
  <div>
    <header>
      <div class="logo">
        <img class="m-logo" src="../../assets/image/big-logo.svg" alt="LOGO" />
      </div>
      <el-col><h2>version: 2/10 2.0</h2></el-col>
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
    PBXlists: "PBXlists",
    PBTSellingLists: "PBTSellingLists",
    PBXSellingLists: "PBXSellingLists",
  }),
  watch: {
    PBTlists: function (new_list) {
      this.$store.commit("setPBTlists", new_list);
    },
    deep: true,
    PBXlists: function (newLists) {
      this.$store.commit("setPBXlists", newLists);
    },
    deep: true,
    PBTSellingLists: function (newLists) {
      this.$store.commit("setPBTSellingLists", newLists);
    },
    deep: true,
    PBXSellingLists: function (newLists) {
      this.$store.commit("setPBXSellingLists", newLists);
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
  methods: {
    liclick(link) {
      this.$router.push(link);
    },
    get_lists: async function () {
      const tlist = await allData.getMyTokenList("PBT", this.baddr);
      this.$store.commit("setPBTlists", tlist);

      const xlist = await allData.getMyTokenList("PBX", this.baddr);
      this.$store.commit("setPBXlists", xlist);

      console.log("tlist--xlists", tlist, xlist);
      //market selling list
      const tSaleList = await allData.getSaleList("PBT");
      this.$store.commit("setPBTSellingLists", tSaleList);
      const xSaleList = await allData.getSaleList("PBX");
      this.$store.commit("setPBXSellingLists", xSaleList);
      console.log("saleList", tSaleList, xSaleList);
      //my Sall list
      const tMySaleList = await allData.getMySaleList("PBT");
      this.$store.commit("setPBTMySaleLists", tMySaleList);
      console.log("PBTMySaleLists", tMySaleList);

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
        if (bsc) {
          commit("setBaddr", this.$store.state.bsc.addr);
          await this.get_lists();
          loading.close();
        }
      } catch (e) {
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