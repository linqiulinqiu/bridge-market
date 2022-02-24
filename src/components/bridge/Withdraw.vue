<template>
  <el-col id="withdraw" class="tabs">
    <el-col>
      取款{{ bcoin }} 将会发送到以下地址 : <br />
      <span style="font-size: 10px">
        请确认取款地址是自己钱包的收款地址，并且确认地址是正确的。
      </span>
      <el-col class="aa">
        <span v-if="curNFT.pbxs">
          <span v-if="curNFT.pbxs['0']">请绑定一个正确的取款地址</span>
          <span v-else
            ><span v-if="bcoin == 'XCH'">
              <i v-if="curNFT.pbxs['1'].withdrawAddr">{{
                curNFT.pbxs["1"].withdrawAddr
              }}</i>
            </span>
            <span v-if="bcoin == 'HDD'">
              <i v-if="curNFT.pbxs['2'].withdrawAddr">{{
                curNFT.pbxs["2"].withdrawAddr
              }}</i>
            </span>
            <span v-if="bcoin == 'XCC'">
              <i v-if="curNFT.pbxs['3'].withdrawAddr">
                <i v-if="curNFT.pbxs['3'].withdrawAddr == this.zeroAddr">
                  取款地址已清空，请重新绑定
                </i>
                <i v-else>{{ curNFT.pbxs["3"].withdrawAddr }}</i>
              </i>
            </span>
            <span v-else>请先绑定一个关于{{ bcoin }}的钱包取款地址</span></span
          >
        </span>
      </el-col>
      <el-col>
        <el-col style="height: 45px; margin-top: 10px">
          <p>
            烧掉
            <el-input
              v-model.trim="wAmount"
              class="amount-input"
              clearable
              maxlength="40"
              suffix-icon="el-icon-edit"
            ></el-input>
            <el-button type="primary" size="mini" circle>全部</el-button>
            WXCC币，
          </p>
        </el-col>

        <el-col style="height: 70px">
          <p>
            你将会收到 <span class="span"> {{ getwAmount }}</span> {{ bcoin }}币
          </p>
          <p v-if="this.tips_amount" class="minifont">
            <i v-if="wAmount.length > 0">{{ this.tips_amount }}</i>
          </p>
        </el-col>
      </el-col>
      <el-col>
        <el-button type="primary" @click="withdraw">取款</el-button>
        <el-button @click="bind_dialog = true">更改取款地址</el-button>
        <el-button @click="clearAddr">清空存款地址</el-button>
      </el-col>
      <el-col style="margin-top: 20px">
        <p>
          <span class="minifont">
            一个账户绑定多个钱包的多个地址时，钱款可能随机发送到其中一个钱包中，请注意查收
          </span>
        </p>
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
    bcoin: "bcoin",
    curNFT: "curNFT",
  }),
  data() {
    return {
      wAmount: "",
      getwAmount: "",
      tips_amount: false,
      wAddr: "",
      bind_dialog: false,
      zeroAddr:
        "xcc1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqvt9px0",
    };
  },
  watch: {
    wAmount: async function () {
      var wamount = this.wAmount;
      console.log("wamount", this.bcoin, wamount);
      if (!wamount || isNaN(wamount) || wamount == "") {
        wamount = "0";
        return false;
      }
      const after_fee = await market.afterFee(this.bcoin, "withdraw", wamount);
      console.log("afterfee", after_fee);
      if (!after_fee) {
        this.getwAmount = "";
        this.tips_amount = "数额过少，将什么都收不到呢！";
      } else if (after_fee == "fund") {
        this.getwAmount = "";
        this.tips_amount = "数额过大，余额不够呢！";
      } else {
        this.getwAmount = after_fee;
        this.tips_amount = false;
      }
      return after_fee;
    },
  },
  methods: {
    amount_valid: async function (wAmount) {
      if (!wAmount || isNaN(wAmount)) {
        return false;
      }
      //amount = parseFloat(amount) // TODO: convert to bignum later
      const after_fee = await market.afterFee(this.bcoin, "withdraw", wAmount);
      // console.log("after_fee", after_fee);
      if (!after_fee || isNaN(after_fee) || parseFloat(after_fee) <= 0) {
        return false;
      }
      return true;
    },
    withdraw: async function () {
      const amount = this.wAmount;
      // const btn = this;
      const coin = this.bcoin;
      console.log("bcoin", coin);
      if (await this.amount_valid(this.wAmount)) {
        try {
          const res = await market.burnWXCC(amount, coin);
          console.log("withdraw res", res);
        } catch (e) {
          console.log("withdraw errrr", e.message);
        }
      }
    },
    clearAddr: async function () {
      console.log("coin", this.bcoin);
      if (this.bcoin == "XCC") {
        const id = this.curNFT.pbxs["3"].id;
        const res = await market.clearAddr(id);
        console.log("clearAddr", res);
      }
    },
    bindWaddr: async function () {
      if (this.bcoin == "XCC") {
        const id = this.curNFT.pbxs["3"].id;
        const addr = this.wAddr.toString();
        const res = await market.bindAddr(addr, id);
        console.log("bindWaddr", res);
      }
    },
  },
};
</script>