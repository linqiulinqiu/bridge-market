<template>
  <el-row type="flex" justify="center">
    <!-- <el-col v-if="curNFT && curNFT.mata"> -->
    <el-col :span="10">
      <img :src="curNFT.meta.image" alt="Img" />
      <p>id:#{{ curNFT.id }}</p>
      <el-col v-if="curNFT.market">
        <el-col v-if="curNFT.market.seller == '-self'">
          <p v-if="curNFT.market.price">
            {{ $t("price") }}<span>{{ curNFT.market.price }}&nbsp;</span>
            <span>{{ curNFT.market.ptName }}</span>
          </p>
          <p v-if="curNFT.market.desc != ''">
            {{ $t("desc") }}{{ curNFT.market.desc }}
          </p>
          <p v-else>No Description</p>
        </el-col></el-col
      >
      <p>
        {{ $t("function") }}:
        <span v-if="curNFT.pbxs">
          <span v-if="Object.keys(curNFT.pbxs).includes('3')">
            Bridge for Chives
          </span>
          <span v-if="Object.keys(curNFT.pbxs).includes('2')">
            Bridge for HDDcoin
          </span>
          <span v-if="Object.keys(curNFT.pbxs).includes('1')"
            >Bridge for Chia</span
          >
        </span>
        <span v-else> no bind bridge </span>
      </p>
    </el-col>
    <el-col v-if="curNFT.market" :span="13">
      <!-- My sale nft info -->
      <!-- <el-col v-if="curNFT.market.seller"> -->
      <el-col v-if="curNFT.market.seller == '-self'">
        <el-col>
          <p>
            <span>Change price to:</span>
            <el-input v-model="nftPrice" placeholder="input price"></el-input>
            <el-select v-model="priceToken" class="selecToken">
              <el-option value="BNB" key="BNB" label="BNB"></el-option>
              <el-option value="BUSD" key="BUSD" label="BUSD"></el-option>
            </el-select>
          </p>
          <el-button @click="sellNFT">{{ $t("change-price") }}</el-button>
        </el-col>
        <el-col>--- {{ $t("or") }} ---</el-col>
        <el-col>
          <el-button @click="retreatNFT"> retreat from market </el-button>
        </el-col>
      </el-col>
      <!-- market NFT info Not mine -->
      <el-col v-if="curNFT.market.seller == ''">
        <el-col>
          <p>
            The price :
            <span v-if="curNFT.market.price"
              >{{ curNFT.market.price }}&nbsp;</span
            >
            <span v-if="curNFT.market.ptName">{{ curNFT.market.ptName }}</span>
          </p>
          <p>
            Description:
            <span v-if="curNFT.market.desc">{{ curNFT.market.desc }}</span>
          </p>
          <p>
            Function:
            <span v-if="curNFT.pbxs">
              <span
                v-for="(item, index) in Object.keys(curNFT.pbxs)"
                :key="index"
              >
                <span v-if="item == '3'"> Bridge for Chives </span>
                <span v-if="item == '2'"> Bridge for HDDcoin </span>
                <span v-if="item == '1'">Bridge for Chia</span>
              </span>
            </span>
            <span v-else> no bind bridge </span>
          </p>
          <el-col>
            <el-button @click="buyNFT"> Buy It </el-button>
          </el-col>
        </el-col>
      </el-col>
      <!-- </el-col> -->
    </el-col>
    <!-- My NFT not sale -->
    <el-col v-else :span="13">
      <h2>售卖此NFT</h2>
      <h3>1、发送到市场</h3>
      <h3>
        2、设置价格、描述
        <span class="minifont"
          >你可以在此处设置，也可以在市场位置设置更改价格等</span
        >
      </h3>
      <p>
        <label for="price" class="labels">price </label>
        <el-input
          v-model="nftPrice"
          placeholder="input price"
          maxlength="20"
          show-word-limit
        ></el-input>
        <el-select v-model="priceToken" class="selecToken">
          <el-option value="BNB" key="BNB" label="BNB"></el-option>
          <el-option key="BUSD" label="BUSD" value="BUSD"></el-option>
        </el-select>
      </p>
      <p>
        <label for="description" class="labels"> Description: </label>
        <el-input
          type="text"
          placeholder="input description"
          v-model="nftDesc"
          maxlength="50"
          show-word-limit
          id="description"
        />
      </p>
      <p>
        <el-button @click="sendSell">Sell</el-button>
      </p>
    </el-col>
  </el-row>
  <!-- </el-col> -->
</template>
<script>
import market from "../../../market";
import { mapState } from "vuex";
export default {
  name: "NFTinfo",
  computed: mapState({
    bcoin: "bcoin",
    curNFT: "curNFT",
    mcoin: "mcoin",
  }),
  watch: {
    nftprice: function (newprice) {
      console.log("price", newprice);
    },
    curNFT: function (newnft) {
      this.$store.commit("setCurNFT", newnft);
      console.log("curNFTTTTt", newnft);
    },
  },
  data() {
    return {
      nftPrice: 0,
      nftDesc: "",
      priceToken: "BNB",
      setInfo: true,
    };
  },
  methods: {
    send: async function () {
      const curNFT = this.$store.state.curNFT;
      const id = curNFT.id;
      const coin = "PBT";
      const tx = await market.sendToMarket(coin, id);
      console.log("send to market", tx);
      // await market.waitEventDone
      return tx;
    },
    sellNFT: async function () {
      const curNFT = this.$store.state.curNFT;
      const id = curNFT.id;
      const coin = "PBT";

      if (this.nftPrice === 0 || this.nftPrice == null) {
        this.$message("price is empty");
      }
      const res = await market.setSellInfo(
        coin,
        id,
        this.priceToken,
        this.nftPrice,
        this.nftDesc
      );
      console.log("sellNFT res", res);
      return res;
    },
    sendSell: async function () {
      const obj = this;
      const evt_send = await obj.send();
      await market.waitEventDone(evt_send, async function (evt_send, evt) {
        console.log(
          "blockHash",
          evt,
          evt_send.blockHash,
          evt_send.blockHash == null
        );
        if (evt.event == "Transfer") {
          const evt_sell = await obj.sellNFT();
          console.log("evnt sell", evt_sell);
        }
      });
      console.log("PBTsend", evt_send);
    },

    retreatNFT: async function () {
      const id = this.curNFT.id;
      console.log("retreat start", this.mcoin, id);
      const res = await market.retreatNFT(this.mcoin, id);
      console.log("retreat ok", res);
    },
    buyNFT: async function () {
      const curNFT = this.$store.state.curNFT;
      const res = await market.buyNFT(this.mcoin, curNFT);
      console.log("buyNFT res", res);
    },
  },
};
</script>