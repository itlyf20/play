<template>
  <div>
    <el-header>
      <div class="title">游戏后台运营管理系统</div>
      <div class="titleright">
        <span class="titlehy">欢迎，&nbsp;{{ user }}</span>
        <el-dropdown @command="setDialogInfo">
          <span class="el-dropdown-link">
            <span class="titles">用户设置</span>
            <i
              class="el-icon-arrow-down el-icon--right"
              style="color: #fff"
            ></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="info">个人信息</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
  </div>
</template>
<script>
export default {
  name: "Header",
  data() {
    return {
      user: "",
    };
  },
  mounted() {
    let user = sessionStorage.getItem("user");
    this.user = user;
    let token = sessionStorage.getItem("token");
    if (token == null) {
      this.$router.push("/login");
    }
  },
  methods: {
    // 下拉框选择，点击个人信息后调整到对应的函数执行
    setDialogInfo(comItem) {
      switch (comItem) {
        case "info":
          this.showInfoList();
          break;
        case "logout":
          this.logout();
          break;
      }
    },
    //展示个人信息
    showInfoList() {
      this.$alert(
        `<div>
            名称：${this.user}
            <br/>
            身份：管理员
          </div>`,
        "个人名片",
        {
          dangerouslyUseHTMLString: true,
        }
      );
    },
    logout() {
      this.$confirm("确定退出登录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //点击确定的操作(调用接口)
          window.sessionStorage.clear();
          this.$router.push("/login");
        })
        .catch(() => {
          return;
        });
    },
  },
};
</script>
<style scoped>
.titlehy {
  padding: 0 20px;
  font-size: 18px;
  color: #fff;
}
.titles {
  font-size: 16px;
  color: #fff;
}
.el-header {
  background-color: #242f42;
  display: flex;
  top: 0;
  width: 100%;
  line-height: 60px;
  position: fixed;
}
.el-header .title {
  color: #41b883;
  font-size: 18px;
  text-align: left;
}
.el-header .titleright {
  color: white;
  font-size: 16px;
  position: absolute;
  right: 30px;
}
</style>