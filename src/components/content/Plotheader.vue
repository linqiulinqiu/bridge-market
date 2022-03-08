<template>
  <div class="container">
    <el-row type="flex" justify="center">
      <el-col :span="2">
        <img
          style="width: 160px"
          src="../../assets/image/logo_000.png"
          alt="LOGO"
        />
      </el-col>
      <el-col :span="7">
        <h5 style="line-height: 35px">
          version:3/8 4.0 &nbsp;&nbsp;&nbsp;pbwallet:#0.2.10
        </h5>
      </el-col>
      <el-col class="nav" :span="8">
        <ul>
          <li
            class="nav-item"
            v-for="(item, index) in this.nav"
            :key="index"
            @click="liclick(item.link, index)"
          >
            {{ item.tag }}
          </li>
        </ul>
      </el-col>
      <el-col :span="4">
        <el-button v-if="!baddr" @click="connect_wallet" class="connect"
          >Connect Wallet</el-button
        >
        <span v-else style="color: #fff" class="baddr font">{{
          baddr.substr(0, 6) + "..." + baddr.substr(-4, 4)
        }}</span>
      </el-col>
      <el-col :span="4">
        <el-select v-model="lang">
          <el-option
            v-for="item in langs"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
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
    },
  },
  data() {
    return {
      langs: [
        { value: "en", label: "English" },
        { value: "zh", label: "简体中文" },
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
  methods: {
    liclick(link, index) {
      console.log("link", link);
      let arr = document.getElementsByClassName("nav-item");
      let array = Array.from(arr);
      array.forEach((element) => {
        element.classList.remove("active");
      });
      array[index].classList.add("active");
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
      console.log("PBT-nft-brief-info ", tlist, tSaleList);
      return "ok";
    },
    get_lists: async function () {
      //获取PBT nft 详细信息
      //my list
      const mylist = await allData.getMyTokenList("PBT");
      const saleList = await allData.getSaleList("PBT");
      const slist = saleList;
      const slistKeys = Object.keys(slist);
      const msList = {};
      for (let i = 0; i < slistKeys.length; i++) {
        if (slist[slistKeys[i]].market.seller == "-self") {
          const key = slist[slistKeys[i]].id.toString();
          msList[key] = slist[slistKeys[i]];
          this.$store.commit("setPBTMySaleLists", msList);
        }
      }
      // My sale list
      console.log("PBT all-Lists", mylist, saleList, msList);
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
      if (bsc) {
        commit("setBaddr", this.$store.state.bsc.addr);
        await this.getBrieflist();
      }
      await this.get_lists();
      console.log("downnnnnnnnnnn");
      // } catch (e) {
      //   console.log(e.message);
      //   this.$message(e.message);
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
.el-col,
.el-option {
  color: #38f2af;
}
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  color: #38f2af;
}
.el-select-dropdown__item {
  color: black;
}
.connect {
  background-color: #38f2af;
  color: #000000;
  width: 180px;
  font-size: 22px;
  cursor: pointer;
  box-shadow: 0px 2px 2px 0px rgba(56, 242, 175, 0.08);
}
.baddr {
  color: #38f2af;
  width: 180px;
  font-size: 22px;
  display: inline-block;
}
li {
  float: left;
  color: #fff;
  margin: 0 20px;
  cursor: pointer;
  float: left;
}
.active {
  color: #38f2af;
  border-bottom: 3px solid #38f2af;
}
</style>
