<script>
import layout from "../../components/layout/index.vue";
import myDialog from "../../components/myDialog/index.vue";

import SkmService from "../../services/api";

export default {
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
        folderName: "",
        cover: "",
        info: "",
        _id: "",
        // folderHasPaper:[]
      },
      rules: {
        folderName: [
          { required: true, message: "请输入文件夹名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        info: [{ required: true, message: "请填文件夹简介", trigger: "blur" }]
      },



      /** 文分类文章列表 */
      pushPaperFormFolderId: '',
      paperList:[
        {
          _id: '12313',
          title: '标题',
          info: '简介简介',
        },
        {
          _id: '12313',
          title: '标题',
          info: '简介简介',
        },
      ],
      paperList_currentPage: 1,
      multipleSelection: [],
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
      this.listData = result.data;
    },




    /** 列表编辑 */
    handleEdit(index, row) {     
      this.ruleForm = {
        folderName: row.folderName,
        cover: row.cover,
        info: row.info,
        index,
        _id: row._id,
        
      }
      this.isCreate = false;
      this.dialogTitle = '编辑',
      this.dialogBtn = '立即保存',
      this.dialogVisible = true;
    },

    pushPaperBtn(index, row) {     
      console.log(index,row)
     
      // this.dialogPPVisible = true;
      SkmService.get_list({unclassified: true}).then((data)=>{
       

        if(data.data.length){
           this.pushPaperFormFolderId = row._id
           this.paperList = data.data;
          this.dialogPPVisible = true;
          
        }else{
          this.$message({ type: 'info', message: '暂时没有未分配的文章!' });
        }
      })
    },

    handleDelete(index, row) {

      this.$confirm('此操作将永久删除该文件夹, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          
          SkmService.deleteFolder({_id: row._id}).then((data)=>{
            if(data.code === 0){
             this.$message({ type: 'success', message: '删除成功!' });
             this.listData.splice(index,1) // 请求接口删除  why 前端操作
            }
          })

        }).catch(() => {
          this.$message({ type: 'info', message: '已取消删除' });          
        });
      
    },




    /** 表单弹窗 */ 
    showDialog() {
      
      this.dialogVisible = true;
      this.ruleForm = {
        folderName: "",
        cover: "",
        info: "",
        _id: "",
      };
      this.isCreate = true;
    },
    submitForm() {
      console.log('this.$refs')
      console.log(this.$refs)
      console.log(this.$refs.newFolderform)
      
      this.$refs.newFolderform.validate(valid => {
        console.log(valid)
        if (valid) {
          this.changeList()
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      console.log(formName)
      // this.$refs[formName].resetFields();
      this.ruleForm.folderName = '';
      this.ruleForm.cover = '';
      this.ruleForm.info = '';
      this.ruleForm._id = '';

    },

    async changeList() {
      this.dialogVisible = false;

      if(this.isCreate){
        let insertObj = {};

        for(let item in this.ruleForm){
          if(item !== '_id'){
            insertObj[item] = this.ruleForm[item]
          }
        }

        const result = await SkmService.saveFolder(insertObj);
        this.listData.push(result.data)
        this.$message({ type: 'success', message: '创建成功!' });

      }else{
       
        await SkmService.saveEditorFolder(this.ruleForm);
        // this.listData[this.ruleForm.index] = result.data;
        await this.getFolderList();
        this.$message({ type: 'success', message: '修改成功!' });
      }
      
    },


    /** 上传图片 */ 
    handleAvatarSuccess(res) {

      this.ruleForm.cover = 'http://localhost:3000/' + res.file.path;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === ("image/jpeg" || "image/png" || "image/jpg");
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 jpeg/jpg/png 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    /** 加文章 */ 
    closeMydialog(){
      this.dialogVisible = false
    },
    closeMydialogPP(){
      this.dialogPPVisible = false
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log('xuanze:')
      console.log(this.multipleSelection)
    },
    submitFormPP() {
      if (this.multipleSelection.length === 0){
        this.$message({ type: 'info', message: '还没选择添加的文章!' });
      }else{
        let folderHasPaper = [];
        this.multipleSelection.forEach((item)=>{
          folderHasPaper.push({
            _id: item._id,
            title: item.title,
          })
        })
        SkmService.pushPaper({ _id: this.pushPaperFormFolderId, folderHasPaper})
        .then((data)=>{
          if (data.code === 0) {
            this.dialogPPVisible = false;
            this.$message({ type: 'success', message: '添加完毕!' });
            this.getFolderList()
          }
        })
      }
     
    },




  },
  mounted() {},
  created() {
    this.getFolderList()
  }
};
</script>
<template>
  <layout>
    <myDialog v-if="dialogVisible" :dialogVisible="dialogVisible" :dialogTitle="dialogTitle" :dialogBtn="dialogBtn" :hasResetForm="hasResetForm" 
        @closeMyDialog="closeMydialog" 
        @resetForm="resetForm"
        @submitForm="submitForm" >
      <div class="myDialogBody">
        <el-form :model="ruleForm" :rules="rules" ref="newFolderform" label-width="100px" class="demo-ruleForm">
          <el-form-item label="封面">
            <el-upload
              class="avatar-uploader"
              action="http://127.0.0.1:3000/editor/uploadImg"
              :with-credentials="true"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <div class="el-upload">
                <img v-if="ruleForm.cover" :src="ruleForm.cover" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </div>
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
      
    <myDialog v-if="dialogPPVisible" :dialogVisible="dialogPPVisible" :dialogTitle="dialogPPTitle" :dialogBtn="dialogPPBtn" :hasResetForm="hasResetFormPP" 
        @closeMyDialog="closeMydialogPP" 
        @submitForm="submitFormPP" >
      <div class="myDialogBody">
        <el-table
          ref="multipleTable"
          :data="paperList"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="_id" label="id" width="120"></el-table-column>
          <el-table-column prop="title" label="标题" width="120"></el-table-column>
          <el-table-column prop="info" label="简介" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-pagination
          v-if="paperList.length"
          :current-page="paperList_currentPage"
          :page-size="10"
          layout="total, prev, pager, next"
          :total="paperList.length"
        ></el-pagination>
        <el-divider><i class="el-icon-mobile-phone"></i></el-divider>
        <div>
          <el-tag
            v-for="item in multipleSelection"
            :key="item.title"
            closable
          >
            {{item.title}}
          </el-tag>
        </div>

      </div>
    </myDialog>


    <div class="warp">
      <el-row class="listTop">
        <el-col :span="6">
          <div class="listTop_left">
            <div class="saveButton">
              <i class="el-icon-upload"></i>
            </div>
            <div class="pageTitle">Folder</div>
          </div>
        </el-col>
        <el-col :span="6" :offset="12">
          <ul class="btns">
            <li @click="showDialog">
              <i class="el-icon-folder-add"></i>
            </li>
          </ul>
        </el-col>
      </el-row>
      <el-table :data="listData"  style="width: 100%">
        <el-table-column label="名称" prop="folderName"></el-table-column>
        <el-table-column label="背景">
          <template slot-scope="scope">
            <img :src="scope.row.cover" width="80" height="80" class="head_pic" />
          </template>
        </el-table-column>
        <el-table-column label="创建日期" prop="updated_at"></el-table-column>
        <el-table-column label="简介" prop="info"></el-table-column>
        <el-table-column label="包含文章" >
          <template slot-scope="scope">
            <el-tag v-for="(item,key) in scope.row.folderHasPaper" :key="key">{{item.title}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="编辑">
          <template slot-scope="scope">
            <el-button size="mini" @click="pushPaperBtn(scope.$index, scope.row)">加文章</el-button>
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
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
    </div>
  </layout>
</template>


<style scoped>
.warp {
  width: 100%;
  /* height: 100%; */
  box-shadow: rgba(0, 0, 0, 0.5) 0px 1px 20px -8px;
  /* position: relative; */
  /* overflow: hidden; */
  margin-top: 30px;
}
.listTop {
  background-color: #fff;
  border-bottom: 1px solid #000;
  height: 50px;
  line-height: 50px;
  font-size: 18px;
}
.listTop_left {
  height: 50px;
}
.pageTitle {
  /* display: inline-block; */
  float: left;
}
.saveButton {
  position: relative;
  top: -25px;
  left: 25px;
  background-color: deeppink;
  width: 50px;
  height: 50px;
  color: cornsilk;
  line-height: 50px;
  text-align: center;
  font-size: 24px;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 1px 10px -8px;
}


.btns {
  width: 100%;
  height: 100px;
  font-size: 28px;
  color: #ccc;
}
.btns li {
  display: inline-block;
  margin: 0 20px;
}
.btns li:hover {
  cursor: pointer;
}
.btns li:hover i {
  color: coral;
}

.el-pagination {
  text-align: right;
  padding: 4px 20px;
}

.myDialogBody {
  padding-right: 20px;
}

.avatar-uploader {
  font-size: 0;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.5s;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
