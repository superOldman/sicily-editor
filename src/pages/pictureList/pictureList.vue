<script type='text/ecmascript-6'>
import SkmService from '../../services/api';
// import { mapGetters } from "vuex";
import { myGetTime } from '../../utils/utils';

export default {
  data() {
    return {
      listData: [],
      paperSum: 0,
      currentPage: 1,
      pageSize: 100,
      color: [
        'aliceblue',
        'antiquewhite',
        'beige',
        'thistle',
        'wheat',
        'darkseagreen',
        'darkkhaki'
      ]
    };
  },
  // components: { editorForm },
  created() {
    this.getList();
  },
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    async getList(
      params = {
        page: this.currentPage,
        pageSize: this.pageSize
      }
    ) {
      const result = await SkmService.imageList(params);
      result.data.list.forEach(item => {
        item.updated_at = myGetTime(item.updated_at);
        if (!item.connection.length) {
          item.connection.push('/');
        }
      });

      this.listData = result.data.list;
      this.paperSum = result.data.sum;
    },

    handleSizeChange(val) {
      this.getList({
        page: (this.currentPage = val),
        pageSize: this.pageSize
      });
    },
    handleCurrentChange(val) {
      this.getList({
        page: (this.currentPage = val),
        pageSize: this.pageSize
      });
    },

    // 删除
    deleteImage(_id) {
      this.$confirm('确认删除？')
        .then(async () => {
          const data = await SkmService.deleteImage({ _id });
          if (data.code === 0) {
            this.getList();
          }
        })
        .catch(() => {});
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(() => {
          done();
        })
        .catch(() => {});
    }
  }
};
</script>

<template>
  <layout class="listWarp">
    <div class="massive_css massive_style">
      <el-row class="listTop">
        <el-col :span="6">
          <div class="listTop_left">
            <div class="saveButton">
              <i class="el-icon-upload"></i>
            </div>
            <div class="pageTitle">Picture</div>
          </div>
        </el-col>
      </el-row>
      <div class="listBody">
        <div class="listHead"></div>
        <ul id="Images">
          <li v-for="(item,index) in listData" :key="index" :title="item.connection[0]">
            <el-row class="imgHead">
              <el-col :span="16">{{'日期：'+item.updated_at}}</el-col>
              <el-col :offset="2" :span="6">{{item.size}}</el-col>
            </el-row>
            <div class="uploadImgDiv">
              <!-- <el-image :src="item.url" alt fit="contain" ></el-image>scale-down -->
              <el-image :src="item.url" alt fit="scale-down" ></el-image>
            </div>
            <el-row class="operate">
              <el-col :span="4"><el-checkbox></el-checkbox></el-col>
              <el-col :span="16"><p v-for="(text,_index) in item.connection" :key="_index">{{text}}</p></el-col>
              <el-col :span="4"> <i class="el-icon-delete img_del" @click="deleteImage(item._id)"></i></el-col>
            </el-row>
            <!-- <div class="operate">

              <div class="layui-unselect layui-form-checkbox" lay-skin="primary">
                  <span></span>
              </div>
             <div>

             </div> -->
            <!-- </div> -->
          </li>
        </ul>
      </div>

      <!-- <el-pagination
        v-if="listData.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="paperSum"
      ></el-pagination>-->
    </div>
  </layout>
</template>

<style lang="less">
@import "./pictureList.less";

/*  */
</style>
