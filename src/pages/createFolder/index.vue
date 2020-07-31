<script>
import layout from '../../components/layout/index.vue';
import myDialog from '../../components/myDialog/index.vue';
import SkmService from '../../services/api';
import address from '../../constant/address';
import { myGetTime } from '../../utils/utils';
export default {
  name: 'createFolder',
  data() {
    return {
      listData: [
        // {
        //   folderName: "王小虎",
        //   // showPaperId: "2131231231231231",saveFolder
        //   updated_at: "2016-05-02 11:11:11",
        //   cover: "../../assets/images/logo.png",
        //   info: "上海市普陀区金沙江路 1518 弄"
        // }
      ],

      currentPage: 1,

      /** dialog */

      dialogTitle: '新建文件夹',
      dialogBtn: '立即创建',
      hasResetForm: true,

      /** dialog */

      dialogPPTitle: '添加文章',
      dialogPPBtn: '保存',
      hasResetFormPP: false,
      dialogPPVisible: false,

      /** 新建表单 */

      dialogVisible: false,
      isCreate: true,
      ruleForm: {
        folderName: '',
        cover: '',
        info: '',
        _id: ''
        // folderHasPaper:[]
      },
      rules: {
        folderName: [
          { required: true, message: '请输入文件夹名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        info: [{ required: true, message: '请填文件夹简介', trigger: 'blur' }]
      },

      uploadAddress: address + '/editor/uploadImg',

      /** 文分类文章列表 */
      pushPaperFormFolderId: '',
      paperList: [
        {
          _id: '12313',
          title: '标题',
          info: '简介简介'
        },
        {
          _id: '12313',
          title: '标题',
          info: '简介简介'
        }
      ],
      paperList_currentPage: 1,
      multipleSelection: []
    };
  },
  components: {
    layout,
    myDialog
  },
  methods: {
    /** 初始化加载 */

    async getFolderList() {
      const result = await SkmService.getFolderList();
      result.data.forEach(item => {
        item.updated_at = myGetTime(item.updated_at);
      });
      this.listData = result.data;
    },

    /** 列表编辑 */
    handleEdit(index, row) {
      this.ruleForm = {
        folderName: row.folderName,
        cover: row.cover,
        info: row.info,
        index,
        _id: row._id
      };
      this.isCreate = false;
      this.dialogTitle = '编辑';
      this.dialogBtn = '立即保存';
      this.dialogVisible = true;
    },

    pushPaperBtn(index, row) {
      console.log(index, row);

      // this.dialogPPVisible = true;
      SkmService.get_list({ unclassified: true }).then(data => {
        if (data.data.length) {
          this.pushPaperFormFolderId = row._id;
          this.paperList = data.data;
          this.dialogPPVisible = true;
        } else {
          this.$message({ type: 'info', message: '暂时没有未分配的文章!' });
        }
      });
    },

    handleDelete(index, row) {
      this.$confirm('此操作将永久删除该文件夹, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          SkmService.deleteFolder({ _id: row._id }).then(data => {
            if (data.code === 0) {
              this.$message({ type: 'success', message: '删除成功!' });
              this.listData.splice(index, 1); // 请求接口删除  why 前端操作
            }
          });
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消删除' });
        });
    },

    /** 表单弹窗 */

    showDialog() {
      this.dialogVisible = true;
      this.ruleForm = {
        folderName: '',
        cover: '',
        info: '',
        _id: ''
      };
      this.isCreate = true;
      this.dialogTitle = '新建文件夹';
      this.dialogBtn = '立即创建';

    },
    submitForm() {
      console.log('this.$refs');
      console.log(this.$refs);
      console.log(this.$refs.newFolderform);

      this.$refs.newFolderform.validate(valid => {
        console.log(valid);
        if (valid) {
          this.changeList();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      console.log(formName);
      // this.$refs[formName].resetFields();
      this.ruleForm.folderName = '';
      this.ruleForm.cover = '';
      this.ruleForm.info = '';
      this.ruleForm._id = '';
    },

    async changeList() {
      this.dialogVisible = false;

      if (this.isCreate) {
        let insertObj = {};

        for (let item in this.ruleForm) {
          if (item !== '_id') {
            insertObj[item] = this.ruleForm[item];
          }
        }

        const result = await SkmService.saveFolder(insertObj);
        this.listData.push(result.data);
        this.$message({ type: 'success', message: '创建成功!' });
      } else {
        await SkmService.saveEditorFolder(this.ruleForm);
        // this.listData[this.ruleForm.index] = result.data;
        await this.getFolderList();
        this.$message({ type: 'success', message: '修改成功!' });
      }
    },

    /** 上传图片 */

    handleAvatarSuccess(res) {
      this.ruleForm.cover = address + '/' + res.file.path;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type; // === ("image/jpeg" || "image/png" || "image/jpg");
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 jpeg/jpg/png 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },

    /** 加文章 */

    closeMydialog() {
      this.dialogVisible = false;
    },
    closeMydialogPP() {
      this.dialogPPVisible = false;
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log('xuanze:');
      console.log(this.multipleSelection);
    },
    submitFormPP() {
      if (this.multipleSelection.length === 0) {
        this.$message({ type: 'info', message: '还没选择添加的文章!' });
      } else {
        let folderHasPaper = [];
        this.multipleSelection.forEach(item => {
          folderHasPaper.push({
            _id: item._id,
            title: item.title
          });
        });
        SkmService.pushPaper({
          _id: this.pushPaperFormFolderId,
          folderHasPaper
        }).then(data => {
          if (data.code === 0) {
            this.dialogPPVisible = false;
            this.$message({ type: 'success', message: '添加完毕!' });
            this.getFolderList();
          }
        });
      }
    }
  },
  mounted() {},
  created() {
    this.getFolderList();
  }
};
</script>
<template>
  <layout>
    <div class="massive_css createFolderWarp">
      <el-row class="listTop">
        <el-col :span="6">
          <div class="listTop_left">
            <div class="saveButton">
              <i class="el-icon-upload"></i>
            </div>
            <div class="pageTitle">Folder</div>
          </div>
        </el-col>
        <el-col :span="4" :offset="14">
          <ul class="btns">
            <li @click="showDialog">
              <i class="el-icon-folder-add"></i>新建文件夹
            </li>
            <li></li>
          </ul>
        </el-col>
      </el-row>
      <el-table :data="listData" style="width: 98%; margin: 0 auto;">
        <el-table-column label="名称" prop="folderName" width="100"></el-table-column>
        <el-table-column label="背景" width="100">
          <template slot-scope="scope">
            <img
              :src="scope.row.cover || 'http://img0.imgtn.bdimg.com/it/u=1003180970,3716906246&fm=26&gp=0.jpg'"
              width="80"
              height="80"
              class="head_pic"
            />
          </template>
        </el-table-column>
        <el-table-column label="创建日期" prop="updated_at" width="180"></el-table-column>
        <el-table-column label="简介" prop="info" width></el-table-column>
        <el-table-column label="包含文章" width>
          <template slot-scope="scope">
            <el-tag v-for="(item,key) in scope.row.folderHasPaper" :key="key">{{item.title}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="编辑" width="280">
          <template slot-scope="scope">
            <el-button size="mini" @click="pushPaperBtn(scope.$index, scope.row)">加文章</el-button>
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-if="listData.length"
        :current-page="currentPage"
        :page-size="10"
        layout="total, prev, pager, next  "
        :total="listData.length"
      ></el-pagination>

    <myDialog
      v-if="dialogVisible"
      :dialogVisible="dialogVisible"
      :dialogTitle="dialogTitle"
      :dialogBtn="dialogBtn"
      :hasResetForm="hasResetForm"
      @closeMyDialog="closeMydialog"
      @resetForm="resetForm"
      @submitForm="submitForm"
      class="create-folder-dialog"
    >
      <div class="myDialogBody">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="newFolderform"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="封面">
            <el-upload
              class="avatar-uploader"
              :action="uploadAddress"
              :with-credentials="true"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <el-image v-if="ruleForm.cover" :src="ruleForm.cover" class="avatar" :fit="'cover'"/>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item label="文件夹名称" prop="folderName">
            <el-input v-model="ruleForm.folderName"></el-input>
          </el-form-item>

          <el-form-item label="文件夹简介" prop="info">
            <el-input type="textarea" v-model="ruleForm.info"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </myDialog>

    <myDialog
      v-if="dialogPPVisible"
      :dialogVisible="dialogPPVisible"
      :dialogTitle="dialogPPTitle"
      :dialogBtn="dialogPPBtn"
      :hasResetForm="hasResetFormPP"
      @closeMyDialog="closeMydialogPP"
      @submitForm="submitFormPP"
    >
      <div class="myDialogBody">
        <el-table
          ref="multipleTable"
          :data="paperList"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="_id" label="id" width></el-table-column>
          <el-table-column prop="title" label="标题" width></el-table-column>
          <el-table-column prop="info" label="简介" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-pagination
          v-if="paperList.length"
          :current-page="paperList_currentPage"
          :page-size="10"
          layout="total, prev, pager, next"
          :total="paperList.length"
        ></el-pagination>
        <el-divider>
          <i class="el-icon-mobile-phone"></i>
        </el-divider>
        <div>
          <el-tag v-for="item in multipleSelection" :key="item.title" closable>{{item.title}}</el-tag>
        </div>
      </div>
    </myDialog>

    </div>
  </layout>
</template>


<style lang="less" scoped>
@import "./createFolder.less";
</style>
