<template>
  <div id="ServerChild">
    <el-select v-model="server_id" placeholder="请选择服务器" id="selects">
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
      server_id: "",
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
};
</script>
<style scoped>
</style>