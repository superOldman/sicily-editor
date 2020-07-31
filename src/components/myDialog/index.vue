<script>
export default {
  data() {
    return {
      restaurants: [],
      input: ''
    };
  },
  props: [ 'dialogVisible','dialogTitle','dialogBtn','hasResetForm' ],
  //   props: {
  //       dialogTitle: String,
  //       dialogBtn: String,
  //       hasResetForm: Boolean,
  //   },
  methods: {
    closeMyDialog() {
      this.$emit('closeMyDialog');
    },
    resetForm() {
      this.$emit('resetForm');
    },
    submitForm() {
      this.$emit('submitForm');
    },
  },

};

</script>

<template>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :before-close="closeMyDialog" width="30%">
      <slot />
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeMyDialog">取 消</el-button>
        <el-button v-if="hasResetForm" @click="resetForm">重置</el-button>
        <el-button type="primary" @click="submitForm">{{dialogBtn}}</el-button>
      </span>
    </el-dialog>
</template>


<style scoped>
</style>