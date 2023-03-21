<template>
  <div class="app-container">
    <el-form
      ref="formData"
      :model="formData"
      :inline="true"
      @submit.native.prevent
    >
      <el-form-item prop="procedureId">
        <el-select v-model="formData.procedureId" placeholder="请选择工序">
          <el-option
            v-for="item in processOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
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
    <!-- <div class="action-box">
      <el-button
        v-hasPermi="['basicData:fieldManagement:add']"
        class="dark-green-btn"
        @click="onAdd"
        >新增</el-button
      >
      <el-button
        v-hasPermi="['basicData:fieldManagement:import']"
        class="blue-btn"
        @click="onImport"
        >导入</el-button
      >
      <el-button
        v-hasPermi="['basicData:fieldManagement:export']"
        class="light-blue-btn"
        @click="onExport"
        >导出</el-button
      >
    </div> -->
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="100" align="center">
      </el-table-column>
      <el-table-column type="index" label="序号" width="50" align="center">
      </el-table-column>
      <el-table-column prop="procedureName" label="工序名称" align="center" />
      <el-table-column prop="name" label="对应字段" align="center" />
      <el-table-column prop="createTime" label="创建时间" align="center">
      </el-table-column>
      <!-- <el-table-column label="启用禁用" align="center">
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
            v-hasPermi="['basicData:fieldManagement:edit']"
            @click="onEdit(scope.row)"
            type="text"
            size="small"
            >编辑
          </el-button>
          <el-button
            v-hasPermi="['basicData:fieldManagement:delete']"
            @click="onDelete(scope.row.id)"
            type="text"
            size="small"
            >删除
          </el-button>
        </template>
      </el-table-column> -->
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
        label-width="110px"
      >
        <el-form-item
          prop="procedureId"
          label="车间工序"
          :rules="[
            { required: true, message: '车间工序不能为空', trigger: 'change' },
          ]"
        >
          <el-select v-model="dialogForm.procedureId" placeholder="请选择">
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
          prop="name"
          label="对应字段名称"
          :rules="[{ required: true, message: '对应字段名称不能为空' }]"
        >
          <div style="width: 217px">
            <el-input
              v-model="dialogForm.name"
              placeholder="请输入车间名称"
            ></el-input>
          </div>
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
          >
          </el-switch>
        </el-form-item>
      </el-form>
    </el-dialog>

    <ImportDialog
      :dialogVisible="importDialogVisible"
      templateFileName="工序对应字段导入模板.xlsx"
      action="/manager/procedureField/import"
      @onSuccess="onImportSucess"
      @onClose="handleCloseImportDialog"
    />
  </div>
</template>

<script>
import ImportDialog from "@/components/ImportDialog";
import { getProcedureSelectList } from "@/api/basicData/productProcess";
import {
  getProcedureFieldPageList,
  addProcedureField,
  editProcedureField,
  eableProcedureField,
  deleteProcedureField,
} from "@/api/basicData/fieldManagement";
import { downLoadXlsx } from "@/utils/zipdownload";
export default {
  name: "FieldManage",
  components: {
    ImportDialog,
  },
  data() {
    return {
      processOptions: [],
      formData: {
        procedureId: "",
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
      multipleSelection: [],
      importDialogVisible: false,
    };
  },
  created() {
    this.getProcedureSelectList();
    this.getTableData();
  },
  methods: {
    getTableData() {
      this.loading = true;
      getProcedureFieldPageList(this.formData).then((res) => {
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

    // 导入
    onImport() {
      this.importDialogVisible = true;
    },

    handleCloseImportDialog() {
      this.importDialogVisible = false;
    },

    onImportSucess() {
      this.importDialogVisible = false;
      this.getTableData();
    },

    // 导出
    onExport() {
      downLoadXlsx("/manager/procedureField/export", {
        name: this.formData.name,
      });
    },

    onEdit(row) {
      this.dialogForm = { ...row };
      this.dialogTitle = "编辑车间";
      this.isEdit = true;
      this.dialogVisible = true;
    },

    // 选择行
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    // 启用/禁用
    changeStatus(row) {
      this.$confirm(
        `是否确认${row.eable === "1" ? "禁用" : "启用"}该字段?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          eableProcedureField({
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

    onDelete(id) {
      this.$confirm("工序字段删除后无法恢复，确定要删除吗？", "删除确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteProcedureField(id).then((res) => {
            this.$message.success("删除成功!");
            if (this.tableData.length === 1) {
              this.formData.current =
                this.formData.current === 1 ? 1 : this.formData.current - 1;
            }
            this.getTableData();
          });
        })
        .catch(() => {

        });
    },

    handleCloseDialog() {
      this.dialogForm = {
        id: "",
        name: "",
        procedureId: "",
        eable: "0",
      };
      this.$refs["rightDialogForm"].resetFields();
      this.dialogTitle = "";
      this.dialogVisible = false;
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.dialogForm.id) {
            addProcedureField(this.dialogForm).then((res) => {
              this.$message.success("新增成功!");
              this.handleCloseDialog();
              this.getTableData();
            });
          } else {
            editProcedureField(this.dialogForm).then((res) => {
              this.$message.success("编辑成功!");
              this.handleCloseDialog();
              this.getTableData();
            });
          }
          this.handleCloseDialog();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
