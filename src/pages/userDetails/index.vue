<script type='text/ecmascript-6'>
/* COMPONENT DOCUMENT
 * author: skm
 * date: 2020/03/20
 * desc: 用户详情页
 */
import SkmService from "../../services/api";
export default {
  data() {
    var baseCheck = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("不能为空"));
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkNewPass !== "") {
          this.$refs.ruleForm.validateField("checkNewPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.newPass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      showUPForm: false,
      showEMForm: false,

      userMessageShow: false,
      userMessage: {
        // title: "管理员",
        // userName: "sdfsdfs",
        // photo: ""
      },
      ruleForm: {
        oldPass: "",
        newPass: "",
        checkNewPass: ""
      },
      rules: {
        oldPass: [{ validator: baseCheck, trigger: "blur" }],
        newPass: [{ validator: validatePass, trigger: "blur" }],
        checkNewPass: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  created() {},
  watch: {
    "this.$store.state": {
      handler(val) {
        console.log(12121, val);
        this.userMessage = val;
        this.userMessageShow = true;
      },
      deep: true
    }
  },
  mounted() {
    // this.getUserMessage();
  },
  methods: {
    getUserMessage() {
      console.log(this.$store.state.userDetails.userDetails);
      this.userMessage = this.$store.state.userDetails.userDetails;
      this.userMessageShow = true;
    },
    handleAvatarSuccess(res, file) {
      console.log("上传回调");
      console.log(arguments);
      this.userMessage.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type; //=== ('image/jpeg' || 'image/png' || 'image/jpg');
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 jpeg/jpg/png 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    submitForm(formName) {
      console.log(this.$refs[formName]);
      console.log(this.$refs[formName].validate);
      console.log("formName", formName);
      this.$refs[formName].validate(valid => {
        console.log("valid", valid);
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    async userUpDate() {
      SkmService.userUpdate({});
    }
  }
};
</script>

<template>
  <layout>
    <div class="detailwarp">
      <div class="top massive_css2">
        <!-- <p>
          <span>管理员：</span>
          <span v-if="userMessage.userName">{{userMessage.userName}}</span>
        </p>-->
        <div class="topHead">
          <el-row>
            <el-col :span="1" :offset="1">
              <el-upload
                class="avatar-uploader"
                action="http://127.0.0.1:3000/editor/uploadImg"
                :with-credentials="true"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <div class="el-upload">
                  <img v-if="userMessageShow" :src="userMessage.photo" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  <div class="after">上传头像</div>
                </div>
              </el-upload>
            </el-col>
            <el-col :span="8" class="nameAndpush">
              <div class="userName">superOldman</div>

              <input
                id="h-sign"
                type="text"
                placeholder="编辑个性签名"
                maxlength="60"
                class="space_input"
              />
              <!-- <div class="userPushPaperNum">发表文章：1</div> -->
            </el-col>
          </el-row>
        </div>

        <div class="topFoot">
          <el-row>
            <el-col :offset="1" :span="2" class="topFoot_first">
              <div class="topFoot_title">发表文章</div>
              <div class="topFoot_sum">1篇</div>
            </el-col>
            <el-col :span="10">
              <div class="topFoot_title">涉猎分类</div>
              <div class="topFoot_sum">安抚，说法</div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div></div>

      <div class="contentSetting">
        <div class="settingGrid">
          <el-row class="settingGridSetheight">
            <el-col :span="6">
              <i class="el-icon-success"></i>邮箱
            </el-col>
            <el-col :span="12" class="setting_mid">15221955725@163.com</el-col>
            <el-col :span="6">
              <el-button @click="showEMForm = !showEMForm">修改</el-button>
            </el-col>
          </el-row>
        </div>
        <div class="settingGrid">
          <!-- <transition-group  class="settingGrid"> -->
          <el-row class="settingGridSetheight">
            <el-col :span="6">
              <i class="el-icon-warning"></i>密码
            </el-col>
            <el-col :span="12" class="setting_mid">设置了</el-col>
            <el-col :span="6">
              <el-button @click="showUPForm = !showUPForm">修改</el-button>
            </el-col>
          </el-row>

          <div v-if="showUPForm" class="form_message">
            <p class="form_message_text">重置密码</p>
            <el-form
              :model="ruleForm"
              status-icon
              :rules="rules"
              ref="ruleForm1"
              label-width="100px"
              label-position="left"
              class="demo-ruleForm"
            >
              <el-form-item label="旧密码" prop="oldPass">
                <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="新密码" prop="newPass">
                <el-input type="password" v-model="ruleForm.newPass" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="确认新密码" prop="checkNewPass">
                <el-input type="password" v-model="ruleForm.checkNewPass" autocomplete="off"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm1')">提交</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>

<style  scoped >
.detailwarp {
  text-align: left;
}
.topHead {
  height: 84px;
  background-image: url("~@/assets/images/userTopbg.webp");
  background-position: 50%;
  background-size: cover;
  transition: background-image 0.2s ease, background-size 1s ease;
  padding-top: 116px;
  position: relative;
}
#h-sign {
  box-shadow: none;
  color: rgb(214, 222, 228);
  font-size: 12px;
  font-family: "Microsoft Yahei";
  line-height: 26px;
  height: 26px;
  margin-left: -5px;
  position: relative;
  top: -1px;
  width: 730px;
  background: transparent;
  border-radius: 4px;
  border-width: initial;
  border-style: none;
  border-color: initial;
  border-image: initial;
  padding: 0px 5px;
}
#h-sign:hover {
  box-shadow: rgba(255, 255, 255, 0.5) 0px 0px 0px 1px;
  background: rgba(255, 255, 255, 0.2);
}

#h-sign:focus {
  box-shadow: rgba(35, 54, 86, 0.3) 0px 2px 4px inset;
  color: rgb(109, 117, 122);
  background: rgb(255, 255, 255);
}
.space_input {
  line-height: 28px;
  height: 28px;
  vertical-align: top;
  padding: 0px 10px;
  transition: all 0.3s ease 0s;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(204, 208, 215);
  border-image: initial;
  border-radius: 0px;
}

.topFoot {
  height: 60px;
  line-height: 30px;
  font-size: 14px;
}
.topFoot_first {
  text-align: center;
}
.topFoot_title {
  color: dimgray;
}

.topFoot_sum {
  color: #8c939d;
}
.avatar-uploader {
  font-size: 0;
  /* width: 68px;
  height: 68px;
  margin-top: 10px; */
}
.avatar-uploader .el-upload {
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.5s;
  width: 68px;
  height: 68px;
}
.avatar-uploader .el-upload .after {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 14px;
  line-height: 68px;
  text-align: center;
  transition: all 0.5s;
  opacity: 0;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader .el-upload:hover .after {
  opacity: 1;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 68px;
  height: 68px;
  line-height: 68px;
  text-align: center;
}
.avatar {
  width: 68px;
  height: 68px;
  display: block;
}

.top .nameAndpush {
  margin-left: 30px;
}

.top .nameAndpush .userName {
  line-height: 50px;
  color: #fff;
  height: 50px;
  font-size: 24px;
  font-weight: bold;
}

.top .nameAndpush .userPushPaperNum {
  line-height: 26px;
  color: #fff;
  height: 26px;
  font-size: 14px;
  /* font-weight: bold; */
}

.contentSetting {
  border-top: 1px solid #e5e9ef;

  width: 1000px;
  margin: 100px auto 0;
  text-align: center;
  font-size: 16px;
}

.settingGrid {
  border-bottom: 1px solid #e5e9ef;
  transition: 0.5s all;
}

.settingGridSetheight {
  height: 60px;
  line-height: 60px;
}
.settingGrid i {
  color: #48bd86;
  /* font-size: 24px;
  line-height: 60px; */
  margin-right: 15px;
}

.settingGrid .setting_mid {
  color: #6d757a;
  font-size: 14px;
}

.form_message {
  padding-top: 20px;
  padding-left: 100px;
  width: 50%;
}
.form_message_text {
  font-size: 24px;
  margin: 20px 0;
  text-align: left;
}
</style>


