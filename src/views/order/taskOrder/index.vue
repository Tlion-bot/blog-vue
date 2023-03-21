<template>
  <div class="app-container">
    <el-form ref="formData" :model="formData" :inline="true">
      <el-form-item prop="customerName">
        <el-input v-model="formData.customerName" placeholder="客户名称" />
      </el-form-item>
      <el-form-item prop="orderCode">
        <el-input v-model="formData.orderCode" placeholder="订单编号" />
      </el-form-item>
      <el-form-item prop="examineFlag">
        <el-select v-model="formData.examineFlag" placeholder="审核状态">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
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
    <div class="action-box">
      <el-button
        v-hasPermi="['order:taskOrder:add']"
        class="dark-green-btn"
        @click="onAdd"
        >创建生产单</el-button
      >
      <el-button
        v-hasPermi="['order:taskOrder:transfer']"
        class="light-green-btn"
        @click="onTransfer"
        >调单</el-button
      >
      <!-- <el-button
        v-hasPermi="['order:taskOrder:import']"
        class="blue-btn"
        @click="onImport"
        >导入</el-button
      > -->
      <el-button
        v-hasPermi="['order:taskOrder:export']"
        class="light-blue-btn"
        @click="onExport"
        v-throttle
        >导出</el-button
      >
      <el-button
        v-hasPermi="['order:taskOrder:audit']"
        class="blue-btn"
        @click="onAudit"
        >审核</el-button
      >
      <el-button
        v-hasPermi="['order:taskOrder:reverseAudit']"
        class="yellow-btn"
        @click="onReverseAudit"
        >审核不通过</el-button
      >
      <el-button
        v-hasPermi="['order:taskOrder:delete']"
        class="red-btn"
        @click="onBatchDelete"
        >删除</el-button
      >
      <el-button
        v-hasPermi="['order:taskOrder:inventory']"
        class="dark-green-btn"
        :disabled="!multipleSelection.length"
        @click="inventoryDialogVisible = true"
        >工序库存查看</el-button
      >
    </div>
    <el-table
      class="table-wrapper"
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      :span-method="handleSpanMethod"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center">
      </el-table-column>
      <el-table-column label="订单编号" align="center">
        <template slot-scope="scope">
          <div
            class="order-code"
            style="cursor: pointer"
            @click="onView(scope.row.id)"
          >
            {{ scope.row.orderCode }}
            <img
              class="pass"
              v-if="scope.row.examineFlag === '1'"
              src="../../../assets/images/pass.png"
              alt="审核通过"
            />
            <img
              class="no-pass"
              v-if="scope.row.examineFlag === '2'"
              src="../../../assets/images/no-pass.png"
              alt="审核不通过"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="客户名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.customerOrderId ? scope.row.customerName : "" }}
        </template>
      </el-table-column>
      <el-table-column label="交货日期" align="center">
        <template slot-scope="scope">
          {{ scope.row.customerOrderId ? scope.row.deliveryDate : "" }}
        </template>
      </el-table-column>
      <el-table-column label="客户地址" align="center">
        <template slot-scope="scope">
          {{ scope.row.customerOrderId ? scope.row.customerAddress : "" }}
        </template>
      </el-table-column>
      <el-table-column label="联系电话" align="center">
        <template slot-scope="scope">
          {{ scope.row.customerOrderId ? scope.row.customerPhone : "" }}
        </template>
      </el-table-column>
      <el-table-column label="产品信息" align="center">
        <el-table-column label="产品名称" align="center" prop="productName" />
        <el-table-column label="型号" align="center" prop="productModel" />
        <el-table-column label="规格" align="center" prop="productSpec" />
        <el-table-column label="颜色" align="center" prop="productColor" />
        <el-table-column label="尺寸" align="center" prop="productSize" />
        <el-table-column label="皮布号" align="center" prop="peelClothNo" />
        <el-table-column label="数量" align="center" prop="productNum" />
        <!-- <el-table-column label="单位" align="center" prop="productUnit" />  -->
      </el-table-column>
      <el-table-column label="工序" align="center">
        <el-table-column
          v-for="(item, index) in processOptions"
          :label="item.name"
          :key="index"
          align="center"
        >
          <template slot-scope="scope">
            <div
              v-if="scope.row.procedureList[index]"
              class="process-box"
              :class="{
                'in-stock':
                  scope.row.procedureList[index].stock === 0 ? false : true,
              }"
            >
              {{ scope.row.procedureList[index].dispatchNum }}
            </div>
            <span v-else>--</span>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button
            class="light-blue-btn"
            v-hasPermi="['order:taskOrder:arrange']"
            @click="onArrange(scope.row.productionId)"
            size="small"
            :disabled="isDisabled(scope.row)"
            >调用库存
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

    <AddDiaolog
      v-if="dialogVisible"
      :visible="dialogVisible"
      @onClose="dialogVisible = false"
      @onSubmit="onSubmitAdd"
    />

    <TransferDialog
      v-if="transferDialogVisible"
      :visible="transferDialogVisible"
      @onClose="transferDialogVisible = false"
      @onSubmit="onSubmitTransfer"
    />

    <ImportDialog
      :dialogVisible="importDialogVisible"
      templateFileName="生产订单导入模板.xlsx"
      action="/manager/productionOrder/import"
      @onSuccess="onImportSucess"
      @onClose="handleCloseImportDialog"
    />

    <InventoryDialog
      :visible="inventoryDialogVisible"
      :multipleSelection="multipleSelection"
      @onClose="inventoryDialogVisible = false"
    />

    <ArrangeDiaolog
      v-if="arrangeDiaologVisible"
      :id="currentId"
      :visible="arrangeDiaologVisible"
      @arrangeCallBack="arrangeCallBack"
      @onClose="arrangeDiaologVisible = false"
    />
  </div>
</template>

<script>
import {
  getProductionOrderPageList,
  auditProductionOrder,
  auditBackProductionOrder,
  deleteProductionOrder,
} from "@/api/order/taskOrder";
import { getProcedureSelectList } from "@/api/basicData/productProcess";
import AddDiaolog from "./components/AddDiaolog";
import TransferDialog from "./components/TransferDialog";
import ImportDialog from "@/components/ImportDialog";
import InventoryDialog from "./components/InventoryDialog";
import ArrangeDiaolog from "./components/ArrangeDiaolog";
import { downLoadXlsx } from "@/utils/zipdownload";
export default {
  name: "TaskOrder",
  components: {
    AddDiaolog,
    TransferDialog,
    ImportDialog,
    InventoryDialog,
    ArrangeDiaolog,
  },
  data() {
    return {
      // 搜索
      formData: {
        customerName: "",
        orderCode: "",
        examineFlag: "",
        current: 1,
        size: 10,
      },
      statusOptions: [
        {
          label: "待审核",
          value: "0",
        },
        {
          label: "审核通过",
          value: "1",
        },
        {
          label: "审核不通过",
          value: "2",
        },
      ],
      processOptions: [],
      // 表格
      loading: false,
      tableData: [],
      // 合并单元格
      total: 0,
      column1Arr: [], // column1
      column1Index: 0, // column1索引
      multipleSelection: [],
      // 创建订单
      dialogVisible: false,
      // 调单
      transferDialogVisible: false,
      // 导入
      importDialogVisible: false,
      // 工序库存
      inventoryDialogVisible: false,
      // 工序排工
      currentId: "",
      arrangeDiaologVisible: false,
    };
  },
  computed: {
    totalPrice: function () {
      let totalPrice = 0;
      this.dialogForm.product.forEach((item) => {
        totalPrice = totalPrice + item.productNum * item.unitPrice;
      });
      return totalPrice;
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      await this.getProcedureSelectList();
      this.getTableData();
    },

    getProcedureSelectList() {
      getProcedureSelectList().then((res) => {
        if (res.code === 200) {
          this.processOptions = res.data;
        }
      });
    },

    getTableData() {
      this.loading = true;
      getProductionOrderPageList(this.formData).then((res) => {
        if (res.code === 200) {
          let tableData = res.data.records;
          this.tableData = this.handleTableData(tableData);
          this.mergeTable(this.tableData);
          this.total = res.data.total;
          this.loading = false;
        }
      });
    },

    // table 表格数据初始化处理，将树结构数据转为一维数组
    handleTableData(data) {
      const tableData = data.reduce((accumulator, currentValue) => {
        let obj = {
          customerOrderId: currentValue.customerOrderId,
          customerAddress: currentValue.customerAddress,
          customerName: currentValue.customerName,
          customerPhone: currentValue.customerPhone,
          deliveryDate: currentValue.deliveryDate,
          examineFlag: currentValue.examineFlag,
          id: currentValue.id,
          orderCode: currentValue.orderCode,
        };
        currentValue.productList.forEach((item) => {
          accumulator.push({
            ...obj,
            ...item,
            customId: `${obj.id}-${item.orderId}`,
          });
        });
        return accumulator;
      }, []);
      return tableData;
    },

    // 初始化合并行数组
    mergeInit() {
      this.column1Arr = []; // column1
      this.column1Index = 0; // column1索引
    },

    // 合并表格
    mergeTable(data) {
      this.mergeInit();
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          if (i === 0) {
            // 第一行必须存在，以第一行为基准
            this.column1Arr.push(1); // column1
            this.column1Index = 0;
          } else {
            // 判断当前元素与上一元素是否相同
            if (data[i].id === data[i - 1].id) {
              this.column1Arr[this.column1Index] += 1;
              this.column1Arr.push(0);
            } else {
              this.column1Arr.push(1);
              this.column1Index = i;
            }
          }
        }
      }
    },

    handleSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex <= 5) {
        const _row_1 = this.column1Arr[rowIndex];
        const _col_1 = _row_1 > 0 ? 1 : 0;
        return {
          rowspan: _row_1,
          colspan: _col_1,
        };
      }
    },

    isDisabled(row) {
      if (!row.customerOrderId) {
        return true;
      }
      let flag = row.procedureList.some((item) => item.stock > 0);
      return !flag;
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
      this.dialogVisible = true;
    },

    handleCloseAddDiaolog() {
      this.dialogVisible = false;
    },

    onSubmitAdd() {
      this.dialogVisible = false;
      this.formData.current = 1;
      this.getTableData();
    },

    onTransfer() {
      this.transferDialogVisible = true;
    },

    handleCloseTransferDialog() {
      this.transferDialogVisible = false;
    },

    onSubmitTransfer() {
      this.transferDialogVisible = false;
      this.formData.current = 1;
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
      downLoadXlsx("/manager/productionOrder/export", {
        customerName: this.formData.customerName,
        orderCode: this.formData.orderCode,
        examineFlag: this.formData.examineFlag,
      });
    },

    onAudit() {
      if (!this.multipleSelection.length) {
        this.$message.warning("请至少选择一个订单!");
        return;
      }
      this.$confirm("是否确定审核该订单？", "审核确认", {
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
          auditProductionOrder(auditForm).then((res) => {
            this.$message.success("审核成功!");
            this.getTableData();
          });
        })
        .catch(() => {});
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
        .then(() => {
          let auditForm = {
            id: [],
            audit: "2",
            remark: "审核不通过成功",
          };
          auditForm.id = this.multipleSelection.map((item) => {
            return item.id;
          });
          auditBackProductionOrder(auditForm).then((res) => {
            this.$message.success("审核不通过成功!");
            this.getTableData();
          });
        })
        .catch(() => {});
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

    onDelete(id) {
      if (!this.multipleSelection.length) {
        this.$message.warning("请至少选择一个订单!");
        return;
      }
      this.$confirm("订单删除后无法恢复，确定要删除吗？", "删除确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteProductionOrder(id).then((res) => {
            this.$message.success("删除成功!");
            let ids = String(id).split(",");
            if (this.tableData.length === ids.length) {
              this.formData.current =
                this.formData.current === 1 ? 1 : this.formData.current - 1;
            }
            this.getTableData();
          });
        })
        .catch(() => {});
    },

    // 选择行
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    onView(id) {
      this.$router.push({
        path: "/order/taskOrderDetail",
        query: {
          id,
        },
      });
    },

    onArrange(id) {
      this.currentId = id;
      this.arrangeDiaologVisible = true;
    },

    arrangeCallBack() {
      this.arrangeDiaologVisible = false;
      this.init();
    },
  },
};
</script>

<style lang="scss" scoped>
.order-code {
  position: relative;
  .pass {
    width: 61px;
    height: 42px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .no-pass {
    width: 75px;
    height: 75px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.textColor {
  color: #30869b;
}

.process-box {
  border: 1px solid #ddd;
}
.in-stock {
  color: #fff;
  background-color: rgba(75, 121, 2, 1);
}
</style>
