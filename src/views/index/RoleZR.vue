<template>
  <div class="rolezr">
    <table>
      <tr>
        <td>
          <span>UID：</span>
          <el-input v-model="uid" placeholder="请输入玩家uid"></el-input>
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
        <el-table-column
         prop="uid" 
         sortable 
         label="uid"
        ></el-table-column>
        <el-table-column
          prop="role_id"
          sortable
          label="龙(role_id)"
        ></el-table-column>
        <el-table-column
          prop="in_crystal"
          sortable
          label="是否在水晶内"
        ></el-table-column>
        <el-table-column
          prop="role_level"
          sortable
          label="等级"
        ></el-table-column>
        <el-table-column
          prop="campType"
          sortable
          label="品阶"
        ></el-table-column>
        <el-table-column
          prop="role_power"
          sortable
          label="战力"
        ></el-table-column>
        <el-table-column
          prop="percentage_of_times"
          sortable
          label="次数百分比"
        ></el-table-column>
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
  name: "RoleZR",
  components: { pageNation },
  data() {
    return {
      tableData: [],
      uid: "",
      currentPage: 1, //当前页数
      pageSize: 10, //每页的数据
      loading: false,
    };
  },
  methods: {
    //分页
    pageChange(item) {
      this.currentPage = item.page_index;
      this.pageSize = item.page_limit;
    },
    search(){
      if (this.uid == "") {
        this.$message({
          type: "warning",
          message: "请输入需要查询的uid",
        });
        return;
      } else {
        this.loading = true;
        this.$http.post("/rolezr", { uid: this.uid }).then((res) => {
          if (res.result.length > 0) {
            this.tableData = res.result;
            this.loading = false;
          } else {
            this.$message({ type: "warning", message: "没有对应的数据" });
            this.loading = false;
            this.uid="";
            this.tableData = [];
            return;
          }
        });
      }
    },
    // 时间戳转换方法
    formatDate(row, column, cellValue, index) {
      if (cellValue == null || cellValue == "") return "";
      let date = new Date(parseInt(cellValue * 1000)); //时间戳为10位需*1000，如果为13位的话不需乘1000。
      let Y = date.getFullYear() + "-";
      let M =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1) + "-"
          : date.getMonth() + 1 + "-";
      let D =
        date.getDate() < 10 ? "0" + date.getDate() + " " : date.getDate() + " ";
      let h =
        date.getHours() < 10
          ? "0" + date.getHours() + ":"
          : date.getHours() + ":";
      let m =
        date.getMinutes() < 10
          ? "0" + date.getMinutes() + ":"
          : date.getMinutes() + ":";
      let s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D + "" + h + m + s;
    },
  },
};
</script>
<style scoped>
.rolezr td {
  padding: 18px;
  font-size: 14px;
  display: flex;
  float: left;
}
</style>
