<template>
  <div class="dragonbalance">
    <table>
      <tr>
        <td>
          <span>服务器：</span>
          <Server ref="ServerChild" />
        </td>
        <td>
          <span>竞技场：</span>
          <Arena ref="ArenaChild" />
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
           <span style="width:80px">战力差：</span>
           <el-input placeholder="请输入战力差百分比" v-model="fighting"></el-input>
        </td>
        <td>
           <span style="width:100px">低战力值：</span>
           <el-input placeholder="请输入低战力值" v-model="low_power"></el-input>
        </td>
        <td>
           <span style="width:100px">高战力值：</span>
           <el-input placeholder="请输入高战力值" v-model="high_power"></el-input>
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
          tableData.slice((page_index - 1) * page_size, page_index * page_size)
        "
      >
        <el-table-column
          prop="role_id"
          sortable
          width="85px"
          label="龙id"
        ></el-table-column>
        <el-table-column
          prop="role_name"
          sortable
          width="90px"
          label="龙名称"
        ></el-table-column>
        <el-table-column
          prop="repeat"
          sortable
          label="重复场次率"
        ></el-table-column>
        <el-table-column
          prop="win"
          sortable
          width="85px"
          label="胜率"
        ></el-table-column>
        <el-table-column
          prop="fighting"
          sortable="custom"
          label="战斗场次"
        ></el-table-column>
        <el-table-column 
          prop="come_out" 
          sortable 
          width="90px"
          label="出场率"
        ></el-table-column>
        <el-table-column
          prop="round"
          sortable
          label="平均回合数"
        ></el-table-column>
        <el-table-column
          prop="survival"
          sortable
          width="90px"
          label="存活率"
        ></el-table-column>
        <el-table-column
          prop="one_survival"
          sortable
          label="1号位出现率"
        ></el-table-column>
        <el-table-column
          prop="tow_survival"
          sortable
          label="2号位出现率"
        ></el-table-column>
         <el-table-column
          prop="three_survival"
          sortable
          label="3号位出现率"
        ></el-table-column>
        <el-table-column
          prop="four_survival"
          sortable
          label="4号位出现率"
        ></el-table-column>
         <el-table-column
          prop="five_survival"
          sortable
          label="5号位出现率"
        ></el-table-column>
        <el-table-column
          prop="six_survival"
          sortable
          label="6号位出现率"
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
import Arena from "../../components/arena/Arena"
export default {
  name: "DragonBalance",
  components: {Server,pageNation,Arena},
  data() {
    return {
      tableData: [],
      fighting:"",
      first_time: "",
      last_time: "",
      high_power:"",
      low_power:"",
      page_index: 1, 
      page_size: 10,
      loading: false,
    };
  },
  mounted() {
    this.first_time = window.localStorage.getItem("first_time");
    this.last_time = window.localStorage.getItem("last_time");
  },
  methods: {
    //分页
    pageChange(item) {
      this.page_index = item.page_index;
      this.page_size = item.page_limit;
    },
   //龙平衡查询获取数据
    search() {
      var last_time = this.last_time;
      var first_time = this.first_time;
      window.localStorage.setItem("last_time", last_time);
      window.localStorage.setItem("first_time", first_time);
      var server_id = this.$refs.ServerChild.server_id;
      var arena=this.$refs.ArenaChild.arena;
      this.loading=true;
      server_id.forEach(serveritem=>{
          arena.forEach(arenaitem=>{
               this.$http.post("/dragonbalance",{
                  server_id:serveritem,
                  arena:arenaitem,
                  last_time:last_time/1000,
                  first_time:first_time/1000,
                  fighting:this.fighting,
                  high_power:this.high_power,
                  low_power:this.low_power
               }).then(res=>{
                 console.log(res)
                 this.loading=false;
               })
          })
      })
    },
  }
};
</script>
<style scoped>
/* 局部样式 */
.dragonbalance td {
  padding: 18px;
  font-size: 14px;
  display: flex;
  float: left;
}
.el-main{
  margin-top: -15px;
}
</style>