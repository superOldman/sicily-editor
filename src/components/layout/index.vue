<script>
/* COMPONENT DOCUMENT
 * author: zhaoyang
 * date: 2019/09/30
 * desc: 布局
 */

// import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';
// import { Getter, Action } from 'vuex-class';
import MODULES_INFO from "../../constant/navModule.js";
import SkmService from "../../services/api";
import userContent from "../userContent/index.vue";

export default {
  name: "layout",
  data: function() {
    return {
      MODULES_INFO,
      userMessage: {},
      // userMessage: {
      //   title: "",
      //   userName: "",
      //   imgUrl: ""
      // }
    };
  },
  components: {
    userContent
  },
  computed :{
    // userMessage(){
    //   return this.$store.state.userDetails
    // }
  },
  // watch: {
  //   // 如果 `question` 发生改变，这个函数就会运行
  //   userMessage: function (newQuestion, oldQuestion) {
  //     if(newQuestion !== oldQuestion){
  //       this.userMessage = newQuestion
  //     }
  //   }
  // },
  mounted() {
    // console.log(MODULES_INFO)
    this.isLogin();
  },
  methods: {
    clickToPage(route) {
      this.$router.push({ name: route });
    },
    isLogin() {
      // const self = this;
      this.userMessage = this.$store.state.userDetails;
      if (!this.$store.state.userDetails) {
        SkmService.islogin().then(data => {
          console.log(data)
          if (data.code === 1) {
            // self.$router.push({ name: "login" });
          } else {
            console.log(data);
            this.userMessage = data.userMessage;
            this.$store.commit("refushUser", data.userMessage);
            console.log(this.$store.state.userDetails);
            console.log(this.$store.state.userDetails.title);
          }
        });
      }
    }
  }
};
</script>

<template>
  <el-container class="warp">
    <el-header>
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="grid-content bg-purple">sicilyEditor</div>
        </el-col>
        <el-col :span="8" :offset="12">
          <div class="grid-content bg-purple">
            <user-content v-if="userMessage" :userMessage="userMessage"></user-content>
          </div>
        </el-col>
        <!-- <el-col :span="8" :offset="12"></el-col> -->
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu :default-openeds="['1', '3']">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-message"></i>导航一
            </template>
            <el-menu-item-group>
              <!-- <template slot="title">分组一</template> -->
              <el-menu-item
                v-for="(item,index) in MODULES_INFO"
                :key="index"
                index="1-1"
                @click="clickToPage(item.router)"
              >{{item.name}}</el-menu-item>
              <!-- <el-menu-item index="1-1" @click="clickToPage('editor')">选项1</el-menu-item> -->
              <!-- <el-menu-item index="1-2">选项2</el-menu-item> -->
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <slot />
      </el-main>
    </el-container>
  </el-container>
</template>

<style  scoped>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
  height: 60px;
}
.grid-content {
  height: 60px;
}
.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  /* line-height: 200px; */
  /* padding-left: 20px; */
  height: 100%;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  height: 100%;
}

body > .el-container {
  margin-bottom: 40px;
  height: 100%;
}
.warp {
  height: 100%;
}
</style>
