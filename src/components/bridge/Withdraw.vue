<template>
  <el-col id="withdraw">
    <el-col>
      Input count of {{ mcoin }} that will be sent to : <br />
      <p>
        <!-- <span v-if="mcoin == 'XCH'">
          <i v-if="curNFT.pbxs['1'].withdrawAddr"></i>
        </span>
        <span v-if="mcoin == 'HDD'">
          <i v-if="curNFT.pbxs['2'].withdrawAddr"></i>
        </span>
        <span v-if="mcoin == 'XCC'">
          <i v-if="curNFT.pbxs['3'].withdrawAddr"></i>
        </span> -->
      </p>
      <p>
        <span>Please bind a withdraw {{ mcoin }} wallet address first</span>
      </p>
      <p>
        <el-input v-model.number="wAmount" class="amount-input"></el-input>
        <el-button>MAX</el-button>
        you will receive <span> {{ getwAmount }}</span
        >{{ mcoin }}coins
      </p>
      <el-col>
        <el-button>Withdraw</el-button>
        <el-button>Change withdraw address</el-button>
      </el-col>
    </el-col>
    <el-col>
      <p>Input a withdraw address below</p>
      <el-input type="text" v-model.trim="wAddr"></el-input>
      <p>
        <el-button type="primary">Bind</el-button>
        <el-button>Cancel</el-button>
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
      wAmount: 0,
      getwAmount: 0,
      wAddr: "",
    };
  },
  methods: {},
};
</script>