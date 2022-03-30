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
        <span v-for="(version,pkg) in versions">
            <p>{{pkg}}-{{version}}</p>
        </span>
      </el-col>
      <!-- <el-col>

      </el-col> -->
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
        <el-button
          v-if="!baddr"
          @click="connect_wallet"
          class="connect"
          :loading="conenct_loading"
          >Connect Wallet</el-button
        >
        <span v-else style="color: #fff" class="baddr font">
          <el-tooltip effect="light" placement="bottom">
            <span slot="content" class="font">bsc钱包地址: {{ baddr }}</span>
            <span class="font">{{
              baddr.substr(0, 6) + "..." + baddr.substr(-4, 4)
            }}</span>
          </el-tooltip>
        </span>
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
import data from "../../data";
import { i18n, setup } from "../../locales";
import store from "../../store";

function versions(){
    const vs = {}
    vs.App = process.env.VUE_APP_MY_VERSION
    const dep = JSON.parse(process.env.VUE_APP_DEP_VERSIONS)
    for(let n in dep){
        const v = dep[n].split('/')
        if(v.length>1){
            const f = v[1].split('#')
            if(f.length>1){
                vs[f[0]] = f[1]
            }
        }
    }
    console.log('vs=', vs)
    return vs
}

export default {
  name: "Plotheader",
  computed: mapState({
    baddr: "baddr",
    myList: "myList",
    marketList: "marketList",
    nav() {
      return [
        { tag: this.$t("home"), link: "/home" },
        { tag: this.$t("bridge"), link: "/bridge" },
        { tag: this.$t("market"), link: "/market" },
        { tag: this.$t("doc"), link: "/doc" },
      ];
    },
  }),
  watch: {
    lang: function () {
      setup(this.lang);
    },
  },
  data() {
    return {
      conenct_loading: false,
      langs: [
        { value: "en", label: "English" },
        { value: "zh", label: "简体中文" },
      ],
      lang: i18n.locale,
      versions: versions()
    };
  },
  methods: {
    liclick(link, index) {
      let arr = document.getElementsByClassName("nav-item");
      let array = Array.from(arr);
      array.forEach((element) => {
        element.classList.remove("active");
      });
      array[index].classList.add("active");
      this.$store.commit("setCurrentPbtId", false);
      this.$router.push(link).catch((err) => err); //加catch,在router.push的时候捕获异常，防止重复点击报错
    },
    connect_wallet: async function () {
      this.conenct_loading = true;
      const commit = this.$store.commit;
      const bsc = await data.connect(commit);
      if (bsc) {
        commit("setBaddr", bsc.addr);
        await data.loadAlllists_brief(store);
        await data.loadAlllists_detail(store);
        const otAllowance = await market.tokenAllowance();
        this.$store.commit("setRedeemAllowance", otAllowance);
        this.conenct_loading = false;
      }
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
