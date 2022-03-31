<template>
  <el-col>
    <el-col>
      <p>
        {{ $t("destroy") }} :
        <el-button @click="burnPBT">{{ $t("destroy") }}</el-button>
      </p>
    </el-col>
    <h2>{{ $t("sell") }}</h2>
    <el-col v-if="sendToMarket">
      <p>
        1、{{ $t("send-tomarket") }}
        <el-button @click="send" type="primary" :loading="send_loading">{{
          $t("send")
        }}</el-button>
      </p>
    </el-col>
    <el-col v-else>
      <p>
        2、{{ $t("set-sell-info") }}
        <span class="minifont">价格为零将不会出现在市场列表中</span>
      </p>
      <el-col>
        <label for="price" class="labels">{{ $t("price") }}</label>
        <p>
          <el-input
            v-model="nftPrice"
            placeholder="input price"
            maxlength="20"
            show-word-limit
            id="price"
          ></el-input>
          <el-select v-model="ptName" class="selecToken">
            <el-option value="BNB" key="BNB" label="BNB"></el-option>
            <el-option key="BUSD" label="BUSD" value="BUSD"></el-option>
          </el-select>
        </p>

        <label for="description" class="labels"> {{ $t("desc") }}</label>
        <el-input
          type="text"
          :placeholder="this.$t('input-desc')"
          v-model="nftDesc"
          maxlength="50"
          show-word-limit
          id="description"
        />
        <p>
          <el-button @click="sellNFT" :loading="set_loading">
            {{ $t("sell") }}
          </el-button>
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
      ptName: "BNB",
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
        this.$message(this.$t("price-tips"));
        this.set_loading = false;
        this.change_loading = false;
      }
      try {
        const res = await market.setSellInfo(
          id,
          this.ptName,
          this.nftPrice,
          this.nftDesc
        );
        console.log("sell", res);
        const obj = this;
        await market.waitEventDone(res, async function (evt) {
          obj.set_loading = false;
          obj.sendToMarket = true;
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