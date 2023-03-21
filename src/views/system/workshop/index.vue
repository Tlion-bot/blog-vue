<template>
  <div class="app-container">
    <el-form
      ref="formData"
      :model="formData"
      :inline="true"
      @submit.native.prevent
    >
      <el-form-item prop="name">
        <el-input
          v-model="formData.name"
          placeholder="请输入车间名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="dark-green-btn" @click="onSearch" v-throttle
          >搜索</el-button
        >
        <el-button class="gray-btn" @click="onReset('formData')" v-throttle
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <div class="action-box">
      <el-button
        v-hasPermi="['workshop:add']"
        class="dark-green-btn"
        @click="onAdd"
        >新增车间</el-button
      >
    </div>
    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" width="50" align="center">
      </el-table-column>
      <el-table-column prop="name" label="车间名称" align="center" />
      <el-table-column prop="createTime" label="创建时间" align="center">
      </el-table-column>
      <el-table-column label="启用禁用" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.eable"
            active-value="0"
            inactive-value="1"
            active-color="#30869B"
            @change="changeStatus(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['workshop:edit']"
            @click="onEdit(scope.row)"
            type="text"
            size="small"
            >编辑
          </el-button>
          <el-button
            v-hasPermi="['workshop:detail']"
            @click="onView(scope.row)"
            type="text"
            size="small"
            >查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      style="margin-bottom: 20px"
      :page.sync="formData.current"
      :limit.sync="formData.size"
      @pagination="getTableData"
    />
    <el-dialog
      :visible.sync="dialogVisible"
      top="0vh"
      width="35%"
      custom-class="right-dialog"
      :show-close="false"
      :before-close="handleCloseDialog"
    >
      <div class="right-dialog-header">
        <div class="right-dialog-title">{{ dialogTitle }}</div>
        <div>
          <el-button
            class="gray-btn"
            size="small"
            v-throttle
            @click="handleCloseDialog"
            >取消</el-button
          >
          <el-button
            class="dark-green-btn"
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
        label-position="left"
        label-width="90px"
        @submit.native.prevent
      >
        <el-form-item
          prop="name"
          label="车间名称"
          :rules="[{ required: true, message: '车间名称不能为空' }]"
        >
          <div style="width: 217px">
            <el-input
              :disabled="disabled"
              v-model="dialogForm.name"
              placeholder="请输入车间名称"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item
          v-if="!isEdit"
          prop="procedureId"
          label="车间工序"
          :rules="[
            { required: true, message: '车间工序不能为空', trigger: 'change' },
          ]"
        >
          <el-select
            v-model="dialogForm.procedureId"
            placeholder="请选择"
            :disabled="disabled"
          >
            <el-option
              v-for="item in processOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="eable"
          label="启用/禁用"
          :rules="[{ required: true }]"
        >
          <el-switch
            v-model="dialogForm.eable"
            active-value="0"
            inactive-value="1"
            active-color="#30869B"
            :disabled="disabled"
          >
          </el-switch>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getProcedureSelectList } from "@/api/basicData/productProcess";
import {
  getWorkshopPageList,
  addWorkshop,
  editWorkshop,
  eableWorkshop,
} from "@/api/system/workshop";
export default {
  name: "Workshop",
  data() {
    return {
      formData: {
        name: "",
        current: 1,
        size: 10,
      },
      loading: false,
      tableData: [],
      total: 0,
      dialogTitle: "",
      dialogVisible: false,
      dialogForm: {
        id: "",
        name: "",
        procedureId: "",
        eable: "0",
      },
      isEdit: false,
      disabled: false,
      processOptions: [],
    };
  },
  created() {
    this.getTableData();
    this.getProcedureSelectList();
  },
  methods: {
    getTableData() {
      this.loading = true;
      getWorkshopPageList(this.formData).then((res) => {
        this.tableData = res.data.records;
        this.total = res.data.total;
        this.loading = false;
      });
    },

    getProcedureSelectList() {
      getProcedureSelectList().then((res) => {
        this.processOptions = res.data;
      });
    },

    onSearch() {
      this.formData.current = 1;
      this.getTableData();
    },

    onReset(formName) {
      this.formData.current = 1;
      this.$refs[formName].resetFields();
      this.getTableData();
    },

    onAdd() {
      this.dialogTitle = "新增车间";
      this.dialogVisible = true;
    },

    onEdit(row) {
      this.dialogForm = { ...row };
      this.dialogTitle = "编辑车间";
      this.isEdit = true;
      this.dialogVisible = true;
    },

    /** 切换状态 */
    changeStatus(row) {
      this.$confirm(
        `是否确认${row.eable === "1" ? "禁用" : "启用"}该车间?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          eableWorkshop({
            id: row.id,
            eable: row.eable,
          })
            .then((res) => {
              this.msgSuccess(`${row.eable === "1" ? "禁用" : "启用"}成功`);
            })
            .catch(() => {
              row.eable = row.eable === "1" ? "0" : "1";
            });
        })
        .catch(() => {
          row.eable = row.eable === "1" ? "0" : "1";
        });
    },

    onView(row) {
      this.dialogForm = { ...row };
      this.dialogTitle = "车间详情";
      this.disabled = true;
      this.dialogVisible = true;
    },

    handleCloseDialog() {
      this.dialogForm = {
        id: "",
        name: "",
        procedureId: "",
        eable: "0",
      };
      this.$refs['rightDialogForm'].resetFields();
      this.isEdit = false;
      this.disabled = false;
      this.dialogTitle = "";
      this.dialogVisible = false;
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.dialogForm.id) {
            addWorkshop(this.dialogForm).then((res) => {
              this.$message.success("新增成功!");
              this.handleCloseDialog();
              this.getTableData();
            });
          } else {
            editWorkshop(this.dialogForm).then((res) => {
              this.$message.success("编辑成功!");
              this.handleCloseDialog();
              this.getTableData();
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
