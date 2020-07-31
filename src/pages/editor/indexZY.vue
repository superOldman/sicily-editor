<script type='text/ecmascript-6'>
/* COMPONENT DOCUMENT
 * author: skm
 * date: 2020/03/17
 * desc: 文章编辑
 */
import twMarkdownView from '../../components/markdownEditor/markdownEditor.vue';
import SkmService from '../../services/api';
import address from '../../constant/address';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      markdownView: null,
      isNewEditor: false,
      isShowEditor: false,
      imageUrl: '',
      placeholder: {
        title: '标题',
        info: '简介...'
      },
      options: {
        title: '',
        author: '', //this.$store.state.getUserInfo(),
        info: '',
        content: null,
        markdown: null,
        saveImageUrl: '',
        hasTags: [],
        hasFolder: ''
        // config: {
        //   editorId: "markdown-editor",
        //   config: { markdown: "qweqeqweqw" }
        // }
      },
      // 文件夹列表
      folderListShow: false,
      createfolderShow: false,
      folderList: [],
      showFolderName: '选择文件夹',
      uploadAddress: address + '/editor/uploadImg',
      currentTag: '',
      rules: {
        title: { required: true, message: '请输入文章标题' },
        info: { required: true, message: '请输入文章简介' },
      },
    };
  },
  components: {
    twMarkdownView,
    // setTags
  },
  computed: {
    ...mapGetters('userMessageModule', ['getUserInfo'])
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
      if (window.location.href.indexOf('?') !== -1) {
        // this.$route.query.id
        let articleId = window.location.href.split('?id=')[1];
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
      this.$refs.editorForm.validate(async (valid) => {
        if (valid) {
          if (this.isNewEditor) {
            this.newEditor();
          } else {
            this.againEditor();
          }
        } else {
          this.$message.warning('请填写必填字段');
        }
      });
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
        this.$message.error('上传头像图片只能是 jpeg/jpg/png 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    addTags() {
      this.currentTag && this.options.hasTags.push(this.currentTag);
      this.currentTag = '';
    },
    removeTag(index) {
      this.options.hasTags.splice(index, 1);
    },
    addFolder(name) {
      this.options.hasFolder = this.showFolderName = name;
    },
    // 新建文件夹
    createFolder() {
      this.$router.push({ name: 'createFolder', query: { id: 12312313 } });
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
      <div class="form_message">
        <el-form label-width="100px" label-position="left" :model="options" :rules="rules" ref="editorForm">
          <el-form-item label="标题" prop="title">
            <el-input type="text" label-width="100px" :placeholder="placeholder.title" v-model="options.title"></el-input>
          </el-form-item>
          <el-form-item label="详情" prop="info">
            <el-input type="textarea" :placeholder="placeholder.info" v-model="options.info"></el-input>
          </el-form-item>
          <el-form-item label="作者" prop="userName">
            <el-input type="text" v-model="(getUserInfo || {}).userName" readonly/>
          </el-form-item>
          <el-form-item label="选择文件夹" v-if="folderListShow">
            <el-select v-model="options.hasFolder" placeholder="请选择" class="common-width">
              <el-option v-for="(item, index) in folderList" :key="index" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="上传封面">
            <el-upload class="avatar-uploader" drag :show-file-list="false" :action="uploadAddress" :with-credentials="true" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <el-image v-if="imageUrl || options.saveImageUrl" :src="imageUrl || options.saveImageUrl" :fit="'cover'" />
              <div v-else class="avatar_else">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text"> 将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="添加标签">
            <el-input v-model="currentTag" class="common-width" placeholder="请输入标签名称" maxlength="10" />
            <el-button type="primary" class="theMargin" @click="addTags" :disabled="!currentTag">添加</el-button>
            <div class="tags">
              <el-tag class="tit" v-for="(item,index) in options.hasTags" :key="index" closable @close="removeTag(index)">{{item}}</el-tag>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <el-divider>文章内容</el-divider>
      <tw-markdown-view
        v-if="isShowEditor"
        :config="{ markdown: options.markdown  }"
        @onchange="onchange"
      ></tw-markdown-view>
    </div>
  </layout>
</template>

<style lang="less">
.editorWarp {
  .form_message {
    text-align: left;
    padding: 20px;
    .common-width {
      width: 360px
    }
    .el-icon-upload {
      margin: 20px 0 16px;
    }
    .theMargin {
      margin-left: 20px;
    }
  }
}

</style>
