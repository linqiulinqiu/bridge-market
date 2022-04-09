<template>
  <el-col id="swapmain">
    <el-col v-if="'addr' in this.bsc">
      <el-col>
        <h3>Simple Swap</h3>
        <p>Trade common tokens (powered by PancakeSwap)</p>
      </el-col>
      <el-col class="swap-input">
        <p>
          From<span class="clearfix" v-if='from_balance'>Balance: {{ this.from_balance }}</span>
        </p>
        <el-input
          v-model="from_amount"
          class="amount-ipt"
          clearable
          maxlength="20"
        ></el-input>
        <el-button v-if="from_balance>0" @click="from_all">{{ $t("all") }}</el-button>
        <el-select v-model="from_coin" placeholder="请选择">
          <el-option
            v-for="w in wlist"
            :key="w.address"
            :label="w.bsymbol"
            :value="w.address"
            :disabled="w.address==to_coin"
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
          To<span class="clearfix" v-if='to_balance'>Balance: {{ this.to_balance }}</span>
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
            :disabled="w.address==from_coin"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col class="swap-btn" v-if="this.to_amount>0">
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
  </el-col>
</template>
<script>
import { ethers } from "ethers";
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
      from_coin: '',
      from_ctr: false,
      swapping: false,
      to_balance: false,
      to_amount: 0,
      to_val: 0,
      to_coin: ''
    };
  },
  watch: {
    from_amount: async function (newa, olda) {
      await this.update_amounts();
    },
    from_coin: async function (newc, oldc) {
      await this.update_balance(true,false);
      await this.update_amounts();
    },
    to_coin: async function (newc, oldc) {
      await this.update_balance(false,true);
      await this.update_amounts()
    },
  },
  methods: {
    order_swap: function () {
      const old_from_coin = this.from_coin;
      this.from_coin = this.to_coin;
      this.to_coin = old_from_coin;
    },
    update_amounts: async function () {
      let to_val = ethers.BigNumber.from(0)
      console.log('update-amounts', this.from_coin, this.to_coin)
      if (this.from_coin!='') {
        this.from_val = await tokens.parse(this.from_coin, this.from_amount);
        console.log('from', this.from_amount, this.from_val)
        if (this.from_coin!='' && this.to_coin!='' && this.from_val.gt(0)){
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
      this.to_val = to_val
      this.to_amount = await tokens.format(this.to_coin, to_val);
      console.log('to-amount-from', this.from_val, this.from_amount)
      console.log('to-amount-to', this.to_val, this.to_amount)
    },
    update_balance: async function (from, to) {
        if(from){
            const from_balance = await tokens.balance(this.from_coin)
            this.from_balance = await tokens.format(this.from_coin, from_balance)
            console.log('update-balance-from', from, from_balance, this.from_balance)
        }
        if(to){
            const to_balance = await tokens.balance(this.to_coin)
            this.to_balance = await tokens.format(this.to_coin, to_balance)
        }
    },
    from_all: function () {
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
      this.wlist = []
      this.wlist.push({
          bsymbol: "BNB",
          address: ethers.constants.AddressZero,
          decimals: 18,
        })
      this.wlist.push({
          bsymbol: "PBP",
          address: this.bsc.ctrs.pbp.address,
          decimals: await this.bsc.ctrs.pbp.decimals(), 
        })
      this.wlist.push({
          bsymbol: "USDT",
          address: this.bsc.ctrs.usdt.address,
          decimals: await this.bsc.ctrs.usdt.decimals(),
        })
      for (let i in wsymbols) {
        this.wlist.push(pbwallet.wcoin_info(wsymbols[i], "bsymbol"));
      }
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
