<template>
  <div class="menu">
    <el-menu
      router
      :default-active="$route.path"
      background-color="#324157"
      text-color="#fff"
      active-text-color="#09F7F7"
      unique-opened
    >
      <el-submenu v-for="item in menu" :index="item.id" :key="item.id">
        <template slot="title"
          ><i :class="item.icon" style="color: #fff"></i
          >{{ item.name }}</template
        >
        <el-menu-item-group
          v-for="(items, indexs) in item.submenu"
          :key="indexs"
        >
          <el-menu-item :index="items.to" style="margin-top: -16px;">
            {{items.name}}
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
import menu from "../../config/menu";
export default {
  name: "NavMenu",
  data() {
    return {
      menu: menu,
    };
  },
};
</script>
<style scoped>
.el-menu {
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
}
::-webkit-scrollbar {
  display: none;
}
</style>