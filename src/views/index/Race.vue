<template>
  <div class="race">
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
          prop="server_id"
          sortable
          label="服务器"
        ></el-table-column>
        <el-table-column
          prop="race_draw_times"
          sortable
          label="种族抽次数"
        ></el-table-column>
        <el-table-column
          prop="water_frequency"
          sortable
          label="水次数"
        ></el-table-column>
        <el-table-column
          prop="water_population"
          sortable
          label="水人数"
        ></el-table-column>
        <el-table-column
          prop="number_of_fires"
          sortable
          label="火次数"
        ></el-table-column>
        <el-table-column
          prop="number_of_fire_victims"
          sortable
          label="火人数"
        ></el-table-column>
        <el-table-column
          prop="wind_frequency"
          sortable
          label="风次数"
        ></el-table-column>
        <el-table-column
          prop="wind_number"
          sortable
          label="风人数"
        ></el-table-column>
        <el-table-column
         prop="times" 
         sortable 
         label="地次数"
        ></el-table-column>
        <el-table-column
          prop="number_of_people"
          sortable
          label="地人数"
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
  name: "Race",
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
      map.set(item.server_id,item.servername)
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
      var server_id = this.$refs.ServerChild.server_id;
      if (
        server_id == "" ||
        first_time / 1000 == "" ||
        last_time / 1000 == ""
      ) {
        this.$message({ type: "warning", message: "请选择服务器名称" });
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
      var arr = [];
      this.loading = true;
      server_id.forEach((item) => {
        if (item == "全选") {
          return;
        } else {
          this.$http
            .post("/race", {
              server_id: item,
              last_time: last_time / 1000,
              first_time: first_time / 1000,
            })
            .then((res) => {
              if (res.code == 200 && res.result.length > 0) {
                res.result.forEach((item) => {
                  let obj = {
                    server_id: map.get(item.server_id),
                    race_draw_times: item.race_draw_times,
                    water_frequency: item.water_frequency,
                    water_population: item.water_population,
                    number_of_fires: item.number_of_fires,
                    number_of_fire_victims: item.number_of_fire_victims,
                    wind_frequency: item.wind_frequency,
                    wind_number: item.wind_number,
                    times: item.times,
                    number_of_people: item.number_of_people,
                  };
                  arr.push(obj);
                });
                this.tableData = arr;
                this.loading = false;
              } else {
                this.$message({ type: "warning", message: res.data.msg });
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
.race td {
  padding: 18px;
  font-size: 14px;
  display: flex;
  float: left;
}
</style>