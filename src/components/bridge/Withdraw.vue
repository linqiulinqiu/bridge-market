<template>
  <el-col id="withdraw">
    <el-col v-if="this.hasPbxs">
      <el-col v-if="this.withdrawAddr">
        <el-col>
          <p v-if="withdrawBinded > 1">
            {{
              $t("bind-waddr-tips", {
                wbind: this.withdrawBinded,
                ubind: this.withdrawBinded - 1,
              })
            }}
          </p>
          <p>
            <span>{{ $t("w-addr", { bcoin: bcoin }) }} :</span> <br />
            <span class="tips">
              {{ $t("correct-addr") }}
            </span>
          </p>
          <el-col class="follow">
            <span class="font">
              {{ this.withdrawAddr }}
            </span>
            <el-button
              style="float: right"
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="bind_dialog = true"
            ></el-button>
          </el-col>
          <el-col>
            <el-col id="burn-amount">
              {{ $t("burn") }} :
              <el-input
                v-model.trim="wAmount"
                class="amount-input"
                clearable
                maxlength="20"
                suffix-icon="el-icon-edit"
              ></el-input>
              <el-button
                type="primary"
                size="small"
                @click="wAmount = WBalance[bcoin]"
                >{{ $t("all") }}
              </el-button>
              W{{ bcoin }}，
              <el-button
                type="primary"
                :loading="w_loading"
                :disabled="w_disabled"
                @click="withdraw"
                >{{ $t("withdraw") }}
              </el-button>
            </el-col>
            <el-col>
              <p>
                {{ $t("get") }}
                <span class="get-amount">
                  <span v-if="this.wAmount != ''">
                    {{ getwAmount }}
                  </span>
                </span>
                {{ bcoin }}
              </p>
              <p v-if="this.tips_amount" class="minifont">
                <i v-if="this.wAmount.length > 0">{{ this.tips_amount }}</i>
              </p>
            </el-col>
          </el-col>
        </el-col>
      </el-col>
      <el-col v-else>
        <el-col v-if="this.withdrawBinded > 0">
          <el-col style="margin-top: 20px">
            <p>
              <span class="minifont">
                {{ $t("tips-waddr") }}
              </span>
            </p>
          </el-col>
        </el-col>
        <el-col v-else>
          <p>
            {{ $t("input-addr") }}
            <span style="font-size: 10px"> ({{ $t("correct-addr") }}) </span>
          </p>
          <el-input
            type="text"
            v-model.trim="wAddr"
            clearable
            suffix-icon="el-icon-edit"
            :placeholder="this.$t('bind-waddr')"
          ></el-input>
          <el-button
            type="primary"
            @click="bindWaddr"
            :loading="bind_loading"
            >{{ $t("bind") }}</el-button
          >
        </el-col>
      </el-col>
    </el-col>
    <el-col v-else>
      {{ $t("data") }}。。。
      <el-skeleton :rows="5" animated></el-skeleton>
    </el-col>

    <el-dialog :title="this.$t('bind-waddr')" :visible.sync="bind_dialog">
      <el-card>
        <p>
          {{ $t("input-addr") }}
          <span style="font-size: 10px"> ({{ $t("correct-addr") }}) </span>
          <el-button
            style="float: right"
            icon="el-icon-delete"
            @click="clearAddr"
            size="small"
            :loading="clear_loading"
          >
            {{ $t("clear-waddr") }}
          </el-button>
        </p>
        <el-col class="bindWaddr">
          <el-input
            type="text"
            v-model.trim="wAddr"
            clearable
            suffix-icon="el-icon-edit"
          ></el-input>
          <el-button type="primary" @click="bindWaddr" :loading="bind_loading">
            {{ $t("bind-waddr") }}
          </el-button>
          <el-button @click="bind_dialog = false">{{ $t("cancel") }}</el-button>
        </el-col>
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
      const cointy = this.current.coinType;
      if (pbxs == undefined) {
        return false;
      } else if (cointy in pbxs && pbxs[cointy]["withdrawAddr"]) {
        return pbxs[cointy]["withdrawAddr"];
      }
      return false;
    },
    withdrawBinded(state) {
      let pbts = state.myList;
      const coinType = state.current.coinType;
      let binded = 0;
      for (let i in pbts) {
        const item = pbts[i];
        if ("pbxs" in item) {
          if (item.pbxs && coinType in item.pbxs) {
            if ("withdrawAddr" in item.pbxs[coinType]) {
              if (item.pbxs[coinType].withdrawAddr) binded++;
            }
          }
        }
      }
      return binded;
    },
    hasPbxs() {
      const pbxs = this.curNFT && "pbxs" in this.curNFT;
      return pbxs;
    },
  }),
  data() {
    return {
      hasPbx: false,
      w_disabled: true,
      w_loading: false,
      clear_loading: false,
      bind_loading: false,
      wAmount: "",
      getwAmount: "",
      tips_amount: false,
      wAddr: "",
      bind_dialog: false,
    };
  },
  watch: {
    curNFT: function (nft, old) {
      // this.hasPbxs = nft && "pbxs" in nft;
    },
    bcoin: async function () {
      this.wAmount = "";
      this.getwAmount = "";
    },
    withdrawAddr: function (newV) {
      return newV;
    },
    wAmount: async function () {
      var wamount = this.wAmount;
      console.log("wamount", this.bcoin, wamount);
      if (!wamount || isNaN(wamount) || wamount == "") {
        wamount = "0";
        console.log(wamount);
        this.tips_amount = this.$t("correct-amount");
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
      const cointy = this.current.coinType;
      const id = this.current.pbtId;
      console.log("pbtd", id);
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
      const cointy = this.current.coinType;
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
          this.$message(this.$t("correct-amount"));
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
<style>
#withdraw {
  font-size: 20px;
}
#withdraw .get-amount {
  line-height: 10px;
}
#burn-amount .el-input__inner {
  background: #373943;
  border: none;
  box-sizing: border-box;
  color: #38f2af;
  border-radius: 10px;
}
#burn-amount .el-input {
  margin: 0px 10px;
  color: #fff;
}
.tips {
  font-size: 14px;
}
.bindWaddr {
  margin: 20px 0px;
  text-align: center;
}
.bindWaddr button {
  margin: 20px 0px 0px 0px;
}
</style>