<template>
  <div class="container">
    <el-row type="flex" justify="center">
      <el-col :span="2" id="logo">
        <img
          style="width: 160px"
          src="../../assets/image/logo_000.png"
          alt="LOGO"
        />
      </el-col>
      <el-col :span="7" id="version">
        <p v-for="(version, pkg) in versions" :key="version">
          <span>{{ pkg }}-{{ version }}<br /></span>
        </p>
      </el-col>
      <el-col id="menu" :span="8">
        <el-menu
          :router="true"
          :default-active="this.menuIndex"
          text-color="#fff"
          mode="horizontal"
          background-color="#25272e"
          @select="selectTag"
        >
          <el-menu-item
            v-for="item in this.nav"
            :key="item.link"
            :index="item.link"
            >{{ item.tag }}
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="4" id="connect">
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
      <el-col :span="4" id="changelang">
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

function versions() {
  const vs = {};
  vs.App = process.env.VUE_APP_MY_VERSION;
  const dep = JSON.parse(process.env.VUE_APP_DEP_VERSIONS);
  for (let n in dep) {
    const v = dep[n].split("/");
    if (v.length > 1) {
      const f = v[1].split("#");
      if (f.length > 1) {
        vs[f[0]] = f[1];
      }
    }
  }
  console.log("vs=", vs);
  return vs;
}
function tags() {
  const mode = location.hash.substr(2, location.hash.length - 2);
  const tag = "/" + mode.substr(0, mode.indexOf("/"));
  console.log("mode-tag", mode, tag);
  return tag;
}
export default {
  name: "Plotheader",
  computed: mapState({
    baddr: "baddr",
    myList: "myList",
    marketList: "marketList",
    nav() {
      return [
        { tag: this.$t("home"), link: "/Home" },
        { tag: this.$t("bridge"), link: "/Bridge" },
        { tag: this.$t("market"), link: "/Market" },
        { tag: this.$t("doc"), link: "/Doc" },
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
      versions: versions(),
      menuIndex: tags(),
    };
  },
  methods: {
    selectTag: function (key) {
      this.$store.commit("setCurrentPbtId", false);
      // this.menuIndex = key;
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
.el-select-dropdown__item {
  color: black;
}
#connect,
#logo,
#version,
#changelang {
  height: 90px;
  box-sizing: border-box;
}
#connect .el-button {
  margin-top: 20px;
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
#logo {
  padding-top: 15px;
}
#version {
  line-height: 30px !important;
  padding-left: 50px;
}
#version span {
  display: block;
  float: left;
  margin: 5px 20px 0px;
}
#menu {
  height: 90px;
  box-sizing: border-box;
}
.el-menu {
  height: 90px;
  border: none !important;
  margin-left: 50px;
}
.el-menu--horizontal > .el-menu-item {
  height: 90px;
  font-size: 24px;
  padding: 10px;
  margin-left: 30px;
}
.el-menu--horizontal > .el-menu-item.is-active {
  color: #38f2af !important;
  border-bottom: #38f2af 2px solid !important;
}
</style>
