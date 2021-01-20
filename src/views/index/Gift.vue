<template>
  <div class="gift">
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
          ></el-date-picker>
        </td>
        <td>
          <span>结束时间：</span>
          <el-date-picker
            v-model="last_time"
            type="datetime"
            value-format="timestamp"
            placeholder="选择日期时间"
          ></el-date-picker>
        </td>
        <td>
          <span>礼包类别：</span>
          <el-select v-model="gift_type" placeholder="礼包类别">
            <el-option
              v-for="item in giftType"
              :label="item.label"
              :key="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
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
        :data="
          tableData.slice((page_index - 1) * page_size, page_index * page_size)
        "
        :fit="true"
      >
        <el-table-column
          prop="server_id"
          sortable
          label="服务器"
        ></el-table-column>
        <el-table-column
          prop="recharge_id"
          sortable
          label="礼包名称"
        ></el-table-column>
        <el-table-column
          prop="gift_type"
          sortable
          label="礼包类别"
        ></el-table-column>
        <el-table-column
          prop="dollar"
          sortable="custom"
          label="单价"
        ></el-table-column>
        <el-table-column
          prop="amount"
          sortable="custom"
          label="金额"
        ></el-table-column>
        <el-table-column
          prop="money_percentage"
          sortable
          label="金额百分比"
        ></el-table-column>
        <el-table-column
          prop="count" 
          sortable 
          label="次数"
        ></el-table-column>
        <el-table-column
          prop="times_percentage"
          sortable
          label="次数百分比"
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
import Server from "../../components/serverd/Server";
import pageNation from "../../components/pagenation/pageNation";
import giftType from "../../config/gift_type"
import xlsx from "xlsx";
import FileSaver from "file-saver";
import server from "../../config/server"
let map=new Map();
export default {
  name: "Gift",
  components: { Server, pageNation },
  data() {
    return {
      tableData: [],
      first_time: "",
      last_time: "",
      page_index: 1, // 页数
      page_size: 10,
      loading: false,
      gift_type: "",
      server:server,
      giftType: giftType,
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
      if (column.prop === "amount") {
        this.tableData = this.tableData.sort(
          this.sortFun(column.prop, column.order === "ascending")
        );
      }
    },
    // 查询
    search() {
      var last_time = this.last_time;
      var first_time = this.first_time;
      window.localStorage.setItem("last_time", last_time);
      window.localStorage.setItem("first_time", first_time);
      var server_id = this.$refs.ServerChild.server_id;
      if (first_time / 1000 == "") {
        this.$message({ type: "warning", message: "请输入开始时间" });
        return;
      }
      if (last_time / 1000 == "") {
        this.$message({ type: "warning", message: "请输入结束时间" });
        return;
      }
      if (server_id == "") {
        this.$message({ type: "warning", message: "请选择需要查询的服务器" });
        return;
      }
      if (this.recharge_id == "") {
        this.$message({ type: "warning", message: "请选择礼包类别" });
        return;
      }
      var arr = [];
      this.loading = true;
      server_id.forEach((item) => {
        if (item == "全选") {
          return;
        } else {
          this.$http
            .post("/gift", {
              server_id: item,
              gift_type: this.gift_type,
              first_time: first_time / 1000,
              last_time: last_time / 1000,
            })
            .then((res) => {
              if (res.code == 200 && res.result.length > 0) {
                res.result.forEach((item) => {
                  let obj = {
                    recharge_id: item.recharge_id,
                    dollar: item.dollar,
                    server_id: map.get(item.server_id),
                    gift_type: item.gift_type,
                    amount: item.amount,
                    money_percentage: item.money_percentage,
                    count: item.count,
                    times_percentage: item.times_percentage,
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
                this.tableData = [];
                this.loading = false;
                return;
              }
            });
        }
      });
    },
    // 导出excel
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
            if (typeof console !== "undefined") console.log(e, wbout);
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
.gift td {
  padding: 18px;
  font-size: 14px;
  display: flex;
  float: left;
}
</style>