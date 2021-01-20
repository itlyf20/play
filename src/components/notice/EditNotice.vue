<template>
    <div class="editnotice">
        <span style="margin-left:20px">服务器选择：</span>
         <el-select v-model="banben" placeholder="请选择服务器" id="selects">
            <el-option
                v-for="item in banbenarr"
                :label="item.label"
                :key="item.value"
                :value="item.value"
            ></el-option>
        </el-select>
        <el-button type="primary" @click="serch()">查询</el-button>
        <div class="content" v-loading="loading">
            <el-input :autosize="{maxRows: 30}" type="textarea" v-model="notice"></el-input>
            <el-button type="primary" @click="onSubmit">保存</el-button>
        </div>
    </div>
</template>
<script>
  export default {
    data() {
      return {
          notice:"",
          banben:"",
          loading: false,
          banbenarr: [
            { id: 1, label: "安卓测试服", value: "安卓测试服" },
            { id: 2, label: "安卓正式服", value: "安卓正式服" },
            { id: 3, label: "ios正式服", value: "ios正式服" },
            { id: 4, label: "安卓临时正式服", value: "安卓临时正式服" },
            { id: 5, label: "安卓临时测试服", value: "安卓临时测试服" },
          ],
      }
    },
    methods: {
      serch(){
        this.loading=true;
        this.$http.post("/getoss",{
            banben:this.banben
        }).then(res=>{
            this.notice=res.result
            this.loading=false;
        })
      },
      onSubmit() {
        this.$http.post("/saveoss",{
            notice:this.notice,
            banben:this.banben
        }).then(res=>{
            if(res=="success"){
                this.$message({ type: "success", message: "保存成功" });
                this.notice=""
                this.banben=""
            }else{
                this.$message({ type: "warning", message: "保存失败" });
            }
        }).catch(err=>{
            console.log(err);
            return;
        })
      }
    }
  }
</script>
<style scoped>
  
.editnotice{
  height: 82vh;
}
.el-button{
    margin: 20px 20px;
}
</style>
