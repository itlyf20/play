<template>
  <div class="dialog">
    <el-dialog
      :title="dialog.title"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
      :visible.sync="dialog.show"
    >
      <el-form
        ref="NoticeForm"
        :model="NoticeForm"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="标题：" prop="title">
          <el-input placeholder="请输入公告标题" v-model="NoticeForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容：" prop="content">
          <el-input placeholder="请输入公告内容" v-model="NoticeForm.content"></el-input>
        </el-form-item>
        <el-form-item label="弹出次数：" prop="tanchucount">
          <el-input-number
            v-model="NoticeForm.tanchucount"
            controls-position="right"
            :min="1"
            :max="20"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="弹出选项：" prop="checkedtanchu">
          <el-radio-group v-model="NoticeForm.checkedtanchu">
            <el-radio-button
              v-for="item in tanchutype"
              :key="item.label"
              :label="item.value"
            ></el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button type="primary" @click="handleAddEdit('NoticeForm')"
          >立即发送</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "Noticedialog",
  // 获取父亲传过来的值
  props: {
    dialog: Object,
  },
  data() {
    return {
      dialogVisible: false,
      NoticeForm: {
        checkedtanchu: "",
        title: "",
        content: "",
        tanchucount: 1,
      },
      tanchutype: [
        {
          label: 1,
          value: "登录界面",
        },
        {
          label: 2,
          value: "主界面",
        },
      ],
      rules: {
        checkedtanchu: [
          { required: true, message: "请选择弹出界面", trigger: "blur" },
        ],
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        tanchucount: [
          { required: true, message: "请输入弹出次数", trigger: "blur" },
        ],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
    };
  },
  methods: {
    handleAddEdit(NoticeForm) {
      this.$refs[NoticeForm].validate((valid) => {
        if (valid) {
          var obj = {
            title: this.NoticeForm.title,
            content: this.NoticeForm.content,
            tanchucount: this.NoticeForm.tanchucount,
            checkedtanchu: this.NoticeForm.checkedtanchu,
          };
          this.$emit("update", obj);
          this.dialog.show = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleClose() {
      this.dialog.show = false;
    },
  },
};
</script>
<style scoped>
</style>