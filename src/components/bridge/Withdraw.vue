<template>
  <el-col id="withdraw" class="tabs">
    <el-col>
      取款{{ mcoin }} 将会发送到以下地址 : <br />
      <span style="font-size: 10px">
        请确认取款地址是自己钱包的收款地址，并且确认地址是正确的。
      </span>
      <el-col class="aa">
        <span v-if="curNFT.pbxs">
          <span v-if="curNFT.pbxs['0']">请绑定一个正确的取款地址</span>
          <span v-else
            ><span v-if="mcoin == 'XCH'">
              <i v-if="curNFT.pbxs['1'].withdrawAddr">{{
                curNFT.pbxs["1"].withdrawAddr
              }}</i>
            </span>
            <span v-if="mcoin == 'HDD'">
              <i v-if="curNFT.pbxs['2'].withdrawAddr">{{
                curNFT.pbxs["2"].withdrawAddr
              }}</i>
            </span>
            <span v-if="mcoin == 'XCC'">
              <i v-if="curNFT.pbxs['3'].withdrawAddr">
                <i v-if="curNFT.pbxs['3'].withdrawAddr == this.zeroAddr">
                  取款地址已清空，请重新绑定
                </i>
                <i v-else>{{ curNFT.pbxs["3"].withdrawAddr }}</i>
              </i>
            </span>
            <span v-else>请先绑定一个关于{{ mcoin }}的钱包取款地址</span></span
          >
        </span>
      </el-col>
      <p>
        烧掉
        <el-input v-model.trim="wAmount" class="amount-input"></el-input>
        <el-button>全部</el-button>WXCC币， 你将会收到
        <span class="span"> {{ getwAmount }}</span
        >{{ mcoin }}币
      </p>
      <el-col>
        <el-button type="primary" @click="withdraw">取款</el-button>
        <el-button @click="bind_dialog = true">更改取款地址</el-button>
        <el-button @click="clearAddr">清空存款地址</el-button>
      </el-col>
    </el-col>
    <el-dialog title="绑定取款地址" :visible.sync="bind_dialog">
      <el-card>
        <p>
          在下面输入你的取款地址：
          <span style="font-size: 10px">
            (请确认取款地址是自己钱包的收款地址，并且确认地址是正确的。)
          </span>
        </p>
        <el-input type="text" v-model.trim="wAddr"></el-input>
        <p>
          <el-button type="primary" @click="bindWaddr">Bind</el-button>
          <el-button @click="bind_dialog = false">Cancel</el-button>
        </p>
      </el-card>
    </el-dialog>
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
      bind_dialog: false,
      zeroAddr:
        "xcc1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqvt9px0",
    };
  },
  methods: {
    withdraw: async function () {
      const amount = this.wAmount;
      try {
        const res = await market.burnWXCC(amount);
        console.log("withdraw res", res);
      } catch (e) {
        console.log("withdraw errrr", e.message);
      }
    },
    clearAddr: async function () {
      console.log("coin", this.mcoin);
      if (this.mcoin == "XCC") {
        const id = this.curNFT.pbxs["3"].id;
        const res = await market.clearAddr(id);
        console.log("clearAddr", res);
      }
    },
    bindWaddr: async function () {
      if (this.mcoin == "XCC") {
        const id = this.curNFT.pbxs["3"].id;
        const addr = this.wAddr.toString();
        const res = await market.bindAddr(addr, id);
        console.log("bindWaddr", res);
      }
    },
  },
};
</script>