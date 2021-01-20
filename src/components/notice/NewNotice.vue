<template>
  <div class="newnotice">
    <table>
      <tr>
        <td>
          <span style="margin-left: 20px; width: 60px">标题：</span>
          <el-input v-model="notice_title" placeholder="请输入需要查询的公告标题"></el-input>
        </td>
        <td>
          <el-button type="primary" @click="search()">查询</el-button>
        </td>
        <td colspan="12" style="position: absolute; right: 30px">
          <el-button @click="AddNotice()" type="success" icon="el-icon-plus"
            >新建公告</el-button>
        </td>
      </tr>
    </table>
    <el-main>
      <el-table
        border
        :fit="true"
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
      >
        <el-table-column prop="id" sortable label="ID">
          <template slot-scope="{ row, $index }">
            <span v-if="!showEdit[$index]">{{ row.id }}</span>
            <el-input
              type="text"
              v-model="row.id"
              v-else
              placeholder="请输入ID"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="type" sortable label="类型">
          <template slot-scope="{ row, $index }">
            <span v-if="!showEdit[$index]">{{ row.type }}</span>
            <el-input
              type="text"
              v-model="row.type"
              v-else
              placeholder="请输入类型"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="notice" sortable label="公告">
          <template slot-scope="{ row, $index }">
            <span v-if="!showEdit[$index]">{{ row.notice }}</span>
            <el-input
              type="text"
              v-model="row.notice"
              v-else
              placeholder="请输入公告"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="state" sortable label="状态">
          <template slot-scope="{ row, $index }">
            <span v-if="!showEdit[$index]">{{ row.state }}</span>
            <el-input
              type="text"
              v-model="row.state"
              v-else
              placeholder="请输入状态"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="startime" sortable label="开始时间">
          <template slot-scope="{ row, $index }">
            <span v-if="!showEdit[$index]">
              {{ row.startime }}
            </span>
            <el-date-picker
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="row.startime"
              v-else
              placeholder="请输入生效开始时间"
            >
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column prop="endtime" sortable label="结束时间">
          <template slot-scope="{ row, $index }">
            <span v-if="!showEdit[$index]">
              {{ row.endtime }}
            </span>
            <el-date-picker
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="row.endtime"
              v-else
              placeholder="请输入结束时间"
            >
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column prop="sender" sortable label="发送人">
          <template slot-scope="{ row, $index }">
            <span v-if="!showEdit[$index]">{{ row.sender }}</span>
            <el-input
              type="text"
              v-model="row.sender"
              v-else
              placeholder="请输入发送人"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          width="200"
          label="操作"
        >
          <template slot-scope="{ row, $index }">
            <el-button
              v-if="!showEdit[$index]"
              @click="showUpdate($index, row)"
              type="primary"
            >
              <i class="el-icon-edit"></i>修改
            </el-button>
            <el-button
              v-if="!showEdit[$index]"
              @click="del($index, row)"
              type="danger"
            >
              <i class="el-icon-delete"></i>删除
            </el-button>
            <el-button
              v-if="showEdit[$index]"
              @click="submit($index, row)"
              type="success"
              >确定</el-button
            >
            <el-button
              v-if="showEdit[$index]"
              @click="cancelUpdate($index)"
              type="warning"
              >取消</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pageNation
        :total="tableData.length"
        :page-size="pageSize"
        @pageChange="pageChange"
        :page_index="currentPage"
      />
    </el-main>
    <NoticeDialog :dialog="dialog" @update="getProfile($event)" />
  </div>
</template>
<script>
import NoticeDialog from "../noticedialog/Noticedialog.vue";
import pageNation from "../pagenation/pageNation";
export default {
  name: "Notice",
  components: { NoticeDialog, pageNation },
  data() {
    return {
      tableData: [],
      notice_title:"",//公告标题
      showEdit: [], //控制页面修改显示隐藏
      currentPage: 1, //当前页数
      pageSize: 10, //每页的数据
      dialog: {
        show: false, //是否显示弹出框
        title: "", //弹出框的title
      },
    };
  },
  methods: {
    //分页
    pageChange(item) {
      this.currentPage = item.page_index;
      this.pageSize = item.page_limit;
    },
    //新建公告按钮点击弹出层
    AddNotice() {
      this.dialog = {
        show: true,
        title: "新建公告",
      };
    },
    //点击查询按钮
    search(){
      this.$http.post("/api/notice",{
        notice_title:this.notice_title
      }).then(res=>{
        console.log(res.data)
      })
    },
    getProfile(data) {
      //获取noticedialog中表单传输过来的数据
      console.log(data);
    },
    //编辑后点击确定按钮
    submit(index, row) {
      console.log(index, row);
      this.$set(this.showEdit, index, false);
    },
    //点击删除
    del(index, row) {
      console.log(index, row);
    },
    //点击修改
    showUpdate(index) {
      this.showEdit[index] = true;
      //点击修改后改变状态切换为确定按钮
      this.$set(this.showEdit, index, true); //这里要用$set方法，否则页面状态不更新
    },
    //取消修改
    cancelUpdate(index) {
      this.$confirm("取消修改？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(() => {
        this.$set(this.showEdit, index, false);
      })
      .catch(() => {});
    },
  },
};
</script>
<style scoped>
.newnotice{
  height: 82vh;
}
.newnotice td {
  padding: 18px;
  font-size: 14px;
  display: flex;
  float: left;
}
</style>