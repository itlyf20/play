<template>
  <div class="dialog">
    <el-dialog
      :title="dialog.title"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
      :visible.sync="dialog.show"
    >
      <el-form label-width="100px" :model="PmdForm" :rules="rules">
        <el-form-item label="标题：" prop="title">
          <el-input placeholder="请输入跑马灯标题" v-model="PmdForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容：" prop="content">
          <el-input placeholder="请输入跑马灯内容" v-model="PmdForm.content"></el-input>
        </el-form-item>
        <el-form-item label="选择:">
          <el-radio-group
            v-model="PmdForm.checked"
            v-for="item in workOrderList"
            :key="item.label"
            @change="qiehuan(item.label)"
          >
            <el-radio-button :label="item.label">{{
              item.value
            }}</el-radio-button>
          </el-radio-group>
          <div style="padding: 30px" v-show="check">
            <span>定时：</span>
            <el-date-picker
              v-model="dingshi_time"
              type="datetime"
              value-format="timestamp"
              placeholder="请选择定时发送的时间"
            >
            </el-date-picker>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button type="primary" @click="handleAndEdit()">立即发送</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "MailDialog",
  // 获取父亲传过来的值
  props: {
    dialog: Object,
  },
  data() {
    return {
      check: false,
      PmdForm: {
        title: "",
        content: "",
        checked: 1,
      },
      dingshi_time: "",
      workOrderList: [
        {
          label: 1,
          value: "即时",
        },
        {
          label: 2,
          value: "定时",
        },
      ],
      rules: {
        title: [
          {
            required: true,
            message: "请输入标题",
            trigger: "blur",
          },
        ],
        content: [
          {
            required: true,
            message: "请输入内容",
            trigger: "blur",
          },
        ],
        checked: [
          {
            required: true,
            message: "请输入内容",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    handleAndEdit() {
      if (this.PmdForm.checked == 2) {
        if (this.dingshi_time == "") {
          alert("请输入定时时间");
          return;
        } else {
          var obj = {
            title: this.PmdForm.title,
            content: this.PmdForm.content,
            time: this.dingshi_time / 1000,
          };
          this.dialog.show = false;
          this.$emit("update", obj);
        }
      } else {
        var jishi_time = parseInt(new Date().getTime() / 1000);
        var obj = {
          title: this.PmdForm.title,
          content: this.PmdForm.content,
          time: jishi_time,
        };
        this.dialog.show = false;
        this.$emit("update", obj);
      }
    },
    handleClose() {
      this.dialog.show = false;
    },
    qiehuan(value) {
      if (value == 2) {
        this.check = true;
      } else {
        this.check = false;
      }
    },
  },
};
</script>
<style scoped>
</style>