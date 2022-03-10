<template>
  <el-row type="flex" justify="center">
    <!-- <el-col v-if="curNFT && curNFT.mata"> -->
    <el-col :span="10">
      <el-col v-if="curNFT.meta.image">
        <img :src="curNFT.meta.image" alt="Img" style="width: 300px" />
      </el-col>
      <p>id:#{{ curNFT.id }}</p>
      <el-col v-if="curNFT.market">
        <el-col v-if="curNFT.market.seller == '-self'">
          <p v-if="curNFT.market.price">
            {{ $t("price") }}:<span
              >{{ curNFT.market.price }}&nbsp;&nbsp;&nbsp;</span
            >
            <span>{{ curNFT.market.ptName }}</span>
          </p>
          <p v-if="curNFT.market.desc != ''">
            {{ $t("desc") }}:{{ curNFT.market.desc }}
          </p>
          <p v-else>No Description</p>
        </el-col></el-col
      >
      <!-- <p>
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
      </p> -->
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
          <el-button @click="sellNFT" type="primary" :loading="change_loading">
            {{ $t("change-price") }}
          </el-button>
        </el-col>
        <el-col style="margin: 20px">--- {{ $t("or") }} ---</el-col>
        <el-col>
          <el-button @click="retreatNFT" type="primary" :loading="re_loading">
            retreat from market
          </el-button>
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
          <!-- <p>
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
          </p> -->
          <el-col>
            <el-button @click="buyNFT" type="primary" :loading="buy_loading">
              Buy It
            </el-button>
          </el-col>
        </el-col>
      </el-col>
      <!-- </el-col> -->
    </el-col>
    <!-- My NFT not sale -->
    <el-col v-else :span="13">
      <h2>售卖NFT</h2>
      <el-col v-if="sendToMarket">
        <p>
          1、发送此NFT到市场
          <el-button @click="send" type="primary" :loading="send_loading"
            >发送到市场</el-button
          >
        </p>
      </el-col>
      <el-col v-else>
        <p>
          2、设置价格与描述
          <span class="minifont">价格为零将不会出现在市场列表中</span>
        </p>
        <el-col>
          <label for="price" class="labels">price </label>
          <p>
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

          <label for="description" class="labels"> Description: </label>
          <el-input
            type="text"
            placeholder="input description"
            v-model="nftDesc"
            maxlength="50"
            show-word-limit
            id="description"
          />
          <p>
            <el-button @click="sellNFT" :loading="set_loading">Sell</el-button>
          </p>
        </el-col>
      </el-col>
    </el-col>
  </el-row>
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
    baddr: "baddr",
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
      sendToMarket: true,
      send_loading: false,
      set_loading: false,
      change_loading: false,
      re_loading: false,
      buy_loading: false,
    };
  },
  methods: {
    send: async function () {
      this.send_loading = true;
      const curNFT = this.$store.state.curNFT;
      const id = curNFT.id;
      const coin = "PBT";
      try {
        const tx = await market.sendToMarket(coin, id);
        console.log("send to market", tx);
        const obj = this;
        await market.waitEventDone(tx, async function (tx, evt) {
          obj.sendToMarket = false;
          obj.send_loading = false;
        });
      } catch (e) {
        this.sendToMarket = true;
        this.send_loading = false;
        console.log("sendToMarket errr", e.message);
        if (e.data.code == 3) {
          console.log("send err", e.data.message);
          this.$message(e.data.message);
        }
      }
    },
    sellNFT: async function () {
      this.set_loading = true;
      this.change_loading = true;
      const curNFT = this.$store.state.curNFT;
      const id = curNFT.id;
      const coin = "PBT";
      if (this.nftPrice === 0 || this.nftPrice == null) {
        this.$message("price is empty");
        this.set_loading = false;
        this.change_loading = false;
      }
      try {
        const res = await market.setSellInfo(
          coin,
          id,
          this.priceToken,
          this.nftPrice,
          this.nftDesc
        );
        const obj = this;
        await market.waitEventDone(res, async function (evt) {
          obj.set_loading = false;
          obj.sendToMarket = true;
          obj.change_loading = false;

          console.log("sendtomarket", obj.sendToMarket);
        });
        return res;
      } catch (e) {
        this.change_loading = false;
        this.set_loading = false;
        console.log("setSellInfo errr", e.message);
      }
    },
    retreatNFT: async function () {
      this.re_loading = true;
      const id = this.curNFT.id;
      const obj = this;
      try {
        const res = await market.retreatNFT(this.mcoin, id);
        await market.waitEventDone(res, async function (evt) {
          obj.re_loading = false;
        });
      } catch (e) {
        obj.re_loading = false;
        console.log("retreat err", e.message);
      }
    },
    buyNFT: async function () {
      this.buy_loading = true;
      const curNFT = this.$store.state.curNFT;
      const obj = this;
      try {
        const res = await market.buyNFT(this.mcoin, curNFT);
        await market.waitEventDone(res, async function (evt) {
          obj.buy_loading = false;
        });
      } catch (e) {
        obj.buy_loading = false;
        console.log("buyNFt err", e.message);
      }
    },
  },
};
</script>