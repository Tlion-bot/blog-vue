<template>
  <div class="app-container">
    <el-form ref="formData" :model="formData" :inline="true">
      <el-form-item prop="name">
        <el-input
          v-model="formData.name"
          placeholder="请输入产品名称"
        ></el-input>
      </el-form-item>
      <el-form-item prop="model">
        <el-input
          v-model="formData.model"
          placeholder="请输入产品型号"
        ></el-input>
      </el-form-item>
      <el-form-item prop="spec">
        <el-input v-model="formData.spec" placeholder="请输入规格"></el-input>
      </el-form-item>
      <el-form-item prop="color">
        <el-input v-model="formData.color" placeholder="请输入颜色"></el-input>
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
        class="dark-green-btn"
        v-hasPermi="['basicData:materialManagement:add']"
        @click="onAdd"
        :disabled="disabled"
        >新增工序</el-button
      >
      <!-- <el-button
        class="blue-btn"
        v-hasPermi="['basicData:materialManagement:add']"
        @click="onSave"
        >保存工序</el-button
      > -->
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
      class="table-wrapper"
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="50"
        :selectable="selectable"
        align="center"
      />

      <el-table-column
        v-for="item in tableColumns"
        :prop="item.prop"
        :label="item.label"
        :key="item.prop"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="!scope.row.isEdit">{{ scope.row[item.prop] }}</span>
          <el-input
            v-else
            v-model="tableData[scope.$index][item.prop]"
            placeholder="选择"
            readonly
            @focus="onFocus(item.prop, scope.$index)"
          ></el-input>
        </template>
      </el-table-column>

      <el-table-column label="人工成本小计" align="center">
        <template slot-scope="scope">
          <span>{{
            getTotalPrice(
              scope.row.totalPrice,
              scope.row.productProcedureLabourPriceList,
              scope.row.isEdit
            )
          }}</span>
          <!-- <el-input
            v-else
            type="number"
            v-model="tableData[scope.$index].totalPrice"
            placeholder="单行输入"
          ></el-input> -->
        </template>
      </el-table-column>

      <el-table-column
        v-for="(item, index) in processOptions"
        :label="item.name"
        :key="item.id"
        align="center"
      >
        <el-table-column label="件数" align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.isEdit">{{
              scope.row.productProcedureLabourPriceList[index].num
            }}</span>
            <el-input
              v-else
              type="number"
              v-model="scope.row.productProcedureLabourPriceList[index].num"
              placeholder="单行输入"
              min="1"
            ></el-input>
          </template>
        </el-table-column>

        <el-table-column label="工价" align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.isEdit">{{
              scope.row.productProcedureLabourPriceList[index].price
            }}</span>
            <el-input
              v-else
              type="number"
              v-model="scope.row.productProcedureLabourPriceList[index].price"
              placeholder="单行输入"
              min="0"
            ></el-input>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="100" align="center">
        <template slot-scope="scope">
          <!-- <el-button
            v-hasPermi="['basicData:materialManagement:edit']"
            v-show="!scope.row.isEdit"
            @click="onEdit(scope)"
            type="text"
            size="small"
            style="color: #19a4c7"
            >编辑
          </el-button> -->
          <el-button
            v-hasPermi="['basicData:materialManagement:edit']"
            v-show="scope.row.isEdit"
            @click="onSave(scope)"
            type="text"
            size="small"
            style="color: #19a4c7"
            >保存
          </el-button>
          <el-button
            v-hasPermi="['basicData:materialManagement:delete']"
            v-show="scope.row.isEdit"
            @click="onCancel(scope)"
            type="text"
            size="small"
            style="color: #19a4c7"
            >取消
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
    <selectProduct
      v-if="dialogVisible"
      :visible="dialogVisible"
      :multiple="false"
      @select="handleSelectProduct"
      @close="handleCloseSelectProduct"
    />

    <ImportDialog
      :dialogVisible="importDialogVisible"
      templateFileName="产品工序工价导入模板.xlsx"
      action="/manager/productProcedureLabour/import"
      @onSuccess="onImportSucess"
      @onClose="handleCloseImportDialog"
    />
  </div>
</template>

<script>
import SelectProduct from "@/components/SelectProduct";
import ImportDialog from "@/components/ImportDialog";
import { getProcedureSelectList } from "@/api/basicData/productProcess";
import {
  getProductProcedureLabourPageList,
  addProductProcedureLabour,
  editProductProcedureLabour,
  deleteProductProcedureLabour,
} from "@/api/basicData/labourCost";
import { downLoadXlsx } from "@/utils/zipdownload";
export default {
  name: "LabourCost",
  components: {
    SelectProduct,
    ImportDialog,
  },
  data() {
    return {
      formData: {
        name: "",
        model: "",
        spec: "",
        color: "",
        current: 1,
        size: 10,
      },
      disabled: false,
      loading: false,
      tableColumns: [
        {
          label: "产品名称",
          prop: "name",
        },
        {
          label: "型号",
          prop: "model",
        },
        {
          label: "规格",
          prop: "spec",
        },
        {
          label: "皮布号",
          prop: "peelClothNo",
        },
        {
          label: "颜色",
          prop: "color",
        },
        {
          label: "单位",
          prop: "unit",
        },
        // {
        //   label: "人工成本小计",
        //   prop: "totalPrice",
        // },
      ],
      tableData: [],
      total: 0,
      multipleSelection: [],
      dialogVisible: false,
      currentRowIndex: null,
      processOptions: [],
      importDialogVisible: false,
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
      getProductProcedureLabourPageList(this.formData).then((res) => {
        this.tableData = res.data.records;
        this.tableData.forEach((item) => {
          let productProcedureLabourPriceList = this.processOptions.map(
            (item2) => {
              let findIndex = item.productProcedureLabourPriceList.findIndex(
                (item3) => item3.procedureId === item2.id
              );

              return {
                ...item2,
                num:
                  findIndex > -1
                    ? item.productProcedureLabourPriceList[findIndex].num
                    : "",
                price:
                  findIndex > -1
                    ? item.productProcedureLabourPriceList[findIndex].price
                    : "",
              };
            }
          );

          // this.$set(item, "processOptions", processOptions);
          this.$set(
            item,
            "productProcedureLabourPriceList",
            productProcedureLabourPriceList
          );
        });
        this.total = res.data.total;
        this.loading = false;
      });
    },

    getProcedureSelectList() {
      getProcedureSelectList().then((res) => {
        this.processOptions = res.data;
      });
    },

    getTotalPrice(currentValue, list, isEdit) {
      if (!isEdit) {
        return currentValue;
      } else {
        let value = 0;
        list.forEach((item) => {
          // value = value + item.num * item.price;
          value = value + (+item.price);
         
        });
        let realVal = parseFloat(value).toFixed(2)
        return realVal || 0;
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

    // 选择行
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    selectable(row, index) {
      //console.log("selectable", row);
      return row.id ? true : false;
    },

    onAdd() {
      let productProcedureLabourPriceList = this.processOptions.map((item) => {
        return {
          procedureId: item.id,
          num: "",
          price: "",
          sort: item.sort
        };
      });

      this.tableData.unshift({
        id: "",
        productProcedureLabourPriceList,
        isEdit: true,
      });

      this.disabled = true;
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
      this.$confirm("产品工序工价删除后无法恢复，确定要删除吗？", "删除确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteProductProcedureLabour(ids.join()).then((res) => {
            this.$message.success("删除成功!");
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
      downLoadXlsx("/manager/productProcedureLabour/export", {
        name: this.formData.name,
        model: this.formData.model,
        spec: this.formData.spec,
        color: this.formData.color,
      });
    },

    onFocus(prop, index) {
      console.log("onFocus", prop, index);
      if (prop === "name") {
        this.currentRowIndex = index;
        this.dialogVisible = true;
      }
    },

    handleSelectProduct(list) {
      let val = list[0];
      this.$set(this.tableData[this.currentRowIndex], "productId", val.id);
      this.$set(this.tableData[this.currentRowIndex], "name", val.name);
      this.$set(this.tableData[this.currentRowIndex], "model", val.model);
      this.$set(this.tableData[this.currentRowIndex], "spec", val.spec);
      this.$set(
        this.tableData[this.currentRowIndex],
        "peelClothNo",
        val.peelClothNo
      );
      this.$set(this.tableData[this.currentRowIndex], "color", val.color);
      this.$set(this.tableData[this.currentRowIndex], "unit", val.unit);
      this.$set(this.tableData[this.currentRowIndex], "name", val.name);

      this.dialogVisible = false;
    },

    handleCloseSelectProduct() {
      this.dialogVisible = false;
    },

    onEdit({ row, $index }) {
      this.$set(this.tableData[$index], "isEdit", true);
    },

    onSave({ row, $index }) {
      let productProcedureLabourPriceList =
        row.productProcedureLabourPriceList.filter(
          (item) => item.num && item.price
        );
      let data = {
        ...row,
        productProcedureLabourPriceList,
      };
      
      addProductProcedureLabour(data).then((res) => {
        this.$message.success("新增成功!");
        this.getTableData();
        this.disabled = false;
        // this.$set(this.tableData[$index], "isEdit", false);
      });
      // if (!row.id) {
      //   addProductProcedureLabour(row).then((res) => {
      //     this.$message.success("新增成功!");
      //     this.getTableData();
      //     this.$set(this.tableData[$index], "isEdit", false);
      //   });
      // } else {
      //   editProductProcedureLabour(row).then((res) => {
      //     this.$message.success("编辑成功!");
      //     this.getTableData();
      //     this.$set(this.tableData[$index], "isEdit", false);
      //   });
      // }
    },

    onCancel({ row, $index }) {
      if (!row.id) {
        // this.$set(this.tableData[$index], "isEdit", false);
        this.tableData.splice($index, 1);
        this.disabled = false;
        return;
      }

      // this.$confirm(
      //   "该产品工序工价删除后无法恢复，确定要删除吗？",
      //   "删除确认",
      //   {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     type: "warning",
      //   }
      // )
      //   .then(() => {
      //     deleteProductProcedureLabour(id).then((res) => {
      //       this.$message.success("删除成功!");
      //       let ids = (id + "").split(",");
      //       if (this.tableData.length === ids.length) {
      //         this.formData.current =
      //           this.formData.current === 1 ? 1 : this.formData.current - 1;
      //       }
      //       this.getTableData();
      //     });
      //   })
      //   .catch(() => {
      //     this.$message({
      //       type: "info",
      //       message: "已取消删除",
      //     });
      //   });
    },
  },
};
</script>

<style lang="scss" scoped>
.table-wrapper {
  ::v-deep {
    .el-input__inner {
      border: none !important;
      padding: 0 10px !important;
    }
  }
}
</style>
