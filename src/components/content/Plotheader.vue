<template>
  <div>
    <header>
      <div class="logo">
        <img class="m-logo" src="../../assets/image/big-logo.svg" alt="LOGO" />
      </div>
      <el-col :span="8"
        ><p style="line-height: 15px">
          version: 2/28 3.0 pbwallet:#0.1.6
        </p></el-col
      >
      <el-col :span="8">
        <el-select v-model="lang">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="8"
        ><div class="navi">
          <ul class="navi-content">
            <li
              v-for="(item, index) in this.nav"
              :key="index"
              @click="liclick(item.link)"
            >
              {{ item.tag }}
            </li>
          </ul>
        </div></el-col
      >
      <el-col :span="2"
        ><div class="linkto">
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
          /></a></div
      ></el-col>
      <el-col :span="2">
        <nav>
          <div class="start">
            <el-button
              v-if="!baddr"
              type="primary"
              @click="connect_wallet"
              id="start"
              >start</el-button
            >
            <span v-else>{{
              baddr.substr(0, 6) + "..." + baddr.substr(-4, 4)
            }}</span>
          </div>
        </nav>
      </el-col>
    </header>
  </div>
</template>

<script>
import { mapState } from "vuex";
import market from "../../market";
import allData from "../../getAllData";
import { i18n, setup } from "../../locales";

export default {
  name: "Plotheader",
  computed: mapState({
    baddr: "baddr",
    PBTlists: "PBTlists",
    PBTSellingLists: "PBTSellingLists",
    mode: "mode",
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
    lang: function () {
      setup(this.lang);
      console.log(this.lang, setup(this.lang));
    },
    nav: function () {
      console.log(this.nav);
      return this.nav;
    },
    deep: true,
  },
  data() {
    return {
      options: [
        {
          value: "en",
          label: "English",
        },
        {
          value: "zh",
          label: "简体中文",
        },
      ],
      lang: i18n.locale,
      nav: [
        { tag: "Home", link: "/home" },
        { tag: this.$t("bridge"), link: "/bridge" },
        { tag: this.$t("market"), link: "/market" },
        { tag: "Doc", link: "/doc" },
      ],
    };
  },
  mounted() {
    // const start = document.querySelector("#statrt");
    // start.addEventListener("keydown", async function (e) {
    //   if (e.keyCode == "13") {
    //     console.log("按下了回车键", this, AppVue);
    //     await this.connect_wallet();
    //   }
    // });
  },
  methods: {
    liclick(link) {
      const curMode = link.toString().substr(1);
      this.$store.commit("setMode", curMode);
      this.$router.push(link).catch((err) => err); //加catch,在router.push的时候捕获异常，防止重复点击报错
    },
    getBrieflist: async function () {
      // 获取my PBT NFT 简单信息
      const tlist = await allData.getMyList("PBT");
      this.$store.commit("setPBTlists", tlist);
      //获取 matket PBT NFT 简单信息
      const tSaleList = await allData.getMarketList("PBT");
      this.$store.commit("setPBTSellingLists", tSaleList);
      // console.log("PBTSellingLists", tSaleList);
      console.log("PBT-nft-brief-info ", tlist, tSaleList);
      return "ok";
    },
    get_lists: async function () {
      //获取PBT nft 详细信息
      //my list
      const mylist = await allData.getMyTokenList("PBT");
      this.$store.commit("setPBTlists", mylist);
      // const obj = this;
      const saleList = await allData.getSaleList("PBT");
      // const mySaleList = await allData.getMySaleList("PBT");
      this.$store.commit("setPBTSellingLists", saleList);
      const slist = saleList;
      const slistKeys = Object.keys(slist);
      console.log("slistKeys", saleList, slistKeys);
      const msList = {};
      for (let i = 0; i < slistKeys.length; i++) {
        console.log("12314564");
        if (slist[slistKeys[i]].market.seller == "-self") {
          const key = slist[slistKeys[i]].id.toString();
          msList[key] = slist[slistKeys[i]];
          this.$store.commit("setPBTMySaleLists", msList);
          console.log(
            "mysale 00000000000000000000000000000000000",
            slist[slistKeys[i]],
            msList
          );
        }
      }

      // My sale list
      console.log(
        "PBT all-Lists",
        mylist,
        saleList,
        this.$store.state.mySaleList
      );

      const oldToken = "0x134315EF3D11eEd8159fD1305af32119a046375A";
      const otBalance = await market.tokenBalance(oldToken);
      const otAllowance = await market.tokenAllowance(oldToken);
      this.$store.commit("setRedeemBalance", otBalance);
      this.$store.commit("setRedeemAllowance", otAllowance);
      return "ok";
    },

    connect_wallet: async function () {
      const commit = this.$store.commit;
      // const loading = this.$loading({
      //   lock: true,
      //   spinner: "el-icon-loading",
      //   background: "rgba(200,230,200,0.6)",
      // });
      // try {
      const bsc = await allData.connectW(commit);
      // const obj = this;
      if (bsc) {
        commit("setBaddr", this.$store.state.bsc.addr);
        await this.getBrieflist();
        console.log("down");
      }
      // await this.getMarketInfo();
      // const suc = await this.get_lists();
      // debugger;
      // await this.get_lists();
      // await this.get_lists();
      console.log("downnnnnnnnnnn");
      // } catch (e) {
      // console.log(e.message);
      // this.$message(e.message);
      // }
      // loading.close();
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.logo {
  height: 70px;
}
.m-logo {
  height: 70px;
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
  display: inline-block;
}
.navi-content {
  list-style: none;
  color: #ffffff;
}
li {
  margin: 0 15px;
  cursor: pointer;
  float: left;
}
.linkto {
  width: 180px;
  height: 70px;
  display: flex;
  justify-content: space-evenly;
  /* align-items: center; */
  /* background-color: green; */
}
.l-coin {
  height: 32px;
  margin-top: 18px;
}
.start {
  /* background-color: yellow; */
  margin-left: 30px;
}
</style>
