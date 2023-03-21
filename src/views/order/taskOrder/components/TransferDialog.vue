<template>
  <el-dialog
    :visible.sync="visible"
    top="0vh"
    width="989px"
    custom-class="right-dialog"
    :show-close="false"
    :before-close="onClose"
  >
    <div class="right-dialog-header">
      <div class="right-dialog-title">调单</div>
      <div>
        <el-button class="gray-btn" size="small" v-throttle @click="onClose"
          >取消</el-button
        >
        <el-button
          class="dark-green-btn"
          size="small"
          v-throttle
          @click="onSubmit"
          >导入数据</el-button
        >
      </div>
    </div>

    <div class="right-dialog-content">
      <el-form ref="searchForm" :model="searchForm" :inline="true">
        <el-form-item prop="orderCode">
          <el-input v-model="searchForm.orderCode" placeholder="订单编号" />
        </el-form-item>
        <el-form-item prop="customerName">
          <el-input v-model="searchForm.customerName" placeholder="客户名称" />
        </el-form-item>
        <el-form-item prop="creator">
          <el-input v-model="searchForm.creator" placeholder="制单人" />
        </el-form-item>
        <el-form-item>
          <el-button class="dark-green-btn" @click="onSearch" v-throttle
            >搜索</el-button
          >
          <el-button class="gray-btn" @click="onReset" v-throttle
            >重置</el-button
          >
        </el-form-item>
      </el-form>

      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center"> </el-table-column>
        <el-table-column label="订单编号" align="center">
          <template slot-scope="scope">
            <div style="color: #30869b">
              {{ scope.row.orderCode }}
            </div>
            <!-- <div
              style="color: #30869b; cursor: pointer"
              @click="onView(scope.row.id)"
            >
              {{ scope.row.orderCode }}
            </div> -->
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="客户名称" align="center" />
        <el-table-column prop="customerPhone" label="联系电话" align="center" />
        <el-table-column
          prop="customerAddress"
          label="客户地址"
          align="center"
          width="180"
        />
        <el-table-column prop="otherPrice" label="其它费用" align="center" />
        <el-table-column prop="num" label="数量" align="center" />
        <el-table-column prop="totalPrice" label="小计" align="center" />
        <el-table-column prop="deliveryDate" label="交货日期" align="center" />
        <el-table-column prop="creator" label="制单人" align="center" />
      </el-table>

      <pagination
        :total="total"
        style="margin-bottom: 20px"
        :page.sync="searchForm.current"
        :limit.sync="searchForm.size"
        @pagination="getTableData"
      />
    </div>
  </el-dialog>
</template>

<script>
import { getCustomerOrderPageList } from "@/api/order/customerOrder";
import { transferProductionOrder } from "@/api/order/taskOrder";
export default {
  name: "TransferDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchForm: {
        customerName: "",
        orderCode: "",
        creator: "",
        isYes: "0",
        current: 1,
        size: 10,
      },
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
      getCustomerOrderPageList(this.searchForm).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data.records;
          this.total = res.data.total;
          this.loading = false;
        }
      });
    },

    onSearch() {
      this.searchForm.current = 1;
      this.getTableData();
    },
    onReset() {
      this.searchForm.current = 1;
      this.$refs["searchForm"].resetFields();
    },
    // 选择行
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    onView(id) {
      this.$router.push({
        path: "/order/customerOrderDetail",
        query: {
          id,
        },
      });
    },
    onClose() {
      this.onReset();
      this.$emit("onClose");
    },
    onSubmit() {
      if (!this.multipleSelection.length) {
        this.$message.warning("请至少选择一个选项！");
        return;
      }
      let id = this.multipleSelection.map((item) => {
        return item.id;
      });

      transferProductionOrder({
        id,
      }).then((res) => {
        if (res.code === 200) {
          this.$message.success("调单成功!");
          this.onReset();
          this.$emit("onSubmit");
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.right-dialog-header {
  ::v-deep {
    .el-form-item {
      margin-bottom: 0 !important;
    }
  }
}
</style>
