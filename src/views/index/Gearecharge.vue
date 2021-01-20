<template>
  <div class="gearecharge">
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
        <td style="font-size: 20px">
          <span>期间总充值：</span>
          <span>{{ total_recharge }}</span>
        </td>
      </tr>
    </table>
    <el-main v-loading="loading">
      <el-table border @sort-change="sortChange" :fit="true" :data="tableData">
        <el-table-column
          prop="dollar"
          sortable="custom"
          label="单价"
        ></el-table-column>
        <el-table-column
          prop="sum_of_money"
          sortable="custom"
          label="金额"
        ></el-table-column>
        <el-table-column
          prop="amount_proportion"
          sortable
          label="金额占比"
        ></el-table-column>
        <el-table-column 
          prop="number_of_people" 
          sortable 
          label="次数"
        ></el-table-column>
        <el-table-column
          prop="proportion_of_population"
          sortable
          label="次数占比"
        ></el-table-column>
      </el-table>
    </el-main>
  </div>
</template>
<script>
import Server from "../../components/server/Server.vue";
export default {
  name: "Gearecharge",
  components: { Server },
  data() {
    return {
      tableData: [],
      total_recharge: "",
      server_id: "",
      first_time: "",
      last_time: "",
      loading: false,
    };
  },
  mounted() {
    this.first_time = window.localStorage.getItem("first_time");
    this.last_time = window.localStorage.getItem("last_time");
  },
  methods: {
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
      if (column.prop === "sum_of_money") {
        this.tableData = this.tableData.sort(
          this.sortFun(column.prop, column.order === "ascending")
        );
      }
    },
    search() {
      var last_time = this.last_time;
      var first_time = this.first_time;
      window.localStorage.setItem("last_time", last_time);
      window.localStorage.setItem("first_time", first_time);
      var server_id = this.$refs.ServerChild.server_id;
      if (server_id == "") {
        this.$message({ type: "warning", message: "请选择需要查询的服务器" });
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
      this.$http
        .post("/gearecharge", {
          first_time: first_time / 1000,
          last_time: last_time / 1000,
          server_id: server_id,
        })
        .then((res) => {
          if (res.result.length > 0) {
            this.tableData = res.result;
            this.loading = false;
            this.total_recharge = res.total_recharge.toFixed(2);
          } else {
            this.$message({ type: "warning", message: "没有对应的数据" });
            this.loading = false;
            this.tableData = [];
            return;
          }
        });
    },
  },
};
</script>
<style scoped>
.gearecharge td {
  padding: 18px;
  font-size: 14px;
  display: flex;
  float: left;
}
</style>