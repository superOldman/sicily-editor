<script type='text/ecmascript-6'>
/* COMPONENT DOCUMENT
 * author: skm
 * date: 2020/03/25
 * desc: 列表编辑表单
 */

export default {
  props: {
    formData: {
      type: Object,
      default() {
        return {
          title: "",
          info: "",
          auther: "",
          date1: "",
          date2: "",
          _id: '',
        };
      }
    }
  },
  mounted() {
    console.log(this.formData)
  },
  methods: {
    onSubmit() {
      console.log("submit!");
      const self = this;
      this.$router.push({ path:'/editor', query:{ id: self.formData._id } })
    }
  }
};
</script>

<template>
  <el-form ref="form" :model="formData" label-width="80px" size="mini">
    <el-form-item label="标题">
      <el-input v-model="formData.title"></el-input>
    </el-form-item>
    <el-form-item label="编辑人">
      <el-select v-model="formData.outher" :placeholder="formData.outher">
        <el-option label="superOldMan" value=""></el-option>
        <el-option label="other" value=""></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="详情">
      <el-input v-model="formData.info"></el-input>
    </el-form-item>
    <el-form-item label="日期">
      <el-col :span="11">
        <el-date-picker
          type="date"
          placeholder="选择日期"
          v-model="formData.date1"
          style="width: 100%;"
        ></el-date-picker>
      </el-col>
      <el-col class="line" :span="2">-</el-col>
      <el-col :span="11">
        <el-time-picker placeholder="选择时间" v-model="formData.date2" style="width: 100%;"></el-time-picker>
      </el-col>
    </el-form-item>
    <el-form-item size="large">
      <el-button type="primary" @click="onSubmit">重新编辑</el-button>
    </el-form-item>
  </el-form>
</template>

<style  scoped >
</style>