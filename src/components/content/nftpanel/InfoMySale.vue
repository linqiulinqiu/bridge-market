<template>
  <el-col>
    <el-col>
      <label for="_price" class="labels">{{ $t("change-price") }}</label>
      <p>
        <el-input
          v-model="nftPrice"
          placeholder="input price"
          id="_price"
          class="price-input"
        ></el-input>
        <el-select v-model="ptName" class="selecToken">
          <el-option value="BNB" key="BNB" label="BNB"></el-option>
          <el-option value="USDT" key="USDT" label="USDT"></el-option>
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
        class="desc"
      />
      <p>
        <el-button
          @click="sellNFT"
          type="primary"
          :loading="change_loading"
          class="btn-infoms"
        >
          {{ $t("change-price") }}
        </el-button>
        <el-button
          @click="retreatNFT"
          type="primary"
          :loading="re_loading"
          class="btn-infoms"
        >
          {{ $t("retreat") }}
        </el-button>
        <el-button class="btn-cancel" @click="clearPbtId">{{
          $t("cancel")
        }}</el-button>
      </p>
    </el-col>
  </el-col>
</template>
<script>
import { mapState } from "vuex";
import market from "../../../market";

export default {
  name: "InfoMySale",
  props: ["clearPbtId", "curNFT"],
  computed: mapState({ bcoin: "bcoin", current: "current" }),
  data() {
    return {
      nftPrice: "",
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
          obj.$store.commit("setCurrentPbtId", false);
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
          obj.$store.commit("setCurrentPbtId", false);
        });
      } catch (e) {
        this.re_loading = false;
        console.log("retreat err", e.message);
      }
    },
  },
};
</script>
<style>
</style>