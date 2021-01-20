<template>
  <div class="index">
    <Headers />
    <el-container>
      <el-aside width="215px">
        <NavMenu />
      </el-aside>
      <el-main>
        <Tags />
        <div class="content">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import bus from "../config/bus";
import Tags from "../components/tags/Tags";
import NavMenu from "../components/navmenu/NavMenu";
import Headers from "../components/header/Header";
export default {
  name: "Index",
  components: { Tags, NavMenu, Headers },
  mounted() {
    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    bus.$on("tags", (msg) => {
      let arr = [];
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].name && arr.push(msg[i].name);
      }
      this.tagsList = arr;
    });
  },
};
</script>
<style scoped>
.el-aside {
  position: fixed;
  left: 0;
  top: 60px;
  height: 100%;
  overflow-y: auto;
  /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
  -ms-overflow-style: none;
  /*火狐下隐藏滚动条*/
  scrollbar-width: none;
  scrollbar-color: transparent transparent;
}

.el-main {
  position: fixed;
  top: 60px;
  right: 0;
  left: 195px;
  height: 100%;
  overflow-y: auto;
  /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
  -ms-overflow-style: none;
  /*火狐下隐藏滚动条*/
  scrollbar-width: none;
  scrollbar-color: transparent transparent;
}
::-webkit-scrollbar {
  display: none;
  width: 0 !important;
}
.content {
  position: relative;
  width: 100%;
  margin-top: -5px;
  height: calc(100vh - 80px);
  min-height: auto;
  display: inline-block;
  left: 8px;
  line-height: 40px;
  overflow-y: auto;
  /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
  -ms-overflow-style: none;
  /*火狐下隐藏滚动条*/
  scrollbar-width: none;
  box-shadow: 0 0 2px #ccc;
  scrollbar-color: transparent transparent;
}
</style>
