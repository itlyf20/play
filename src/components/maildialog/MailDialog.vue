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
        ref="MailForm"
        :rules="rules"
        :model="MailForm"
        label-width="100px"
      >
        <el-form-item label="玩家id：" prop="play_ids">
          <el-input
            v-model.number="MailForm.play_ids"
            placeholder="请输入玩家id"
          ></el-input>
        </el-form-item>
        <el-form-item label="服务器：" prop="server_id">
          <el-select
            v-model="MailForm.server_id"
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
        </el-form-item>
        <el-form-item label="标题：" prop="title">
          <el-input v-model="MailForm.title" placeholder="请输入邮件标题"></el-input>
        </el-form-item>
        <el-form-item label="内容：" prop="content">
          <el-input v-model="MailForm.content"  placeholder="请输入邮件内容"></el-input>
        </el-form-item>
        <el-form-item label="发送时间：" prop="send_time">
          <el-date-picker
            v-model="MailForm.send_time"
            type="datetime"
            value-format="timestamp"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发送人：" prop="sendpeople">
          <el-input placeholder="请输入发送人" v-model="MailForm.sendpeople"></el-input>
        </el-form-item>
        <el-form-item label="附件：" prop="role_id">
          <el-input
            style="width: 60%"
            placeholder="请输入物品名称或龙的ID"
            v-model.number="MailForm.role_id"
          ></el-input>
          <span style="margin-left: 20px; padding: 10px; font-size: 15px"
            >共</span
          >
          <el-input-number
            style="width: 15%"
            v-model="MailForm.num"
            controls-position="right"
            :min="1"
            :max="10"
          ></el-input-number>
          <span style="padding: 10px; font-size: 15px">个</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleclose()">取 消</el-button>
        <el-button type="primary" @click="handleAddEdit('MailForm')"
          >立即发送</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Server from "../serverd/Server";
export default {
  name: "MailDialog",
  components: {
    Server,
  },
  // 获取父亲传过来的值
  props: {
    dialog: Object,
  },
  data() {
    return {
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
      ],
      MailForm: {
        title: "",
        play_ids: "",
        content: "",
        send_time: "",
        sendpeople: "",
        num: 1,
        role_id: "",
        server_id: [],
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        play_ids: [
          {
            type: "number",
            required: true,
            message: "请输入玩家ID",
            trigger: "blur",
          },
        ],
        server_id: [
          { required: true, message: "请输入服务器", trigger: "blur" },
        ],
        content: [{ required: true, message: "请输入内容", trigger: "blur" }],
        send_time: [{ required: true, message: "请输入时间", trigger: "blur" }],
        sendpeople: [
          { required: true, message: "请输入发送人名称", trigger: "blur" },
        ],
        role_id: [
          {
            required: true,
            type: "number",
            message: "请输入角色id",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //input输入分割
    // myFunction(){
    //   this.MailForm.play_ids=this.MailForm.play_ids.replace(/([^_-\W]{5})/g,"$1,")
    // },
    handleAddEdit(MailForm) {
      this.$refs[MailForm].validate((valid) => {
        if (valid) {
          this.dialog.show = false;
          let obj = {
            title: this.MailForm.title,
            content: this.MailForm.content,
            send_time: this.MailForm.send_time,
            sendpeople: this.MailForm.sendpeople,
            num: this.MailForm.num,
            role_id: this.MailForm.role_id,
            play_ids: this.MailForm.play_ids,
            server_id: this.MailForm.server_id,
          };
          var arr = [];
          arr.push(obj);
          this.$emit("update", arr);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    selectAll() {
      if (this.MailForm.server_id.length < this.ssoption.length) {
        this.MailForm.server_id = [];
        this.ssoption.map((item) => {
          this.MailForm.server_id.push(item.value);
        });
        this.MailForm.server_id.unshift("全选");
      } else {
        this.MailForm.server_id = [];
      }
    },
    changeSelect(val) {
      if (!val.includes("全选") && val.length === this.ssoption.length) {
        this.MailForm.server_id.unshift("全选");
      } else if (
        val.includes("全选") &&
        val.length - 1 < this.ssoption.length
      ) {
        this.MailForm.server_id = this.MailForm.server_id.filter((item) => {
          return item !== "全选";
        });
      }
    },
    removeTag(val) {
      if (val === "全选") {
        this.MailForm.server_id = [];
      }
    },
    handleclose() {
      this.dialog.show = false;
    },
  },
};
</script>
<style scoped>
.upload {
  width: 20px;
  height: 20px;
  margin-top: 10px;
}
</style>