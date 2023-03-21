<template>
  <div class="app-container">
    <ul class="list">
      <li class="list-item">
        <span class="list-item-label">公司图标：</span>
        <el-image
          style="width: 100px; height: 100px"
          :src="detail.avatar"
          fit="fill"
        ></el-image>
      </li>
      <li class="list-item">
        <span class="list-item-label">公司名称：</span>
        <span class="list-item-value">{{ detail.name }}</span>
      </li>
      <li class="list-item">
        <span class="list-item-label">公司简称：</span>
        <span class="list-item-value">{{ detail.introduce }}</span>
      </li>
      <li class="list-item">
        <span class="list-item-label">公司地址：</span>
        <span class="list-item-value">{{ detail.companyAddress }}</span>
      </li>
      <li class="list-item">
        <span class="list-item-label">工厂地址：</span>
        <span class="list-item-value">{{ detail.factoryAddress }}</span>
      </li>
      <li class="list-item">
        <span class="list-item-label">公司负责人：</span>
        <span class="list-item-value">{{ detail.contact }}</span>
      </li>
      <li class="list-item">
        <span class="list-item-label">负责人电话：</span>
        <span class="list-item-value">{{ detail.account }}</span>
      </li>
      <li class="list-item">
        <el-button
          class="dark-green-btn"
          v-hasPermi="['basicData:companyInfo:edit']"
          @click="onEdit"
          >编辑</el-button
        >
      </li>
    </ul>
    <el-dialog
      :visible.sync="dialogVisible"
      top="0vh"
      width="35%"
      custom-class="right-dialog"
      :show-close="false"
      :before-close="handleCloseDialog"
    >
      <div class="right-dialog-header">
        <div class="right-dialog-title">编辑</div>
        <div>
          <el-button plain size="small" v-throttle @click="handleCloseDialog"
            >取消</el-button
          >
          <el-button
            type="primary"
            size="small"
            v-throttle
            @click="submitForm('rightDialogForm')"
            >保存</el-button
          >
        </div>
      </div>

      <el-form
        class="right-dialog-content"
        ref="rightDialogForm"
        :model="dialogForm"
        :rules="rules"
        label-position="left"
        label-width="100px"
      >
        <el-form-item prop="avatar" label="公司图标">
          <ImageUpload
            :value="dialogForm.avatar"
            @input="handleUploadSuccess"
          />
        </el-form-item>
        <el-form-item prop="name" label="公司名称">
          <div style="width: 320px">
            <el-input
              v-model="dialogForm.name"
              placeholder="请输入公司名称"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="introduce" label="公司简称">
          <div style="width: 320px">
            <el-input
              v-model="dialogForm.introduce"
              placeholder="请输入公司简称"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="companyAddress" label="公司地址">
          <div style="width: 320px">
            <el-input
              v-model="dialogForm.companyAddress"
              placeholder="请输入公司地址"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="factoryAddress" label="工厂地址">
          <div style="width: 320px">
            <el-input
              v-model="dialogForm.factoryAddress"
              placeholder="请输入工厂地址"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="contact" label="公司负责人">
          <div style="width: 320px">
            <el-input
              v-model="dialogForm.contact"
              placeholder="请输入公司负责人"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="account" label="负责人电话">
          <div style="width: 320px">
            <el-input
              v-model="dialogForm.account"
              placeholder="请输入负责人电话"
              disabled
            ></el-input>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import ImageUpload from "@/components/ImageUpload";
import { tenantDetail, tenantEdit } from "@/api/system/tenant";
export default {
  name: "CompanyInfo",
  components: {
    ImageUpload,
  },
  data() {
    return {
      tenantId: "",
      detail: {},
      dialogTitle: "",
      dialogVisible: false,
      dialogForm: {},
      rules: {
        avatar: [
          { required: true, message: "公司图标不能为空", trigger: "blur" },
        ],
        name: [
          { required: true, message: "公司名称不能为空", trigger: "blur" },
        ],
        companyAddress: [
          { required: true, message: "公司地址不能为空", trigger: "blur" },
        ],
        contact: [
          { required: true, message: "公司负责人不能为空", trigger: "blur" },
        ],
        account: [
          { required: true, message: "负责人电话不能为空", trigger: "blur" },
          {
            pattern: /^1\d{10}$/,
            message: "联系电话格式不正确",
            trigger: "blur",
          },
        ],
        arrivalTime: [
          { required: true, message: "到期时间不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.tenantId = JSON.parse(sessionStorage.getItem("user")).tenantId;
    this.getCompanyInfo();
  },
  methods: {
    getCompanyInfo() {
      tenantDetail(this.tenantId).then((res) => {
        this.detail = res.data;
      });
    },
    onEdit() {
      this.dialogForm = { ...this.detail };
      this.dialogVisible = true;
    },
    handleCloseDialog() {
      this.$refs["rightDialogForm"].resetFields();
      this.dialogVisible = false;
    },

    handleUploadSuccess(val) {
      this.dialogForm.avatar = val;
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          tenantEdit(this.dialogForm).then((res) => {
            this.$message.success("编辑成功!");
            this.handleCloseDialog();
            this.getCompanyInfo();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.list {
  list-style: none;
  &-item {
    display: flex;
    color: #101010;
    font-size: 14px;
    margin-bottom: 26px;
    &-label {
      width: 84px;
    }
    &-value {
      font-weight: bold;
    }
  }
}
</style>
