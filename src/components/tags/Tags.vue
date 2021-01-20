<template>
  <div class="tags-wrap">
    <div class="tags" v-if="showTags">
      <ul class="tags-ul">
        <li
          class="tags-li"
          v-for="(item, index) in tagsList"
          :class="{ active: isActive(item.path) }"
          :key="index"
        >
          <router-link :to="item.path" class="tags-li-title">
            {{ item.title }}
          </router-link>
          <span class="tags-li-icon" @click="closeTags(index)"
            ><i class="el-icon-close"></i
          ></span>
        </li>
      </ul>
      <div class="tags-close-box">
        <el-dropdown @command="handleTags">
          <el-button size="mini" type="primary">
            标签选项<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu size="small" slot="dropdown">
            <el-dropdown-item command="other">关闭其他</el-dropdown-item>
            <el-dropdown-item command="all">关闭所有</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import bus from "../../config/bus";
export default {
  name: "Tags",
  data() {
    return {
      tagsList: [],
    };
  },
  methods: {
    isActive(path) {
      return path == this.$route.fullPath;
    },
    // 关闭单个标签
    closeTags(index) {
      const delItem = this.tagsList.splice(index, 1)[0];
      const item = this.tagsList[index]
        ? this.tagsList[index]
        : this.tagsList[index - 1];
      if (item) {
        delItem.path == this.$route.fullPath && this.$router.push(item.path);
      } else {
        this.$router.push("/playerinfo");
      }
    },
    // 关闭全部标签
    closeAll() {
      this.tagsList = [];
      this.$router.push("/playerinfo");
    },
    // 关闭其他标签
    closeOther() {
      const curItem = this.tagsList.filter((item) => {
        return item.path == this.$route.fullPath;
      });
      this.tagsList = curItem;
    },
    // 设置标签
    setTags(route) {
      const isExist = this.tagsList.some((item) => {
        return item.path == route.fullPath;
      });
      !isExist &&
        this.tagsList.push({
          title: route.meta.title,
          path: route.fullPath,
        });
      bus.$emit("tags", this.tagsList);
    },
    handleTags(command) {
      command == "other" ? this.closeOther() : this.closeAll();
      command == "all" ? this.closeAll() : this.closeOther();
    },
  },
  //计算属性
  computed: {
    showTags() {
      return this.tagsList.length > 0;
    },
  },
  //监听
  watch: {
    $route(newValue, oldValue) {
      this.setTags(newValue);
    },
  },
  mounted() {
    this.setTags(this.$route);
  },
};
</script>
<style>
.tags {
  position: relative;
  left: 8px;
  top: -15px;
  height: 40px;
  line-height: 40px;
  overflow: hidden;
  box-shadow: 0 3px 3px #ddd;
}
.tags-ul {
  width: 88%;
  display: flex;
  height: 100%;
  margin-left: -35px;
}
.tags-li {
  float: left;
  display: flex;
  border-radius: 3px;
  font-size: 0.1rem;
  margin: 1px;
  cursor: pointer;
  height: 30px;
  line-height: 30px;
  border: 1px solid #e9eaec;
  background: #fff;
  padding: 0 3px 0 8px;
  color: #666;
  margin-top: -13px;
}
.tags-li.active {
  background: #4098ff;
  color: #fff;
}
.tags-li.active .tags-li-title {
  color: #fff;
}
.tags-li-title {
  text-decoration: none;
  display: inline-block;
  color: #000;
  vertical-align: middle;
  font-size: 12px;
}
.tags-li-icon {
  display: inline-block;
  vertical-align: middle;
  font-size: 0.5rem;
  margin-left: 3px;
}
.tags-close-box {
  position: absolute;
  right: 0;
  top: 0;
  width: 95px;
  padding-left: 10px;
  box-shadow: 0px 0px 30px #ccc;
}
</style>
