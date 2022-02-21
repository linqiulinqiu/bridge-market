<template>
  <el-col id="withdraw">
    <el-col>
      取款{{ mcoin }} 将会发送到以下地址 : <br />
      请确认取款地址是自己钱包的收款地址，并且确认地址是正确的。
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
        <span>请先绑定一个关于{{ mcoin }}的钱包取款地址</span>
      </p>
      <p>
        <el-input v-model.number="wAmount" class="amount-input"></el-input>
        <el-button>全部</el-button>
        你将会收到 <span> {{ getwAmount }}</span
        >{{ mcoin }}币
      </p>
      <el-col>
        <el-button>取款</el-button>
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
      wAmount: 0,
      getwAmount: 0,
      wAddr: "",
    };
  },
  methods: {},
};
</script>