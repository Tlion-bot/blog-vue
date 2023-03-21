<template>
  <div class="app-container">
    <el-form ref="formData" :model="formData" :inline="true">
      <el-form-item prop="date">
        <el-date-picker
          v-model="formData.date"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择月"
          @change="handleChangeDate"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="nickname">
        <el-input v-model="formData.nickname" placeholder="员工名称" />
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
        v-hasPermi="['staffSalaries:pieceWork:export']"
        class="light-blue-btn"
        @click="onExport"
        v-throttle
        >导出</el-button
      >
      <!-- <el-button
        v-hasPermi="['staffSalaries:pieceWork:import']"
        class="blue-btn"
        @click="onImport"
        v-throttle
        >导入</el-button
      > -->
      <el-button
        v-hasPermi="['staffSalaries:pieceWork:audit']"
        class="light-blue-btn"
        @click="onAudit"
        v-throttle
        >审核</el-button
      >
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center"> </el-table-column>
      <el-table-column prop="yearmonth" label="月份" align="center" />
      <el-table-column prop="nickname" label="员工名称" align="center" />
      <el-table-column prop="ssex" label="性别" align="center">
        <!-- <template slot-scope="scope">
          <span v-if="scope.row.sex === '0'">男</span>
          <span v-else-if="scope.row.sex === '1'">女</span>
          <span v-else>未知</span>
        </template> -->
      </el-table-column>
      <el-table-column prop="postname" label="职务" align="center" />
      <el-table-column prop="sisseparation" label="在职/离职" align="center">
        <!-- <template slot-scope="scope">
          {{ scope.row.isseparation === "0" ? "在职" : "离职" }}
        </template> -->
      </el-table-column>
      <el-table-column
        prop="separationtime"
        label="离职日期"
        width="180"
        align="center"
      >
        <template slot-scope="scope">
          {{
            scope.row.sisseparation === "离职" ? scope.row.separationtime : ""
          }}
        </template>
      </el-table-column>
      <el-table-column prop="basepay" label="基本工资" align="center" />
      <el-table-column
        prop="minimumguaranteepay"
        label="保底工资"
        align="center"
      />
      <el-table-column prop="pieceworkPay" label="计件工资" align="center" />
      <el-table-column prop="stotalPay" label="实发工资" align="center" />
      <el-table-column prop="examineFlag" label="审核状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.examineFlag === '0'">待审核</span>
          <span style="color: green" v-else-if="scope.row.examineFlag === '1'"
            >审核通过</span
          >
          <span style="color: red" v-else>审核不通过</span>
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
    <ImportDialog
      :dialogVisible="importDialogVisible"
      templateFileName="员工月度计件工资导入模板.xlsx"
      action="/manager/userSalary/import"
      @onSuccess="onImportSucess"
      @onClose="handleCloseImportDialog"
    />
  </div>
</template>

<script>
import ImportDialog from "@/components/ImportDialog";
import {
  getUserSalaryPageList,
  auditUserSalary,
} from "@/api/staffSalaries/pieceWork";
import { downLoadXlsx } from "@/utils/zipdownload";
export default {
  name: "PieceWork",
  components: {
    ImportDialog,
  },
  data() {
    return {
      // 搜索
      formData: {
        date: "",
        year: "",
        month: "",
        nickname: "",
        current: 1,
        size: 10,
      },
      // 表格
      loading: false,
      tableData: [],
      total: 0,
      multipleSelection: [],
      importDialogVisible: false,
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      this.loading = true;
      getUserSalaryPageList(this.formData).then((res) => {
        this.tableData = res.data.records;
        this.total = res.data.total;
        this.loading = false;
      });
    },

    handleChangeDate(val) {
      console.log("handleChangeDate", val);
      if (val) {
        let tempDateArr = val.split("-");
        this.formData.year = tempDateArr[0];
        this.formData.month = Number(tempDateArr[1]) + "";
      } else {
        this.formData.year = "";
        this.formData.month = "";
      }
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

    onExport() {
      downLoadXlsx("/manager/userSalary/export", {
        year: this.formData.year,
        month: this.formData.month,
        nickname: this.formData.nickname,
      });
    },

    onAudit() {
      if (!this.multipleSelection.length) {
        this.$message.warning("请至少选择一项!");
        return;
      }
      this.$confirm("是否确定审核？", "审核确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let auditForm = {
            id: [],
            audit: "1",
            remark: "审核通过",
          };

          auditForm.id = this.multipleSelection.map((item) => {
            return item.id;
          });

          auditUserSalary(auditForm).then((res) => {
            this.$message({
              type: "success",
              message: "审核成功!",
            });
            this.getTableData();
          });
        })
        .catch(() => {});
    },

    // 选择行
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.wages {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  font-size: 18px;
  font-weight: bold;
  .el-icon-circle-close {
    color: #929292;
    cursor: pointer;
  }
}
</style>
