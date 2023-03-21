<template>
  <div>
    <el-form ref="formData" :model="formData" :inline="true">
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
      <el-button
        v-hasPermi="['order:customerOrder:add']"
        class="dark-green-btn"
        @click="onAdd"
        v-throttle
        >创建订单</el-button
      >
      <!-- <el-button
        v-hasPermi="['order:customerOrder:delete']"
        class="red-btn"
        @click="onBatchDelete"
        v-throttle
        >删除</el-button
      > -->
      <el-button
        v-hasPermi="['order:customerOrder:import']"
        class="blue-btn"
        @click="onImport"
        v-throttle
        >导入</el-button
      >
      <el-button
        v-hasPermi="['order:customerOrder:export']"
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
      <el-table-column type="selection" align="center" />
      <el-table-column prop="orderCode" label="订单编号" align="center" />
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
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center"
        width="180"
      />
      <el-table-column label="工序状态" width="200" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.orderStatus === '3'">已完成</span>
          <span v-else>未完成</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button
            v-hasPermi="['order:customerOrder:view']"
            @click="onView(scope.row.id)"
            type="text"
            size="small"
            v-throttle
            >查看
          </el-button>
          <el-button
            v-hasPermi="['order:customerOrder:edit']"
            @click="onEdit(scope.row)"
            type="text"
            size="small"
            v-throttle
            >编辑
          </el-button>
          <!-- <el-button
            v-hasPermi="['order:customerOrder:delete']"
            @click="onDelete(scope.row.id)"
            type="text"
            size="small"
            v-throttle
            >删除
          </el-button> -->
          <template v-if="scope.row.outType !== '2'">
            <el-button
              v-if="scope.row.orderStatus === '3'"
              v-hasPermi="['order:customerOrder:delete']"
              @click="onAllOut(scope.row.id)"
              type="text"
              size="small"
              v-throttle
              >订单出库
            </el-button>
            <el-button
              v-hasPermi="['order:customerOrder:delete']"
              v-else
              @click="onOut(scope.row.id)"
              type="text"
              size="small"
              v-throttle
              >部分出库
            </el-button>
          </template>
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
      width="989px"
      custom-class="right-dialog"
      :show-close="false"
      :before-close="handleCloseDialog"
    >
      <div class="right-dialog-header">
        <div class="right-dialog-title">{{ dialogTitle }}</div>
        <div v-if="isEdit" class="right-dialog-text">
          订单编号：{{ dialogForm.orderCode }}
        </div>
        <div v-if="isEdit" class="right-dialog-text">
          单据日期：{{ dialogForm.orderTime }}
        </div>
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
        :rules="dialogRules"
        label-position="left"
        label-width="80px"
      >
        <el-row class="row-title">客户信息</el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item prop="customerName" label="名称">
              <el-input
                v-model="dialogForm.customerName"
                placeholder="单行输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="customerAddress" label="地址">
              <el-input
                v-model="dialogForm.customerAddress"
                placeholder="单行输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="customerPhone" label="电话">
              <el-input
                v-model="dialogForm.customerPhone"
                placeholder="单行输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="row-title">单据金额信息</el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item prop="orderPrice" label="单据金额">
              <el-input
                type="number"
                v-model.number="dialogForm.orderPrice"
                placeholder="单行输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="otherPrice" label="其它费用">
              <el-input
                type="number"
                v-model.number="dialogForm.otherPrice"
                placeholder="单行输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="totalAmount" label="总金额">
              <el-input
                type="number"
                v-model.number="dialogForm.totalAmount"
                placeholder="单行输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item prop="receivedPrice" label="已收定金">
              <el-input
                type="number"
                v-model.number="dialogForm.receivedPrice"
                placeholder="单行输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="collectionDate" label="收款日期">
              <el-date-picker
                v-model="dialogForm.collectionDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="arrearsPrice" label="尚欠金额">
              <el-input
                type="number"
                v-model.number="dialogForm.arrearsPrice"
                placeholder="单行输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="row-title">
          <span style="margin-right: 15px">产品信息</span>
          <el-button class="dark-green-btn" @click="onAddSelect" v-throttle
            >增选</el-button
          >
        </el-row>
        <div
          class="product-info-item"
          v-for="(item, index) in dialogForm.customerProductList"
          :key="index"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                :prop="`customerProductList[${index}].productName`"
                label="产品名称"
                :rules="[
                  {
                    required: true,
                    message: '请输入产品名称',
                    trigger: 'change',
                  },
                ]"
              >
                <el-input
                  v-model="item.productName"
                  placeholder="选择"
                  readonly
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-button
                class="light-blue-btn"
                @click="onSelectProduct(index)"
                v-throttle
                >选择</el-button
              >
              <el-button
                v-if="dialogForm.customerProductList.length > 1"
                style="margin-left: 20px"
                class="red-btn"
                @click="onRemove(index)"
                v-throttle
                >删除</el-button
              >
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                :prop="`customerProductList[${index}].productModel`"
                label="型号"
                :rules="[
                  {
                    required: true,
                    message: '请输入型号',
                    trigger: 'change',
                  },
                ]"
              >
                <el-input
                  v-model="item.productModel"
                  placeholder="选择"
                  readonly
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :prop="`customerProductList[${index}].productSpec`"
                label="规格"
                :rules="[
                  {
                    required: true,
                    message: '请输入规格',
                    trigger: 'change',
                  },
                ]"
              >
                <el-input
                  v-model="item.productSpec"
                  placeholder="选择"
                  readonly
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                :prop="`customerProductList[${index}].productSize`"
                label="尺寸"
                :rules="[
                  {
                    required: true,
                    message: '请输入尺寸',
                    trigger: 'change',
                  },
                ]"
              >
                <el-input
                  v-model="item.productSize"
                  placeholder="选择"
                  readonly
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :prop="`customerProductList[${index}].peelClothNo`"
                label="皮布号"
                :rules="[
                  {
                    required: true,
                    message: '请输入皮布号',
                    trigger: 'change',
                  },
                ]"
              >
                <el-input
                  v-model="item.peelClothNo"
                  placeholder="选择"
                  readonly
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item
                :prop="`customerProductList[${index}].productNum`"
                label="数量"
                :rules="[
                  {
                    required: true,
                    message: '请输入数量',
                    trigger: 'blur',
                  },
                ]"
              >
                <el-input
                  v-model="item.productNum"
                  placeholder="单行输入"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :prop="`customerProductList[${index}].unitPrice`"
                label="单价"
                :rules="[
                  {
                    required: true,
                    message: '请输入单价',
                    trigger: 'change',
                  },
                ]"
              >
                <el-input
                  v-model.number="item.unitPrice"
                  placeholder="选择"
                  readonly
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="totalPrice" label="小计">
              <el-input
                readonly
                type="number"
                v-model.number="totalPrice"
                placeholder="单行输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="deliveryDate" label="交货日期">
              <el-date-picker
                v-model="dialogForm.deliveryDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-form-item prop="packingInstruction" label="包装说明">
            <el-input
              v-model="dialogForm.packingInstruction"
              placeholder="单行输入"
            ></el-input>
          </el-form-item>
        </el-row> -->
        <el-row>
          <el-form-item prop="productionInstruction" label="生产说明">
            <el-input
              v-model="dialogForm.productionInstruction"
              placeholder="单行输入"
            ></el-input>
          </el-form-item>
        </el-row>
      </el-form>

      <selectProduct
        v-if="innerVisible"
        :visible="innerVisible"
        @select="handleSelectProduct"
        @close="handleCloseSelectProduct"
      />
    </el-dialog>

    <ImportDialog
      :dialogVisible="importDialogVisible"
      templateFileName="客户订单导入模板.xlsx"
      action="/manager/customerOrder/import"
      @onSuccess="onImportSucess"
      @onClose="handleCloseImportDialog"
    />

    <WarehouseDialog
      v-if="outWarehouseDialogVisible"
      :id="outWarehousOrderId"
      :visible="outWarehouseDialogVisible"
      @out="outSuccess"
      @close="outWarehouseDialogVisible = false"
    />
  </div>
</template>

<script>
import ImportDialog from "@/components/ImportDialog";
import SelectProduct from "../../components/SelectProduct";
import WarehouseDialog from "./WarehouseDialog";
import {
  getCustomerOrderPageList,
  addCustomerOrder,
  editCustomerOrder,
  deleteCustomerOrder,
} from "@/api/order/customerOrder";
import { downLoadXlsx } from "@/utils/zipdownload";
export default {
  name: "CustomerOrderList",
  components: {
    ImportDialog,
    SelectProduct,
    WarehouseDialog,
  },
  props: {
    status: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      // 搜索
      formData: {
        customerName: "",
        orderCode: "",
        isYes: "",
        orderStatus: "",
        current: 1,
        size: 10,
      },
      // 表格
      loading: false,
      tableData: [],
      total: 0,
      multipleSelection: [],
      // 创建订单
      isEdit: false,
      dialogTitle: "",
      dialogVisible: false,
      dialogForm: {
        id: "",
        customerName: "",
        customerAddress: "",
        customerPhone: "",
        orderPrice: 0,
        otherPrice: 0,
        totalAmount: 0,
        receivedPrice: 0,
        collectionDate: "",
        arrearsPrice: 0,
        customerProductList: [
          {
            productId: "",
            productName: "",
            productModel: "",
            productSpec: "",
            peelClothNo: "",
            productSize: "",
            productColor: "",
            productUnit: "",
            productNum: "",
            unitPrice: "",
            productCategoryName: "",
          },
        ],
        totalPrice: "",
        packingInstruction: "",
        productionInstruction: "",
      },
      dialogRules: {
        customerName: [{ required: true, message: "名称不能为空" }],
        customerAddress: [{ required: true, message: "地址不能为空" }],
        customerPhone: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的电话",
            trigger: "blur",
          },
        ],
      },
      innerVisible: false,
      currentRowIndex: 0,
      importDialogVisible: false,
      // 订单出库
      outWarehousOrderId: "",
      outWarehouseDialogVisible: false,
    };
  },
  computed: {
    totalPrice: function () {
      let totalPrice = 0;
      this.dialogForm.customerProductList.forEach((item) => {
        totalPrice = totalPrice + item.productNum * item.unitPrice;
      });
      return totalPrice;
    },
  },
  created() {
    this.formData.orderStatus = this.status;
    this.getTableData();
  },
  methods: {
    getTableData() {
      this.loading = true;
      getCustomerOrderPageList(this.formData).then((res) => {
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
      this.dialogTitle = "创建订单";
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

    onExport() {
      downLoadXlsx("/manager/customerOrder/export", {
        customerName: this.formData.customerName,
        orderCode: this.formData.orderCode,
        isYes: this.formData.isYes,
      });
    },

    onSelectProduct(index) {
      this.innerVisible = true;
      this.currentRowIndex = index;
    },

    onAddSelect() {
      this.dialogForm.customerProductList.push({
        productId: "",
        productName: "",
        productModel: "",
        productSpec: "",
        peelClothNo: "",
        productSize: "",
        productColor: "",
        productUnit: "",
        productNum: "",
        unitPrice: "",
        productCategoryName: "",
      });
    },

    onRemove(index) {
      this.dialogForm.customerProductList.splice(index, 1);
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

    onDelete(id) {
      this.$confirm("该顾客订单删除后无法恢复，确定要删除吗？", "删除确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.dialogForm.totalPrice = this.totalPrice;
          deleteCustomerOrder(id).then((res) => {
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

    onEdit(row) {
      this.dialogForm = JSON.parse(JSON.stringify(row));
      this.dialogTitle = "编辑订单";
      this.isEdit = true;
      this.dialogVisible = true;
    },

    handleCloseDialog() {
      this.dialogTitle = "";
      this.dialogVisible = false;
      this.$refs["rightDialogForm"].resetFields();
      this.dialogForm = {
        id: "",
        customerName: "",
        customerAddress: "",
        customerPhone: "",
        orderPrice: "",
        otherPrice: "",
        totalAmount: "",
        receivedPrice: "",
        collectionDate: "",
        arrearsPrice: "",
        customerProductList: [
          {
            productId: "",
            productName: "",
            productModel: "",
            productSpec: "",
            peelClothNo: "",
            productSize: "",
            productColor: "",
            productUnit: "",
            productNum: "",
            unitPrice: "",
            productCategoryName: "",
          },
        ],
      };
      this.isEdit = false;
      this.disabled = false;
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.isEdit) {
            addCustomerOrder(this.dialogForm).then((res) => {
              this.$message.success("新增成功!");
              this.getTableData();
              this.handleCloseDialog();
            });
          } else {
            editCustomerOrder(this.dialogForm).then((res) => {
              this.$message.success("编辑成功!");
              this.getTableData();
              this.handleCloseDialog();
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    handleSelectProduct(list) {
      console.log("handleSelectProduct", list);

      list.forEach((item, index) => {
        if (index === 0) {
          this.$set(
            this.dialogForm.customerProductList[this.currentRowIndex],
            "productId",
            item.productId
          );
          this.$set(
            this.dialogForm.customerProductList[this.currentRowIndex],
            "productName",
            item.name
          );
          this.$set(
            this.dialogForm.customerProductList[this.currentRowIndex],
            "productModel",
            item.model
          );
          this.$set(
            this.dialogForm.customerProductList[this.currentRowIndex],
            "productSpec",
            item.spec
          );
          this.$set(
            this.dialogForm.customerProductList[this.currentRowIndex],
            "peelClothNo",
            item.peelClothNo
          );
          this.$set(
            this.dialogForm.customerProductList[this.currentRowIndex],
            "productSize",
            `${item.length}*${item.width}*${item.hight}`
          );
          this.$set(
            this.dialogForm.customerProductList[this.currentRowIndex],
            "productColor",
            item.color
          );
          this.$set(
            this.dialogForm.customerProductList[this.currentRowIndex],
            "productUnit",
            item.unit
          );
          this.$set(
            this.dialogForm.customerProductList[this.currentRowIndex],
            "unitPrice",
            item.price
          );
          this.$set(
            this.dialogForm.customerProductList[this.currentRowIndex],
            "productCategoryName",
            item.productCategoryName
          );
        } else {
          this.dialogForm.customerProductList.push({
            productId: item.productId,
            productName: item.name,
            productModel: item.model,
            productSpec: item.spec,
            peelClothNo: item.peelClothNo,
            productSize: `${item.length}*${item.width}*${item.hight}`,
            productColor: item.color,
            productUnit: item.unit,
            productNum: "",
            unitPrice: item.price,
            productCategoryName: item.productCategoryName,
          });
        }
      });
      this.innerVisible = false;
    },

    handleCloseSelectProduct() {
      this.innerVisible = false;
    },

    onOut(id) {
      this.outWarehousOrderId = id;
      this.outWarehouseDialogVisible = true;
    },

    onAllOut(id) {
      this.outWarehousOrderId = id;
      this.outWarehouseDialogVisible = true;
    },

    outSuccess() {
      this.outWarehouseDialogVisible = false;
      this.getTableData();
    },
  },
};
</script>

<style lang="scss" scoped>
.right-dialog-text {
  color: #30869b;
  font-size: 14px;
}

.row-title {
  color: #101010;
  font-size: 18px;
  margin-bottom: 18px;
}

.product-info-item {
  margin-bottom: 20px;
  border-bottom: 1px dashed #bbb;
}
</style>
