<template>
  <div class="hangup">
    <table>
      <tr>
        <td>
          <span>服务器：</span>
          <Server ref="ServerChild" />
        </td>
        <td>
          <span>起止时间：</span>
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
        <td>
          <el-button type="primary" @click="exportExcel()">导出excel</el-button>
        </td>
      </tr>
    </table>
    <el-main v-loading="loading">
      <el-table
        class="table"
        border
        @sort-change="sortChange"
        :fit="true"
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
      >
        <el-table-column
          prop="server_id"
          sortable
          label="服务器"
        ></el-table-column>
        <el-table-column 
          prop="level_id" 
          sortable="custom"
          label="关卡id"
        ></el-table-column>
        <el-table-column
          prop="hangup_section"
          sortable
          label="挂机区间"
        ></el-table-column>
        <el-table-column
          prop="hangup_count"
          sortable="custom"
          label="挂机人数"
        ></el-table-column>
        <el-table-column
          prop="hangup_proportion"
          sortable
          label="挂机占比"
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
import xlsx from "xlsx";
import FileSaver from "file-saver";
import Server from "../../components/serverd/Server.vue";
import pageNation from "../../components/pagenation/pageNation";
import server from "../../config/server"
let map=new Map();
export default {
  name: "HangUp",
  components: { Server, pageNation },
  data() {
    return {
      server_id: "",
      first_time: "",
      last_time: "",
      loading: false,
      pageSize: 10,
      currentPage: 1,
      tableData: [],
      server:server
    };
  },
  mounted() {
    this.first_time = window.localStorage.getItem("first_time");
    this.last_time = window.localStorage.getItem("last_time");
    this.server.forEach(item=>{
      map.set(item.server_id,item.servername)
    })
  },
  methods: {
    //分页
    pageChange(item) {
      this.currentPage = item.page_index;
      this.pageSize = item.page_limit;
    },
    //排序
    sortFun(attr, rev) {
      //第一个参数传入info里的prop表示排的是哪一列，第二个参数是升还是降排序
      if (rev == undefined) {
        rev = 1;
      } else {
        rev = rev ? 1 : -1;
      }

      return function (a, b) {
        a = a[attr];
        b = b[attr];
        if (a < b) {
          return rev * -1;
        }
        if (a > b) {
          return rev * 1;
        }
        return 0;
      };
    },
    sortChange(column, prop, order) {
      if (column.prop === "hangup_count") {
        this.tableData = this.tableData.sort( 
          this.sortFun(column.prop, column.order === "ascending")
        );
      }
      if (column.prop === "level_id") {
        this.tableData = this.tableData.sort( 
          this.sortFun(column.prop, column.order === "ascending")
        );
      }
    },
    exportExcel() {
      // 设置当前日期
      let time = new Date();
      let year = time.getFullYear();
      let month = time.getMonth() + 1;
      let day = time.getDate();
      let hour = time.getHours();
      let seconds = time.getSeconds();
      let minutes = time.getMinutes();
      let name =
        year + "" + month + "" + day + "" + hour + "" + minutes + "" + seconds;

      if (this.tableData.length > 0) {
        ////当前页为第一页
        this.currentPage = 1;
        //每页大小限制条数：为总条数（将表格数据全部渲染出来在第一页上）
        this.pageSize = this.tableData.length;
        var xlsxParam = { raw: true }; //转换成excel时，使用原始的格式
        this.$nextTick(function () {
          var wb = xlsx.utils.table_to_book(
            document.querySelector(".table"),
            xlsxParam
          );
          /* get binary string as output */
          var wbout = xlsx.write(wb, {
            bookType: "xlsx",
            bookSST: true,
            type: "array",
          });
          try {
            //  name+'.xlsx'表示导出的excel表格名字
            FileSaver.saveAs(
              new Blob([wbout], { type: "application/octet-stream" }),
              name + ".xlsx"
            );
          } catch (e) {
            if (typeof console !== "undefined") console.log(e, wbout);
          }
          this.pageSize = 10;
          return wbout;
        });
      } else {
        this.$message({ type: "warning", message: "表中没有数据不能导出" });
        return;
      }
    },
    search() {
      var last_time = this.last_time;
      var first_time = this.first_time;
      window.localStorage.setItem("last_time", last_time);
      window.localStorage.setItem("first_time", first_time);
      var arr = [];
      var server_id = this.$refs.ServerChild.server_id;
      if (server_id == "") {
        this.$message({
          type: "warning",
          message: "请选择需要查询的服务器",
        });
        return;
      }
      if (first_time / 1000 == "") {
        this.$message({
          type: "warning",
          message: "请输入开始时间",
        });
        return;
      }
      if (last_time / 1000 == "") {
        this.$message({
          type: "warning",
          message: "请输入开始时间",
        });
        return;
      }
      this.loading = true;
      server_id.forEach((item) => {
        if (item == "全选") {
          return;
        } else {
          this.$http
            .post("/hangup", {
              first_time: first_time / 1000,
              last_time: last_time / 1000,
              server_id: item,
            })
            .then((res) => {
              if (res.code == 200 && res.result.length > 0) {
                res.result.forEach((item) => {
                  let obj = {
                    level_id: item.level_id,
                    server_id: map.get(item.server_id),
                    hangup_section: item.hangup_section,
                    hangup_count: item.hangup_count,
                    hangup_proportion: item.hangup_proportion,
                  };
                  arr.push(obj);
                });
                this.tableData = arr;
                this.loading = false;
              } else {
                this.$message({ type: "warning", message: "没有对应的数据" });
                this.tableData=[];
                this.loading = false;
                return;
              }
            });
        }
      });
    },
  },
};
</script>
<style scoped>
.hangup td {
  padding: 18px;
  font-size: 14px;
  display: flex;
  float: left;
}
</style>