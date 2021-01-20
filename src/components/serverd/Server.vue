<template>
  <div id="ServerChild">
    <el-select
      v-model="server_id"
      collapse-tags
      multiple
      @remove-tag="removeTag"
      placeholder="请选择服务器"
      @change="changeSelect"
    >
      <el-option
        label="全选"
        value="全选"
        @click.native="selectAll"
      ></el-option>
      <el-option
        v-for="item in ssoption"
        :label="item.label"
        :key="item.value"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: "Select",
  data() {
    return {
      server_id: [],
      ssoption: [
        { id: 1, label: "美国服1", value: 100 },
        { id: 2, label: "美国服2", value: 101 },
        { id: 3, label: "美国服3", value: 102 },
        { id: 4, label: "美国服4", value: 103 },
        { id: 5, label: "美国服5", value: 104 },
        { id: 6, label: "美国服6", value: 105 },
        { id: 7, label: "美国服7", value: 106 },
        { id: 8, label: "美国服8", value: 107 },
        { id: 9, label: "美国服9", value: 108 },
        { id: 10, label: "美国服10", value: 109 },
        { id: 11, label: "美国服11", value: 110 },
        { id: 12, label: "美国服12", value: 111 },
        { id: 13, label: "美国服13", value: 112 },
        { id: 14, label: "美国服14", value: 113 },
        { id: 15, label: "美国服15", value: 114 },
        { id: 16, label: "美国服16", value: 115 },
        { id: 17, label: "美国服17", value: 116 },
        { id: 18, label: "美国服18", value: 117 }
      ],
    };
  },
  methods: {
    selectAll() {
      if (this.server_id.length < this.ssoption.length) {
        this.server_id = [];
        this.ssoption.map((item) => {
          this.server_id.push(item.value);
        });
        this.server_id.unshift("全选");
      } else {
        this.server_id = [];
      }
    },
    changeSelect(val) {
      if (!val.includes("全选") && val.length === this.ssoption.length) {
        this.server_id.unshift("全选");
      } else if (
        val.includes("全选") &&
        val.length - 1 < this.ssoption.length
      ) {
        this.server_id = this.server_id.filter((item) => {
          return item !== "全选";
        });
      }
    },
    removeTag(val) {
      if (val === "全选") {
        this.server_id = [];
      }
    },
  },
};
</script>
<style scoped>
</style>