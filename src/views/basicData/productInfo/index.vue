<template>
  <div class="app-container">
    <el-form
      ref="formData"
      :model="formData"
      :inline="true"
      @submit.native.prevent
    >
      <el-form-item prop="productCategoryId">
        <el-select
          v-model="formData.productCategoryId"
          placeholder="请选择类别"
        >
          <el-option
            v-for="item in productCategoryOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="dark-green-btn" @click="onSearch">搜索</el-button>
        <el-button class="gray-btn" @click="onReset('formData')"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
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
        v-throttle
        >导出</el-button
      >
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center">
      </el-table-column>
      <el-table-column prop="productCategoryName" label="类别" align="center" />
      <el-table-column prop="name" label="产品名称" align="center" />
      <el-table-column prop="spec" label="规格" align="center" />
      <el-table-column prop="length" label="长" align="center" />
      <el-table-column prop="width" label="宽" align="center" />
      <el-table-column prop="hight" label="高" align="center" />
      <el-table-column prop="peelClothNo" label="皮布号" align="center" />
      <el-table-column prop="color" label="颜色" align="center" />
      <el-table-column prop="model" label="型号" align="center" />
      <el-table-column prop="unit" label="单位" align="center" />
      <el-table-column prop="supplier" label="供应商" align="center" />
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="160"
        align="center"
      />
      <el-table-column fixed="right" label="操作" width="100" align="center">
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
      width="40%"
      custom-class="right-dialog"
      :show-close="false"
      :before-close="handleCloseDialog"
    >
      <div class="right-dialog-header">
        <div class="right-dialog-title">{{ dialogTitle }}</div>
        <div>
          <el-button class="gray-btn" size="small" @click="handleCloseDialog"
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

      <div class="right-dialog-content">
        <el-form
          style="padding-right: 150px"
          ref="rightDialogForm"
          :model="dialogForm"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item prop="productCategoryId" label="类别">
            <el-select
              v-model="dialogForm.productCategoryId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in productCategoryOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="name" label="产品名称">
            <el-input
              v-model="dialogForm.name"
              placeholder="请输入产品名称"
            ></el-input>
          </el-form-item>

          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item prop="length" label="长">
                <el-input
                  type="number"
                  v-model="dialogForm.length"
                  placeholder="请输入长"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="width" label="宽">
                <el-input
                  type="number"
                  v-model="dialogForm.width"
                  placeholder="请输入宽"
                /> </el-form-item
            ></el-col>
            <el-col :span="8">
              <el-form-item prop="hight" label="高">
                <el-input
                  type="number"
                  v-model="dialogForm.hight"
                  placeholder="请输入高"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item prop="spec" label="规格">
            <el-input
              v-model="dialogForm.spec"
              placeholder="请输入规格"
            ></el-input>
          </el-form-item>

          <el-form-item prop="peelClothNo" label="皮布号">
            <el-input
              v-model="dialogForm.peelClothNo"
              placeholder="请输入皮布号"
            ></el-input>
          </el-form-item>

          <el-form-item prop="color" label="颜色">
            <el-input
              v-model="dialogForm.color"
              placeholder="请输入颜色"
            ></el-input>
          </el-form-item>

          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item prop="model" label="型号">
                <el-input v-model="dialogForm.model" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="unit" label="单位">
                <el-input v-model="dialogForm.unit" /> </el-form-item
            ></el-col>
            <el-col :span="8">
              <el-form-item prop="price" label="价格">
                <el-input type="number" v-model="dialogForm.price" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item prop="supplier" label="供应商">
            <el-input
              v-model="dialogForm.supplier"
              placeholder="请输入供应商"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <ImportDialog
      :dialogVisible="importDialogVisible"
      templateFileName="产品导入模板.xlsx"
      action="/manager/product/import"
      @onSuccess="onImportSucess"
      @onClose="handleCloseImportDialog"
    />
  </div>
</template>

<script>
import ImportDialog from "@/components/ImportDialog";
import { downLoadXlsx } from "@/utils/zipdownload";
import {
  getProductPageList,
  addProduct,
  editProduct,
  deleteProduct,
} from "@/api/basicData/productInfo";
import { getProductCategorySelectList } from "@/api/basicData/materialManagement";
export default {
  name: "ProductInfo",
  components: {
    ImportDialog,
  },
  data() {
    return {
      productCategoryOptions: [],
      formData: {
        productCategoryId: "",
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
        productCategoryId: "",
        name: "",
        length: "",
        width: "",
        hight: "",
        spec: "",
        peelClothNo: "",
        color: "",
        model: "",
        unit: "",
        price: "",
        supplier: "",
      },
      rules: {
        productCategoryId: [
          { required: true, message: "请选择类别", trigger: "change" },
        ],
        name: [{ required: true, message: "请输入产品名称" }],
        length: [{ required: true, message: "请输入长" }],
        width: [{ required: true, message: "请输入宽" }],
        hight: [{ required: true, message: "请输入高" }],
        spec: [{ required: true, message: "请输入规格" }],
        peelClothNo: [{ required: true, message: "请输入皮布号" }],
        color: [{ required: true, message: "请输入颜色" }],
        model: [{ required: true, message: "请输入型号" }],
        unit: [{ required: true, message: "请输入单位" }],
        price: [{ required: true, message: "请输入价格" }],
      },
      importDialogVisible: false,
    };
  },
  created() {
    this.getTableData();
    this.getProductCategorySelectList();
  },
  methods: {
    getTableData() {
      this.loading = true;
      getProductPageList(this.formData).then((res) => {
        this.tableData = res.data.records;
        this.total = res.data.total;
        this.loading = false;
      });
    },

    getProductCategorySelectList() {
      getProductCategorySelectList().then((res) => {
        this.productCategoryOptions = res.data;
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
      this.dialogTitle = "新增";
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
      downLoadXlsx("/manager/product/export", {
        name: this.formData.productCategoryId,
      });
    },

    onEdit(row) {
      this.dialogForm = { ...row };
      this.dialogTitle = "编辑";
      this.dialogVisible = true;
    },

    onDelete(id) {
      this.$confirm("产品信息删除后无法恢复，确定要删除吗？", "删除确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteProduct(id).then((res) => {
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
      this.dialogForm = {
        id: "",
        productCategoryId: "",
        name: "",
        length: "",
        width: "",
        hight: "",
        spec: "",
        peelClothNo: "",
        color: "",
        supplier: "",
      };
      this.$refs["rightDialogForm"].resetFields();
      this.dialogTitle = "";
      this.dialogVisible = false;
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.dialogForm.id) {
            addProduct(this.dialogForm).then((res) => {
              this.$message.success("新增成功!");
              this.handleCloseDialog();
              this.getTableData();
            });
          } else {
            editProduct(this.dialogForm).then((res) => {
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
