<template>
  <el-col>
    <h2>Guide For Bridge</h2>
    <el-col>
      <h1>如何将XCC转换成币安智能链上的WXCC</h1>
        
      <p>
        1. 推荐在Chrome浏览器上访问PlotBridge。<br>
        2. 运访问PlotBridge前，需要安装MetaMask钱包的Chrome插件，并在钱包注册一个账号。<br>
        3. 登录MetaMask钱包，连接到币安智能链主网。<br>
        4. 通过 <a href="https://bridgemarket.onrender.com/#/Bridge" target="_blank">https://bridgemarket.onrender.com/#/Bridge</a>  运行 PlotBridge 。<br>
        5. 点击“连接钱包”，会弹出一个确认连接的窗口。<br>
        6. 如果连接成功，会在右上角显示钱包的地址同时在页面左侧的“我的NFT”侧框中会显示您所拥有的NFT。<br>
        7. 您需要至少一个NFT来运用桥的功能，NFT可以通过“铸造NFT”按钮自行铸造，也可以在市场上购买，您也可以在市场上出售自己的NFT。<br>
        8. 选择您拥有的一个NFT，并选择要进行转换的币种（这里我们选择XCC进行演示），然后点击获取“获取XCC存款地址”按钮。<br>
        9. 页面中间会显示可以接收XCC的桥地址。每个NFT都会在该页面生成一个对应的桥地址。您可以从您的钱包或您的交易账户往这个桥地址发送代币。<br>
        10. 点击桥地址，可以复制该地址，保存在系统剪贴板中，作为您代币的接收地址。<br>
        11. PlotBridge 会将收到的 XCC 币转换成 BEP20 代币 WXCC 并将它们保存在您的 MetaMask 钱包中。您可以在交易页面或者在PancakeSwap 网站上将WXCC代币兑换成其他代币（例如 BNB）。<br>
        12. PlotBridge将收取 0.3% 或最低 30 XCC 的交易费用。<br>
        13. 您可以在输入框中输入XCC的数量，页面会显示最终将交换并发送到您MetaMask钱包的代币WXCC数量。<br>
      </p>
      <h1>如何将WXCC转换回XCC</h1>
      <p>
        1. 在取款页面，首先需要绑定你要提现XCC的韭菜钱包地址。<br>
        2. 输入WXCC的数量后，点击“取款”按钮，一定数量的XCC会进入您的Chives钱包。<br>
        3. PlotBridge将收取0.1%的交易费用，每笔交易最少2个XCC币。<br>
      </p>
      <h1>旧版的代币不能用怎么办 </h1>
      <p>
        您可以在兑换页面将旧版的PXCC按照1：1的比例兑换成新版本的代币WXCC。<br>
      </p>
    </el-col>
  </el-col>
</template>

<script>
export default {
  name: "GuideforBridge",
};
</script>
<style scoped>
.el-col {
  padding: 30px;
}
.el-col p {
  line-height: 35px;
}
a{
  text-decoration: none;
  color: aqua;
}
</style>