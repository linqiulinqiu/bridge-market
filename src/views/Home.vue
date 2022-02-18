<template>
  <div class="home">
    <div class="container">
      <plotheader/>
      <div class="banner">
        <el-button type="info" size="big">NFT PRESALE</el-button>
      </div>
      <div class="content">
        <h3>What problems are miners experiencing?<br>
          problem 1 <br>
          problem 2 <br><br><br>
        How do we solve these problems?<br>
          1. we do ... <br>
          2. we do ...</h3>
      </div>
      <plotfooter/>
      <!-- <footer>
        <nav class="bottom-info">
          <div><a href="" style="text-decoration:none;color:black">© 2022 Plot Network Ltd,All rights reserved. Address</a></div>
        </nav>
      </footer> -->
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

import Plotheader from '../components/content/Plotheader.vue'
import Plotfooter from '../components/content/Plotfooter.vue'

export default {
  name: 'Home',
  components: {  
    Plotheader,
    Plotfooter
  },
}
</script>
<style scoped>
  *{
    margin: 0;
    padding: 0;
  }
  
  ::-webkit-scrollbar {
  /*隐藏滚轮*/
  display: none;
}
  
  .container{
    width: 100vw;
    height: 100vh;
    background-color: rgb(229, 247, 240);
    position: relative;
    overflow: hidden;
  }
  .banner{
    /* background-color: red; */
    height: 435px;
    width: 100vw;
    background-image: url(../assets/image/banner.jpg);
    background-position: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .content{
    position: absolute;
    bottom: 15vh;
    left: 43vw;
  }
  /* footer{
    height: 93px;
    width: 100vw;
    background-color: #D5D5D5;
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  } */
  /* .bottom-info{
    background-color: red;
  } */
</style>