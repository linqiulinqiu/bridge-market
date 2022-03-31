<template>
  <el-col>
    <el-col>
      <label for="_price" class="labels">{{ $t("change-price") }}</label>
      <p>
        <el-input
          v-model="nftPrice"
          placeholder="input price"
          id="_price"
        ></el-input>
        <el-select v-model="ptName" class="selecToken">
          <el-option value="BNB" key="BNB" label="BNB"></el-option>
          <el-option value="BUSD" key="BUSD" label="BUSD"></el-option>
        </el-select>
      </p>
      <label for="description" class="labels">{{ $t("desc") }}</label>
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
        {{ $t("retreat") }}
      </el-button>
    </el-col>
  </el-col>
</template>
<script>
import { mapState } from "vuex";
import market from "../../../market";

export default {
  name: "InfoMySale",
  props: ["show", "curNFT"],
  computed: mapState({ bcoin: "bcoin", current: "current" }),
  data() {
    return {
      nftPrice: 0,
      nftDesc: "",
      ptName: "BNB",
      change_loading: false,
      re_loading: false,
    };
  },
  methods: {
    sellNFT: async function () {
      this.change_loading = true;
      const id = this.curNFT.id;
      if (this.nftPrice === 0 || this.nftPrice == null) {
        this.$message(this.$t("price-tips"));
        this.change_loading = false;
      }
      try {
        const res = await market.setSellInfo(
          id,
          this.ptName,
          this.nftPrice,
          this.nftDesc
        );
        const obj = this;
        await market.waitEventDone(res, async function (evt) {
          obj.change_loading = false;
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