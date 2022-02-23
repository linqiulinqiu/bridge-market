<template>
  <div class="container">
    <div class="logo">PlotBridge</div>
    <div class="nav">
      <ul>
        <li class="nav-item" v-for="(item, index) in this.nav" :key="index" @click="liclick(item.link,index)">{{item.tag}}</li>
      </ul>
    </div>
    <div class="connect">connect</div>
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
    liclick(link,index) {
      let arr = document.getElementsByClassName('nav-item')
      let array = Array.from(arr)
      array.forEach(element =>{
        element.classList.remove('active')
      });
      array[index].classList.add('active')
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
      const bsc = await allData.connectW();
      // const obj = this;
      if (bsc) {
        commit("setBaddr", this.$store.state.bsc.addr);
        // const msg = await this.getBrieflist();

        await this.getBrieflist();

        // loading.close();
        // await this.getPBmarketList();
        console.log("down");
      }
      // await this.getMarketInfo();
      // const suc = await this.get_lists();
      await this.get_lists();
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
.container {
  display: flex;
  align-items: center;
}
.logo {
  cursor: pointer;
  font-weight: 500;
  font-size: 18px;
  line-height: 70px;
  color: #38F2AF;
  flex: 2;
}
.connect{
  background-color: #38F2AF;
  color: #000000;
  height: 33px;
  width: 132px;
  line-height: 33px;
  flex:1;
  border-radius: 4px;
  margin-right: 30px;
  cursor: pointer;
  box-shadow: 0px 2px 2px 0px rgba(56, 242, 175, 0.08);
}
.nav {
  flex:7;
}
.nav ul {
  height: 70px;
  display: flex;
  list-style: none;
  justify-content: flex-start;
  
}
li {
  color: #ffffff;
  margin:0 20px;
  cursor: pointer;
}
.active {
  color: #38F2AF;
  border-bottom:3px solid #38F2AF;
}
</style>
