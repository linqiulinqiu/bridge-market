<template>
  <div class="content">
    <el-container>
      <el-aside width="300px">
        <h3>docs title</h3>
        <el-col>
          <el-menu
            v-for="item in this.menuLink"
            :key="item.index"
            :router="true"
            :default-active="activeIndex"
            text-color="#fff"
            background-color="#25272e"
            @select="handleSelect"
          >
            <el-menu-item :index="item.link">
              <i class="el-icon-document"></i>
              <span slot="title">{{ item.value }}</span>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-aside>
      <el-main>
        <router-view></router-view>
        <!-- <el-col>
          <el-col v-if="this.menuIndex == '1'"><Introduction /></el-col>
          <el-col v-else-if="this.menuIndex == '2'"><RoadMap /></el-col>
          <el-col v-else-if="this.menuIndex == '3'"><GuideforMarket /></el-col>
          <el-col v-else-if="this.menuIndex == '4'"><GuideforWallet /></el-col>
          <el-col v-else-if="this.menuIndex == '5'"><GuideforBridge /></el-col>
          <el-col v-else-if="this.menuIndex == '6'"><Guidefor /></el-col>
        </el-col> -->
      </el-main>
    </el-container>
  </div>
</template>

<script>

export default {
  name: "Doc",
  computed: {},
  data() {
    return {
      activeIndex: "/Introduction",
      menuIndex: "1",
      menuLink: [
        {
          index: "1",
          link: "/Introduction",
          value: "Introduction",
        },
        {
          index: "2",
          link: "/RoadMap",
          value: "RoadMap",
        },
        {
          index: "3",
          link: "/Guidefor",
          value: "Guidefor",
        },
        {
          index: "4",
          link: "/GuideforBridge",
          value: "GuideforBridge",
        },
        {
          index: "5",
          link: "/GuideforMarket",
          value: "GuideforMarket",
        },
        {
          index: "6",
          link: "/GuideforWallet",
          value: "GuideforWallet",
        },
      ],
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