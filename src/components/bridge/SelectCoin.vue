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
      addclass: "",
      coinMap: coinMap,
    };
  },
  methods: {
    changeCoin: function (item) {
      this.addclass = item.symbol;
      this.$store.commit("setCurrentCoinType", item.index);
    },
  },
};
</script>
<style>
#selectCoin {
  padding: 20px 5px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}
#selectCoin > p {
  color: #fff;
}
.isselect {
  border: #38f2af 1px solid !important;
  color: #38f2af;
}
.coinTypes {
  width: 96%;
  height: 50px;
  text-align: center;
  line-height: 50px;
  border-radius: 5px;
  border: #668b66 1px solid;
  margin: 10px auto;
  cursor: pointer;
}
</style>