<script type='text/ecmascript-6'>
/* COMPONENT DOCUMENT
 * author: skm
 * date: 2020/03/23
 * desc: 文章列表
 */
// import editorForm from "../../components/editorForm/index.vue";
import SkmService from '../../services/api'
import { mapGetters } from 'vuex'
import { myGetTime } from '../../utils/utils'

export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      listData: [],
      paperSum: 0,

      formData: {
        title: 'sdfafa',
        info: 'sdfadfa',
        auther: ' vvvvvvv',
        date1: '',
        date2: ''
      },
      dialogVisible: false
    }
  },
  // components: { editorForm },
  created() {
    this.getList()
  },
  mounted() {},
  computed: {
    ...mapGetters('pageStatsModule', ['getLoading']),
    ...mapGetters('userMessageModule', ['getUserInfo'])
  },
  watch: {
    '$store.state.loadingStatus.loading': {
      handler(val) {
        console.log(12121, val)
      }
    }
    // formData: {
    //   deep: true,
    //   handler(val, old) {

    //   }
    // }
  },
  methods: {
    getList(
      params = {
        page: this.currentPage,
        pageSize: this.pageSize
      }
    ) {
      SkmService.get_list(params).then(result => {
        result.data.list.forEach(item => {
          item.updated_at = myGetTime(item.updated_at)
        })

        this.listData = result.data.list
        this.paperSum = result.data.sum
      })
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.getList({
        page: (this.currentPage = val),
        pageSize: this.pageSize
      })
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)

      console.log('handleCurrentChange')

      this.getList({
        page: (this.currentPage = val),
        pageSize: this.pageSize
      })
    },

    topChange(val) {
      let title = !val.stick ? '置顶' : '取消置顶'
      this.$confirm(`确定${title}？`)
        .then(async () => {
          let { _id, stick } = val
          const data = await SkmService.setTop({ _id, stick: !stick })
          if (data.code === 200) {
            val.stick = !val.stick
          } else {
            this.$alert(data.message, '提示', { confirmButtonText: '确定' })
          }
        })
        .catch(() => {})
    },
    // 编辑
    handleEdit(index, row) {
      console.log('编辑', 'searchById')
      console.log(index, row)
      // this.dialogVisible = true;
      this.formData = row
      this.$router.push({ path: '/editor', query: { id: this.formData._id } })
    },
    // 删除
    handleDelete(index, row) {
      console.log('删除', 'destroyById')
      console.log(index, row)
      this.$confirm('确认删除？')
        .then(async () => {
          const data = await SkmService.destroyById({ _id: row._id })
          if (data.code === 200) {
            this.getList()
          }
        })
        .catch(() => {})
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done()
        })
        .catch(() => {})
    }
  }
}
</script>

<template>
  <div class="articleListWarp">
    <!-- list
    <div>
      <editorForm :formData="formData"></editorForm>
    </div>-->
    <!-- <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <editorForm :formData="formData"></editorForm>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>-->
    <div class="massive_css massive_style">
      <el-row class="listTop">
        <el-col :span="6">
          <div class="listTop_left">
            <div class="saveButton">
              <i class="el-icon-upload"></i>
            </div>
            <div class="pageTitle">Article</div>
          </div>
        </el-col>
        <!-- <el-col :span="6" :offset="12">
          <ul class="btns">
            <li @click="showDialog">
              <i class="el-icon-folder-add"></i>
            </li>
          </ul>
        </el-col>-->
      </el-row>
      <el-table v-loading="getLoading" :data="listData" stripe style="width: 98%; margin: 0 auto;">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column
          draggable="true"
          prop="updated_at"
          label="日期"
          width="200"
          :resizable="true"
        ></el-table-column>
        <el-table-column prop="title" label="标题" width="200"></el-table-column>
        <el-table-column prop="author" label="编辑人" width="160"></el-table-column>
        <el-table-column prop="info" label="详情"></el-table-column>
        <el-table-column prop="hasFolder" label="所属文件夹" width="150"></el-table-column>
        <el-table-column label="置顶" width="80">
          <template slot-scope="scope">
            <div id="changeTop">
              <el-switch
                class="changeTop"
                style="cursor: pointer;"
                v-model="scope.row.stick"
                disabled
                @click.native="topChange(scope.row)"
                active-color="#13ce66"
                inactive-color="#ff4949"
              ></el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope" v-if="getUserInfo">
            <el-button
              size="mini"
              :disabled="getUserInfo.userName !== scope.row.author"
              @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              :disabled="getUserInfo.userName !== scope.row.author"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="listData.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="paperSum"
      ></el-pagination>
    </div>
  </div>
</template>

<style   >
.articleListWarp {
  min-height: 1080px;
}
.articleListWarp .massive_style {
  width: 98%;
  margin: 30px auto 0;
  position: relative;
}

.articleListWarp .listTop {
  background-color: #fff;
  border-bottom: 1px solid #000;
  height: 50px;
  line-height: 50px;
  font-size: 18px;
}
.articleListWarp .listTop_left {
  height: 50px;
}
.articleListWarp .pageTitle {
  /* display: inline-block; */
  float: left;
  margin-left: 100px;
}
.articleListWarp .saveButton {
  position: absolute;
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
}

.articleListWarp .changeTop.el-switch.is-disabled {
  opacity: 1;
}

#changeTop .el-switch.is-disabled .el-switch__core,
.el-switch.is-disabled .el-switch__label {
  cursor: pointer;
}

.articleListWarp .el-pagination {
  padding: 20px;
}
</style>
