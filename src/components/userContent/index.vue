<script type='text/ecmascript-6'>
/* COMPONENT DOCUMENT
 * author: skm
 * date: 2020/03/20
 * desc: 用户信息组件
 */
import SkmServes from "../../services/api";
import store from '../../store/index';
export default {
  data() {
    return {
      // title: '管理员',
      // userName: 'superOldman',
      // imgUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    };
  },
  props: {
    userMessage: {
      title: String,
      userName: String,
      imgUrl: String
    }
  },
  mounted() {
    //  this.pageToDetails()
    console.log(this.userMessage);
  },
  methods: {
    pageToDetails() {
      this.$router.push({ name: "userDetails" });
    },
    logout() {
      store.commit('refushUser',null)
      SkmServes.logout();
    }
  }
};
</script>

<template>
  <el-dropdown class="el-dropDown">
    <div class="el-dropdown-link">
      <ul class="userDetails clearfix">
        <li>{{userMessage.title}}</li>
        <li>{{userMessage.userName}}</li>
        <li class="imgBorder">
          <img :src="userMessage.photo" alt srcset />
        </li>
      </ul>
    </div>
    <!-- <span class="el-dropdown-link"> -->
    <!-- <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar> -->
    <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
    <!-- </span> -->
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="pageToDetails()">详情</el-dropdown-item>
      <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<style  scoped >
.el-dropdown {
  height: 60px;
  line-height: 80px;
  overflow: hidden;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.userDetails > li {
  float: left;
  margin-right: 5px;
}
.imgBorder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin-top: 10px;
  font-size: 0px;
}
.imgBorder > img {
  width: 100%;
  height: 100%;
}
</style>