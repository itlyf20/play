<template>
  <div class="shopbuy">
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
          <span>商店类别：</span>
          <el-select v-model="shop_id" placeholder="商店类别">
            <el-option
              v-for="item in shoptype"
              :label="item.label"
              :key="item.value"
              :value="item.value"
            ></el-option>
          </el-select>
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
        @sort-change="sortChange"
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
          prop="shop_type"
          sortable
          label="商店类别"
        ></el-table-column>
        <el-table-column
          prop="product_name"
          sortable
          label="物品名称"
        ></el-table-column>
        <el-table-column
          prop="money_type"
          sortable
          label="货币种类"
        ></el-table-column>
        <el-table-column
          prop="money_cost"
          sortable
          label="货币价格"
        ></el-table-column>
        <el-table-column
          prop="gm_count"
          sortable="custom"
          label="购买次数"
        ></el-table-column>
        <el-table-column
          prop="money_consume"
          sortable
          label="货币消耗占比"
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
import server from "../../config/server"
import shoptype from "../../config/shoptype"
let map=new Map();
export default {
  name: "ShopBuy",
  components: { Server, pageNation },
  data() {
    return {
      tableData: [],
      first_time: "",
      last_time: "",
      loading: false,
      shop_id: "",
      page_index: 1, // 页数
      page_size: 10,
      server:server,
      shoptype:shoptype
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
      if (column.prop === "gm_count") {
        this.tableData = this.tableData.sort(
          this.sortFun(column.prop, column.order === "ascending")
        );
      }
    },
    search() {
      var last_time = this.last_time;
      var first_time = this.first_time;
      var server_id = this.$refs.ServerChild.server_id;
      window.localStorage.setItem("last_time", last_time);
      window.localStorage.setItem("first_time", first_time);
      var arr = [];
      if (server_id == "") {
        this.$message({ type: "warning", message: "请选择服务器" });
        return;
      }
      if (this.shop_id == "") {
        this.$message({ type: "warning", message: "请选择商店类别" });
        return;
      }
      if (first_time / 1000 == "") {
        this.$message({ type: "warning", message: "请输入开始时间" });
        return;
      }
      if (last_time / 1000 == "") {
        this.$message({ type: "warning", message: "请输入结束时间" });
        return;
      }
      server_id.forEach((item) => {
        if (item == "全选") {
          return;
        } else {
          this.loading = true;
          this.$http
            .post("/shopbuy", {
              last_time: this.last_time / 1000,
              first_time: this.first_time / 1000,
              shop_id: this.shop_id,
              server_id: item,
            })
            .then((res) => {
              if (res.code == 200 && res.result.length > 0) {
                res.result.forEach((item) => {
                  let obj = {
                    server_id: map.get(item.server_id),
                    product_name: item.product_name,
                    shop_type: item.shop_type,
                    money_type: item.money_type,
                    money_cost: item.money_cost,
                    gm_count: item.gm_count,
                    money_consume: item.money_consume,
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
/* 局部样式 */
.shopbuy td {
  padding: 18px;
  font-size: 14px;
  display: flex;
  float: left;
}
</style>