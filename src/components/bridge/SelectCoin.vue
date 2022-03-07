<template>
  <el-col id="selectCoin">
    <p>Select CoinTypes</p>
    <ul>
      <li
        v-for="(item, name) in this.coinMap"
        :key="name"
        @click="changeCoin(item, name)"
        class="coinTypes"
        :class="{ isselect: name == addclass }"
      >
        {{ item.label }}
      </li>
    </ul>
  </el-col>
</template>
<script>
import { mapState } from "vuex";
export default {
  computed: mapState({
    bcoin: "bcoin",
  }),
  data() {
    return {
      addclass: 0,
      coinMap: [
        {
          coinTy: "XCC",
          label: "Chives",
        },
        {
          coinTy: "XCH",
          label: "Chia",
        },
        {
          coinTy: "HDD",
          label: "HDDcoin",
        },
      ],
    };
  },
  methods: {
    changeCoin: function (item, name) {
      this.addclass = name;
      const coin = item.coinTy;
      this.$store.commit("setBcoin", coin);
      console.log("coin", this.bcoin, name);
    },
  },
};
</script>
<style>
.isselect {
  background: #668b66;
  color: #51e9a7;
}
</style>