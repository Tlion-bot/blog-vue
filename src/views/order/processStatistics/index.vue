<template>
  <div class="app-container">
    <el-form
      class="search-form"
      ref="formData"
      :model="formData"
      :inline="true"
    >
      <el-form-item prop="month">
        <el-select
          v-model="formData.month"
          placeholder="期间"
          @change="handleChangeDateType"
        >
          <el-option
            v-for="item in monthOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="formData.month === '5'" prop="dateValue">
        <el-date-picker
          v-model="formData.dateValue"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleChangeDate"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="productName">
        <el-input v-model="formData.productName" placeholder="产品名称" />
      </el-form-item>
      <el-form-item prop="productModel">
        <el-input v-model="formData.productModel" placeholder="型号" />
      </el-form-item>
      <el-form-item prop="status">
        <el-select v-model="formData.status" placeholder="完工状态">
          <el-option
            v-for="item in orderStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="customerName">
        <el-input v-model="formData.customerName" placeholder="客户名称" />
      </el-form-item>
      <el-form-item prop="orderCode">
        <el-input v-model="formData.orderCode" placeholder="任务单号" />
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
        v-hasPermi="['order:processStatistics:export']"
        class="light-blue-btn"
        @click="onExport"
        v-throttle
        >导出</el-button
      >
      <el-button
        v-hasPermi="['order:processStatistics:delete']"
        class="red-btn"
        @click="onDelete"
        >删除</el-button
      >
    </div>
    <el-table
      class="table-wrapper"
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center">
      </el-table-column>
      <el-table-column
        prop="orderCode"
        label="订单编号"
        width="180"
        align="center"
      />
      <el-table-column
        prop="dispatchCode"
        label="任务单号"
        width="180"
        align="center"
      />
      <el-table-column
        prop="orderTime"
        label="下单日期"
        width="100"
        align="center"
      />
      <el-table-column
        prop="deliveryDate"
        label="交货日期"
        width="100"
        align="center"
      />
      <el-table-column
        prop="customerName"
        label="客户名称"
        width="100"
        align="center"
      />

      <el-table-column label="产品" align="center">
        <el-table-column
          prop="productName"
          label="名称"
          width="100"
          align="center"
        />
        <el-table-column
          prop="productSpec"
          label="规格"
          width="100"
          align="center"
        />
        <el-table-column
          prop="peelClothNo"
          label="皮布号"
          width="100"
          align="center"
        />
        <el-table-column
          prop="productModel"
          label="型号"
          width="100"
          align="center"
        />
        <el-table-column
          prop="productColor"
          label="颜色"
          width="100"
          align="center"
        />
        <el-table-column
          prop="productUnit"
          label="单位"
          width="100"
          align="center"
        />
      </el-table-column>

      <el-table-column
        prop="productNum"
        label="下单量"
        width="100"
        align="center"
      />

      <el-table-column
        v-for="(item, index) in processOptions"
        :label="item.name"
        :key="index"
        align="center"
      >
        <el-table-column label="件数" width="100" align="center">
          <template slot-scope="scope">
            <div>
              {{ scope.row.processOptions[index].num || "--" }}
            </div>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column
        prop="productionInstruction"
        label="生产说明"
        align="center"
      />
      <!-- <el-table-column
        prop="packingInstruction"
        label="包装说明"
        align="center"
      /> -->
    </el-table>
    <pagination
      :total="total"
      style="margin-bottom: 20px"
      :page.sync="formData.current"
      :limit.sync="formData.size"
      @pagination="getTableData"
    />
  </div>
</template>

<script>
import {
  getCompleteOrderPageList,
  deleteDispatchOrder,
} from "@/api/order/completeOrder";
import { getProcedureSelectList } from "@/api/basicData/productProcess";
import { downLoadXlsx } from "@/utils/zipdownload";
export default {
  name: "CompleteOrder",
  data() {
    return {
      // 搜索
      formData: {
        dataType: "2",
        month: "",
        dateValue: "",
        orderTimeStart: "",
        orderTimeEnd: "",
        productName: "",
        productModel: "",
        orderStatus: "",
        customerName: "",
        orderCode: "",
        current: 1,
        size: 10,
      },
      monthOptions: [
        {
          label: "当天",
          value: "1",
        },
        {
          label: "本月",
          value: "2",
        },
        {
          label: "上月",
          value: "3",
        },
        {
          label: "本年",
          value: "4",
        },
        {
          label: "自定义",
          value: "5",
        },
        {
          label: "全部",
          value: "6",
        },
        {
          label: "1月",
          value: "7",
        },
        {
          label: "2月",
          value: "8",
        },
        {
          label: "3月",
          value: "9",
        },
        {
          label: "4月",
          value: "10",
        },
        {
          label: "5月",
          value: "11",
        },
        {
          label: "6月",
          value: "12",
        },
        {
          label: "7月",
          value: "13",
        },
        {
          label: "8月",
          value: "14",
        },
        {
          label: "9月",
          value: "15",
        },
        {
          label: "10月",
          value: "16",
        },
        {
          label: "11月",
          value: "17",
        },
        {
          label: "12月",
          value: "18",
        },
      ],
      orderStatusOptions: [
        {
          label: "已完工",
          value: "2",
        },
        {
          label: "未完工",
          value: "1",
        },
      ],
      // 表格
      loading: false,
      tableColumns: [
        {
          label: "任务单号",
          prop: "taskNumber",
          width: "100",
        },
        {
          label: "下单日期",
          prop: "orderDate",
          width: "100",
        },
        {
          label: "订单编号",
          prop: "orderCode",
          width: "140",
        },
        {
          label: "交货日期",
          prop: "deliveryDate",
        },
        {
          label: "客户名称",
          prop: "customerName",
          width: "100",
        },
        {
          label: "产品",
          prop: "produce",
          children: [
            {
              label: "名称",
              prop: "name",
              width: "140",
            },
            {
              label: "规格",
              prop: "specification",
            },
            {
              label: "皮布号",
              prop: "leatherNum",
            },
            {
              label: "型号",
              prop: "model",
            },
            {
              label: "单位",
              prop: "unit",
            },
          ],
        },
        {
          label: "下单量",
          prop: "num",
        },

        {
          label: "钉架",
          prop: "process1",
          children: [
            {
              label: "件数",
              prop: "processNum1",
            },
          ],
        },

        {
          label: "开棉打底",
          prop: "process2",
          children: [
            {
              label: "件数",
              prop: "processNum1",
            },
          ],
        },

        {
          label: "生产说明",
          prop: "statement1",
        },
        {
          label: "包装说明",
          prop: "statement2",
        },
      ],
      tableData: [],
      total: 0,
      multipleSelection: [],
      processOptions: [],
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      await this.getProcedureSelectList();
      this.getTableData();
    },
    getTableData() {
      this.loading = true;
      getCompleteOrderPageList(this.formData)
        .then((res) => {
          this.tableData = res.data.records;
          this.tableData.forEach((item) => {
            let processOptions = this.processOptions.map((item2) => {
              let findIndex = item.dispatchLabourPriceList.findIndex(
                (item3) => item3.procedureId === item2.id
              );

              return {
                ...item2,
                num:
                  findIndex > -1
                    ? item.dispatchLabourPriceList[findIndex].num
                    : "",
              };
            });

            this.$set(item, "processOptions", processOptions);
          });

          this.total = res.data.total;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },

    getProcedureSelectList() {
      getProcedureSelectList().then((res) => {
        this.processOptions = res.data;
      });
    },

    handleChangeDateType(value) {
      if (value !== "5") {
        this.formData.orderTimeStart = "";
        this.formData.orderTimeEnd = "";
      }
    },

    handleChangeDate(value) {
      if (value) {
        this.formData.orderTimeStart = value[0];
        this.formData.orderTimeEnd = value[1];
      } else {
        this.formData.orderTimeStart = "";
        this.formData.orderTimeEnd = "";
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

    onExport() {
      downLoadXlsx("/manager/dispatchOrder/exportFinish", {
        orderTimeStart: this.formData.orderTimeStart,
        orderTimeEnd: this.formData.orderTimeEnd,
        orderCode: this.formData.orderCode,
        status: this.formData.status,
        customerName: this.formData.customerName,
        userId: this.formData.userId,
        productName: this.formData.productName,
        examineFlag: this.formData.productName,
        dataType: 2,
        productModel: this.formData.productModel,
      });
    },

    onDelete() {
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
          let ids = this.multipleSelection.map((item) => {
            return item.id;
          });
          if (this.tableData.length === ids.length) {
            this.formData.current =
              this.formData.current === 1 ? 1 : this.formData.current - 1;
          }
          deleteDispatchOrder(ids.join()).then((res) => {
            this.$message.success("删除成功!");
            this.getTableData();
          });
        })
        .catch(() => {});
    },

    // 选择行
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    onView({ id }) {
      this.$router.push({
        path: "/order/detail",
        query: {
          id,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.search-form {
  ::v-deep {
    .el-input {
      width: 160px;
    }
  }
}

.textColor {
  color: #30869b;
}
</style>
