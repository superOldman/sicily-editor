<template>
  <div class="warp">
    <div v-if="true">

      <h4>添加分类</h4>
      <el-input v-model="input" class="input" placeholder="请输入内容">
        <i class="el-icon-paperclip el-input__icon" slot="suffix"></i>
      </el-input>
      <!-- <el-dropdown split-button type="primary" @click="handleClick">
        选择分类
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item >黄金糕</el-dropdown-item>
          <el-dropdown-item>狮子头</el-dropdown-item>
          <el-dropdown-item>螺蛳粉</el-dropdown-item>
          <el-dropdown-item>双皮奶</el-dropdown-item>
          <el-dropdown-item>蚵仔煎</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->

      <el-button type="primary" class="theMargin" @click="addFolder" closable>
        添加
        <i class="el-icon-upload el-icon--right"></i>
      </el-button>
      <div>---------------------------------------------------------------------</div>
    </div>
    <div v-if="folderName" class="folder">
      <div class="backgroundFilter"></div>
      <div class="backgroundColor"></div>
      <ul>
        <li>{{folderName}}</li>
        <li>
          <img src="../../assets/images/reduce-server-requests-in-wordpress.webp" alt="" srcset="">
        </li>
      </ul>
    </div>

  </div>
</template>


<style scoped>
.warp{
    padding: 20px 0;
    text-align: left;
}
.warp h4{
    font-size: 26px;
    line-height: 30px;
    margin: 20px 0;
}
.warp .input {
  width: 200px;
  margin-right: 20px;
}

.warp .tags .tit{
    margin: 5px;
}

.folder{
  display: flex ;
  width: 260px;
  height: 50px;
  border-radius: 7px;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 1px 20px -8px;
  text-shadow: rgba(0, 0, 0, 0.1) 0px 0px 1px;
  text-align: left;
  padding: 20px;
  position: relative;
  overflow: hidden;
}
.backgroundFilter{
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
   background-image: url(../../assets/images/reduce-server-requests-in-wordpress.webp) ;
      background-size: cover;
    filter: blur(10px);
    /* background-position: 50% center; */
    background-repeat: no-repeat;
     background-color: rgba(255,255,255,0.6);

}
.backgroundColor{
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(255,255,255,0.6);
}
.folder ul{
  position: relative;
  width: 100%;
  height: 100%;
}
.folder ul li {
  float: left;
  height: 50px;
  line-height: 50px;

}
.folder ul li:nth-child(1){
  width: 80%;
}
.folder ul li:nth-child(2){
  width: 50px;
  height: 50px;
  border-radius: 5px;
  overflow: hidden;
}
.folder ul li:nth-child(2) img{
  width: 50px;
  height: 50px;
}
</style>
<script>
export default {
  data() {
    return {
      restaurants: [],
      input: ''
    }
  },
  props: ['folderName'],
  methods: {
    addFolder() {
      this.$emit('addFolder', this.input)
    },
    handleCommand(command) {
      this.$message('click on item ' + command)
    }
  },
  mounted() {}
}
</script>