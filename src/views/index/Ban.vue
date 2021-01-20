<template>
  <div class="ban">
    <table>
      <tr>
        <td>
          <span style="margin-left: 20px; width: 80px">玩家ID：</span>
          <el-input v-model="player_id" placeholder="请输入玩家id"></el-input>
        </td>
        <td>
          <el-button type="primary" @click="search()">查询</el-button>
        </td>
      </tr>
    </table>
    <el-main v-loading="loading">
      <el-table
        border
        :fit="true"
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
      >
        <el-table-column sortable label="玩家ID">
          <template slot-scope="{ row, $index }">
            <span v-if="!showEdit[$index]">{{ row.player_id }}</span>
            <el-input
              type="text"
              v-model="row.playid"
              v-else
              placeholder="请输入玩家ID"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column sortable label="状态">
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
        <el-table-column sortable label="操作人">
          <template slot-scope="{ row, $index }">
            <span v-if="!showEdit[$index]">{{ row.operator }}</span>
            <el-input
              type="text"
              v-model="row.operator"
              v-else
              placeholder="请输入操作人"
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
  </div>
</template>
<script>
import pageNation from "../../components/pagenation/pageNation";
export default {
  name: "Ban",
  components: { pageNation },
  data() {
    return {
      player_id:"",
      showEdit: [], //控制页面修改显示隐藏
      currentPage: 1, //当前页数
      pageSize: 10, //每页的数据
      tableData: [],
      loading: false,
    };
  },
  methods: {
    //分页
    pageChange(item) {
      this.currentPage = item.page_index;
      this.pageSize = item.page_limit;
    },
    //查询
    search(){
      this.loading=true;
      this.$http.post("/ban",{
        player_id:this.player_id,
      }).then(res=>{
        console.log(res);
        this.loading=false;
      })
    },
    //删除操作
    del(index, row) {
      console.log(index, row);
    },
    // 编辑后点击确定
    submit(index, row) {
      console.log(index, row);
      this.$set(this.showEdit, index, false);
    },
    //点击修改
    showUpdate(index) {
      this.showEdit[index] = true;
      this.$set(this.showEdit, index, true);
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
        this.$set(this.showName, index, "");
        this.$set(this.showAge, index, "");
      })
      .catch(() => {});
    },
  },
};
</script>
<style scoped>
.ban td {
  padding: 10px;
  font-size: 14px;
  display: flex;
  float: left;
}
</style>