<template>
  <el-col id="withdraw" class="tabs">
    <el-col v-if="this.withdrawAddr">
      <el-col>
        <p>
          {{ $t("w-addr", { bcoin: bcoin }) }} : <br />
          <span style="font-size: 10px">
            {{ $t("correct-addr") }}
          </span>
        </p>
        <el-col>
          {{ this.withdrawAddr }}
          <p>
            <el-button
              @click="bind_dialog = true"
              type="primary"
              size="small"
              >{{ $t("change-waddr") }}</el-button
            >
            <el-button
              @click="clearAddr"
              size="small"
              :loading="clear_loading"
              >{{ $t("clear-waddr") }}</el-button
            >
          </p>
        </el-col>
        <el-col>
          <el-col style="height: 45px; margin-top: 10px">
            <p>
              {{ $t("burn") }}
              <el-input
                v-model.trim="wAmount"
                class="amount-input"
                clearable
                maxlength="40"
                suffix-icon="el-icon-edit"
              ></el-input>
              <el-button type="primary" @click="wAmount = WBalance[bcoin]">{{
                $t("all")
              }}</el-button>
              W{{ bcoin }}，
            </p>
          </el-col>
          <el-col style="height: 70px">
            <p>
              {{ $t("get") }}
              <span class="span">
                <span class="font" v-if="this.wAmount != ''">{{
                  getwAmount
                }}</span>
              </span>
              {{ bcoin }}
            </p>
            <p v-if="this.tips_amount" class="minifont">
              <i v-if="this.wAmount.length > 0">{{ this.tips_amount }}</i>
            </p>
          </el-col>
        </el-col>
        <el-col>
          <el-col style="margin-top: 20px">
            <p>
              <span class="minifont">
                {{ $t("tips-waddr") }}
              </span>
            </p>
          </el-col>
        </el-col>
      </el-col>
    </el-col>
    <el-col v-else>
      <p>
        在下面输入你的取款地址：
        <span style="font-size: 10px"> ({{ $t("correct-addr") }}) </span>
      </p>
      <el-input type="text" v-model.trim="wAddr"></el-input>
      <el-button type="primary" @click="bindWaddr" :loading="bind_loading">{{
        $t("bind-waddr")
      }}</el-button>
    </el-col>

    <el-dialog title="绑定取款地址" :visible.sync="bind_dialog">
      <el-card>
        <p>
          在下面输入你的取款地址：
          <span style="font-size: 10px"> ({{ $t("correct-addr") }}) </span>
        </p>
        <el-input type="text" v-model.trim="wAddr"></el-input>
        <el-button type="primary" @click="bindWaddr" :loading="bind_loading">{{
          $t("bind-waddr")
        }}</el-button>
        <el-button @click="bind_dialog = false">{{ $t("cancel") }}</el-button>
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
  props: ["curNFT"],
  computed: mapState({
    baddr: "baddr",
    bcoin: "bcoin",
    WBalance: "WBalance",
    current: "current",
    withdrawAddr(state) {
      const pbxs = this.curNFT.pbxs;
      const cointy = this.coinMap[state.bcoin];
      if (pbxs == undefined) {
        return false;
      } else if (cointy in pbxs && pbxs[cointy]["withdrawAddr"]) {
        return pbxs[cointy]["withdrawAddr"];
      }
      return false;
    },
  }),
  data() {
    return {
      w_disabled: true,
      w_loading: false,
      clear_loading: false,
      bind_loading: false,
      wAmount: "",
      getwAmount: "",
      tips_amount: false,
      wAddr: "",
      bind_dialog: false,
      coinMap: {
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
        this.w_disabled = true;

        this.getwAmount = "";
        this.tips_amount = this.$t("tips-amount1");
      } else if (after_fee == "fund") {
        this.w_disabled = true;
        this.getwAmount = "";
        this.tips_amount = this.$t("tips-amount2");
      } else {
        this.getwAmount = after_fee;
        this.tips_amount = false;
        this.w_disabled = false;
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
      this.w_loading = true;
      const amount = this.wAmount;
      const coin = this.bcoin;
      if (await this.amount_valid(this.wAmount)) {
        try {
          const obj = this;
          const res = await market.burnWcoin(amount, coin);
          await market.waitEventDone(res, async function (evt) {
            obj.w_loading = false;
          });
        } catch (e) {
          console.log("withdraw errrr", e.message);
          this.w_loading = false;
        }
      }
    },
    clearAddr: async function () {
      this.clear_loading = true;
      const cointy = this.coinMap[this.bcoin];
      const id = this.current.pbtId;
      const obj = this;
      try {
        const res = await market.clearAddr(id, cointy);
        console.log("clearAddr", res);
        await market.waitEventDone(res, async function (evt) {
          obj.clear_loading = false;
        });
      } catch (e) {
        this.clear_loading = false;
        console.log("clear Withdraw Addr err", e.message);
      }
    },
    bindWaddr: async function () {
      this.bind_loading = true;
      const cointy = this.coinMap[this.bcoin];
      const id = this.current.pbtId;
      const addr = this.wAddr.toString();
      const obj = this;
      try {
        let rebind = false;
        if (this.withdrawAddr != false) {
          rebind = true;
        }
        console.log(" bindaddr params", addr, id, cointy, rebind);
        const res = await market.bindAddr(addr, id, cointy, rebind);
        console.log("bindWaddr", res, rebind);
        if (res == false) {
          this.bind_loading = false;
          this.$message("请输入正确的取款地址");
        }
        // await market.waitEventDone(res, async function (evt) {
        obj.bind_loading = false;
        // });
      } catch (e) {
        this.bind_loading = false;
        console.log("bind withdraw addr err", e.message);
      }
    },
  },
};
</script>