<script type='text/ecmascript-6'>
/* COMPONENT DOCUMENT
 * author: skm
 * date: 2020/03/17
 * desc: 文章编辑
 */
import twMarkdownView from "../../components/markdownEditor/markdownEditor.vue";
import setTags from "../../components/setTags/setTags.vue";
import SkmService from "../../services/api";
import address from "../../constant/address";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      markdownView: null,
      isNewEditor: false,
      isShowEditor: false,
      imageUrl: "",
      placeholder: {
        title: "标题",
        info: "简介..."
      },
      options: {
        title: "",
        author: "", //this.$store.state.getUserInfo(),
        info: "",
        content: null,
        markdown: null,
        imageUploadURL: address + "/editor/uploadImg",
        saveImageUrl: "",
        hasTags: [],
        hasFolder: ""
        // config: {
        //   editorId: "markdown-editor",
        //   config: { markdown: "qweqeqweqw" }
        // }
      },
      // 文件夹列表
      folderListShow: false,
      createfolderShow: false,
      folderList: [],
      showFolderName: "选择文件夹",
      uploadAddress: address + "/editor/uploadImg"
    };
  },
  components: {
    twMarkdownView,
    setTags
  },
  computed: {
    ...mapGetters("userMessageModule", ["getUserInfo"])
  },
  created() {
    this.getArticleById();
    this.getFolderList();

    console.log(this.$store.state);
    // return this.$store.state.getUserInfo()
  },
  mounted() {},
  methods: {
    async getArticleById() {
      if (window.location.href.indexOf("?") !== -1) {
        // this.$route.query.id
        let articleId = window.location.href.split("?id=")[1];
        const result = await SkmService.searchById({ id: articleId });
        if (result.code === 0) {
          this.options = result.list;
          this.isNewEditor = false;
          this.isShowEditor = true;
        }
      } else {
        this.isNewEditor = true;
        this.isShowEditor = true;
      }
    },
    async getFolderList() {
      const result = await SkmService.getFolderList();
      if (result.code === 0) {
        result.data.forEach((item, index) => {
          this.folderList[index] = item.folderName;
        });
        this.folderListShow = true;
      }
      if (!this.folderList.length) {
        this.createfolderShow = true;
      }
    },

    onchange(obj) {
      this.options.content = obj.html;
      this.options.markdown = obj.markdown;
      if (this.isNewEditor) {
        this.newEditor();
      } else {
        this.againEditor();
      }
    },
    async againEditor() {
      this.options.author = this.getUserInfo.userName;
      const result = await SkmService.saveEditorHtml(this.options);

      this.$confirm(result.message)
        .then(confirm => {
          if (confirm) {
            // this.$router.push({ name: 'editor' });
            this.$router.go(0);
          }
        })
        .catch(() => {});
    },
    async newEditor() {
      this.options.author = this.getUserInfo.userName;
      const result = await SkmService.saveHtml(this.options);

      this.$confirm(result.message)
        .then(confirm => {
          if (confirm) {
            this.$router.go(0);
          }
        })
        .catch(() => {});
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.options.saveImageUrl = res.file.path;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type; // === ("image/jpeg" || "image/png" || "image/jpg");
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 jpeg/jpg/png 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    addTags(item) {
      item && this.options.hasTags.push(item);
    },
    removeTag(index) {
      this.options.hasTags.splice(index, 1);
    },
    addFolder(name) {
      this.options.hasFolder = this.showFolderName = name;
    },
    // 新建文件夹
    createFolder() {
      this.$router.push({ name: "createFolder", query: { id: 12312313 } });
    },
    selectName(name) {
      this.showFolderName = name;
    }
  }
};
</script>

<template>
  <layout class="editorWarp">
    <div class="content">
      <el-row :gutter="20">
        <el-col :span="10">
          <div class="form_message">
            <p class="form_message_text">编辑</p>
            <el-form label-width="100px" label-position="left" class="title">
              <el-form-item label="标题">
                <el-input type="text" :placeholder="placeholder.title" v-model="options.title"></el-input>
              </el-form-item>
              <el-form-item label="详情">
                <el-input type="textarea" :placeholder="placeholder.info" v-model="options.info"></el-input>
              </el-form-item>
              <el-form-item label="作者">
                <el-input type="text" v-model="(getUserInfo || {}).userName"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="form_upLoadImg"></div>
          <div class="upLoadImgTitle">上传图片</div>
          <el-upload
            class="avatar-uploader"
            drag
            :show-file-list="false"
            :action="uploadAddress"
            :with-credentials="true"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="imageUrl || options.saveImageUrl"
              :src="imageUrl || options.saveImageUrl"
              class="avatar"
            />
            <div v-else class="avatar_else">
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
      <!-- <el-divider>
        <i class="el-icon-mobile-phone"></i>
      </el-divider>-->
      <setTags :hasInput="true" :hasTags="options.hasTags" @addTag="addTags" @removeTag="removeTag"></setTags>
      <!-- <el-divider>
        <i class="el-icon-mobile-phone"></i>
      </el-divider>-->
      <!-- <setFolder  :folderName="options.hasFolder" @addFolder="addFolder"></setFolder> -->

      <el-dropdown class="setFolder" v-if="folderListShow" split-button type="primary">
        {{showFolderName}}
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item,index) in folderList"
            :key="index"
            @click.native="addFolder(item)"
          >{{item}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <tw-markdown-view
        v-if="isShowEditor"
        :config="{ markdown: options.markdown, imageUploadURL: options.imageUploadURL}"
        @onchange="onchange"
      ></tw-markdown-view>
    </div>
  </layout>
</template>

<style  scoped >
.editorWarp .content {
  text-align: left;
}
.form_message {
  padding-top: 20px;
  width: 100%;
}
.form_message_text {
  font-size: 26px;
  margin: 20px 0;
}
.form_upLoadImg {
  padding-top: 20px;
}
.upLoadImgTitle {
  margin: 20px 0;
  font-size: 26px;
}
.avatar-uploader {
  font-size: 0;
}
.avatar-uploader .avatar {
  width: 100%;
  height: 100%;
}
.avatar-uploader .avatar_else {
  height: 100%;
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
.setFolder {
  margin-bottom: 20px;
}
/* 卡片样式 
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
} */
</style>
