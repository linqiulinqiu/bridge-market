<template>
  <div class="content">
    <el-container>
      <el-aside width="300px">
        <el-col>
          <el-menu
            :router="true"
            :default-active="this.menuIndex"
            text-color="#fff"
            background-color="#25272e"
            @select="handleSelect"
          >
            <el-menu-item
              v-for="item in this.menuLink"
              :index="item.link"
              :key="item.index"
            >
              <i class="el-icon-document"></i>
              <span slot="title">{{ item.value }}</span>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
function menuItem() {
  const mode = location.hash.substr(1, location.hash.length - 1);
  return mode;
}

export default {
  name: "Doc",
  computed: {
    menuLink() {
      return [
        {
          index: "1",
          link: "/Doc/Introduction",
          value: this.$t("intoduction"),
        },
        {
          index: "2",
          link: "/Doc/RoadMap",
          value: this.$t("road-map"),
        },
        {
          index: "3",
          link: "/Doc/GuideforBridge",
          value: this.$t("guide-bridge"),
        },
        {
          index: "4",
          link: "/Doc/GuideforMarket",
          value: this.$t("guide-market"),
        },
        {
          index: "5",
          link: "/Doc/GuideforWallet",
          value: this.$t("guide-wallet"),
        },
        {
          index: "6",
          link: "/Doc/Contact",
          value: this.$t("contact"),
        },
      ];
    },
  },
  data() {
    return {
      menuIndex: menuItem(),
    };
  },
  methods: {
    handleSelect: function (key, keyPath) {
      this.menuIndex = key;
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
.content {
  display: flex;
  color: #ffffff;
  font-size: 14px;
}
.el-main {
  /* height: calc(100vh); */
  width: 100vw;
}
</style>