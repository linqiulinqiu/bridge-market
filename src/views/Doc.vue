<template>
  <div class="content">
    <el-container>
      <el-aside width="300px">
        <h3>docs title</h3>
        <el-col>
          <el-menu
            :router="true"
            :default-active="this.$route.path"
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
export default {
  name: "Doc",
  computed: {
    menuLink() {
      return [
        {
          index: "1",
          link: "/Introduction",
          value: this.$t("introduction"),
        },
        {
          index: "2",
          link: "/RoadMap",
          value: this.$t("road-map"),
        },
        {
          index: "3",
          link: "/Guidefor",
          value: "Guidefor",
        },
        {
          index: "4",
          link: "/GuideforBridge",
          value: this.$t("guide-bridge"),
        },
        {
          index: "5",
          link: "/GuideforMarket",
          value: this.$t("guide-market"),
        },
        {
          index: "6",
          link: "/GuideforWallet",
          value: this.$t("guide-wallet"),
        },
      ];
    },
    // routerPath() {
    //   return this.$route.meta.guidePath
    //     ? this.$route.meta.jumpPath
    //     : this.$route.path;
    // },
  },
  data() {
    return {
      menuIndex: "1",
    };
  },
  methods: {
    handleSelect: function (key) {
      this.menuIndex = key;
      this.activeColor = key;
      console.log("handleSelect key=", key, typeof key, this.activeColor);
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
.isActive {
  color: #d82048;
}
.content {
  display: flex;
  color: #ffffff;
}
.el-main {
  height: calc(100vh - 70px);
  width: 100vw;
}
</style>