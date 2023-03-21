<template>
  <div class="app-container" v-loading="loading">
    <el-row class="common-title first-row" :gutter="30">
      <el-col :span="6">订单编号：{{ detail.orderCode }}</el-col>
      <el-col :span="6">单据日期：{{ detail.orderTime }}</el-col>
    </el-row>
    <el-row class="common-title">
      <span style="margin-right: 20px">客户订单详情</span>
    </el-row>
    <el-row class="info-item" :gutter="30">
      <el-col :span="6">客户：{{ detail.customerName }}</el-col>
      <el-col :span="6">电话：{{ detail.customerPhone }}</el-col>
      <el-col :span="6">地址：{{ detail.customerAddress }}</el-col>
    </el-row>
    <el-row class="common-title">单据金额信息</el-row>
    <el-row class="info-item" :gutter="30">
      <el-col :span="6">单据金额：{{ detail.orderPrice }}</el-col>
      <el-col :span="6">其它费用：{{ detail.otherPrice }}</el-col>
      <el-col :span="6">总金额：{{ detail.totalAmount }}</el-col>
    </el-row>
    <el-row class="info-item" :gutter="30">
      <el-col :span="6">已收定金：{{ detail.receivedPrice }}</el-col>
      <el-col :span="6">收款日期：{{ detail.collectionDate }}</el-col>
      <el-col :span="6">尚欠金额：{{ detail.arrearsPrice }}</el-col>
    </el-row>
    <el-table :data="detail.customerProductList" style="width: 100%">
      <el-table-column type="index" label="序号" width="50" align="center" />
      <el-table-column label="产品状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status === '0'">未出库</span>
          <span v-else-if="scope.row.status === '1'">已出库</span>
        </template>
      </el-table-column>
      <el-table-column prop="outTime" label="出库日期" align="center" />
      <el-table-column prop="productName" label="商品类别" align="center" />
      <el-table-column prop="productName" label="产品名称" align="center" />
      <el-table-column prop="productModel" label="型号" align="center" />
      <el-table-column prop="productColor" label="颜色" align="center" />
      <el-table-column prop="productSize" label="尺寸" align="center" />
      <el-table-column prop="productSpec" label="规格" align="center" />
      <el-table-column prop="peelClothNo" label="皮布号" align="center" />
      <el-table-column prop="unitPrice" label="单价" align="center" />
      <el-table-column prop="productUnit" label="单位 " align="center" />
      <el-table-column prop="productNum" label="数量" align="center" />
      <el-table-column prop="totalPrice" label="小计" align="center" />
      <el-table-column
        prop="logisticsCompany"
        label="物流公司"
        align="center"
      />
    </el-table>
  </div>
</template>

<script>
import { getCustomerOrderDetail } from "@/api/order/customerOrder";
export default {
  name: "CustomerOrderDetail",
  data() {
    return {
      loading: false,
      detail: {
        orderCode: "",
        orderTime: "",
        customerName: "",
        customerPhone: "",
        customerAddress: "",
        orderPrice: "",
        otherPrice: "",
        totalAmount: "",
        receivedPrice: "",
        collectionDate: "",
        arrearsPrice: "",
        customerProductList: [],
      },
    };
  },
  created() {
    let id = this.$route.query.id;
    this.getCustomerOrderDetail(id);
  },
  methods: {
    getCustomerOrderDetail(id) {
      getCustomerOrderDetail(id).then((res) => {
        if (res.code === 200) {
          this.detail = res.data;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.common-title {
  color: #101010;
  font-style: 18px;
  font-weight: bold;
  margin-bottom: 24px;
}

.first-row {
  color: #30869b;
  margin-bottom: 40px;
}

.info-item {
  color: #101010;
  font-size: 14px;
  margin-bottom: 33px;
  &:nth-last-of-type(1) {
    margin-bottom: 28px;
  }
}
</style>
