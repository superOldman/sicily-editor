<script type='text/ecmascript-6'>
/* COMPONENT DOCUMENT
 * author: skm
 * date: 2020/03/20
 * desc: 用户信息组件
 */
import SkmServes from '../../services/api';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      // title: '管理员',
      // userName: 'superOldman',
      // imgUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    };
  },
  computed: {
    ...mapGetters('userMessageModule', ['getUserInfo'])
  },
  mounted() {

  },
  methods: {
    pageToDetails() {
      this.$router.push({ name: 'userDetails' });
    },
    logout() {
      this.$store.commit('userMessageModule/refushUser', null);
      SkmServes.logout();
    }
  }
};
</script>

<template>
  <el-dropdown class="el-dropDown">
    <div class="el-dropdown-link">
      <ul class="userDetails clearfix">
        <li>{{(getUserInfo || {}).title}}</li>
        <li>{{(getUserInfo || {}).userName}}</li>
        <li class="imgBorder">
          <img :src="(getUserInfo || {}).photo" alt srcset />
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
  height: 70px;
  line-height: 70px;
  overflow: hidden;
}
.el-dropdown-link {
  cursor: pointer;
  color: #fff;
}
.el-icon-arrow-down {
  font-size: 12px;
}
.userDetails{
  display: flex;
  align-items: center;

}
.userDetails > li {
  margin-right: 5px;
}
.imgBorder {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  font-size: 0px;
}
.imgBorder > img {
  width: 100%;
  height: 100%;
}
</style>