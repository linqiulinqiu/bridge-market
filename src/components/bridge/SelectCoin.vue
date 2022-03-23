<template>
  <el-col id="selectCoin">
    <p>{{ $t("select-coin") }}</p>
    <ul>
      <li
        v-for="item in this.coinMap"
        :key="item.symbol"
        @click="changeCoin(item)"
        class="coinTypes"
        :class="{ isselect: item.symbol == addclass }"
      >
        {{ item.name }}
      </li>
    </ul>
  </el-col>
</template>
<script>
import { mapState } from "vuex";
import pbwallet from "pbwallet";
export default {
  computed: mapState({
    bcoin: "bcoin",
  }),
  data() {
    const coinMap = [];
    for (let i = 1; i <= 3; i++) {
      coinMap.push(pbwallet.wcoin_info(i));
    }
    return {
      addclass: coinMap[0].symbol,
      coinMap: coinMap,
    };
  },
  methods: {
    changeCoin: function (item) {
      this.addclass = item.symbol;
      this.$store.commit("setCurrentCoinType", item.index);
      this.$store.commit("setBcoin", item.symbol);
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