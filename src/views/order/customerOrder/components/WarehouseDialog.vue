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
      <div class="right-dialog-title">
        订单出库
        <span class="right-dialog-text"
          >订单编号：{{ dialogForm.orderCode }}</span
        >
      </div>
      <el-button
        class="dark-green-btn"
        size="small"
        v-throttle
        @click="submitForm('rightDialogForm')"
        >确认出库</el-button
      >
    </div>
    <div class="right-dialog-content" v-loading="loading">
      <el-form
        ref="rightDialogForm"
        :model="dialogForm"
        :rules="dialogRules"
        label-position="right"
        label-width="80px"
      >
        <el-row class="row-title">客户信息</el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="customerName" label="客户名称">
              <el-input
                v-model="dialogForm.customerName"
                placeholder="单行输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="customerAddress" label="地址">
              <el-input
                v-model="dialogForm.customerAddress"
                placeholder="单行输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="customerPhone" label="联系电话">
              <el-input
                v-model="dialogForm.customerPhone"
                placeholder="单行输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="logisticsCompany" label="物流公司">
              <el-input
                v-model="dialogForm.logisticsCompany"
                placeholder="单行输入"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="distributionMode" label="配送方式">
              <el-input
                v-model="dialogForm.distributionMode"
                placeholder="单行输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item prop="productionInstruction" label="生产说明">
              <el-input
                v-model="dialogForm.productionInstruction"
                placeholder="单行输入"
              ></el-input>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row class="row-title">单据金额信息</el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item prop="orderPrice" label="单据金额">
              <el-input
                type="number"
                v-model.number="dialogForm.orderPrice"
                placeholder="单行输入"
                readonly
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="otherPrice" label="其它费用">
              <el-input
                type="number"
                v-model.number="dialogForm.otherPrice"
                placeholder="单行输入"
                readonly
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="totalAmount" label="总金额">
              <el-input
                type="number"
                v-model.number="dialogForm.totalAmount"
                placeholder="单行输入"
                readonly
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
                readonly
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
                readonly
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
                readonly
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-row class="row-title">
        <span style="margin-right: 15px">产品信息</span>
      </el-row>
      <el-table
        :data="dialogForm.customerProductList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          :selectable="setSelectable"
          align="center"
        />
        <el-table-column type="index" label="序号" width="50" align="center" />
        <el-table-column prop="productName" label="产品名称" align="center" />
        <el-table-column prop="productModel" label="型号" align="center" />
        <el-table-column prop="productColor" label="颜色" align="center" />
        <el-table-column prop="productSize" label="尺寸" align="center" />
        <el-table-column prop="productSpec" label="规格" align="center" />
        <!-- <el-table-column prop="peelClothNo" label="皮布号" align="center" />
          <el-table-column prop="unitPrice" label="单价" align="center" />
          <el-table-column prop="productUnit" label="单位 " align="center" /> -->
        <el-table-column prop="productNum" label="数量" align="center" />
        <el-table-column prop="totalPrice" label="小计" align="center" />
        <!-- <el-table-column prop="remark" label="备注 " align="center" /> -->
      </el-table>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="innerVisible"
      width="30%"
      append-to-body
    >
      <div>
        <span class="tip">是否确认出库以下商品？</span>
        <el-table :data="multipleSelection">
          <el-table-column prop="productName" label="商品名称" align="center" />
          <el-table-column prop="productNum" label="商品数量" align="center" />
          <el-table-column prop="productModel" label="型号" align="center" />
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = false">取 消</el-button>
        <el-button type="primary" @click="onOut">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
import {
  getCustomerOrderDetail,
  outCustomerOrder,
} from "@/api/order/customerOrder";
export default {
  name: "WarehouseDialog",
  props: {
    id: {
      type: String | Number,
      default: "",
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      dialogForm: {
        id: "",
        customerName: "",
        customerAddress: "",
        customerPhone: "",
        logisticsCompany: "",
        distributionMode: "",
        orderPrice: 0,
        otherPrice: 0,
        totalAmount: 0,
        receivedPrice: 0,
        collectionDate: "",
        arrearsPrice: 0,
        customerProductList: [],
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
        logisticsCompany: [{ required: true, message: "物流公司不能为空" }],
        distributionMode: [{ required: true, message: "配送方式不能为空" }],
      },
      multipleSelection: [],
      innerVisible: false,
    };
  },
  created() {
    this.getCustomerOrderDetail(this.id);
  },
  methods: {
    getCustomerOrderDetail(id) {
      getCustomerOrderDetail(id).then((res) => {
        if (res.code === 200) {
          console.log(res)
          this.dialogForm = res.data;
        }
      });
    },
    setSelectable(row) {
      // 已出库
      if (row.status === "1") {
        return false;
      }
      return row.orderStatus === "1" ? true : false;
    },
    // 选择行
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.multipleSelection.length) {
            this.$message.warning("请至少选择一个产品!");
            return;
          }
          this.innerVisible = true;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    onReset() {
      this.$refs["rightDialogForm"].resetFields();
      this.dialogForm = {
        id: "",
        customerName: "",
        customerAddress: "",
        customerPhone: "",
        logisticsCompany: "",
        distributionMode: "",
        orderPrice: 0,
        otherPrice: 0,
        totalAmount: 0,
        receivedPrice: 0,
        collectionDate: "",
        arrearsPrice: 0,
        customerProductList: [],
      };
    },

    handleCloseDialog() {
      this.onReset();
      this.$emit("close");
    },

    onOut() {
      let data = {
        id: this.dialogForm.id,
        customerName: this.dialogForm.customerName,
        customerAddress: this.dialogForm.customerAddress,
        customerPhone: this.dialogForm.customerPhone,
        logisticsCompany: this.dialogForm.logisticsCompany,
        distributionMode: this.dialogForm.distributionMode,
        ids: [],
      };
      data.ids = this.multipleSelection.map((item) => {
        return item.id;
      });
      outCustomerOrder(data).then((res) => {
        if (res.code === 200) {
          this.$message.success("操作成功!");
          this.onReset();
          this.$emit("out");
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.right-dialog-text {
  color: #30869b;
  font-size: 14px;
  margin-left: 20px;
}

.row-title {
  color: #101010;
  font-size: 18px;
  margin-bottom: 18px;
}

.tip {
  font-size: 14px;
  line-height: 36px;
}
</style>
