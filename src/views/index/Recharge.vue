<template>
  <div class="reacharge">
    <table>
      <tr>
        <td>
          <span>UID：</span>
          <el-input v-model="uid"  placeholder="请输入玩家uid"></el-input>
        </td>
        <td>
          <el-button type="primary" @click="search()">查询</el-button>
        </td>
        <td style="font-size: 20px">
          <span>该玩家总充值金额：</span>
          <span>{{ dollarAll }}</span>
        </td>
      </tr>
    </table>
    <el-main v-loading="loading">
      <el-table
        border
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        :fit="true"
        @sort-change="sortChange"
      >
        <el-table-column
          prop="server_id"
          sortable
          label="服务器"
        ></el-table-column>
        <el-table-column
         prop="uid"
         sortable
         label="UID"
        ></el-table-column>
        <el-table-column
          prop="date"
          sortable
          :formatter="formatDate"
          label="时间"
        ></el-table-column>
        <el-table-column
          prop="dollar"
          sortable="custom"
          label="金额"
        ></el-table-column>
        <el-table-column
          prop="recharge_id"
          sortable
          label="充值ID"
        ></el-table-column>
        <el-table-column
          prop="gift_id"
          sortable
          label="礼包ID"
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
import server from "../../config/server"
let map=new Map();
export default {
  name: "Recgarge",
  components: { pageNation },
  data() {
    return {
      tableData: [],
      dollarAll: 0,
      currentPage: 1, //当前页数
      pageSize: 10, //每页的数据
      loading: false,
      uid: "",
      server:server
    };
  },
  mounted(){
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
      if (column.prop === "dollar") {
        this.tableData = this.tableData.sort(
          this.sortFun(column.prop, column.order === "ascending")
        );
      }
    },
    search() {
      let arr=[];
      if (this.uid == "") {
        this.$message({
          type: "warning",
          message: "请输入需要查询的uid",
        });
        return;
      }
      this.loading = true;
      this.$http
        .post("/recharge", {
          uid: this.uid,
        })
        .then((res) => {
          if (res.result.length > 0) {
            res.result.forEach(item=>{
              let obj={
                server_id: map.get(item.server_id),
                uid: item.uid,
                date: item.date,
                dollar: item.dollar,
                recharge_id: item.recharge_id,
                gift_id: item.gift_id
              }
              arr.push(obj)
            })
            this.tableData = arr;
            this.dollarAll = res.dollarAll.toFixed(2);
            this.loading = false;
          } else {
            this.$message({ type: "warning", message: "没有对应的数据" });
            this.tableData = [];
            this.uid=""
            this.dollarAll=""
            this.loading = false;
            return;
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
.reacharge td {
  padding: 18px;
  font-size: 14px;
  display: flex;
  float: left;
}
</style>