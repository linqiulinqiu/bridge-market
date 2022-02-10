<template>
  <el-dialog title="NFTinfo" :visible.sync="diaNFT" width="80%">
    <el-card v-if="curNFT && curNFT.meta">
      <el-col :span="7">
        <img :src="curNFT.meta.image" :alt="curNFT.id" />
        <p>id: {{ curNFT.id }}</p>
      </el-col>
      <el-col style="min-height: 300px" v-if="curNFT.pbxs" :span="13">
        <h3>Bound:</h3>
        <el-col v-for="(item, name) in curNFT.pbxs" :key="name">
          <el-col v-if="name == 3">
            <dt>
              Chives(XCC):
              <el-button @click="unbind(item)" size="mini"> Unbind </el-button>
            </dt>
            <dd v-if="item.depositAddr">
              deposit address : {{ item.depositAddr }}
            </dd>
            <dd v-if="item.withdrawAddr">
              <span v-if="String(item['withfrawAddr']).substr(2, 4) != '0000'">
                withdrawAddr: {{ item.withdrawAddr }}
              </span>
            </dd>
            <dd v-if="item.withdrawAddr">
              WXCC Balance:
              <span>{{ WBalance }}</span>
              <el-input v-model="withdrawAmount"></el-input>
              <el-button @click="withdraw">Withdraw</el-button>
            </dd>
            <!-- <dd v-if=""></dd> -->
          </el-col>
          <el-col v-if="name == 2">
            <dt>
              HDDcoin(HDD)
              <el-button @click="unbind(item)" size="mini"> Unbind </el-button>
            </dt>
            <dd v-if="item.depositAddr">deposit addr:{{ item.depositAddr }}</dd>
            <dd v-if="item.withdrawAddr">
              <span v-if="item.withfrawAddr.substr(2, 4) != '0000'">
                withdrawAddr: {{ item.withdrawAddr }}
              </span>
            </dd>
          </el-col>
          <el-col v-if="name == 1">
            <dt>
              Chia(XCH)
              <el-button @click="unbind(item)" size="mini">Unbind</el-button>
            </dt>
            <dd v-if="item.depositAddr">deposit : {{ item.depositAddr }}</dd>
            <dd v-if="item.withdrawAddr">
              <span v-if="item.withfrawAddr.substr(2, 4) != '0000'">
                withdrawAddr: {{ item.withdrawAddr }}
              </span>
            </dd>
          </el-col>
        </el-col>
      </el-col>
      <el-col v-if="curNFT.meta['name'] == 'PlotBridge Xin'"
        ><BindWaddr
      /></el-col>
    </el-card>
  </el-dialog>
</template>