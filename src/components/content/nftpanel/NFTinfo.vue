<template>
  <el-col>
    <el-col v-if="curNFT && curNFT.mata">
      <el-col>
        <img :src="curNFT.meta.image" alt="Img" />
        id:#{{ curNFT.id }}
      </el-col>
      <el-col v-if="curNFT.market">
        <!-- My sale nft info -->
        <el-col v-if="curNFT.market.seller">
          <el-col v-if="curNFT.market.seller == '-self'">
            <el-col>
              <p>
                <span>Change price to:</span>
                <el-input v-model="nftPrice"></el-input>
                <el-select v-model="priceToken" class="selecToken">
                  <el-option value="BNB" key="BNB" label="BNB"></el-option>
                  <el-option value="BUSD" key="BUSD" label="BUSD"></el-option>
                </el-select>
              </p>
              <el-button @click="sellNFT">Change price</el-button>
            </el-col>
            <el-col>--- OR ---</el-col>
            <el-col>
              <e-button @click="retreatNFT"> retreat from market </e-button>
            </el-col>
          </el-col>
          <!-- market NFT info Not mine -->
          <el-col v-else>
            <el-col>
              <p>
                The price :
                <span v-if="curNFt.market.price">{{
                  curNFt.market.price
                }}</span>
              </p>
              <p>
                Description:
                <span v-if="curNFt.market.desc">{{ curNFt.market.desc }}</span>
              </p>
              <p>
                Function:
                <span v-if="curNFt.pbxs.coinTypes">
                  <span v-if="curNFT.pbxs.coinTypes == '3'">
                    Bridge for Chives
                  </span>
                  <span v-if="curNFT.pbxs.coinTypes == '2'">
                    Bridge for HDDcoin
                  </span>
                  <span v-if="curNFT.pbxs.coinTypes == '1'"
                    >Bridge for Chia</span
                  >
                </span>
              </p>
              <el-col>
                <el-button @click="buyNFT"> Buy It </el-button>
              </el-col>
            </el-col>
          </el-col>
        </el-col>
      </el-col>
      <!-- My NFT not sale -->
      <el-col v-else>
        <p>Set the sale info:</p>
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
    </el-col>
  </el-col>
</template>
<script>
import market from "../../../market";
import mapState from "vuex";
export default {
  name: NFTinfo,
  computed: mapState({
    coin: "coin",
    curNFT: "curNFT",
  }),
  data() {
    const state = this.$store.state;
    let price = state.curNFT;
    let desc = "";
    let priceToken = "BNB";
    if (state.curNFT.market) {
      price = state.curNFT.market.price;
      desc = state.curNFT.market.desc;
      priceToken = state.curNFT.market.priceToken;
    }
    return {
      nftPrice: price,
      nftDesc: desc,
      priceToken: priceToken,
      // changePrice: state.curNFT.price,
      // changePriceToken: state.curNFT.market.priceToken,
    };
  },
  methods: {
    send: async function () {
      const curNFT = this.$store.state.curNFT;
      const id = curNFT.id;
      const tx = await market.sendToMarket(this.coin, id);
      console.log("send to market", tx);
    },
    sellNFT: async function () {
      const curNFT = this.$store.state.curNFT;
      const id = curNFT.id;
      if (this.nftPrice === 0 || this.nftPrice == null) {
        this.$message("price is empty");
      }
      const res = await market.setSellInfo(
        this.coin,
        id,
        this.priceToken,
        this.nftPrice,
        this.nftDesc
      );
      console.log("sellNFT res", res);
    },
    sendSell: async function () {
      const obj = this;
      const evt_send = await obj.send().then(async function () {
        const evt_sell = await obj.sellNFT();
      });
    },

    retreatNFT: async function () {
      const id = this.curNFT.id;
      console.log("retreat start", this.coin, id);
      const res = await market.retreatNFT(this.coin, id);
      console.log("retreat ok", res);
    },
    buyNFT: async function () {
      const curNFT = this.$store.state.curNFT;
      const res = await market.buyNFT(this.coin, curNFT);
      console.log("buyNFT res", res);
    },
  },
};
</script>