<template>
  <el-col id="swapmain">
    <el-col v-if="'addr' in this.bsc">
      <el-col>
        <h3>Simple Swap</h3>
        <p>Trade common tokens (powered by PancakeSwap)</p>
      </el-col>
      <el-col class="swap-input">
        <p>
          From<span class="clearfix">Balance: {{ this.from_balance }}</span>
        </p>
        <el-input
          v-model="from_amount"
          class="amount-ipt"
          clearable
          maxlength="20"
        ></el-input>
        <el-select v-model="from_coin" placeholder="请选择">
          <el-option
            v-for="w in this.wraplist"
            :key="w.address"
            :label="w.bsymbol"
            :value="w.address"
            :disabled="w.disabled"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col id="swap-exc">
        <el-button
          circle
          icon="el-icon-bottom"
          size="large"
          @click="change_coin"
          :disabled="change_dis"
        ></el-button>
      </el-col>
      <el-col class="swap-input">
        <p>
          To<span class="clearfix">Balance: {{ this.to_balance }}</span>
        </p>
        <el-input
          v-model="to_amount"
          class="amount-ipt"
          clearable
          maxlength="20"
        ></el-input>
        <el-select v-model="to_coin" placeholder="请选择">
          <el-option
            v-for="w in this.wraplist"
            :key="w.address"
            :label="w.bsymbol"
            :value="w.address"
            :disabled="w.disabled"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col class="swap-btn">
        <ApproveButton
          :bsc="this.bsc"
          :token="this.from_ctr"
          :spender="this.bsc.ctrs.router.address"
          :min-req="this.from_val"
        >
          <el-button @click="all" type="primary">{{ $t("all") }}</el-button>
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
  </el-col>
</template>
<script>
import { ethers } from "ethers";
import { mapState } from "vuex";
import ApproveButton from "./lib/ApproveButton.vue";
import pbwallet from "pbwallet";
import keeper from "pbweb-nftkeeper";
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
  }),
  mounted: function () {
    this.wlist();
    console.log("mounted list", this.wraplist);
  },

  data() {
    return {
      wraplist: [],
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
      dis_f: false,
      dis_to: false,
    };
  },
  watch: {
    bsc: function () {
      this.to_coin = this.bsc.ctrs.pbp.address;
    },
    from_amount: async function (newa, olda) {
      await this.update_amounts(newa);
    },
    from_coin: async function (newc, oldc) {
      await this.update_balance("from");
      await this.update_amounts(this.from_amount);
      for (let i in this.wraplist) {
        this.wraplist[i].disabled = false;
        if (this.wraplist[i].address == newc) {
          this.wraplist[i].disabled = true;
        }
        if (this.wraplist[i] == oldc) {
          this.wraplist[i].disabled = false;
        }
      }
    },
    to_coin: async function (newc, oldc) {
      await this.update_balance("to");
      await this.update_amounts(this.from_amount);
    },
  },
  methods: {
    isDis_from: function (w) {
      console.log("from_w==", w, this.dis_f, this.dis_to);
    },
    isDis_to: function (w) {
      console.log("to_w==", w);
    },
    change_coin: function () {
      const old_from_coin = this.from_coin;
      this.from_coin = this.to_coin;
      this.to_coin = old_from_coin;
      console.log("from=", this.from_coin, "to=", this.to_coin);
    },
    update_amounts: async function () {
      if (ethers.utils.isAddress(this.from_coin)) {
        let newa = this.from_amount;
        if (!newa) {
          newa = "0";
        }
        console.log("from_amount", newa, this.from_coin);
        this.from_val = await keeper.parseToken(this.from_coin, newa);
        if (
          this.from_coin &&
          ethers.utils.isAddress(this.to_coin) &&
          this.from_coin != this.to_coin &&
          this.from_val.gt(0)
        ) {
          try {
            const est = await swap.estimate(
              this.bsc,
              this.from_coin,
              this.to_coin,
              this.from_val
            );
            this.to_val = est;
            this.to_amount = await keeper.formatToken(this.to_coin, est);
          } catch (e) {
            console.log("estimate failed", e);
          }
        }
      }
    },
    update_balance: async function (from_to) {
      let coin = this.from_coin;
      let myaddr = this.bsc.addr;
      if (from_to == "to") {
        coin = this.to_coin;
      }
      const info = {};
      if (coin == ethers.constants.AddressZero) {
        info.ctr = { address: coin };
        info.balance = ethers.utils.formatEther(
          await this.bsc.provider.getBalance(myaddr)
        );
      } else {
        info.ctr = pbwallet.erc20_contract(coin);
        const balance = await info.ctr.balanceOf(myaddr);
        info.balance = await keeper.formatToken(coin, balance);
      }
      if (from_to == "to") {
        this.to_balance = info.balance;
      } else {
        this.from_balance = info.balance;
        this.from_ctr = info.ctr;
      }
    },
    all: function () {
      this.from_amount = this.from_balance;
    },
    swap: async function () {
      this.swapping = true;
      const minreq = this.to_val.sub(this.to_val.div(100));
      console.log(
        "swapping params",
        this.from_coin,
        this.to_coin,
        this.from_val,
        minreq,
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
          await obj.update_balance("from");
          await obj.update_balance("to");
        });
      } catch (e) {
        console.log("err", e);
        this.swapping = false;
      }
    },
    wlist: function () {
      const wsymbols = pbwallet.wcoin_list("bsymbol");
      const wlist = [
        {
          bsymbol: "BNB",
          address: ethers.constants.AddressZero,
          decimals: 18,
        },
        {
          bsymbol: "PBP",
          address: this.bsc.ctrs.pbp.address,
          // decimals: await this.bsc.ctrs.pbp.decimals(), // TODO: should call contract to obtain decimals
        },
        {
          bsymbol: "USDT",
          address: this.bsc.ctrs.usdt.address,
          // decimals: await this.bsc.ctrs.usdt.decimals(),
        },
      ];
      for (let i in wsymbols) {
        wlist.push(pbwallet.wcoin_info(wsymbols[i], "bsymbol"));
      }
      for (let i in wlist) {
        wlist[i]["disabled"] = false;
      }
      console.log("wlist", wlist);
      this.wraplist = wlist;
      return wlist;
    },
  },
};
</script>
<style>
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
