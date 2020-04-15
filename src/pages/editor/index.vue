<script type='text/ecmascript-6'>
/* COMPONENT DOCUMENT
 * author: skm
 * date: 2020/03/17
 * desc: 文章编辑
 */
// import twMarkdownView from "../../components/markdownEditor/markdownEditor.vue";
import SkmService from "../../services/api";

export default {
  data() {
    return {
      markdownView: null,
      isNewEditor:true,
      options: {
        title: "测试1",
        author: "superOldman",
        info: "sdfadfaf",
        content: null,
        markdown: null,
        // config: {
        //   editorId: "markdown-editor",
        //   config: { markdown: "qweqeqweqw" }
        // }
      },
      
    };
  },
  components: {
    // twMarkdownView
  },
  // computed:{
  //   isNewEditor(data){ return data },
  // },
  created() {
    this.getArticleById();

  },
  mounted() {
  },
  methods: {
    getArticleById() {
      if (window.location.href.indexOf("?") !== -1) {
        let articleId = window.location.href.split("?id=")[1];
        let self = this;
        SkmService.searchById({ id: articleId }).then(data => {
          if (data.code === 0) {
            self.options = data.list;
            self.isNewEditor = false;
          }
        });
      }else{
         this.options.markdown = true;
      }
    },
    onchange(obj){
       this.markdownView = obj;
      if(this.isNewEditor){
        this.newEditor()
      }else{
        this.againEditor()
      }
    },
    againEditor(){
      const self = this;
      console.log('bianji')
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
      const self = this;
      SkmService.saveHtml({
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
    }
  }
};
</script>

<template>
  <layout>
    <div>
      editor
      <div class="form_message">
        <p class="form_message_text">编辑</p>
        <el-form label-width="100px" label-position="left" class="title">
          <el-form-item label="标题">
            <el-input type="text" v-model="options.title"></el-input>
          </el-form-item>
          <el-form-item label="详情">
            <el-input type="text" v-model="options.info"></el-input>
          </el-form-item>
          <el-form-item label="作者">
            <el-input type="text" v-model="options.author"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- <tw-markdown-view v-if="options.markdown" :config="{ markdown: options.markdown  }" @onchange="onchange"></tw-markdown-view> -->
    </div>
  </layout>
</template>

<style  scoped >
.form_message {
  padding-top: 20px;
  width: 40%;
}
.form_message_text {
  font-size: 24px;
  margin: 20px 0;
}
</style>
