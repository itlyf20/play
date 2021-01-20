<template>
  <div class="playrecharge">
    <table>
      <tr>
        <td>
          <span>服务器：</span>
          <Server ref="ServerChild" />
        </td>
        <td>
          <el-button type="primary" @click="search()">查询</el-button>
        </td>
        <td style="font-size: 20px">
          <span>全服累计充值：</span>
          <span>{{ total_recharge }}</span>
        </td>
      </tr>
    </table>
    <el-main v-loading="loading">
      <el-table @sort-change="sortChange" border :fit="true" :data="tableData">
        <el-table-column
         prop="section" 
         sortable 
         label="区间"
        ></el-table-column>
        <el-table-column
         prop="number_of_people" 
         sortable 
         label="人数"
        ></el-table-column>
        <el-table-column
          prop="proportion_of_population"
          sortable
          label="人数占比"
        ></el-table-column>
        <el-table-column
          prop="sum_of_money"
          label="区间玩家充值总额"
          sortable="custom"
          :sort-orders="['ascending', 'descending']"
        ></el-table-column>
        <el-table-column
          prop="amount_proportion"
          sortable
          label="占全服充值比例"
        ></el-table-column>
      </el-table>
    </el-main>
  </div>
</template>
<script>
import Server from "../../components/server/Server.vue";
export default {
  name: "PlayRecharge",
  components: { Server },
  data() {
    return {
      tableData: [],
      server_id: "",
      loading: false,
      total_recharge: "",
    };
  },
  methods: {
    sortChange: function (column, prop, order) {
      if (column.prop == "sum_of_money" && column.order == "descending") {
        this.tableData.sort(function (a, b) {
          return b.sum_of_money - a.sum_of_money;
        });
      } else {
        this.tableData.sort(function (a, b) {
          return a.sum_of_money - b.sum_of_money;
        });
      }
    },
    search() {
      var server_id = this.$refs.ServerChild.server_id;
      if (server_id == "") {
        this.$message({ type: "warning", message: "请选择服务器" });
        return;
      } else {
        this.loading = true;
        this.$http
          .post("/playrecharge", { server_id: server_id })
          .then((res) => {
            if (res.code == 200 && res.result.length > 0) {
              this.tableData = res.result;
              this.total_recharge = res.total_recharge.toFixed(2);
              this.loading = false;
            } else {
              this.$message({ type: "warning", message: res.msg });
              this.loading = false;
              this.tableData = [];
              return;
            }
          });
      }
    },
  },
};
</script>
<style scoped>
.playrecharge td {
  padding: 18px;
  font-size: 14px;
  display: flex;
  float: left;
}
</style>