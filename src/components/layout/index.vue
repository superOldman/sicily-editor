<script>
import { setCookie } from '../../utils/cookie'

import MODULES_INFO from '../../constant/navModule.js';
import SkmService from '../../services/api';
import userContent from '../userContent/index.vue';
import { mapGetters } from 'vuex';
export default {
  name: 'layout',
  data: function () {
    return {
      MODULES_INFO,
      pageMessageIcon: MODULES_INFO[0].icon,
      pageMessage: MODULES_INFO[0].name,
      date_year_mounth: '',
      date_hour_min_sec: '',
      userMessage: {},
      timerId: null,
      percentage: 0,
      colors: {
        1: '#bfbfbf',
        2: '#95ddb2',
        3: '#92d1e5',
        4: '#ffb37c',
        5: '#ff6c00',
        6: '#ff0000',
        7: '#e52fec',
        8: '#841cf9',
        9: '#0e0e0e',
        0: ''
      }
    };
  },
  components: {
    userContent
  },
  computed: {
    ...mapGetters('userMessageModule', ['getUserInfo'])
  },

  watch: {
    getUserInfo: {
      handler(val) {
        console.log('监听', val);
        this.percentage = val.level.textSize / 10000 * 100;
      }
    }
  },
  created() { this.renderTime(); },
  mounted() {
    // console.log(MODULES_INFO)
    this.isLogin();

    this.bg_animate();
  },
  beforeDestroy() {
    clearInterval(this.timerId);
  },
  methods: {
    getMyTime(time) {
      let nowTime;
      if (time) {
        nowTime = new Date(time);
        return `${nowTime.getFullYear()}-${addZero(nowTime.getMonth() + 1)}-${addZero(nowTime.getDate())}
        ${addZero(nowTime.getHours())}:${addZero(nowTime.getMinutes())}:${addZero(nowTime.getSeconds())}`;
      } else {
        nowTime = new Date();
        this.date_year_mounth = `${nowTime.getFullYear()}-${addZero(
          nowTime.getMonth() + 1
        )}-${addZero(nowTime.getDate())}`;
        this.date_hour_min_sec = `${addZero(nowTime.getHours())}:${addZero(
          nowTime.getMinutes()
        )}:${addZero(nowTime.getSeconds())}`;
      }
      function addZero(num) {
        return num >= 10 ? num : `0${num}`;
      }
    },
    renderTime() {
      this.getMyTime();
      this.timerId = setInterval(() => {
        this.getMyTime();
      }, 1000);
    },
    selectHandle(item) {
      this.pageMessage = item.name;
      this.pageMessageIcon = item.icon;
    },
    isLogin() {
      // this.userMessage = this.$store.state.userDetails.userDetails;
      if (!this.getUserInfo) {
        SkmService.islogin().then(data => {

          setCookie('loginName', data.username)
          this.$store.commit('userMessageModule/refushUser', data.userMessage);

        });
      }
    },

    /** 字体背景动画 */
    bg_animate() {
      const canvas = document.createElement('canvas');
      this.ctx = canvas.getContext('2d');
      this.ctx.font = 'oblique bolder 24px fantasy';
      const textWidth =
        Math.ceil(this.ctx.measureText('sicilymarmot').width) + 10;
      canvas.width = textWidth;
      this.ctx.font = 'oblique bolder 24px fantasy';
      this.ctx.fillText('sicilymarmot', 0, 50);
      this.dom = document.getElementById('logo');
      this.dom.style.width = textWidth + 'px';
      this.dom.style.webkitMask =
        'url(' + canvas.toDataURL('image/png', 0.92) + ')';
    },
    format() { return; },
    customColorMethod() {
      return this.colors[this.getUserInfo.level.lv];
    }
  }
};
</script>

<template>
  <el-container class="warp">
    <el-header height="70px">
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="grid-content bg-purple" id="logo"></div>
        </el-col>
        <el-col :span="12" class="header_center">
          <div id="nt-title-container" class="navbar-left running-text visible-lg clearfix">
            <div class="date-top">
              <i class="el-icon-date"></i>
              {{date_year_mounth}}
            </div>
            <div class="digital">
              <i class="el-icon-time"></i>
              {{date_hour_min_sec}}
            </div>
            <div class="levelbar" v-if="getUserInfo">
              <div class="levelText">
                <li>Lv.{{getUserInfo.level.lv}}</li>
                <li>{{getUserInfo.level.textSize}}/1w</li>
              </div>
              <el-progress :percentage="percentage" :format="format" :color="customColorMethod"></el-progress>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <user-content></user-content>
          </div>
        </el-col>
        <!-- <el-col :span="8" :offset="12"></el-col> -->
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="225px">
        <el-menu @select="selectHandle" router :default-active="MODULES_INFO.find(a => a.router === $route.name).name">
          <el-menu-item v-for="(item,index) in MODULES_INFO.filter(a=> a.navShow)" :key="index" :index="item.name" :route="{name: item.router}">
            <i :class="item.icon" class="icon_color"></i>
            {{item.name}}
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-main :class="{'left-style': $route.name !== 'home'}">
        <div class="main_top" v-if="$route.name !== 'home'">
          <div class="main_top_content">
            <el-row>
              <el-col :span="4">
                <div class="main_top_text">
                  <i class="el-icon-s-platform"></i>博客状态管理 V 1.0
                </div>
              </el-col>
              <el-col :span="16">
                <div class="main_top_message">
                  <i class="el-icon-info"></i>
                  欢迎回来，上次登录：{{ getMyTime((getUserInfo || {}).lastLogin) }}
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="main_top_bottom" v-if="$route.name !== 'home'"></div>
        <div class="main_top_base" v-if="$route.name !== 'home'">
          <div></div>
          <el-row>
            <el-col :span="4">
              <i :class="MODULES_INFO.find(a => a.router === $route.name).icon"></i>
              {{MODULES_INFO.find(a => a.router === $route.name).name}}
            </el-col>
            <el-col :span="16">
              <p class="motto">
                {{(getUserInfo || {}).motto}}
              </p>
            </el-col>
          </el-row>
        </div>
        <div :class="{slot: $route.name !== 'home'}">
          <slot />
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<style  scoped>
.el-header,
.el-footer {
  color: #333;
  text-align: center;
  line-height: 70px;
  height: 70px;
}
.grid-content {
  height: 70px;
}

#logo {
  width: 140px;
  height: 74px;
  -webkit-animation: move 10s infinite;
  animation: move 10s infinite;
  background-image: url("~@/assets/images/layout_font_bg.jpg");
  /* background-image: url('~@/assets/images/bg2.jpg'); */
  background-size: cover;
  /* -webkit-mask: url(https://www.17sucai.com/preview/1424582/2018-10-22/mask/svg/seeklogo.com.svg); */
  /* mask: url(https://www.17sucai.com/preview/1424582/2018-10-22/mask/svg/seeklogo.com.svg); */
  -webkit-mask-size: cover;
  mask-size: cover;
}
.header_center {
  height: 70px;
  display: flex;
  align-items: center;
  font-size: 14px;
}
.running-text {
  box-shadow: rgba(255, 255, 255, 0.1) 0px 1px 0px;
  color: rgb(255, 255, 255);
  width: 50%;
  height: 36px;
  /* display: inline-block; */
  display: flex;

  background: none 0px 0px repeat scroll rgba(0, 0, 0, 0.2);
  border-width: 1px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.2);
  border-image: initial;
  border-radius: 30px;
  /* margin: 6px; */

  line-height: 36px;
}

.date-top {
  box-shadow: rgba(255, 255, 255, 0.1) 1px 0px 0px;
  /* float: left; */
  margin-left: 30px;
  padding-right: 15px;
  border-right: 1px solid rgba(0, 0, 0, 0.4);
}

.digital {
  box-shadow: rgba(255, 255, 255, 0.1) 1px 0px 0px;
  /* float: left; */
  margin-left: 25px;
  /* margin-right: -25px; */
  padding-right: 15px;
  border-right: 1px solid rgba(0, 0, 0, 0.4);
}

.levelbar {
  width: 200px;
}
.levelText {
  height: 20px;
  line-height: 28px;
  text-align: left;
  display: flex;
  justify-content: space-between;
  padding: 0 24px;
}

.levelText li:nth-child(2) {
  font-size: 12px;
  line-height: 34px;
  color: beige;
}

.digital li,
.date-top li {
  float: left;
}

.el-aside {
  color: #fff;
  text-align: center;

  height: 100%;
  text-align: left;
}

.el-menu {
  margin-top: 30px;
  margin-left: 10px;
  background-color: rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 7px;
}

.el-menu-item {
  color: #fff;
}
.el-menu-item:hover,
.is-active {
  background-color: rgba(0, 0, 0, 0.2);
  border-left: 2px solid #fff;
  margin-left: -2px;
}
.el-menu-item:hover::after {
  width: 0px;
  height: 0px;
  position: absolute;
  top: 24px;
  left: -6px;
  content: "";
  display: block;
  transform: rotate(90deg);
  border-bottom: 6px solid rgb(255, 255, 255);
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
}

.el-main {
  color: #333;
  text-align: center;
  height: 100%;
  position: relative;
}

.left-style:before {
  content: "";
  position: absolute;
  top: 20px;
  left: 20px;
  border-width: 0 42px 42px 0;
  border-style: solid;
  border-color: #fff rgba(55, 55, 55, 0.3);
  -webkit-box-shadow: 0 0 0 rgba(0, 0, 0, 0.4), 0 0 10px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 0 0 0 rgba(0, 0, 0, 0.4), 0 0 10px rgba(0, 0, 0, 0.3);
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.4), 0 0 10px rgba(0, 0, 0, 0.3);
  transform: rotate(-90deg);
  -webkit-transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  -o-transform: rotate(-90deg);
  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=3);
}

.el-main .main_top {
  margin-left: 42px;
  height: 42px;
  background-color: #f5f5f5;
  color: #9ea7b3;
}
.el-main .main_top_bottom {
  height: 20px;
  background-color: #f5f5f5;
}

.main_top_content {
  /* position: absolute;
  top: 0px; */
  line-height: 62px;
  height: 62px;
}
.main_top_message {
  border-left: 1px dashed #ccc;
  border-right: 1px dashed #ccc;
  height: 62px;
}
.main_top_message i {
  color: #4ac4bc;
}
.main_top_base {
  background-color: #f0f0f0;
  height: 50px;
  line-height: 50px;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
  color: #9ea7b3;
}
.motto {
  text-align: center;
}
.slot {
  background-color: #fff;
  padding: 20px;
  min-height: 1000px;
}
body > .el-container {
  margin-bottom: 40px;
  height: 100%;
}
.warp {
  height: 100%;
  /* background: url("../../assets/images/bg_city.png") center top / cover no-repeat fixed; */
  background: url("../../assets/images/bg3.jpg") center top / cover no-repeat
    fixed;
}
.icon_color {
  color: #fff;
}
@-webkit-keyframes move {
  0% {
    background-position: 0 0;
  }
  50% {
    background-position: 100% 0;
  }
}

@keyframes move {
  0% {
    background-position: 0 0;
  }
  50% {
    background-position: 100% 0;
  }
}
</style>
