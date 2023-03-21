<template>
  <el-dialog
    :visible.sync="visible"
    top="0vh"
    width="50%"
    custom-class="right-dialog"
    append-to-body
    :show-close="false"
    :before-close="handleCloseDialog"
  >
    <div class="right-dialog-header">
      <div class="right-dialog-title">选择产品</div>
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
          @click="submitForm"
          >保存</el-button
        >
      </div>
    </div>

    <div class="right-dialog-content">
      <el-form ref="rightDialogForm" :model="formData" :inline="true">
        <el-form-item prop="productCategoryId" label="类别：">
          <el-select v-model="formData.productCategoryId" placeholder="请选择">
            <el-option
              v-for="item in productCategoryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="model">
          <el-input
            v-model="formData.model"
            placeholder="请输入型号"
          ></el-input>
        </el-form-item>

        <el-form-item prop="name">
          <el-input v-model="formData.name" placeholder="请输入名称"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button class="dark-green-btn" @click="onSearch" v-throttle
            >搜索</el-button
          >
          <el-button
            class="gray-btn"
            @click="onReset('rightDialogForm')"
            v-throttle
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <el-table
        ref="singleTable"
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          align="center"
          :selectable="selectable"
        >
        </el-table-column>
        <el-table-column
          prop="productCategoryName"
          label="类别"
          align="center"
        />
        <el-table-column prop="name" label="产品名称" align="center" />
        <el-table-column prop="spec" label="规格" align="center" />
        <el-table-column prop="size" label="尺寸" align="center">
          <!-- <template slot-scope="scope">
            {{ scope.row.length }}*{{ scope.row.width }}*{{ scope.row.hight }}
          </template> -->
        </el-table-column>
        <el-table-column prop="peelClothNo" label="皮布号" align="center" />
        <el-table-column prop="color" label="颜色" align="center" />
        <el-table-column prop="model" label="型号" align="center" />
        <el-table-column prop="unit" label="单位" align="center" />
      </el-table>
      <pagination
        :total="total"
        style="margin-bottom: 20px"
        :page.sync="formData.current"
        :limit.sync="formData.size"
        @pagination="getTableData"
      />
    </div>
  </el-dialog>
</template>

<script>
import { getProductCategorySelectList } from "@/api/basicData/materialManagement";
import { getProductProcedureLabourPageList } from "@/api/basicData/labourCost";
export default {
  name: "SelectProduct",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      productCategoryOptions: [],
      formData: {
        productCategoryId: "",
        model: "",
        name: "",
        current: 1,
        size: 10,
      },
      loading: false,
      tableData: [],
      total: 0,
      multipleSelection: [],
      // currentRow: "",
    };
  },
  created() {
    this.getProductCategorySelectList();
    this.getTableData();
  },
  methods: {
    getProductCategorySelectList() {
      getProductCategorySelectList().then((res) => {
        this.productCategoryOptions = res.data;
      });
    },

    getTableData() {
      this.loading = true;
      getProductProcedureLabourPageList(this.formData).then((res) => {
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

    // handleCurrentChange(val) {
    //   this.currentRow = val;
    // },

    selectable(row, index) {
      if (!this.multiple) {
        if (this.multipleSelection.length) {
          return row.id === this.multipleSelection[0].id ? true : false;
        }
      }
      return true;
    },

    // 选择行
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    handleCloseDialog() {
      this.$emit("close");
    },

    submitForm() {
      this.$emit("select", this.multipleSelection);
    },
  },
};
</script>
