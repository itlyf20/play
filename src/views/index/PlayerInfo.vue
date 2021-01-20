<template>
  <div class="playerinfo">
    <table>
      <tr>
        <td>
          <span style="width: 60px">昵称：</span>
          <el-input v-model="nickname"  placeholder="请输入玩家昵称"></el-input>
        </td>
        <td>
          <span>UID：</span>
          <el-input v-model="uid" placeholder="请输入玩家uid"></el-input>
        </td>
        <td>
          <el-button type="primary" @click="search()">查询</el-button>
        </td>
      </tr>
    </table>
    <el-main v-loading="loading">
      <el-table border :data="tableData" :fit="true">
        <el-table-column 
          prop="server_id" 
          label="服务器"
        ></el-table-column>
        <el-table-column 
          prop="uid" 
          label="uid"
        ></el-table-column>
        <el-table-column 
          prop="account" 
          label="账号"
        ></el-table-column>
        <el-table-column 
          prop="nickname" 
          label="昵称"
        ></el-table-column>
        <el-table-column
          prop="reg_time"
          :formatter="formatDate"
          label="注册时间"
        ></el-table-column>
        <el-table-column
          prop="login_time"
          :formatter="formatDate"
          label="登陆时间"
        ></el-table-column>
        <el-table-column
          prop="logout_time"
          :formatter="formatDate"
          label="登出时间"
        ></el-table-column>
        <el-table-column
          prop="total_recharge"
          label="充值额度"
        ></el-table-column>
        <el-table-column 
          prop="user_ip" 
          label="IP"
        ></el-table-column>
        <el-table-column 
          prop="user_level" 
          label="等级"
        ></el-table-column>
        <el-table-column 
          prop="vip_level" 
          label="VIP"
        ></el-table-column>
        <el-table-column 
          prop="diamond" 
          label="钻石"
        ></el-table-column>
        <el-table-column 
          prop="gold" 
          label="金币"
        ></el-table-column>
        <el-table-column
         prop="power_value"
         label="战力"
        ></el-table-column>
      </el-table>
    </el-main>
  </div>
</template>

<script>
import server from "../../config/server"
let map=new Map();
export default {
  name: "PlayerInfo",
  data() {
    return {
      tableData: [],
      uid: "",
      nickname: "",
      loading: false,
      server:server
    };
  },
  mounted(){
    this.server.forEach(item=>{
      map.set(item.server_id,item.servername)
    })
  },
  methods: {
    search() {
      if (this.uid == "" && this.nickname == "") {
        this.$message({ type: "warning", message: "请输入uid或昵称任意一个" });
        return;
      } else {
        this.loading = true;
        this.$http
          .post("/playerinfo", {
            uid: this.uid,
            nickname: this.nickname,
          })
          .then((res) => {
            var arr = [];
            if(res.result.length>0){
                 res.result.forEach((item) => {
                  var obj = {
                    server_id:map.get(item.server_id),
                    uid: item.uid,
                    account: item.account,
                    nickname: item.nickname,
                    reg_time: item.reg_time,
                    login_time: item.login_time,
                    logout_time: item.logout_time,
                    total_recharge: item.total_recharge.toFixed(2),
                    user_ip: item.user_ip,
                    user_level: item.user_level,
                    vip_level: item.vip_level,
                    diamond: item.diamond,
                    gold: item.gold,
                    power_value: item.power_value,
                  };
                  arr.push(obj);
                });
                this.tableData = arr;
                this.uid = "";
                this.nickname = "";
                this.loading = false;
            }else{
                this.$message({ type: "warning", message: "没有对应的数据" });
                this.tableData = [];
                this.uid=""
                this.nickname=""
                this.loading = false;
                return;
            }
          });
      }
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
.playerinfo td {
  padding: 18px;
  font-size: 14px;
  display: flex;
  float: left;
}
</style>>
