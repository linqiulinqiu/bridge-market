<template>
  <el-col id="withdraw" class="tabs">
    <el-col>
      取款{{ bcoin }} 将会发送到以下地址 : <br />
      <span style="font-size: 10px">
        请确认取款地址是自己钱包的收款地址，并且确认地址是正确的。
      </span>
      <el-col class="aa">
        <p>
          <span v-if="curNFT.pbxs">
            <span v-for="(item, key, index) in curNFT.pbxs" :key="index">
              <span v-if="key == '0'">暂不可用的PBT，绑定PBX后使用</span>
              <span v-else>
                <span v-if="curNFT.pbxs[key].withdrawAddr">
                  <span
                    v-if="
                      curNFT.pbxs[key].withdrawAddr.substr(3, 6) == '1qqqqq'
                    "
                    >未绑定取款地址
                  </span>
                  <span v-else class="font"> {{ item.withdrawAddr }}</span>
                </span>
              </span>
            </span>
          </span>
        </p>
        <p>
          <el-button @click="bind_dialog = true" type="primary" size="small"
            >更改取款地址</el-button
          >
          <el-button @click="clearAddr" size="small">清空取款地址</el-button>
        </p>
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
            <el-button type="primary" circle @click="wAmount = WBalance[bcoin]"
              >全部</el-button
            >
            W{{ bcoin }}币，
          </p>
        </el-col>

        <el-col style="height: 70px">
          <p>
            你将会收到
            <span class="span">
              <span class="font" v-if="this.wAmount != ''">{{
                getwAmount
              }}</span>
            </span>
            {{ bcoin }}币
          </p>
          <p v-if="this.tips_amount" class="minifont">
            <i v-if="this.wAmount.length > 0">{{ this.tips_amount }}</i>
          </p>
        </el-col>
      </el-col>
      <el-col>
        <el-button type="primary" @click="withdraw">取款</el-button>
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
        <el-button type="primary" @click="bindWaddr">Bind</el-button>
        <el-button @click="bind_dialog = false">Cancel</el-button>
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
    WBalance: "WBalance",
  }),
  data() {
    return {
      wAmount: "",
      getwAmount: "",
      tips_amount: false,
      wAddr: "",
      bind_dialog: false,
      cointy: {
        XCC: "3",
        HDD: "2",
        XCH: "1",
      },
    };
  },
  watch: {
    wAmount: async function () {
      var wamount = this.wAmount;
      console.log("wamount", this.bcoin, wamount);
      if (!wamount || isNaN(wamount) || wamount == "") {
        wamount = "0";
        console.log(wamount);
        this.tips_amount = "请输入正确的金额";
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
      const after_fee = await market.afterFee(this.bcoin, "withdraw", wAmount);
      if (!after_fee || isNaN(after_fee) || parseFloat(after_fee) <= 0) {
        return false;
      }
      return true;
    },
    withdraw: async function () {
      const amount = this.wAmount;
      const coin = this.bcoin;
      console.log("bcoin", coin);
      if (await this.amount_valid(this.wAmount)) {
        // try {
        console.log("s");
        const res = await market.burnWcoin(amount, coin);
        console.log("withdraw res", res);
        // } catch (e) {
        //   console.log("withdraw errrr", e.message);
        // }
      }
    },
    clearAddr: async function () {
      console.log("coin", this.bcoin);
      const cointy = this.cointy[this.bcoin];
      const id = this.curNFT.id;
      const res = await market.clearAddr(id, cointy);
      console.log("clearAddr", res);
    },
    bindWaddr: async function () {
      const cointy = this.cointy[this.bcoin];
      const id = this.curNFT.id;
      const addr = this.wAddr.toString();
      const res = await market.bindAddr(addr, id, cointy);
      console.log("bindWaddr", res);
    },
  },
};
</script>