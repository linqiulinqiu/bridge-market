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
            <InfoMySale :curNFT="this.curNFT" :show="this.show" />
          </el-col>
          <!-- market NFT info Not mine -->
          <el-col v-if="market.seller == ''">
            <InfoMarket
              :curNFT="this.curNFT"
              :show="this.show"
              :approve="this.approve"
            />
          </el-col>
          <!-- </el-col> -->
        </el-col>
        <!-- My NFT not sale -->
        <el-col v-else :span="13">
          <InfoMy :show="this.show" :curNFT="this.curNFT" />
        </el-col>
      </el-row>
    </el-card>
  </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import InfoMy from "./InfoMy.vue";
import InfoMarket from "./InfoMarket.vue";
import InfoMySale from "./InfoMySale.vue";
export default {
  name: "NFTinfo",
  components: {
    InfoMy,
    InfoMarket,
    InfoMySale,
  },
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
    pbxs() {
      if (this.curNFT && "pbxs" in this.curNFT) return this.curNFT.pbxs;
      return {};
    },
  }),
  watch: {
    curNFT: function () {
      this.nftId;
      this.market;
      this.meta;
      this.pbxs;
    },
    deep: true,
  },
  props: ["approve", "curNFT", "showDialog"],
  data() {
    return {
      visible: false,
      
    };
  },
  methods: {
    show() {
      this.visible = !this.visible;
    },
  },
};
</script>