<template>
  <div class="setTagsWarp">
    <div v-if="hasInput">
      <span>添加标签</span>
      <el-input v-model="input" class="input" placeholder="请输入内容">
        <i class="el-icon-paperclip el-input__icon" slot="suffix"></i>
      </el-input>
      <el-button type="primary" class="theMargin" @click="addTag" closable>
        添加
        <i class="el-icon-upload el-icon--right"></i>
      </el-button>
    </div>
    <div class="tags">
      <el-tag
        class="tit"
        v-for="(item,index) in hasTags"
        :key="index"
        closable
        @close="handleClose(index)"
      >{{item}}</el-tag>
    </div>
  </div>
</template>


<style scoped>
.setTagsWarp {
  margin-bottom: 20px;
  text-align: left;
}
.setTagsWarp span {
  font-size: 14px;
  display: inline-block;
  width: 100px;
  line-height: 30px;
}
.setTagsWarp .input {
  width: 200px;
  margin-right: 20px;
}

.setTagsWarp .tags .tit {
  margin: 5px;
}
</style>
<script>
export default {
  data() {
    return {
      restaurants: [],
      input: ''
    };
  },
  props: {
    hasInput: {
      type: Boolean,
      default: true
    },
    hasTags: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  methods: {
    addTag() {
      if (this.input) {
        this.$emit('addTag', this.input);
        this.input = '';
      } else {
        this.$alert('请先输入文字', '错误', {
          lockScroll: false
        });
      }
    },
    handleClose(index) {
      this.$emit('removeTag', index);
    }
  },
  mounted() {}
};
</script>