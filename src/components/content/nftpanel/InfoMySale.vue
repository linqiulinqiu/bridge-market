<template>
  <el-col>
    <el-col>
      <label for="_price" class="labels">Change price to:</label>
      <p>
        <el-input
          v-model="nftPrice"
          placeholder="input price"
          id="_price"
        ></el-input>
        <el-select v-model="priceToken" class="selecToken">
          <el-option value="BNB" key="BNB" label="BNB"></el-option>
          <el-option value="BUSD" key="BUSD" label="BUSD"></el-option>
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
</template>
<script>
import { mapState } from "vuex";
import market from "../../../market";

export default {
  name: "InfoMySale",
  props: ["curNFT", "show"],
  computed: mapState({ bcoin: "bcoin" }),
  data() {
    return {
      nftPrice: 0,
      nftDesc: "",
      priceToken: "BNB",
      change_loading: false,
      re_loading: false,
    };
  },
  methods: {
    sellNFT: async function () {
      this.change_loading = true;
      const curNFT = this.curNFT;
      const id = curNFT.id;
      if (this.nftPrice === 0 || this.nftPrice == null) {
        this.$message("price is empty");
        this.change_loading = false;
      }
      try {
        const res = await market.setSellInfo(
          id,
          this.priceToken,
          this.nftPrice,
          this.nftDesc
        );
        const obj = this;
        await market.waitEventDone(res, async function (evt) {
          obj.change_loading = false;
          obj.show();
        });
      } catch (e) {
        this.change_loading = false;
        console.log("setSellInfo errr", e.message);
      }
    },
    retreatNFT: async function () {
      this.re_loading = true;
      const id = this.curNFT.id;
      try {
        const res = await market.retreatNFT(id);
        const obj = this;
        await market.waitEventDone(res, async function (evt) {
          obj.re_loading = false;
          obj.show();
        });
      } catch (e) {
        this.re_loading = false;
        console.log("retreat err", e.message);
      }
    },
  },
};
</script>