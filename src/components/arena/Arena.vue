<template>
  <div id="ArenaChild">
    <el-select
      v-model="arena"
      collapse-tags
      multiple
      @remove-tag="removeTag"
      placeholder="请选择竞技场"
      @change="changeSelect"
    >
      <el-option
        label="全选"
        value="全选"
        @click.native="selectAll"
      ></el-option>
      <el-option
        v-for="item in arenaoption"
        :label="item.label"
        :key="item.value"
        :value="item.value"
      ></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: "Arena",
  data() {
    return {
      arena: [],
      arenaoption: [
        { id: 1, label: "普通竞技场", value: "普通竞技场" },
        { id: 2, label: "高级竞技场", value: "高级竞技场" },
      ],
    };
  },
  methods: {
    selectAll() {
      if (this.arena.length < this.arenaoption.length) {
        this.arena = [];
        this.arenaoption.map((item) => {
          this.arena.push(item.value);
        });
        this.arena.unshift("全选");
      } else {
        this.arena = [];
      }
    },
    changeSelect(val) {
      if (!val.includes("全选") && val.length === this.arenaoption.length) {
        this.arena.unshift("全选");
      } else if (
        val.includes("全选") &&
        val.length - 1 < this.arenaoption.length
      ) {
        this.arena = this.arena.filter((item) => {
          return item !== "全选";
        });
      }
    },
    removeTag(val) {
      if (val === "全选") {
        this.arena = [];
      }
    },
  },
};
</script>
<style scoped>
</style>