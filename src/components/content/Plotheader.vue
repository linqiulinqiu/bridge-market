<template>
  <div>
    <header>
      <div class="logo"><img class="m-logo" src="../../assets/image/big-logo.svg" alt=""></div>
      <nav>
        <div class="navi">
          <ul class="navi-content">
            <li v-for="(item,index) in this.nav" :key='index' @click="liclick(item.link)" >{{item.tag}}</li>
          </ul>
        </div>
        <div class="linkto">
          <a href=""><img class="l-coin" src="../../assets/image/discord.png" alt=""></a>
          <a href=""><img class="l-coin" src="../../assets/image/twitter.png" alt=""></a>
          <a href=""><img class="l-coin" src="../../assets/image/facebook.png" alt=""></a>
          <a href=""><img class="l-coin" src="../../assets/image/linkedin.png" alt=""></a>
        </div>
        <div class="start">
            <el-button type="primary" size="small">start</el-button>
        </div>
      </nav> 
    </header>
  </div>
</template>

<script>
export default {
    name: 'Plotheader',
    data() {
      return {
        nav: [{tag:'Home',link:'/home'},{tag:'Bridge',link:'/bridge'},{tag:'Market',link:'/market'},{tag:'Doc',link:'/doc'}]
      }
    },
    methods: {
      liclick(link){
        this.$router.push(link)
      }
    }
}
</script>

<style scoped>
    *{
    margin: 0;
    padding: 0;
  }
  .m-logo{
    height: 65px;
    margin-left: 20px;
  }
  header{
    height: 70px;
    width: 100%;
    background-color: #616161;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  nav{
    display: flex;
  }
  .navi{
    /* background-color: red; */
    display: flex;
    align-items: center;
  }
  .navi-content{
    /* background-color: blue; */
    list-style: none;
    display: flex;
    color: #ffffff;
  }
  li{
    margin: 0 20px;
    cursor: pointer;
  }
  .linkto{
    width: 180px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    /* background-color: green; */
  }
  .l-coin{
    height: 32px;
  }
  .start{
    /* background-color: yellow; */
    margin-right: 30px;
  }
</style>