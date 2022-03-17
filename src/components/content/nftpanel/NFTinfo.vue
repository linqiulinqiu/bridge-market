<template>
  <el-dialog title="curNFT info" :visible.sync="visible" width="50%">
    <el-card>
      <el-row type="flex" justify="center">
        <el-col :span="10">
          <el-col v-if="meta.image">
            <img :src="meta.image" alt="Img" style="width: 300px" />
          </el-col>
          <p>id:#{{ nftId }}</p>
          <el-col v-if="market">
            <p v-if="market.price">
              {{ $t("price") }}:
              <span>{{ market.price }}&nbsp;&nbsp;&nbsp;</span>
              <span>{{ market.ptName }}</span>
            </p>
            <p v-if="market.desc != ''">{{ $t("desc") }}:{{ market.desc }}</p>
            <p v-else>No Description</p>
          </el-col>
        </el-col>
        <el-col v-if="market" :span="13">
          <!-- My sale nft info -->
          <el-col v-if="market.seller == '-self'">
            <el-col>
              <p>
                <span>Change price to:</span>
                <el-input
                  v-model="nftPrice"
                  placeholder="input price"
                ></el-input>
                <el-select v-model="priceToken" class="selecToken">
                  <el-option value="BNB" key="BNB" label="BNB"></el-option>
                  <el-option value="BUSD" key="BUSD" label="BUSD"></el-option>
                </el-select>
              </p>
              <el-button
                @click="sellNFT"
                type="primary"
                :loading="change_loading"
              >
                {{ $t("change-price") }}
              </el-button>
            </el-col>
            <el-col style="margin: 20px">--- {{ $t("or") }} ---</el-col>
            <el-col>
              <el-button
                @click="retreatNFT"
                type="primary"
                :loading="re_loading"
              >
                retreat from market
              </el-button>
            </el-col>
          </el-col>
          <!-- market NFT info Not mine -->
          <el-col v-if="market.seller == ''">
            <el-col>
              <p>
                The price :
                <span v-if="market.price">{{ market.price }}&nbsp;</span>
                <span v-if="market.ptName">{{ market.ptName }}</span>
              </p>
              <p>
                Description:
                <span v-if="market.desc">{{ market.desc }}</span>
              </p>
              <el-col>
                <el-button
                  @click="buyNFT"
                  type="primary"
                  :loading="buy_loading"
                  v-if="approve"
                >
                  Buy It
                </el-button>
                <el-button
                  v-else
                  @click="approveCoin"
                  type="priamry"
                  :loading="approve_loading"
                >
                  Approve
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
                <el-button @click="sellNFT" :loading="set_loading">
                  Sell
                </el-button>
              </p>
            </el-col>
          </el-col>
        </el-col>
      </el-row>
    </el-card>
  </el-dialog>
</template>
<script>
import market from "../../../market";
import { mapState } from "vuex";
export default {
  name: "NFTinfo",
  computed: mapState({
    mcoin: "mcoin",
    nftId() {
      if (this.curNFT && "id" in this.curNFT) return this.curNFT.id;
      return 0;
    },
    market() {
      if (this.curNFT && "market" in this.curNFT) return this.curNFT.market;
      return false;
    },
    meta() {
      if (this.curNFT && "meta" in this.curNFT) return this.curNFT.meta;
      return {};
    },
  }),
  watch: {
    curNFT: function () {
      this.nftId;
      this.market;
      this.meta;
      console.log("now NFT info", this.nftId, this.market, this.meta);
    },
    deep: true,
  },
  props: ["approve", "curNFT", "showDialog"],
  data() {
    return {
      visible: false,
      nftPrice: 0,
      nftDesc: "",
      priceToken: "BNB",
      sendToMarket: true,
      send_loading: false,
      set_loading: false,
      change_loading: false,
      re_loading: false,
      buy_loading: false,
      approve_loading: false,
    };
  },
  methods: {
    curNFt_refresh: function () {},
    show() {
      this.visible = true;
    },
    send: async function () {
      this.send_loading = true;
      const curNFT = this.curNFT;
      const id = curNFT.id;
      const coin = "PBT";
      try {
        const tx = await market.sendToMarket(coin, id);
        const obj = this;
        await market.waitEventDone(tx, async function (tx, evt) {
          console.log("send to market", tx, evt);
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
      const curNFT = this.curNFT;
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
          obj.dialog_visible();
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
          obj.dialog_visible();
        });
      } catch (e) {
        obj.re_loading = false;
        console.log("retreat err", e.message);
      }
    },
    buyNFT: async function () {
      console.log(this.approve);
      this.buy_loading = true;
      const curNFT = this.curNFT;
      const obj = this;
      try {
        const res = await market.buyNFT(this.mcoin, curNFT);
        await market.waitEventDone(res, async function (evt) {
          obj.buy_loading = false;
          obj.dialog_visible();
        });
      } catch (e) {
        obj.buy_loading = false;
        console.log("buyNFt err", e.message);
      }
    },
    approveCoin: async function () {
      this.approve_loading = true;
      const curNFT = this.curNFT;
      const obj = this;
      try {
        const res = await market.approveAllow(curNFT);
        await market.waitEventDone(res, async function (evt) {
          obj.approve_loading = false;
        });
        console.log("res approve", res);
      } catch (e) {
        this.approve_loading = false;
        console.log("approve err", e.message);
      }
    },
  },
};
</script>