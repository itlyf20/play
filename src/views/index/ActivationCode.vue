<template>
  <div class="activationcode">
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
          <el-button type="primary" @click="ExportExcel()">导出Excel</el-button>
        </td>
      </tr>
    </table>
    <el-main v-loading="loading">
      <el-table
        border
        class="table"
        :fit="true"
        :data="
          tableData.slice((page_index - 1) * page_size, page_index * page_size)
        "
      >
        <el-table-column sortable label="编号">
          <template slot-scope="{ row, $index }">
            <span v-if="!showEdit[$index]">{{ row.exchange_id }}</span>
            <el-input
              type="text"
              v-model="row.exchange_id"
              v-else
              placeholder="请输入编号"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column sortable label="物品id">
           <template slot-scope="{ row, $index }">
            <span v-if="!showEdit[$index]">{{ row.product_id }}</span>
            <el-input
              type="text"
              v-model="row.product_id"
              v-else
              placeholder="请输入使用次数"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column sortable label="使用次数">
          <template slot-scope="{ row, $index }">
            <span v-if="!showEdit[$index]">{{ row.count }}</span>
            <el-input
              type="text"
              v-model="row.count"
              v-else
              placeholder="请输入使用次数"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column sortable label="生效开始时间">
          <template slot-scope="{ row, $index }">
            <span v-if="!showEdit[$index]">{{ row.effective_time_start }}</span>
            <el-date-picker
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="row.effective_time_start"
              v-else
              placeholder="请输入生效开始时间"
            >
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column sortable label="失效结束时间">
          <template slot-scope="{ row, $index }">
            <span v-if="!showEdit[$index]">{{ row.expiration_end_time }}</span>
            <el-date-picker
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="row.expiration_end_time"
              v-else
              placeholder="请输入失效结束时间"
            >
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="center"
          width="200"
          label="操作"
        >
          <template slot-scope="{ row, $index }">
            <el-button
              v-if="!showEdit[$index]"
              @click="showUpdate($index, row)"
              type="primary"
            >
              <i class="el-icon-edit"></i>修改
            </el-button>
            <el-button
              v-if="!showEdit[$index]"
              @click="del($index, row)"
              type="danger"
            >
              <i class="el-icon-delete"></i>删除
            </el-button>
            <el-button
              v-if="showEdit[$index]"
              @click="submit($index, row)"
              type="success"
              >确定</el-button
            >
            <el-button
              v-if="showEdit[$index]"
              @click="cancelUpdate($index)"
              type="warning"
              >取消</el-button
            >
          </template>
        </el-table-column>
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
import xlsx from "xlsx";
import FileSaver from "file-saver";
import Server from "../../components/server/Server.vue";
import pageNation from "../../components/pagenation/pageNation";
export default {
  name: "ActivationCode",
  components: { Server, pageNation },
  data() {
    return {
      server_id: "",
      first_time: "",
      last_time: "",
      loading: false,
      page_index: 1, // 页数
      page_size: 10,
      //控制修改显示隐藏
      showEdit: [],
      tableData: [],
    };
  },
  mounted() {
    this.first_time = window.localStorage.getItem("first_time");
    this.last_time = window.localStorage.getItem("last_time");
  },
  methods: {
    //分页
    pageChange(item) {
      this.currentPage = item.page_index;
      this.pageSize = item.page_limit;
    },
    //搜索
    search() {
      var last_time = this.last_time;
      var first_time = this.first_time;
      window.localStorage.setItem("last_time", last_time);
      window.localStorage.setItem("first_time", first_time);
      var server_id = this.$refs.ServerChild.server_id;
      this.loading=true;
      this.$http.post("/activationcode",{
        server_id:server_id,
        first_time:first_time/1000,
        last_time:last_time/1000
      }).then(res=>{
        console.log(res)
        this.loading=false;
      })
    },
    //编辑后点击确定按钮
    submit(index, row) {
      console.log(index, row);
      this.$set(this.showEdit, index, false);
    },
    //点击删除
    del(index, row) {
      console.log(index, row);
    },
    //点击修改
    showUpdate(index) {
      this.showEdit[index] = true;
      //点击修改后改变状态切换为确定按钮
      this.$set(this.showEdit, index, true); //这里要用$set方法，否则页面状态不更新
    },
    //取消修改
    cancelUpdate(index) {
      this.$confirm("取消修改？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$set(this.showEdit, index, false);
        })
        .catch(() => {});
    },
    //导出excel
    ExportExcel() {
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
.activationcode td {
  padding: 18px;
  font-size: 14px;
  display: flex;
  float: left;
}
</style>