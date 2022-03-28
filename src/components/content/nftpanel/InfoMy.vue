<template>
  <el-col>
    <el-col>
      <p>销毁NFT <el-button @click="burnPBT">销毁NFT</el-button></p>
    </el-col>
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
            id="price"
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
          <el-button @click="sellNFT" :loading="set_loading"> Sell </el-button>
        </p>
      </el-col>
    </el-col>
  </el-col>
</template>
<script>
import market from "../../../market";
export default {
  name: "InfoMy",
  props: ["curNFT", "show"],
  data() {
    return {
      nftPrice: 0,
      nftDesc: "",
      priceToken: "BNB",
      sendToMarket: true,
      send_loading: false,
      set_loading: false,
    };
  },
  methods: {
    burnPBT: async function () {
      const id = this.curNFT.id;
      const res = await market.burnNFT(id);
      console.log("burn res", res);
    },
    send: async function () {
      this.send_loading = true;
      const id = this.curNFT.id;
      try {
        const tx = await market.sendToMarket(id);
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
      const id = this.curNFT.id;
      if (this.nftPrice === 0 || this.nftPrice == null) {
        this.$message("price is empty");
        this.set_loading = false;
        this.change_loading = false;
      }
      try {
        const res = await market.setSellInfo(
          id,
          this.priceToken,
          this.nftPrice,
          this.nftDesc
        );
        console.log("sell", res);
        const obj = this;
        await market.waitEventDone(res, async function (evt) {
          obj.set_loading = false;
          obj.sendToMarket = true;
          obj.show();
        });
        return res;
      } catch (e) {
        this.set_loading = false;
        console.log("setSellInfo errr", e.message);
      }
    },
  },
};
</script>