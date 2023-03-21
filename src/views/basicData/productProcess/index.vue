<template>
  <div class="app-container">
    <div class="action-box">
      <el-button
        v-hasPermi="['basicData:productProcess:add']"
        class="dark-green-btn"
        @click="onAdd"
        >新增</el-button
      >
    </div>
    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <el-table-column prop="sort" label="工序排序" align="center" />
      <el-table-column prop="name" label="工序名称" align="center" />
      <el-table-column prop="creator" label="操作账号" align="center" />
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
            v-hasPermi="['basicData:productProcess:edit']"
            @click="onEdit(scope.row)"
            type="text"
            size="small"
            >编辑
          </el-button>
          <el-button
            v-hasPermi="['basicData:productProcess:delete']"
            @click="onDelete(scope.row.id)"
            type="text"
            size="small"
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
        :rules="dialogFormRules"
        label-position="left"
        label-width="90px"
      >
        <el-form-item prop="name" label="工序名称">
          <el-input
            v-model="dialogForm.name"
            placeholder="请输入工序名称"
            style="width: 217px"
          ></el-input>
        </el-form-item>
        <el-form-item prop="eable" label="启用/禁用">
          <el-switch
            v-model="dialogForm.eable"
            active-value="0"
            inactive-value="1"
          >
          </el-switch>
        </el-form-item>
        <el-form-item prop="sort" label="工序排序">
          <el-input
            v-model="dialogForm.sort"
            type="number"
            placeholder="请输入工序排序"
            style="width: 217px"
          ></el-input>
        </el-form-item>
        <el-form-item>
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
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  getProcedurePageList,
  addProcedure,
  editProcedure,
  deleteProcedure,
  eableProcedure,
} from "@/api/basicData/productProcess";
export default {
  name: "ProductProcess",
  data() {
    return {
      formData: {
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
        sort: "",
        eable: "0",
      },
      dialogFormRules: {
        name: [{ required: true, message: "工序名称不能为空" }],
        eable: [{ required: true }],
        sort: [{ required: true, message: "工序排序不能为空" }],
      },
      disabled: false,
      processOptions: [],
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      this.loading = true;
      getProcedurePageList(this.formData).then((res) => {
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

    onAdd() {
      this.dialogTitle = "产品工序配置";
      this.dialogVisible = true;
    },

    onEdit(row) {
      this.dialogForm = { ...row };
      this.dialogTitle = "产品工序配置";
      this.dialogVisible = true;
    },

    /** 切换状态 */
    changeStatus(row) {
      this.$confirm(
        `是否确认${row.eable === "1" ? "禁用" : "启用"}该工序?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          eableProcedure({
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
      this.$confirm("工序删除后无法恢复，确定要删除吗？", "删除确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteProcedure(id).then((res) => {
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
        sort: "",
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
            addProcedure(this.dialogForm).then((res) => {
              this.$message.success("新增成功!");
              this.handleCloseDialog();
              this.getTableData();
            });
          } else {
            editProcedure(this.dialogForm).then((res) => {
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
