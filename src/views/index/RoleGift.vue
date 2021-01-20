<template>
  <div class="rolegift">
    <table>
      <tr>
        <td>
          <span>服务器：</span>
          <Server ref="ServerChild" />
        </td>
        <td>
          <span>开始时间：</span>
          <el-date-picker
            v-model="first_time"
            type="datetime"
            value-format="timestamp"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </td>
        <td>
          <span>结束时间：</span>
          <el-date-picker
            v-model="last_time"
            type="datetime"
            value-format="timestamp"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </td>
        <td>
          <el-button type="primary" @click="search()">查询</el-button>
        </td>
      </tr>
    </table>
    <el-main v-loading="loading">
      <el-table
        :fit="true"
        border
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
      >
         <el-table-column 
          prop="uid" 
          sortable 
          label="UID"
        ></el-table-column>
        <el-table-column 
          prop="point_of_time" 
          sortable 
          label="时间点"
        ></el-table-column>
        <el-table-column
          prop="gift_name"
          sortable
          label="物品名"
        ></el-table-column>
        <el-table-column
          prop="increase_or_decrease"
          sortable
          label="增减"
        ></el-table-column>
        <el-table-column 
          prop="count" 
          sortable 
          label="数量"
        ></el-table-column>
        <el-table-column
          prop="reason_for_change"
          sortable
          label="变动原因"
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
import Server from "../../components/server/Server.vue";
import pageNation from "../../components/pagenation/pageNation";
export default {
  name: "RoleGift",
  components: { Server, pageNation },
  data() {
    return {
      tableData: [],
      first_time: "",
      last_time: "",
      currentPage: 1, //当前页数
      pageSize: 10, //每页的数据
      loading: false,
      server_id: "",
    };
  },
  mounted() {
    this.first_time = window.localStorage.getItem("first_time");
    this.last_time = window.localStorage.getItem("last_time");
  },
  methods: {
    //分页
    pageChange(item) {
      this.currentPage = item.page_index;
      this.pageSize = item.page_limit;
    },
    search() {
      var last_time = this.last_time;
      var first_time = this.first_time;
      window.localStorage.setItem("last_time", last_time);
      window.localStorage.setItem("first_time", first_time);
      var server_id=this.$refs.ServerChild.server_id;
      this.loading=true;
      this.$http.post("/rolegift",{
        server_id:server_id,
        first_time:first_time/1000,
        last_time:last_time/1000,
      }).then(res=>{
        console.log(res)
        this.loading=false;
      })
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
.rolegift td {
  padding: 18px;
  font-size: 14px;
  display: flex;
  float: left;
}
</style>