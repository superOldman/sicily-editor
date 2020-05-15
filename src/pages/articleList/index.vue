<script type='text/ecmascript-6'>
/* COMPONENT DOCUMENT
 * author: skm
 * date: 2020/03/23
 * desc: 文章列表
 */
import editorForm from "../../components/editorForm/index.vue";
import SkmService from "../../services/api";
export default {
  data() {
    return {
      currentPage: 1,
      tableData: [],
      listData: [],
      formData: {
        title: "sdfafa",
        info: "sdfadfa",
        auther: " vvvvvvv",
        date1: "",
        date2: ""
      },
      dialogVisible: false,
    };
  },
  components: { editorForm },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    getList() {
      // const params = { author: "superOldman" };
      const self = this;
      SkmService.get_list().then(function(data) {

       data.forEach((item)=>{
         item.updated_at = myGetTime(item.updated_at)
       })

       function myGetTime(time){
         let myTime = new Date(time);
         return `${myTime.getFullYear()}-${ addZero(myTime.getMonth() + 1)}-${addZero(myTime.getDate())}  ${addZero(myTime.getHours())}:${addZero(myTime.getMinutes())}:${addZero(myTime.getSeconds())}`
       }
       function addZero(num){
         return  num >= 10 ? num : `0${num}` 
       }

        self.listData = data;
        self.createNowTableData();
      });
    },
    createNowTableData(pageNum = 1, pageSize = 10) {
      let lastData = pageSize * pageNum;
      if (lastData > this.listData.length) {
        lastData = this.listData.length;
      }
      this.tableData = this.listData.slice(pageSize * (pageNum - 1), lastData);

      console.log(this.tableData);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.createNowTableData(val);
    },
    // 编辑
    handleEdit(index, row) {
      console.log("编辑", "searchById");
      console.log(index, row);
      this.dialogVisible = true;
      this.formData = row

      // this.open();
      // SkmService.searchById(row._id).then(function(){

      // })
    },
    // 删除
    handleDelete(index, row) {
      console.log("删除", "destroyById");
      console.log(index, row);
      const self = this;
      SkmService.destroyById({ id: row._id }).then(function(data) {    
        if(data.code === 0 ){
          self.listData = data.article;
          self.createNowTableData();
        }  
      });
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then( () => {
          done();
        })
        .catch(() => {});
    }
  }
};
</script>

<template>
  <layout>
    <!-- list
    <div>
      <editorForm :formData="formData"></editorForm>
    </div> -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <editorForm :formData="formData"></editorForm>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-table :data="tableData" stripe style="width: 90%; margin: 0 auto;">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column draggable="true" prop="updated_at" label="日期" width="200" :resizable="true"></el-table-column>
      <el-table-column prop="title" label="标题" width="200"></el-table-column>
      <el-table-column prop="author" label="编辑人" width="160"></el-table-column>
      <el-table-column prop="info" label="详情"></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="listData.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="10"
      :page-sizes="[10, 20, 30, 40]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listData.length"
    ></el-pagination>
  </layout>
</template>

<style  scoped >
</style>
