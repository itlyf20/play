<template>
  <div class="noviceguide">
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
    <div id="main" v-loading="loading"></div>
  </div>
</template>
<script src="https://cdn.bootcss.com/jquery/3.4.1/jquery.js"></script>
<script src="../../assets/jquery.table2excel.js"></script>
<script>
import echarts from "echarts";
import Server from "../../components/server/Server.vue";
export default {
  name: "Noviceguide",
  components: { Server },
  data() {
    return {
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
    search() {
      var last_time = this.last_time;
      var first_time = this.first_time;
      window.localStorage.setItem("first_time", first_time);
      window.localStorage.setItem("last_time", last_time);
      this.queryRanking();
    },
    queryRanking() {
      var last_time = this.last_time;
      var first_time = this.first_time;
      // 在子组件中定义好一个id属性为headerChild的属性，在父组件中通过ref定义后直接通过this.$refs.headerChild.server_id获得子组件的数据
      var server_id = this.$refs.ServerChild.server_id;
      var rankName = new Array();
      var commonCount = new Array();
      var map = new Map();
      if (server_id == "") {
        this.$message({
          type: "warning",
          message: "请选择服务器名称",
        });
        return;
      }
      if (first_time == "") {
        this.$message({
          type: "warning",
          message: "请输入开始时间",
        });
        return;
      }
      if (last_time == "") {
        this.$message({
          type: "warning",
          message: "请输入结束时间",
        });
        return;
      }
      this.loading = true;
      this.$http
        .post("/noviceguide", {
          first_time: first_time / 1000,
          last_time: last_time / 1000,
          server_id: server_id,
        })
        .then((res) => {
          if (res.code == 200&&res.result.length>0) {
            //遍历数组，取出数据
            res.result.forEach((item) => {
              rankName.push(item.event_id);
              commonCount.push(item.count);
            });
            this.getEchart(rankName, commonCount);
          } else {
            this.$message({
              type: "warning",
              message: "没有对应的数据",
            });
            this.loading = false;
            this.getEchart([], [], [], []);
            return;
          }
          this.loading = false;
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
        });
    },
    getEchart(rankName, commonCount) {
      var rankingChart = echarts.init(document.getElementById("main"));
      var option = {
        title: {
          text: "新手引导分析",
          x: "center",
          y: "top",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999",
            },
          },
        },
        toolbox: {
          right: "80px",
          feature: {
            dataView: {
              show: true,
              title: "导出excel",
              //readOnly: true, //设置只读，会隐藏刷新按钮。
              lang: ["导出excel", "关闭", "导出Excel"],
              contentToOption: function (opts) {
                $("#tableExcel_Day").table2excel({
                  exclude: ".noExl", //过滤位置的 css 类名
                  filename: "新手引导视图" + ".xls", //文件名称
                  fileext: "xls",
                  exclude_img: false,
                  exclude_links: false,
                  exclude_inputs: false,
                });
              },
              optionToContent: function (opt) {
                var axisData = opt.xAxis[0].data; //坐标数据
                var series = opt.series; //折线图数据
                var tdHeads =
                  '<td style="width:50%;background-color:gray;">引导步骤</td>'; //表头第一列
                var tdBodys = ""; //表数据
                //组装表头
                var nameData = new Array("通过人数");
                for (var i = 0; i < nameData.length; i++) {
                  tdHeads +=
                    '<td style="width:50%;background-color:gray;">' +
                    nameData[i] +
                    "</td>";
                }
                var table =
                  '<table id="tableExcel_Day" border="1" style="margin-left:90px;width:85%;border-collapse:collapse;font-size:14px;text-align:center;" ><tbody><tr>' +
                  tdHeads +
                  " </tr>";
                //组装表数据
                for (var i = 0, l = axisData.length; i < l; i++) {
                  for (var j = 0; j < series.length; j++) {
                    var temp = series[j].data[i];
                    var counts = 0;
                    if (temp != null && temp != undefined) {
                      tdBodys += "<td>" + temp + "</td>";
                      counts += temp;
                    } else {
                      tdBodys += "<td></td>";
                    }
                  }
                  table +=
                    "<tr><td>" + axisData[i] + "</td>" + tdBodys + "</tr>";
                  tdBodys = "";
                }
                table += "</tbody></table>";
                return table;
              },
            },
          },
        },
        xAxis: {
          data: rankName,
          axisLabel: { interval: 7, rotate: 0 },
        },
        yAxis: {},
        series: [
          {
            name: "次数",
            type: "bar",
            barMaxWidth: "60%",
            data: commonCount,
          },
        ],
      };
      // 为echarts对象加载数据
      rankingChart.setOption(option);
    },
  },
};
</script>
<style scoped>
#main {
  width: 100%;
  margin-top: 25px;
  margin-left: 5px;
  height: 550px;
}
.noviceguide td {
  padding: 18px;
  font-size: 14px;
  display: flex;
  float: left;
}
</style>