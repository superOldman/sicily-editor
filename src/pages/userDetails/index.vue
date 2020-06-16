<script type='text/ecmascript-6'>
/* COMPONENT DOCUMENT
 * author: skm
 * date: 2020/03/20
 * desc: 用户详情页
 */
import SkmService from "../../services/api";
import { mapGetters } from "vuex";
import address from "../../constant/address";
export default {
  data() {
    var baseCheck = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("不能为空"));
      }
      callback();
    };
    var checkUserName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("不能为空"));
      } else {
        if (this.ruleForm2.delete !== this.getUserInfo.userName) {
          callback(new Error("用户名输错了"));
        }
        callback();
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
      showDELETEForm: false,
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
        checkNewPass: [{ validator: validatePass2, trigger: "blur" }],
        delete: [{ validator: checkUserName, trigger: "blur" }]
      },

      ruleForm2: {
        delete: ""
      },
      uploadAddress: address + '/editor/uploadImg',
    };
  },
  computed: {
    ...mapGetters("userMessageModule", ["getUserInfo"])
  },
  created() {},
  watch: {
    // "$store.state.userDetails.userDetails": {
    //   handler(val) {
    //     console.log(12121, val);
    //     this.userMessage = val;
    //   },
    //   deep: true
    // }
  },
  mounted() {},
  methods: {
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
      this.$refs[formName].validate(valid => {
        if (valid) {
          let userMessage = this.ruleForm;
          this.userUpDate({ username: this.getUserInfo.userName, userMessage });
        }
      });
    },
    deleteUser(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("删除用户");

          this.$confirm(`确定删除该用户？`)
            .then(() => {
              //  console.log("确定删除用户");
               this.$store.commit("userMessageModule/clearUser");
               SkmService.writeOff({ username: this.ruleForm2.delete });
             
            })
            .catch(() => {});
         
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    async userUpDate(params) {
      const result = await SkmService.userUpdate(params);
      if (result.code === 0) {
        this.$store.commit("userMessageModule/clearUser");
        SkmService.islogin();
      } else {
        this.$alert(result.message, "错误", { confirmButtonText: "确定" });
      }
    }
  }
};
</script>

<template>
  <layout>
    <div class="detailwarp">
      <div class="top massive_css2">
        <div class="topHead">
          <el-row>
            <el-col :span="1" :offset="1">
              <el-upload
                class="avatar-uploader"
                :action="uploadAddress"
                :with-credentials="true"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <div class="el-upload">
                  <img :src="(getUserInfo || {}).photo" class="avatar" />
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                  <div class="after">上传头像</div>
                </div>
              </el-upload>
            </el-col>
            <el-col :span="8" class="nameAndpush">
              <div class="userName">{{(getUserInfo || {}).userName }}</div>
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
          <el-row class="settingGridSetheight">
            <el-col :span="6">
              <i class="el-icon-success"></i>密码
            </el-col>
            <el-col :span="12" class="setting_mid">设置了</el-col>
            <el-col :span="6">
              <el-button @click="showUPForm = !showUPForm">修改</el-button>
            </el-col>
          </el-row>
          <el-collapse-transition>
            <div v-show="showUPForm" class="form_message">
              <p class="form_message_text">重置密码</p>
              <el-form
                :model="ruleForm"
                status-icon
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                label-position="left"
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
                  <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                  <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-collapse-transition>
        </div>
        <div class="settingGrid">
          <el-row class="settingGridSetheight">
            <el-col :span="6">
              <i class="el-icon-warning"></i>
              <el-button @click="showDELETEForm = !showDELETEForm">注销用户</el-button>
            </el-col>
          </el-row>
          <el-collapse-transition>
            <div v-show="showDELETEForm" class="form_message">
              <p class="form_message_text">注销</p>
              <el-form
                :model="ruleForm2"
                status-icon
                :rules="rules"
                ref="ruleForm2"
                label-width="100px"
                label-position="top"
              >
                <el-form-item label="输入用户名确定注销" prop="delete">
                  <el-input type="text" v-model="ruleForm2.delete" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="deleteUser('ruleForm2')">提交</el-button>
                  <el-button @click="resetForm('ruleForm2')">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-collapse-transition>
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


