<template>
  <div class="notice">
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane label="编辑公告" name="first">
            <EditNotice/>
          </el-tab-pane>
          <el-tab-pane label="新建公告" name="second">
            <NewNotice/>
          </el-tab-pane>
        </el-tabs>
  </div>
</template>

<script>
  import EditNotice from "../../components/notice/EditNotice"
  import NewNotice from "../../components/notice/NewNotice"
  export default {
    components:{EditNotice,NewNotice},
    data() {
      return {
        activeName: 'first'
      };
    },
    methods: {
      
    }
  };
</script>