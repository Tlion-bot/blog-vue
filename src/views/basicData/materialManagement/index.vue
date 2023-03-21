<template>
  <div class="app-container">
    <div class="action-box">
      <el-button
        class="dark-green-btn"
        v-hasPermi="['basicData:materialManagement:add']"
        @click="onAdd"
        >新增</el-button
      >
      <el-button
        v-hasPermi="['basicData:materialManagement:delete']"
        class="red-btn"
        @click="onBatchDelete"
        >删除</el-button
      >
      <el-button
        v-hasPermi="['basicData:materialManagement:import']"
        class="blue-btn"
        @click="onImport"
        >导入</el-button
      >
      <el-button
        v-hasPermi="['basicData:materialManagement:export']"
        class="light-blue-btn"
        @click="onExport"
        >导出</el-button
      >
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="100" align="center">
      </el-table-column>
      <el-table-column prop="name" label="产品类别名称" align="center" />
      <el-table-column label="启用禁用" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.eable"
            active-value="0"
            inactive-value="1"
            @change="changeStatus(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['basicData:materialManagement:edit']"
            @click="onEdit(scope.row)"
            type="text"
            size="small"
            style="color: #19a4c7"
            >编辑
          </el-button>
          <el-button
            v-hasPermi="['basicData:materialManagement:delete']"
            @click="onDelete(scope.row.id)"
            type="text"
            size="small"
            style="color: #19a4c7"
            >删除
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
      >
        <el-form-item
          prop="name"
          label="产品类别名称"
          :rules="[{ required: true, message: '产品类别名称不能为空' }]"
        >
          <div style="width: 217px">
            <el-input
              v-model="dialogForm.name"
              placeholder="请输入产品类别名称"
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
      templateFileName="产品类别导入模板.xlsx"
      action="/manager/productCategory/import"
      @onSuccess="onImportSucess"
      @onClose="handleCloseImportDialog"
    />
  </div>
</template>

<script>
import ImportDialog from "@/components/ImportDialog";
import {
  getProductCategoryPageList,
  addProductCategory,
  editProductCategory,
  eableProductCategory,
  deleteProductCategory,
} from "@/api/basicData/materialManagement";
import { downLoadXlsx } from "@/utils/zipdownload";
export default {
  name: "MaterialManagement",
  components: {
    ImportDialog,
  },
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
      multipleSelection: [],
      dialogTitle: "",
      dialogVisible: false,
      dialogForm: {
        id: "",
        name: "",
        eable: "0",
      },
      importDialogVisible: false,
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      this.loading = true;
      getProductCategoryPageList(this.formData).then((res) => {
        this.tableData = res.data.records;
        this.total = res.data.total;
        this.loading = false;
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

    // 选择行
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    onAdd() {
      this.dialogTitle = "新增产品类别";
      this.dialogVisible = true;
    },

    // 批量删除
    onBatchDelete() {
      if (!this.multipleSelection.length) {
        this.$message.warning("请至少选择一个选项！");
        return;
      }
      let ids = this.multipleSelection.map((item) => {
        return item.id;
      });

      this.onDelete(ids.join());
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
      downLoadXlsx("/manager/productCategory/export", {
        name: this.formData.name,
      });
    },

    onEdit(row) {
      this.dialogForm = { ...row };
      this.dialogTitle = "编辑产品类别";
      this.dialogVisible = true;
    },

    // 启用/禁用
    changeStatus(row) {
      this.$confirm(
        `是否确认${row.eable === "1" ? "禁用" : "启用"}该产品类别?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          eableProductCategory({
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
      this.$confirm("产品类别删除后无法恢复，确定要删除吗？", "删除确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteProductCategory(id).then((res) => {
            this.$message.success("删除成功!");
            let ids = String(id).split(",");
            if (this.tableData.length === ids.length) {
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
      this.dialogTitle = "";
      this.$refs["rightDialogForm"].resetFields();
      this.dialogForm = {
        id: "",
        name: "",
        eable: "0",
      };
      this.dialogVisible = false;
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.dialogForm.id) {
            addProductCategory(this.dialogForm).then((res) => {
              this.$message.success("新增成功!");
              this.handleCloseDialog();
              this.getTableData();
            });
          } else {
            editProductCategory(this.dialogForm).then((res) => {
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
