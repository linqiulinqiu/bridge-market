<template>
  <el-col id="deposite" class="tabs">
    <el-col v-if="baddr">
      <p>
        存入:<el-input
          type="text"
          class="amount-input"
          v-model.trim="depAmount"
        />{{ mcoin }}币
      </p>
      <el-col>
        在以下的地址：
        <el-col class="aa">
          <el-col v-if="curNFT.pbxs">
            <span v-if="curNFT.pbxs['0']">请绑定PBX</span>
            <span v-else>
              <span v-if="mcoin == 'XCH'">
                <i v-if="curNFT.pbxs['1'].depositAddr">{{
                  curNFT.pbxs["1"].depositAddr
                }}</i>
              </span>
              <span v-if="mcoin == 'HDD'">
                <i v-if="curNFT.pbxs['2'].depositAddr">{{
                  curNFT.pbxs["2"].depositAddr
                }}</i>
              </span>
              <span v-if="mcoin == 'XCC'">
                <i v-if="curNFT.pbxs['3'].depositAddr">{{
                  curNFT.pbxs["3"].depositAddr
                }}</i>
              </span>
            </span>
          </el-col>
        </el-col>
      </el-col>
      <p>
        你将会得到<span class="span">{{ getAmount }}</span> W{{ mcoin }}
        币，在你的bsc钱包中。
      </p>
    </el-col>
  </el-col>
</template>
<script>
import { mapState } from "vuex";
import market from "../../market";
import BridgeFee from "./BridgeFee.vue";
export default {
  components: {
    BridgeFee,
  },
  computed: mapState({
    baddr: "baddr",
    mcoin: "mcoin",
    curNFT: "curNFT",
  }),
  data() {
    return {
      depAmount: 0,
      getAmount: 0,
    };
  },
  methods: {},
};
</script>