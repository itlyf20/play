<template>
  <div class="lottery">
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
        border
        :fit="true"
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
      >
        <el-table-column
          prop="server"
          sortable
          label="服务器"
        ></el-table-column>
        <el-table-column
          prop="section"
          sortable
          label="普抽次数"
        ></el-table-column>
        <el-table-column
          prop="number_of_players"
          sortable
          label="玩家数"
        ></el-table-column>
        <el-table-column
          prop="proportion_of_players"
          sortable
          label="玩家占比"
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
import Server from "../../components/serverd/Server.vue";
import pageNation from "../../components/pagenation/pageNation";
import server from "../../config/server"
let map=new Map();
export default {
  name: "Lottery",
  components: { Server, pageNation },
  data() {
    return {
      tableData: [],
      first_time: "",
      last_time: "",
      pageSize: 10,
      currentPage: 1,
      loading: false,
      server:server
    };
  },
  mounted() {
    this.first_time = window.localStorage.getItem("first_time");
    this.last_time = window.localStorage.getItem("last_time");
    this.server.forEach(item=>{
      map.set(item.server_id,item.servername);
    })
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
      var arr = [];
      var server_id = this.$refs.ServerChild.server_id;
      if (server_id == "") {
        this.$message({ type: "warning", message: "请选择服务器" });
        return;
      }
      if (this.first_time == "") {
        this.$message({ type: "warning", message: "请输入开始时间" });
        return;
      }
      if (this.last_time == "") {
        this.$message({ type: "warning", message: "请输入结束时间" });
        return;
      }
      server_id.forEach((item) => {
        if (item == "全选") {
          return;
        } else {
          this.loading = true;
          this.$http
            .post("/lottery", {
              server_id: item,
              first_time: first_time / 1000,
              last_time: last_time / 1000,
            })
            .then((res) => {
              if (res.code == 200 && res.result.length > 0) {
                res.result.forEach((item) => {
                  let obj = {
                    section: item.section,
                    server: map.get(item.server),
                    number_of_players: item.number_of_players,
                    proportion_of_players: item.proportion_of_players,
                  };
                  arr.push(obj);
                });
                this.tableData = arr;
                this.loading = false;
              } else {
                this.$message({
                  type: "warning",
                  message: "没有对应的数据信息",
                });
                this.loading = false;
                this.tableData = [];
                return;
              }
            });
        }
      });
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
.lottery td {
  padding: 18px;
  font-size: 14px;
  display: flex;
  float: left;
}
</style>