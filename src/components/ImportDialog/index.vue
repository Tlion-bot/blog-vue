<template>
  <el-dialog
    custom-class="dialog-warp"
    :title="title"
    :visible.sync="dialogVisible"
    width="460px"
    :close-on-click-modal="false"
    :before-close="handleCloseImportDialog"
  >
    <div class="step1">
      <p>第一步</p>
      <p>
        点击下载空的
        <span class="template-text" @click="onDownLoad">表格模板</span>
      </p>
    </div>
    <div class="step2">
      <p>第二步</p>
      <el-upload
        drag
        :action="uploadUrl"
        :headers="headers"
        :show-file-list="false"
        :before-upload="beforeupload"
        :on-error="handleUploadError"
        :on-success="handleUploadSuccess"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传excel文件，且不超过{{ fileSize }}M
        </div>
      </el-upload>
    </div>
    <el-dialog
      width="30%"
      title="导入详情"
      :visible.sync="innerVisible"
      append-to-body
      :before-close="handleCloseInnerDialog"
    >
      <div class="tip">
        合计：导入成功{{ successCount }}条，失败{{ errorCount }}条
      </div>
      <el-table :data="failList" style="width: 100%">
        <el-table-column prop="num" label="行数" width="100"> </el-table-column>
        <el-table-column prop="failReason" label="失败原因"> </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleCloseInnerDialog"
          >取 消</el-button
        >
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { Loading } from "element-ui";
import { getToken } from "@/utils/auth";
import {
  downloadTemplate,
  getRusultByMessageId,
  getFailRusultByMessageId,
} from "@/api/import";
export default {
  name: "ImportDialog",
  props: {
    title: {
      type: String,
      default: "批量导入",
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    action: {
      type: String,
      default: "",
    },
    templateFileName: {
      type: String,
      default: "",
    },
    // 类型限制
    fileFormats: {
      type: Array,
      default: () => ["xls", "xlsx"],
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      uploadUrl: process.env.VUE_APP_BASE_API + this.action,
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      innerVisible: false,
      timer: null,
      loadingInstance: null,
      successCount: 0,
      errorCount: 0,
      failList: [],
    };
  },
  methods: {
    // 下载模板文件
    async onDownLoad() {
      try {
        const res = await downloadTemplate(this.templateFileName);
        let url = window.URL.createObjectURL(
          new Blob([res], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
          })
        );
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", this.templateFileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.log("onDownload", error);
      }
    },
    // 上传前的处理
    beforeupload(file) {
      let tempArr = file.name.split(".");
      let fileFormat = tempArr[tempArr.length - 1];
      // 校验文件格式
      if (!this.fileFormats.includes(fileFormat)) {
        this.$message.error("文件格式不正确，请上传excel文件！");
        return false;
      }
      // 校检文件大小
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$message.error(`上传文件大小不能超过 ${this.fileSize} MB!`);
          return false;
        }
      }
      this.loadingInstance = Loading.service({
        fullscreen: true,
        text: "正在导入中",
        background: "rgba(0, 0, 0, 0.7)",
      });
    },
    // 上传失败
    handleUploadError() {
      this.$message.error("上传失败, 请重试");
      this.loadingInstance.close();
    },
    // 上传成功回调
    handleUploadSuccess(res) {
      if (res.code === 200) {
        this.$message.success("上传成功!");
        this.innerVisible = false;
        this.timer = setInterval(() => {
          this.getRusultByMessageId(res.data);
        }, 1000);
      } else {
        this.$message.warning(res.msg || "上传失败!");
      }
    },
    async getRusultByMessageId(id) {
      try {
        const res = await getRusultByMessageId(id);
        if (res.code === 200) {
          const { isFinish, successCount, errorCount } = res.data;
          if (isFinish == 1) {
            clearInterval(this.timer);
            this.loadingInstance.close();
            this.timer = null;
            if (errorCount == 0) {
              this.$message.success("导入成功!");
              this.$emit("onSuccess");
            } else {
              this.successCount = successCount;
              this.errorCount = errorCount;
              this.getFailRusultByMessageId(id);
            }
          }
        }
      } catch (error) {
        console.log("getRusultByMessageId", error);
      }
    },

    async getFailRusultByMessageId(id) {
      try {
        const res = await getFailRusultByMessageId(id);
        if (res.code === 200) {
          this.failList = res.data || [];
          this.innerVisible = true;
        }
      } catch (error) {
        console.log("getFailRusultByMessageId", error);
      }
    },
    handleCloseImportDialog() {
      this.$emit("onClose");
    },
    handleCloseInnerDialog() {
      this.innerVisible = false;
      this.$emit("onSuccess");
    },
  },
};
</script>

<style lang="scss">
.dialog-warp {
  .el-dialog__header {
    border-bottom: 1px solid #d9d9d9 !important;
  }

  .el-dialog__body {
    padding: 20px;
  }

  .el-upload,
  .el-upload-dragger {
    width: 100% !important;
  }

  .step1 {
    padding: 0 10px;
    margin-bottom: 20px;
    border-radius: 4px;
    border: 1px dashed #ddd;
  }

  .step2 {
    position: relative;
    > p {
      position: absolute;
      left: 10px;
      z-index: 999;
    }
  }
}

.template-text {
  color: #1890ff;
  cursor: pointer;
}

.tip {
  font-weight: 600;
  margin-bottom: 20px;
}
</style>
