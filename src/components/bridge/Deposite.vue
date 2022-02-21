<template>
  <el-col id="deposite">
    <el-col>
      <p>
        存入:<el-input
          type="text"
          class="amount-input"
          v-model.number="depAmount"
        />{{ mcoin }}币
      </p>
      <p>
        向以下的地址： testtttttttttttttttttttttttttttttttttttttttttt
        <!-- <span v-if="mcoin == 'XCH'">
          <i v-if="curNFT.pbxs['1'].depositAddr"></i>
        </span>
        <span v-if="mcoin == 'HDD'">
          <i v-if="curNFT.pbxs['2'].depositAddr"></i>
        </span>
        <span v-if="mcoin == 'XCC'">
          <i v-if="curNFT.pbxs['3'].depositAddr"></i>
        </span> -->
      </p>
      <p>
        你将会得到<span>{{ getAmount }}</span> W{{ mcoin }}
        币，在你的bsc钱包中。
      </p>
      <p>
        <span>bride fee</span>
      </p>
    </el-col>
    <!-- <el-col><BridgeFee /></el-col> -->
  </el-col>
</template>
<script>
import { mapState } from "vuex";
import market from "../../market";
import BridgeFee from "./BridgeFee.vue";
export default {
  components: {
    BridgeFee,
  },
  computed: mapState({
    baddr: "baddr",
    mcoin: "mcoin",
    curNFT: "curNFT",
  }),
  data() {
    return {
      depAmount: 0,
      getAmount: 0,
    };
  },
  methods: {},
};
</script>