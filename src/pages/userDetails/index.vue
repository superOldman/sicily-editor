<script type='text/ecmascript-6'>
/* COMPONENT DOCUMENT
 * author: skm
 * date: 2020/03/20
 * desc: 用户详情页
 */
import SkmService from '../../services/api';
import { mapGetters } from 'vuex';
import address from '../../constant/address';
export default {
  data() {
    var baseCheck = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'));
      }
      callback();
    };
    var checkUserName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'));
      } else {
        if (this.ruleForm2.delete !== this.getUserInfo.userName) {
          callback(new Error('用户名输错了'));
        }
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkNewPass !== '') {
          this.$refs.ruleForm.validateField('checkNewPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.newPass) {
        callback(new Error('两次输入密码不一致!'));
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
        oldPass: '',
        newPass: '',
        checkNewPass: ''
      },
      rules: {
        oldPass: [{ validator: baseCheck, trigger: 'blur' }],
        newPass: [{ validator: validatePass, trigger: 'blur' }],
        checkNewPass: [{ validator: validatePass2, trigger: 'blur' }],
        delete: [{ validator: checkUserName, trigger: 'blur' }]
      },

      ruleForm2: {
        delete: ''
      },
      uploadAddress: address + '/users/uploadUserPhoto',
      motto: ''
    };
  },
  computed: {
    ...mapGetters('userMessageModule', ['getUserInfo'])
  },
  created() {},
  watch: {
    '$store.state.userMessageModule.userDetails.motto': {
      handler(val) {
        this.motto = val;
      }
    }
  },
  mounted() {
    this.motto = this.getUserInfo.motto;
  },
  methods: {
    handleAvatarSuccess(res, file) {
      console.log('上传回调');
      console.log(res, file);
      this.$store.dispatch('userMessageModule/refushUserPhotoFun', URL.createObjectURL(file.raw));
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type; // === ('image/jpeg' || 'image/png' || 'image/jpg');
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 jpeg/jpg/png 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
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
          this.$confirm('确定删除该用户？')
            .then(() => {
              this.$store.commit('userMessageModule/clearUser');
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
        this.$store.commit('userMessageModule/clearUser');
        this.$router.push({ name: 'login' });
      } else {
        this.$alert(result.message, '错误', { confirmButtonText: '确定' });
      }
    },
    async upDateMotto() {
      if(this.motto !== this.getUserInfo.motto) {
        const result = await SkmService.uploadUserMotto({ motto: this.motto });
        if (result.code === 1) {
          this.$alert('告警', result.message);
          return;
        }
        this.$store.dispatch('userMessageModule/refushUserMottoFun', this.motto);
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
                <img :src="(getUserInfo || {}).photo" class="avatar" />
                <div class="after">上传头像</div>
              </el-upload>
            </el-col>
            <el-col :span="8" class="nameAndpush">
              <div class="userName">{{(getUserInfo || {}).userName }}</div>
              <el-input
                id="h-sign"
                type="text"
                placeholder="编辑个性签名"
                maxlength="60"
                class="space_input"
                v-model="motto"
                @blur="upDateMotto"
              ></el-input>
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

<style lang="less">
@import "./userDetails.less";
</style>


