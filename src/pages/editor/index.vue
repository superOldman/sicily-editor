<script type='text/ecmascript-6'>
/* COMPONENT DOCUMENT
 * author: skm
 * date: 2020/03/17
 * desc: 文章编辑
 */
import twMarkdownView from "../../components/markdownEditor/markdownEditor.vue";
import setTags from "../../components/setTags/setTags.vue";
import SkmService from "../../services/api";

export default {
  data() {
    return {
      markdownView: null,
      isNewEditor: false,
      imageUrl: "",
      options: {
        title: "标题",
        author: "superOldman",
        info: "简介...",
        content: null,
        markdown: null,
        saveImageUrl: "",
        hasTags: [],
        hasFolder: "",
        // config: {
        //   editorId: "markdown-editor",
        //   config: { markdown: "qweqeqweqw" }
        // }
      }
    };
  },
  components: {
    twMarkdownView,
    setTags
  },
  // computed:{
  //   isNewEditor(data){ return data },
  // },
  created() {
    this.getArticleById();
  },
  mounted() {},
  methods: {
    getArticleById() {
      if (window.location.href.indexOf("?") !== -1) {
        let articleId = window.location.href.split("?id=")[1];
        SkmService.searchById({ id: articleId }).then(data => {
          if (data.code === 0) {
            this.options = data.list;
            this.isNewEditor = true;
          }
        });
      } else {
        this.isNewEditor = true;
      }
    },
    onchange(obj) {
      this.markdownView = obj;
      if (this.isNewEditor) {
        this.newEditor();
      } else {
        this.againEditor();
      }
    },
    againEditor() {
      const self = this;
      SkmService.saveEditorHtml({
        id: self.options._id,
        title: self.options.title,
        info: self.options.info,
        markdown: self.markdownView.markdown,
        content: self.markdownView.html,
        author: self.options.author
      }).then(data => {
        self.$alert(data.message, "提示", {
          confirmButtonText: "知道了"
        });
      });
    },
    newEditor() {
      // const self = this;
      console.log(this.options)

      // SkmService.saveHtml(this.options).then(data => {
      //   self.$alert(data.message, "提示", {
      //     confirmButtonText: "知道了"
      //   });
      // });
    },
    handleAvatarSuccess(res, file) {
      console.log("上传回调");
      console.log(arguments);
      this.imageUrl = URL.createObjectURL(file.raw);
      this.options.saveImageUrl = res.file.path;
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
    addTags(item){
      item && this.options.hasTags.push(item)
    },
    removeTag(index){
      this.options.hasTags.splice(index,1)
            
    }

  }
};
</script>

<template>
  <layout>
    <div>
      editor
      <el-row :gutter="20">
        <el-col :span="10">
          <div class="form_message">
            <p class="form_message_text">编辑</p>
            <el-form label-width="100px" label-position="left" class="title">
              <el-form-item label="标题">
                <el-input type="text" v-model="options.title"></el-input>
              </el-form-item>
              <el-form-item label="详情">
                <el-input type="textarea" v-model="options.info"></el-input>
              </el-form-item>
              <el-form-item label="作者">
                <el-input type="text" v-model="options.author"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="upLoadImgTitle">上传图片</div>
          <el-upload
            class="avatar-uploader"
            drag
            :show-file-list="false"
            action="http://127.0.0.1:3000/editor/uploadImg"
            :with-credentials="true"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="imageUrl || options.saveImageUrl"
              :src="imageUrl || options.saveImageUrl"
              class="avatar"
            />
            <div v-else>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </div>
          </el-upload>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="6">
          <!-- <setTags :options="{ hasInput: true, hasTags:[123] }"></setTags> -->
          <setTags class="cWrcMb" :hasInput="true" :hasTags="options.hasTags" @addTag="addTags" @removeTag="removeTag"></setTags>
        </el-col>
      </el-row>

      <tw-markdown-view
        v-if="isNewEditor"
        :config="{ markdown: options.markdown  }"
        @onchange="onchange"
      ></tw-markdown-view>
    </div>
  </layout>
</template>

<style  scoped >
.form_message {
  padding-top: 20px;
  width: 100%;
}
.form_message_text {
  font-size: 24px;
  margin: 20px 0;
}

.upLoadImgTitle {
  margin: 20px 0;
  font-size: 26px;
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

.cWrcMb {
    margin-bottom: 20px;
    height: 200px;
    font-family: Ubuntu, sans-serif;
    text-align: right;
    color: rgb(150, 150, 150);
    box-shadow: rgba(0, 0, 0, 0.5) 0px 1px 20px -8px;
    text-shadow: rgba(0, 0, 0, 0.1) 0px 0px 1px;
    background: rgb(255, 255, 255);
    border-radius:5px;
    overflow: hidden;
}
</style>
