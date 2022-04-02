<template>
  <el-row type="flex" justify="center">
    <el-col :sapn="10">
      <el-empty :image-size="100"></el-empty>
    </el-col>
    <el-col :span="12">
      <p>
        {{ $t("price") }}
        <span>{{ this.mintFee.price }}</span>
        <span>{{ this.mintFee.token }}</span>
      </p>
      <p>
        <span>{{ $t("mintable") }}{{ mintAbles }}</span>
      </p>
      <p>
        <el-button
          @click="mintNFT"
          type="primary"
          v-if="this.mintAbles > 0"
          :loading="mint_loading"
          >{{ $t("mintPBT") }}</el-button
        >
        <span v-else>{{ $t("none") }}</span>
      </p>
    </el-col>
  </el-row>
</template>
<script>
import market from "../../market";
export default {
  name: "MintPBT",
  props: ["mintAbles", "mintFee"],
  data() {
    return {
      mint_loading: false,
    };
  },
  
  methods: {
    mintNFT: async function () {
      this.mint_loading = true;
      try {
        const obj = this;
        const res = await market.mintPBT();
        await market.waitEventDone(res, async function (evt) {
          obj.mint_loading = false;
        });
      } catch (e) {
        this.mint_loading = false;
        this.$message(e.data.message);
        console.log("mint err", e.message);
      }
    },
  },
};
</script>