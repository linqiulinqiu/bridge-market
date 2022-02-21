<template>
  <el-col id="deposite">
    <el-col>
      <p>
        Deposit:<el-input type="text" class="amount-input" v-model.number="depAmount" />{{
          mcoin
        }}coins
      </p>
      <p>
        to the address below: addr :
        testtttttttttttttttttttttttttttttttttttttttttt
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
        You will get <span>{{ getAmount }}</span> W{{ mcoin }} coins on your BSC
        wallet
      </p>
      <p>
        <span>bride fee</span>
      </p>
    </el-col>
  </el-col>
</template>
<script>
import { mapState } from "vuex";
import market from "../../market";
export default {
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