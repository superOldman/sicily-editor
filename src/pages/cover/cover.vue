<script>
import layout from "../../components/layout/index.vue";

import SkmService from "../../services/api";

export default {
  data() {
    return {
      listData: [
        // {
        //   title: "王小虎",
        //   showPaperId: "2131231231231231",
        //   createDate: "2016-05-02 11:11:11",
        //   upDate: "2016-05-02 11:11:11",
        //   // address: "上海市普陀区金沙江路 1518 弄",
        //   image: require("../../assets/images/logo.png"),
        //   show: true
        // }
      ],

      search: "",///

      currentPage: 1,
      dialogVisible: false,

      state:'',
      dialogValue: {},
      stateThis: [],
      // tableData: [],
      // listData: [],
    };
  },
  components: {
    layout
  },
  methods: {
    addFolder() {
      this.$emit("addFolder", this.input);
    },
    handleCommand(command) {
      this.$message("click on item " + command);
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    saveList() {
      console.log("savelist");
      SkmService.saveTop(this.listData)
    },
    addList() {
      this.dialogVisible = false;
    
      SkmService.searcByIdpackageTopModel({ id:this.dialogValue.id}).then((results)=>{
        this.listData.push(results.list);
      })

    },
    // 搜索
    querySearchAsync(queryString, cb) {
      console.log(arguments)
      console.log(queryString)
      // var restaurants = this.restaurants;
      SkmService.get_titleList().then((results)=>{
        console.log(results)
         cb(results);
      })
      
     
       
     
    },
    handleSelect(item) {
      console.log(item);
      this.dialogValue = item
    },
    getTopList(){
      SkmService.getTopList().then((data)=>{
        this.listData = data.list
      })
    }
  },
  mounted() {},
  created() {
    this.getTopList()
  }
};
</script>
<template>
  <layout>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" >
      <el-autocomplete
        v-model="state"
        :fetch-suggestions="querySearchAsync"
        placeholder="请输入内容"
        @select="handleSelect"
      ></el-autocomplete>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addList">确 定</el-button>
      </span>
    </el-dialog>

    <div class="warp">
      <el-row class="listTop">
        <el-col :span="6">
          <div class="listTop_left">
            <div class="saveButton" @click="saveList">
              <i class="el-icon-upload"></i>
            </div>Cover
            <!-- <div class="pageTitle">cover</div> -->
          </div>
        </el-col>
        <el-col :span="6" :offset="12">
          <ul class="btns">
            <li>
              <i class="el-icon-upload"></i>
            </li>
            <li @click="dialogVisible = true">
              <i class="el-icon-folder-add"></i>
            </li>
          </ul>
        </el-col>
      </el-row>
      <el-table
        :data="listData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%"
      >
        <el-table-column label="id" prop="showPaperId"></el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="背景">
          <template slot-scope="scope">
            <img :src="scope.row.image" width="80" height="80" class="head_pic" />
          </template>
        </el-table-column>
        <el-table-column label="创建日期" prop="createDate"></el-table-column>
        <el-table-column label="修改日期" prop="upDate"></el-table-column>
        <el-table-column label="显示">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.show" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </template>
        </el-table-column>

        <el-table-column label="编辑">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >Delete</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-if="listData.length"
        :current-page="currentPage"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
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
  cursor: pointer;
  transition: 0.5s all;
}
.saveButton:hover {
  box-shadow: rgba(0, 0, 0, 0.5) 0px 1px 10px 1px;
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
</style>
