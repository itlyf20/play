<template>
  <div class="login-wrap">
    <div class="ms-login">
      <h1>用户登录</h1>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="0px"
        class="demo-ruleForm"
      >
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="密码"
            v-model="ruleForm.password"
          ></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="login()">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "Login",
  data() {
    return {
      ruleForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      loading: false,
    };
  },
  methods: {
    login() {
      this.loading = true;
      this.$http
        .post("/login", {
          username: this.ruleForm.username,
          password: this.ruleForm.password,
        })
        .then((res) => {
          if (res.code == 200) {
            sessionStorage.setItem("token", res.token);
            sessionStorage.setItem("user", res.user);
            this.$message({
              message: "登录成功",
              type: "success",
            });
            this.loading = false;
            this.$router.push("/playerinfo");
          } else {
            this.$message.error("用户名和密码错误！请检查后重新登录");
            this.loading = false;
            return;
          }
      });
    },
  },
  created() {
    let that = this;
    document.onkeydown = function (e) {
      e = window.event || e;
      if (
        that.$route.path == "/login" &&
        (e.code == "Enter" || e.code == "enter")
      ) {
        //验证在登录界面和按得键是回车键enter
        that.login(); //登录函数
      }
    };
  },
};
</script>
<style scoped>
.login-wrap {
  background-image: url("../assets/login_bg.jpg");
  width: 100%;
  height: 100vh;
  background-size: 100% 100%;
  background-position: center center;
  overflow: auto;
  position: relative;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 300px;
  height: 250px;
  line-height: 30px;
  margin: -150px 0 0 -190px;
  padding: 40px;
  border-radius: 5px;
  background: #fff;
  border: 1px solid #ccc;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
}
</style>
