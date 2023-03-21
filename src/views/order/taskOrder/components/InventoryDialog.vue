<template>
  <el-dialog
    :visible.sync="visible"
    top="0vh"
    width="989px"
    custom-class="right-dialog"
    :show-close="false"
    :before-close="handleCloseDialog"
  >
    <div class="right-dialog-header">
      <div class="right-dialog-title">工序库存</div>
      <el-button
        class="light-blue-btn"
        size="small"
        v-throttle
        @click="handleCloseDialog"
        >关闭</el-button
      >
    </div>
    <div class="right-dialog-content">
      <el-table v-loading="loading" :data="tableData" style="width: 100%">
        <el-table-column label="产品名称" align="center" prop="productName" />
        <el-table-column label="型号" align="center" prop="productModel" />
        <el-table-column label="规格" align="center" prop="productSpec" />
        <el-table-column label="颜色" align="center" prop="productSpec" />
        <el-table-column label="尺寸" align="center" prop="productColor" />
        <el-table-column label="皮布号" align="center" prop="peelClothNo" />

        <el-table-column
          v-for="(item, index) in processOptions"
          :label="item.name"
          :key="index"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.procedureList[index]">
              {{ scope.row.procedureList[index].stock }}
            </span>
            <span v-else>--</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
import { getProcedureSelectList } from "@/api/basicData/productProcess";
import { getProductStockList } from "@/api/order/taskOrder";
export default {
  name: "InventoryDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    multipleSelection: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      processOptions: [],
      form: {
        ids: [],
      },
      tableData: [],
      total: 0,
    };
  },
  created() {
    this.getProcedureSelectList();
  },
  methods: {
    getProcedureSelectList() {
      getProcedureSelectList().then((res) => {
        if (res.code === 200) {
          this.processOptions = res.data || [];
          this.getTableData();
        }
      });
    },
    getTableData() {
      this.loading = true;
      this.form.ids = this.multipleSelection.map((item) => {
        return item.id;
      });
      getProductStockList(this.form).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data;
          this.loading = false;
        }
      });
    },
    handleCloseDialog() {
      this.$emit("onClose");
    },
  },
};
</script>
