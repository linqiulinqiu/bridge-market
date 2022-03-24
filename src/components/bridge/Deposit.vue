<template>
  <el-col id="deposit" class="tabs">
    <el-col v-if="this.hasPbx">
      <el-col v-if="this.depositAddr">
        <p>
          {{ $t("deposit") }}:<el-input
            type="text"
            clearable
            maxlength="40"
            class="amount-input"
            suffix-icon="el-icon-edit"
            v-model.trim="depAmount"
          />{{ bcoin }}
        </p>
        <span>{{ $t("addr") }} ：</span>
        <el-col class="aa">
          <span class="font">
            {{ this.depositAddr }}
          </span>
          <el-tooltip content="复制到剪切板" placement="right">
            <el-button
              size="mini"
              icon="el-icon-document-copy"
              v-clipboard:copy="this.depositAddr"
              v-clipboard:success="onCopy"
              v-clipboard:error="onError"
            ></el-button>
          </el-tooltip>
        </el-col>
        <el-col>
          <p>
            {{ $t("get")
            }}<span class="span"
              ><span v-if="this.depAmount" class="font">
                {{ getAmount }}</span
              ></span
            >
            w{{ bcoin }}，{{ $t("inbsc") }}。
          </p>
          <p v-if="this.tips_amount">
            <i v-if="this.depAmount.length > 0">{{ this.tips_amount }}</i>
          </p>
        </el-col>
      </el-col>
      <el-col v-else>
        <el-col v-if="this.bAbles[bcoin]">
          <el-button
            type="primary"
            class="getdeposte"
            @click="getDepositAddr"
            :loading="getDep_loading"
            >{{ $t("dep-addr", { bcoin: bcoin }) }}
          </el-button>
        </el-col>
        <el-col v-else>
          <p>{{ $t("getaddr") }}</p>
          <el-col>
            <el-link
              class="a-link"
              icon="el-icon-chat-line-square"
              type="primary"
              href="https://discord.gg/xHC9fBfeVW"
              target="_blank"
            >
              discord
            </el-link>
            <el-link
              class="a-link"
              icon="el-icon-chat-line-square"
              type="primary"
              href="https://t.me/PlotBridge"
              target="_blank"
            >
              telegram
            </el-link>
            <el-link
              class="a-link"
              icon="el-icon-chat-line-square"
              type="primary"
              href="https://twitter.com/plot_bridge"
              target="_blank"
            >
              twitter
            </el-link>
          </el-col>
        </el-col>
      </el-col>
    </el-col>
    <el-col v-else>
      <!-- <el-skeleton :rows="5" animated></el-skeleton> -->
      加载中
    </el-col>
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
    current: "current",
    depositAddr(state) {
      const pbxs = this.curNFT.pbxs;
      const cointy = this.current.coinType;
      if (pbxs == undefined) {
        return false;
      } else if (cointy in pbxs && pbxs[cointy]["depositAddr"]) {
        return pbxs[cointy]["depositAddr"];
      }
      return false;
    },
  }),
  data() {
    return {
      bAbles: {
        XCC: true,
        XCH: true,
        HDD: true,
      },
      depAmount: "",
      getAmount: "",
      tips_amount: false,
      getDep_loading: false,
      hasPbx: false,
    };
  },
  watch: {
    curNFT: function (nft, old) {
      this.hasPbx = nft && "pbxs" in nft;
      console.log("this.curNFT in dep=", nft);
    },
    depositAddr: function (newV) {
      console.log("new dep=", newV);
      return newV;
    },
    deep: true,

    depAmount: async function () {
      var depamount = this.depAmount;
      if (!depamount || isNaN(depamount) || depamount == "") {
        depamount = "0";
        this.tips_amount = this.$t("correct-amount");
        return false;
      }
      const after_fee = await market.afterFee(this.bcoin, "deposit", depamount);
      console.log("aftrerfee", after_fee);
      if (!after_fee) {
        this.getAmount = "0";
        this.tips_amount = this.$t("tips-amount1");
      } else if (after_fee == "fund") {
        this.getAmount = "0";
        this.tips_amount = this.$t("tips-amount1");
      } else {
        this.getAmount = after_fee;
        this.tips_amount = false;
      }
      console.log("aft", after_fee, this.getAmount);
      return after_fee;
    },
  },
  methods: {
    onCopy: function (e) {
      this.$message.success("地址已经复制到剪切板！");
    },
    onError: function (e) {
      this.$message.error("抱歉，复制地址失败。");
    },
    getDepositAddr: async function () {
      this.getDep_loading = true;
      const id = this.current.pbtId;
      const cointy = this.current.coinType;
      try {
        const res = await market.getDepAddr(id, cointy);
        if (res == false) {
          console.log("存款地址没有了");
          this.$message(this.$t("getaddr"));
          this.bAbles[this.bcoin] = false;
        }
        const obj = this;
        await market.waitEventDone(res, async function (evt) {
          obj.getDep_loading = false;
        });
      } catch (e) {
        this.getDep_loading = false;
        console.log("deposit addr errr", e.message);
      }
    },
  },
};
</script>
<style>
.a-link {
  margin: 25px;
}
</style>