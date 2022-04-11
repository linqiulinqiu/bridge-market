<template>
  <el-col id="swapmain">
    <el-col v-if="'addr' in this.bsc">
      <el-col id="swapTitle">
        <h3>Simple Swap</h3>
        <p>Trade common tokens (powered by PancakeSwap)</p>
        <el-button
          icon="el-icon-setting"
          circle
          size="medium"
          @click="dia_slip = true"
        ></el-button>
      </el-col>
      <el-col class="swap-input">
        <p>
          From<span class="clearfix" v-if="from_balance"
            >Balance: {{ this.from_balance }}</span
          >
        </p>
        <el-input
          v-model="from_amount"
          class="amount-ipt"
          clearable
          maxlength="20"
        >
          <el-button
            slot="append"
            v-if="from_balance > 0"
            type="primary"
            @click="from_all"
            >{{ $t("all") }}</el-button
          >
        </el-input>
        <el-select v-model="from_coin" placeholder="请选择">
          <el-option
            v-for="w in wlist"
            :key="w.address"
            :label="w.bsymbol"
            :value="w.address"
            :disabled="w.address == to_coin"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col id="swap-exc">
        <el-button
          circle
          icon="el-icon-bottom"
          size="large"
          @click="order_swap"
          :disabled="change_dis"
        ></el-button>
      </el-col>
      <el-col class="swap-input">
        <p>
          To<span class="clearfix" v-if="to_balance"
            >Balance: {{ this.to_balance }}</span
          >
        </p>
        <el-input
          v-model="to_amount"
          class="amount-ipt"
          clearable
          maxlength="20"
        ></el-input>
        <el-select v-model="to_coin" placeholder="请选择">
          <el-option
            v-for="w in wlist"
            :key="w.address"
            :label="w.bsymbol"
            :value="w.address"
            :disabled="w.address == from_coin"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col class="swap-btn" v-if="this.to_amount > 0">
        <ApproveButton
          :bsc="this.bsc"
          :token="this.from_coin"
          :spender="this.bsc.ctrs.router.address"
          :min-req="this.from_val"
        >
          <el-button
            v-if="from_coin != to_coin"
            @click="swap"
            :loading="swapping"
            type="primary"
            >{{ $t("swap") }}
          </el-button>
        </ApproveButton>
      </el-col>
    </el-col>
    <el-dialog title="Settings" :visible.sync="dia_slip">
      <el-card id="slipcard">
        <el-col class="cardheader">
          <h3>Slippage tolenrance</h3>
          <el-tooltip effect="light" placement="right-start">
            <span slot="content" class="tooltip">
              Your transation will revert if the price changes unfavorably by
              more than this percentage.
            </span>
            <el-button icon="el-icon-question" circle></el-button>
          </el-tooltip>
        </el-col>
        <el-col v-for="i in this.slippage" :key="i" id="slip-group">
          <el-button
            class="slipbtn"
            @click="slipAmount = i"
            :class="{ isActive: i == slipAmount }"
            >{{ i / 100 }}%
          </el-button>
        </el-col>
        <el-col v-if="transferOK"><p>Your transaction may fail.</p> </el-col>
      </el-card>
    </el-dialog>
  </el-col>
</template>
<script>
import { ethers } from "ethers";
import debounce from "lodash/debounce";
import { mapState } from "vuex";
import ApproveButton from "./lib/ApproveButton.vue";
import pbwallet from "pbwallet";
import tokens from "../tokens";
import swap from "../swap";
import market from "../market";
export default {
  name: "SwapMain",
  components: {
    ApproveButton,
  },
  computed: mapState({
    bsc: "bsc",
    change_dis() {
      if (this.from_coin != "" && this.to_coin != "") {
        return false;
      }
      return true;
    },
    transferOK() {
      if (this.slipAmount == 20) return true;
      return false;
    },
  }),
  mounted: function () {
    this.load_wlist();
  },

  data() {
    return {
      wlist: [],
      from_balance: false,
      from_amount: 0,
      from_val: 0,
      from_coin: "",
      from_ctr: false,
      swapping: false,
      to_balance: false,
      to_amount: 0,
      to_val: 0,
      to_coin: "",
      slipAmount: 100,
      dia_slip: false,
      slippage: [20, 50, 100, 200],
    };
  },
  watch: {
    slipAmount: function (newnum, oldnum) {
      console.log("slip amount ,old = ", oldnum, "newnum = ", newnum);
      this.slipAmount = newnum;
    },
    from_amount: debounce(async function (newa, olda) {
      await this.update_amounts();
    }, 500),
    from_coin: debounce(async function (newc, oldc) {
      await this.update_balance(true, false);
      await this.update_amounts();
    }, 500),
    to_coin: debounce(async function (newc, oldc) {
      await this.update_balance(false, true);
      await this.update_amounts();
    }, 500),
  },
  methods: {
    order_swap: function () {
      const old_from_coin = this.from_coin;
      this.from_coin = this.to_coin;
      this.to_coin = old_from_coin;
    },
    update_amounts: async function () {
      let to_val = ethers.BigNumber.from(0);
      console.log("update-amounts", this.from_coin, this.to_coin);
      if (this.from_coin != "") {
        this.from_val = await tokens.parse(this.from_coin, this.from_amount);
        console.log("from", this.from_amount, this.from_val);
        if (this.from_coin != "" && this.to_coin != "" && this.from_val.gt(0)) {
          try {
            const est = await swap.estimate(
              this.bsc,
              this.from_coin,
              this.to_coin,
              this.from_val
            );
            to_val = est;
          } catch (e) {
            console.log("estimate failed", e);
          }
        }
      }
      this.to_val = to_val;
      this.to_amount = await tokens.format(this.to_coin, to_val);
      console.log("to-amount-from", this.from_val, this.from_amount);
      console.log("to-amount-to", this.to_val, this.to_amount);
    },
    update_balance: async function (from, to) {
      if (from) {
        const from_balance = await tokens.balance(this.from_coin);
        this.from_balance = await tokens.format(this.from_coin, from_balance);
        console.log(
          "update-balance-from",
          from,
          from_balance,
          this.from_balance
        );
      }
      if (to) {
        const to_balance = await tokens.balance(this.to_coin);
        this.to_balance = await tokens.format(this.to_coin, to_balance);
      }
    },
    from_all: function () {
      this.from_amount = this.from_balance;
    },
    swap: async function () {
      this.swapping = true;
      console.log(this.slipAmount / 100, "%");
      const minreq = this.to_val.sub(this.to_val.mul(this.slipAmount).div(100));
      console.log(
        "swapping params",
        this.from_coin,
        this.to_coin,
        this.from_val,
        minreq,
        this.slipAmount,
        120
      );
      const obj = this;
      try {
        const receipt = await swap.swap(
          this.bsc,
          this.from_coin,
          this.to_coin,
          this.from_val,
          minreq,
          120
        );
        console.log("swap", receipt);
        await market.waitEventDone(receipt, async function (evt) {
          console.log("evt", evt);
          obj.swapping = false;
          obj.from_amount = "";
          obj.to_amount = "";
          await obj.update_balance(true, true);
        });
      } catch (e) {
        console.log("err", e);
        this.swapping = false;
      }
    },
    load_wlist: async function () {
      const wsymbols = pbwallet.wcoin_list("bsymbol");
      this.wlist = [];
      this.wlist.push({
        bsymbol: "BNB",
        address: ethers.constants.AddressZero,
        decimals: 18,
      });
      this.wlist.push({
        bsymbol: "PBP",
        address: this.bsc.ctrs.pbp.address,
        decimals: await this.bsc.ctrs.pbp.decimals(),
      });
      this.wlist.push({
        bsymbol: "USDT",
        address: this.bsc.ctrs.usdt.address,
        decimals: await this.bsc.ctrs.usdt.decimals(),
      });
      for (let i in wsymbols) {
        this.wlist.push(pbwallet.wcoin_info(wsymbols[i], "bsymbol"));
      }
    },
  },
};
</script>
<style>
.tooltip {
  font-size: 14px;
}
#slip-group {
  float: left;
  margin-left: 20px;
  width: 80px;
}
#slipcard .el-button {
  color: #fff;
  background: #373943;
  float: left;
  margin-left: 20px;
}
#slipcard {
  padding: 20px 10px;
}
.cardheader .el-button {
  border: none;
  position: relative;
  top: -25px;
  right: -110px;
}
.isActive {
  color: #38f2af !important;
  background: #373943 !important;
}
#swapTitle {
  position: relative;
}
#swapTitle .el-icon-setting {
  color: #38f2af;
  background: #373943;
  font-size: 30px;
}
#swapTitle .el-button {
  background: #373943;
  border: none;
  position: absolute;
  top: 20px;
  right: 20px;
}
.clearfix {
  margin-left: 10px;
}
#swap-exc {
  height: 50px;
  text-align: center;
}
#swap-exc .el-button {
  width: 40px;
  height: 40px;
  margin-top: 17px;
}
#swap-exc .el-button .el-icon-bottom::before {
  display: inline-block;
  font-size: 30px;
}
#swapmain .el-input-group__append {
  color: #fff;
  background: #373943;
}
#swapmain .el-input-group__append:hover {
  color: #38f2af;
}
.amount-ipt.el-input {
  width: 70%;
  margin-right: 5px;
  margin-bottom: 5px;
  min-width: 200px;
}
#swapmain .el-select {
  width: 150px;
}
.swap-input {
  padding: 30px 30px;
  border-radius: 20px;
  margin-top: 25px;
  background-color: rgba(43, 44, 51, 0.3);
}
.swap-btn {
  text-align: center;
  margin: 20px auto;
}
.swap-btn .el-button {
  margin-right: 20px;
  width: 100px;
}
</style>
