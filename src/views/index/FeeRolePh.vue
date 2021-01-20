<template>
  <div class="feeroleph">
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
          tableData.slice((page_index - 1) * page_size, page_index * page_size)
        "
      >
        <el-table-column
          prop="server_id"
          sortable
          label="服务器"
        ></el-table-column>
        <el-table-column
          prop="dollar"
          sortable="custom"
          label="期间累计充值"
        ></el-table-column>
        <el-table-column
          prop="total_recharge"
          sortable="custom"
          label="累计充值金额"
        ></el-table-column>
        <el-table-column
          prop="checkpoint_id"
          sortable="custom"
          label="主线关卡id"
        ></el-table-column>
        <el-table-column 
          prop="uid" 
          sortable 
          label="uid"
        ></el-table-column>
        <el-table-column
          prop="nickname"
          sortable
          label="角色名"
        ></el-table-column>
        <el-table-column
          prop="user_level"
          sortable
          label="角色等级"
        ></el-table-column>
        <el-table-column
          prop="vip_level"
          sortable
          label="vip等级"
        ></el-table-column>
        <el-table-column
          prop="reg_time"
          :formatter="formatDate"
          sortable
          label="注册时间"
        ></el-table-column>
        <el-table-column
          prop="login_time"
          :formatter="formatDate"
          sortable
          label="最近登录时间"
        ></el-table-column>
      </el-table>
      <pageNation
        :total="tableData.length"
        :page-size="page_size"
        @pageChange="pageChange"
        :page_index="page_index"
      />
    </el-main>
  </div>
</template>
<script>
import Server from "../../components/serverd/Server.vue";
import pageNation from "../../components/pagenation/pageNation";
import xlsx from "xlsx";
import FileSaver from "file-saver";
import server from "../../config/server"
let map=new Map();
export default {
  name: "FeeRolePh",
  components: { Server, pageNation },
  data() {
    return {
      tableData: [],
      first_time: "",
      last_time: "",
      page_index: 1, // 页数
      page_size: 10,
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
      this.page_index = item.page_index;
      this.page_size = item.page_limit;
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
      if (column.prop === "dollar") {
        this.tableData = this.tableData.sort(
          this.sortFun(column.prop, column.order === "ascending")
        );
      }
      if (column.prop === "total_recharge") {
        this.tableData = this.tableData.sort(
          this.sortFun(column.prop, column.order === "ascending")
        );
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
    search() {
      var last_time = this.last_time;
      var first_time = this.first_time;
      window.localStorage.setItem("last_time", last_time);
      window.localStorage.setItem("first_time", first_time);
      var server_id = this.$refs.ServerChild.server_id;
      var arr = [];
      if (server_id == "") {
        this.$message({ type: "warning", message: "请选择服务器" });
        return;
      }
      if (first_time / 1000 == "") {
        this.$message({ type: "warning", message: "请选择开始时间" });
        return;
      }
      if (last_time / 1000 == "") {
        this.$message({ type: "warning", message: "请选择结束时间" });
        return;
      }
      this.loading = true;
      server_id.forEach((item) => {
        if (item == "全选") {
          return;
        } else {
          this.$http
            .post("/feeroleph", {
              first_time: first_time / 1000,
              last_time: last_time / 1000,
              server_id: item,
            })
            .then((res) => {
              if (res.code == 200 && res.result.length > 0) {
                res.result.forEach((item) => {
                  let obj = {
                    dollar: item.dollar,
                    total_recharge: item.total_recharge,
                    server_id: map.get(item.server_id),
                    uid: item.uid,
                    nickname: item.nickname,
                    user_level: item.user_level,
                    vip_level: item.vip_level,
                    reg_time: item.reg_time,
                    login_time: item.login_time,
                    checkpoint_id: item.checkpoint_id,
                  };
                  arr.push(obj);
                });
                this.tableData = arr;
                this.loading = false;
            } else {
              this.$message({
                type: "warning",
                message: "没有对应数据信息",
              });
              this.loading = false;
              this.tableData = [];
              return;
            }
          });
        }
      });
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
        //当前页为第一页
        this.page_index = 1;
        //每页大小限制条数：为总条数（将表格数据全部渲染出来在第一页上）
        this.page_size = this.tableData.length;
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
            if (typeof console!=="undefined") console.log(e, wbout);
          }
          this.page_size = 10;
          return wbout;
        });
      } else {
        this.$message({ type: "warning", message: "表中没有数据不能导出" });
        return;
      }
    },
  },
};
</script>
<style scoped>
/* 局部样式 */
.feeroleph td {
  padding: 18px;
  font-size: 14px;
  display: flex;
  float: left;
}
</style>