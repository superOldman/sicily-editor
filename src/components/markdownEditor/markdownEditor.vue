<script >
/* COMPONENT DOCUMENT
 * author: skm
 * date: 2020/01/02
 * desc: Markdown编辑器
 */

// @ts-ignore
import scriptjs from 'scriptjs';

import { defaultConfig } from './defaultConfig';
// @Component({
//   name: 'markdownEditor',
//   components: {},
// })
export default {
  data() {
    return {
      editor: {},
      timer: null,
      doc: {},
      jsLoadOver: false,
      editorId: 'markdown-editor'
    };
  },
  props: {
    // initData: "",
    // initDataDelay: 0 // 延迟初始化数据时间，单位毫秒
    config: { markdown: '没数据时的字段' }

  },
  created() {
    // console.log(this.editorId)

  },
  mounted() {
    console.log('加载 编辑页面');
    console.log(this.config);
    this.init();
  },
  methods: {
    fetchScript(url) {
      return new Promise(resolve => {
        scriptjs(url, () => {
          resolve();
        });
      });
    },
    getConfig() {
      return { ...defaultConfig, ...this.config };
    },
    getEditor() {
      return this.editor;
    },
    getDoc() {
      return this.doc;
    },
    watch() {
      return this.editor.watch();
    },
    unwatch() {
      return this.editor.unwatch();
    },
    previewing() {
      return this.editor.previewing();
    },
    getHTML() {
      return this.editor.getHTML();
    },
    getMarkdown() {
      return this.editor.getMarkdown();
    },
    setMarkdown(markdown) {
      return this.editor.setMarkdown(markdown);
    },
    saveHtml() {
      const html = this.editor.getPreviewedHTML();
      const savehtml = {
        markdown: this.editor.getMarkdown(),
        html,
        text: window.$(html).text()
      };

      this.$emit('onchange', savehtml);
    },
    init() {
      const vm = this;
      const config = vm.getConfig();
      (async () => {
        await vm.fetchScript(
          'https://cdn.bootcss.com/jquery/1.11.3/jquery.min.js'
        );
        await vm.fetchScript('./static/editor.md-master/editormd.js');
        vm.$nextTick(() => {
          // @ts-ignore
          vm.editor = window.editormd(vm.editorId, config);
          // vm.editor.on('load', () => {
          //     setTimeout(() => { // hack bug: 一个页面多个编辑器只能初始化其中一个数据问题
          //     vm.initData && vm.editor.setMarkdown(vm.initData)
          //     }, vm.initDataDelay)
          // })
          // vm.editor.on('change', () => {
          //   const html = vm.editor.getPreviewedHTML();
          //   const savehtml = {
          //       markdown: vm.editor.getMarkdown(),
          //       html,
          //       text: 'window.$(html).text()',
          //   };
          //   vm.onchange(savehtml);
          // });
        });
      })();
    }
  }
};
</script>

<template>
  <div class="markdown-editor-box">
    <link rel="stylesheet" href="./static/editor.md-master/css/editormd.css" />
    <div  :id="editorId"></div>
    <!-- <div id="markdown-editor"></div> -->
    <el-button class="saveButton" type="primary" @click="saveHtml">
      保存
      <i class="el-icon-upload el-icon--right"></i>
    </el-button>
  </div>
</template>

<style  scoped>
</style>
