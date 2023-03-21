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
      <div>
        <el-button class="gray-btn" size="small" v-throttle @click="onRelease"
          >释放工序库存</el-button
        >
        <el-button
          class="light-blue-btn"
          size="small"
          v-throttle
          :disabled="lockDisabled"
          @click="onLock"
          >锁定工序库存</el-button
        >
      </div>
    </div>
    <div v-loading="loading" class="right-dialog-content">
      <el-row class="order-info" :gutter="20">
        <el-col :span="8">
          <span>订单编号：</span>
          <span>{{ detail.orderCode }}</span>
        </el-col>
        <el-col :span="8">
          <span>客户名称：</span>
          <span>{{ detail.customerName }}</span>
        </el-col>
        <el-col :span="8">
          <span>联系电话：</span>
          <span>{{ detail.customerPhone }}</span>
        </el-col>
      </el-row>
      <div class="product">
        <el-row class="product-title">商品信息</el-row>
        <el-row class="product-thead" type="flex">
          <el-col>产品名称</el-col>
          <el-col>型号</el-col>
          <el-col>规格</el-col>
          <el-col>颜色</el-col>
          <el-col>尺寸</el-col>
          <el-col>皮布号</el-col>
          <el-col>数量</el-col>
        </el-row>
        <el-row class="product-tbody" type="flex">
          <el-col>{{ detail.productName }}</el-col>
          <el-col>{{ detail.productModel }}</el-col>
          <el-col>{{ detail.productSpec }}</el-col>
          <el-col>{{ detail.productColor }}</el-col>
          <el-col>{{ detail.productSize }}</el-col>
          <el-col>{{ detail.peelClothNo }}</el-col>
          <el-col>{{ detail.productNum }}</el-col>
        </el-row>
      </div>

      <div class="product">
        <el-row class="product-title">
          <span>工序配置</span>
          <span class="tip"
            >注：可根据工序库存数量选择是否调用库存进行生产，选择调用库存进行库存锁定</span
          >
        </el-row>
        <el-row class="product-thead" type="flex">
          <el-col></el-col>
          <el-col
            v-for="item in detail.procedureList"
            :key="item.procedureId"
            >{{ item.procedureName }}</el-col
          >
        </el-row>
        <el-row class="product-tbody" type="flex">
          <el-col>排工数量</el-col>
          <el-col
            v-for="(item, index) in detail.procedureList"
            :key="item.procedureId"
          >
            <el-input
              v-model.number="item.dispatchNum"
              type="number"
              style="width: 120px"
              :readonly="item.readonly"
              :min="min"
              :max="max"
              step="1"
              @input="(val) => handleChangeInput(index, val)"
          /></el-col>
        </el-row>
        <el-row class="product-tbody" type="flex">
          <el-col>工序库存</el-col>
          <el-col
            v-for="(item, index) in detail.procedureList"
            :key="item.procedureId"
          >
            <el-checkbox
              v-if="item.stock"
              v-model="item.checked"
              :disabled="item.disabled"
              @change="(val) => handleChangeCheckBox(index, val)"
              >{{ item.stock }}(个)</el-checkbox
            ></el-col
          >
        </el-row>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  getProductionOrderProcedureDetail,
  enableProcedureStock,
  cancelProcedureStock,
} from "@/api/order/taskOrder";
export default {
  name: "ArrangeDiaolog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String || Number,
      default: "",
    },
  },
  data() {
    return {
      loading: false,
      detail: {
        productionOrderId: "",
        procedureId: "",
        orderCode: "",
        customerName: "",
        customerPhone: "",
        productName: "",
        productModel: "",
        productSpec: "",
        productColor: "",
        productSize: "",
        peelClothNo: "",
        productNum: "",
        procedureList: [],
      },
      min: "",
      max: "",
    };
  },
  computed: {
    lockDisabled: function () {
      let flag = this.detail.procedureList.some((item) => item.checked);
      return !flag;
    },
  },
  created() {
    this.getProductionOrderProcedureDetail();
  },
  methods: {
    getProductionOrderProcedureDetail() {
      this.loading = true;
      getProductionOrderProcedureDetail(this.id).then((res) => {
        if (res.code === 200) {
          this.detail = res.data;
          this.detail.procedureList = this.detail.procedureList.map((item) => {
            return {
              ...item,
              readonly: true,
              checked: false,
              disabled: false,
            };
          });
        }
        this.loading = false;
      });
    },
    handleChangeCheckBox(index, val) {
      let procedureList = this.detail.procedureList;
      if (val) {
        let stock = procedureList[index].stock;
        let dispatchNum = procedureList[index].dispatchNum;
        let num = procedureList[index].num;
        for (let i = 0; i < procedureList.length; i++) {
          const item = procedureList[i];
          if (i <= index) {
            item.dispatchNum = stock - dispatchNum >= 0 ? 0 : dispatchNum - stock;
          }
          item.disabled = i !== index;
          item.readonly = i !== index;
          this.min = stock - num >= 0 ? 0 : num - stock;
          this.max = num - 1;
        }
      } else {
        for (let i = 0; i < procedureList.length; i++) {
          const item = procedureList[i];
          if (i <= index) {
            item.dispatchNum = item.num;
          }
          item.disabled = false;
          item.readonly = false;
        }
      }
    },
    handleChangeInput(index, val) {
      console.log("handleChangeInput", index, val);
      let procedureList = this.detail.procedureList;
      let dispatchNum = procedureList[index].dispatchNum;
      for (let i = 0; i < procedureList.length; i++) {
        const item = procedureList[i];
        if (i <= index) {
          item.dispatchNum = dispatchNum;
        }
      }
    },
    // 释放库存
    onRelease() {
      let formData = {
        productionOrderId: this.detail.productionOrderId,
        productionId: this.detail.productionId,
      };
      cancelProcedureStock(formData).then((res) => {
        if (res.code === 200) {
          this.$message.success("操作成功!");
          this.$emit("arrangeCallBack");
        }
      });
    },
    // 锁定库存
    onLock() {
      let formData = {
        productionOrderId: this.detail.productionOrderId,
        productionId: this.detail.productionId,
        procedure: [],
      };
      formData.procedure = this.detail.procedureList.map((item) => {
        return {
          id: item.id,
          procedureId: item.procedureId,
          productId: item.productId,
          num: item.num,
          dispatchNum: item.dispatchNum,
          isYes: item.checked ? "1" : "0",
        };
      });
      console.log("formData", formData);
      enableProcedureStock(formData).then((res) => {
        if (res.code === 200) {
          this.$message.success("操作成功!");
          this.$emit("arrangeCallBack");
        }
      });
    },
    handleCloseDialog() {
      this.$emit("onClose");
    },
  },
};
</script>

<style lang="scss" scoped>
.order-info {
  color: #101010;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 40px;
}

.product {
  margin-bottom: 40px;
  &-title {
    color: #101010;
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 10px;

    .tip {
      color: #f00;
      font-size: 14px;
      margin-left: 20px;
    }
  }

  &-thead {
    background-color: #30869b;
    .el-col {
      flex: 1;
      flex-shrink: 0;
      color: #fff;
      font-size: 14px;
      line-height: 48px;
      text-align: center;
    }
  }

  &-tbody {
    background-color: #fff;
    border: 1px solid #ddd;
    border-top: none;
    .el-col {
      flex: 1;
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #333;
      font-size: 14px;
      height: 48px;
    }
  }
}
</style>
