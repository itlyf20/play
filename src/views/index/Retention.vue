<template>
  <div class="retention">
    <el-main
      v-loading="loading"
      v-if="showData"
      style="margin: 20px auto; width: 100%; align-items: center"
    >
      <el-table
        border
        :fit="true"
        :data="
          tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
      >
        <el-table-column
         prop="time" 
         sortable 
         label="时间"
        ></el-table-column>
        <el-table-column
         prop="dau" 
         label="DAU" 
         sortable
        ></el-table-column>
        <el-table-column
          prop="next_day_retention_rate"
          sortable
          label="次日留存率"
        ></el-table-column>
        <el-table-column
          prop="three_day_retention_rate"
          sortable
          label="三日留存率"
        ></el-table-column>
        <el-table-column
          prop="seven_day_retention_rate"
          sortable
          label="七日留存率"
        ></el-table-column>
        <el-table-column
          prop="fifteen_day_retention_rate"
          sortable
          label="十五日留存率"
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
export default {
  name: "Retention",
  components: { pageNation },
  data() {
    return {
      tableData: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      showData:false
    };
  },
  created() {
    this.getStatTime();
  },
  methods: {
    //分页
    pageChange(item) {
      this.currentPage = item.page_index;
      this.pageSize = item.page_limit;
    },
    formatDate(now) {
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var date = now.getDate();
      return year + "-" + month + "-" + date;
    },
    getStatTime() {
      return new Promise((resolve, reject) => {
        var endDate = parseInt(new Date().getTime() / 1000);
        var startDate = 0;
        var list = [];
        this.loading = true;
        this.$http
          .post("/getfirstday", {
            endDate: endDate,
          })
          .then((res) => {
            res.forEach((item) => {
              startDate = item.register_time;
            });
            var day1 = this.formatDate(new Date(startDate * 1000));
            var start_time =
              new Date(Date.parse(day1.replace(/-/g, "/"))).getTime() / 1000;
            var day = Math.floor((endDate - start_time) / (24 * 3600));
            for (let i = 0; i < day; i++) {
              var parms = start_time + i * (24 * 3600);
              this.search(parms).then((value) => {
                this.showData=true;
                list.push(value);
                list.sort((a, b) => {
                  return a.time < b.time ? 1 : -1;
                });
                this.tableData = list;
                this.loading = false;
              });
            }
          });
      });
    },
    search(parms) {
      var endDate = parseInt(new Date().getTime() / 1000);
      var startDate = 0;
      return new Promise((resolve, reject) => {
        this.$http
          .post("/retention", {
            start_time: parms,
          })
          .then((res) => {
            this.showData=true;
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  },
};
</script>