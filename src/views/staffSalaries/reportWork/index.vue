<template>
  <div class="app-container">
    <el-form ref="formData" :model="formData" :inline="true">
      <el-form-item prop="searchMonth">
        <el-date-picker
          v-model="formData.searchMonth"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择月"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="nickName">
        <el-input
          v-model.trim="formData.nickName"
          placeholder="员工名称"
          @change="handleChangeNickName"
        />
      </el-form-item>
      <el-form-item v-if="formData.nickName" prop="sex">
        <el-select v-model="formData.sex" placeholder="性别" disabled>
          <el-option label="男" value="0"> </el-option>
          <el-option label="女" value="1"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="formData.nickName" prop="procedureName">
        <el-input
          v-model="formData.procedureName"
          placeholder="工序"
          disabled
        />
      </el-form-item>
      <el-form-item prop="customerName">
        <el-input v-model="formData.customerName" placeholder="客户名称" />
      </el-form-item>
      <el-form-item prop="orderCode">
        <el-input v-model="formData.orderCode" placeholder="订单编号" />
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
      <!-- <el-button
        v-hasPermi="['staffSalaries:reportWork:import']"
        class="blue-btn"
        @click="onImport"
        v-throttle
        >导入</el-button
      > -->
      <el-button
        v-hasPermi="['staffSalaries:reportWork:export']"
        class="light-blue-btn"
        @click="onExport"
        v-throttle
        >导出</el-button
      >
      <el-button
        v-hasPermi="['staffSalaries:reportWork:calculate']"
        class="light-blue-btn"
        @click="onCalculate"
        v-throttle
        >计算总工资</el-button
      >

      <span class="wages" v-show="isShow">
        总计件工资：{{ totalWages }}
        <i class="el-icon-circle-close" @click="isShow = false"></i>
      </span>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center"> </el-table-column>
      <el-table-column prop="salaryMonth" label="工资月份" align="center" />
      <el-table-column prop="orderCode" label="订单编号" align="center" />
      <el-table-column prop="customerName" label="客户名称" align="center" />
      <el-table-column prop="productName" label="产品名称" align="center" />
      <el-table-column prop="productModel" label="型号" align="center" />
      <el-table-column prop="productSpec" label="规格" align="center" />
      <el-table-column prop="productSize" label="尺寸" align="center" />
      <el-table-column prop="peelClothNo" label="皮布号" align="center" />
      <el-table-column prop="productUnit" label="单位" align="center" />
      <el-table-column prop="procedureName" label="工序名称" align="center" />
      <el-table-column prop="nickName" label="生产工" align="center" />
      <el-table-column prop="num" label="报工量" align="center" />
      <el-table-column prop="price" label="工价" align="center" />
      <el-table-column prop="pieceworkPay" label="计件工资" align="center" />
      <el-table-column prop="dispatchCode" label="任务单号" align="center" />
      <el-table-column prop="orderTime" label="下单日期" align="center" />
    </el-table>
    <pagination
      :total="total"
      style="margin-bottom: 20px"
      :page.sync="formData.current"
      :limit.sync="formData.size"
      @pagination="getTableData"
    />
    <!-- <ImportDialog
      :dialogVisible="importDialogVisible"
      templateFileName="员工月度计件工资导入模板.xlsx"
      action="/manager/customerOrder/import"
      @onSuccess="onImportSucess"
      @onClose="handleCloseImportDialog"
    /> -->
  </div>
</template>

<script>
// import ImportDialog from "@/components/ImportDialog";
import {
  getWorkReportStatisticsPageList,
  salaryCalculation,
  getUserInfo,
} from "@/api/staffSalaries/reportWork";
import { downLoadXlsx } from "@/utils/zipdownload";
export default {
  name: "ReportWork",
  // components: {
  //   ImportDialog
  // },
  data() {
    return {
      // 搜索
      formData: {
        searchMonth: "",
        nickName: "",
        sex: "",
        procedureName: "",
        customerName: "",
        orderCode: "",
        current: 1,
        size: 10,
      },
      isShow: false,
      totalWages: 0,
      // 表格
      loading: false,
      tableData: [],
      total: 0,
      multipleSelection: [],
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      this.loading = true;
      getWorkReportStatisticsPageList(this.formData).then((res) => {
        this.tableData = res.data.records;
        this.total = res.data.total;
        this.loading = false;
      });
    },

    handleChangeNickName(val) {
      if (val) {
        getUserInfo(val).then((res) => {
          console.log("getUserInfo", res);
          this.formData.sex = res.data.sex;
          this.formData.procedureName = res.data.procedureName;
        });
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

    onImport() {
      console.log("onImport");
    },

    onExport() {
      downLoadXlsx("/manager/workReportStatistics/export", {
        searchMonth: this.formData.searchMonth,
        nickName: this.formData.nickName,
        customerName: this.formData.customerName,
        orderCode: this.formData.orderCode,
      });
    },

    onCalculate() {
      if (this.isShow) {
        return;
      }
      let formData = {
        searchMonth: this.formData.searchMonth,
        nickName: this.formData.nickName,
        orderCode: this.formData.searchMorderCodeonth,
        customerName: this.formData.customerName,
        idList: [],
      };

      formData.idList = this.multipleSelection.map((item) => {
        return item.id;
      });

      salaryCalculation(formData).then((res) => {
        console.log("salaryCalculation", res);
        this.totalWages = res.data;
        this.isShow = true;
      });
    },

    onReverseAudit() {
      if (!this.multipleSelection.length) {
        this.$message.warning("请至少选择一个订单!");
        return;
      }
      this.$confirm("是否确定审核不通过该订单？", "审核不通过确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            this.$message({
              type: "success",
              message: "审核不通过成功!",
            });
            this.getTableData();
          } catch (error) {
            console.log("onReverseAudit", error);
          }
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
