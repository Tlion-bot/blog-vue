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
      <div class="right-dialog-title">创建生产单</div>
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
      label-position="left"
      label-width="80px"
    >
      <el-row class="row-title">
        <span style="margin-right: 15px">产品信息</span>
        <el-button class="dark-green-btn" @click="onAddSelect" v-throttle
          >增选</el-button
        >
      </el-row>
      <div
        class="product-info-item"
        v-for="(item, index) in dialogForm.product"
        :key="index"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              :prop="`product[${index}].productName`"
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
              v-if="dialogForm.product.length > 1"
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
              :prop="`product[${index}].productModel`"
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
              :prop="`product[${index}].productSpec`"
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
              :prop="`product[${index}].productSize`"
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
              :prop="`product[${index}].peelClothNo`"
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
              :prop="`product[${index}].productColor`"
              label="颜色"
              :rules="[
                {
                  required: true,
                  message: '请输入颜色',
                  trigger: 'change',
                },
              ]"
            >
              <el-input
                v-model="item.productColor"
                placeholder="选择"
                readonly
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :prop="`product[${index}].productUnit`"
              label="单位"
              :rules="[
                {
                  required: true,
                  message: '请输入单位',
                  trigger: 'change',
                },
              ]"
            >
              <el-input
                v-model="item.productUnit"
                placeholder="选择"
                readonly
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              :prop="`product[${index}].productNum`"
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
                v-model.number="item.productNum"
                placeholder="单行输入"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :prop="`product[${index}].unitPrice`"
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
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item
              :prop="`product[${index}].ids`"
              label="工序选择"
              :rules="[
                {
                  required: true,
                  message: '请选择工序',
                  trigger: 'change',
                },
              ]"
            >
              <el-checkbox-group
                v-model="item.ids"
                @change="($event) => handleChangeCheckbox($event, index)"
              >
                <el-checkbox
                  v-for="item2 in item.productProcedureLabourPriceList"
                  :label="item2.procedureId"
                  :key="item2.procedureId"
                  >{{ item2.procedureName }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="totalPrice" label="小计">
            <el-input
              type="number"
              v-model="totalPrice"
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
          <el-form-item prop="money" label="包装说明">
            <el-input
              type="number"
              v-model="dialogForm.money"
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
</template>

<script>
import SelectProduct from "../../components/SelectProduct";
import { getProcedureSelectList } from "@/api/basicData/productProcess";
import { addProductionOrder } from "@/api/order/taskOrder";
export default {
  name: "AddDiaolog",
  components: {
    SelectProduct,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      processOptions: [],
      dialogForm: {
        id: "",
        product: [
          {
            productId: "",
            productName: "",
            productModel: "",
            productSpec: "",
            peelClothNo: "",
            productSize: "",
            productNum: "",
            unitPrice: "",
            productCategoryName: "",
            processOptions: [],
            ids: [],
          },
        ],
        totalPrice: "",
        deliveryDate: "",
        productionInstruction: "",
      },
      innerVisible: false,
      currentRowIndex: 0,
    };
  },
  computed: {
    totalPrice: function () {
      let totalPrice = 0;
      this.dialogForm.product.forEach((item) => {
        totalPrice = totalPrice + item.productNum * item.unitPrice;
      });
      return totalPrice;
    },
  },
  created() {
    this.getProcedureSelectList();
  },
  methods: {
    getProcedureSelectList() {
      getProcedureSelectList().then((res) => {
        if (res.code === 200) {
          this.processOptions = res.data || [];
        }
      });
    },

    onSelectProduct(index) {
      this.innerVisible = true;
      this.currentRowIndex = index;
    },

    onAddSelect() {
      this.dialogForm.product.push({
        productId: "",
        productName: "",
        productModel: "",
        productSpec: "",
        peelClothNo: "",
        productColor: "",
        productUnit: "",
        productSize: "",
        productNum: "",
        unitPrice: "",
        productCategoryName: "",
        processOptions: [],
        ids: [],
      });
    },

    onRemove(index) {
      this.dialogForm.product.splice(index, 1);
    },

    handleCloseDialog() {
      this.$refs["rightDialogForm"].resetFields();
      this.dialogForm = {
        id: "",
        product: [
          {
            productId: "",
            productName: "",
            productModel: "",
            productSpec: "",
            peelClothNo: "",
            productColor: "",
            productUnit: "",
            productSize: "",
            productNum: "",
            unitPrice: "",
            productCategoryName: "",
            ids: [],
          },
        ],
        totalPrice: "",
        deliveryDate: "",
        productionInstruction: "",
      };
      this.$emit("onClose");
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogForm.totalPrice = this.totalPrice;
          addProductionOrder(this.dialogForm).then((res) => {
            if (res.code === 200) {
              this.$message.success("新增成功!");
              this.$emit("onSubmit");
              this.handleCloseDialog();
            }
          });
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
            this.dialogForm.product[this.currentRowIndex],
            "productId",
            item.productId
          );
          this.$set(
            this.dialogForm.product[this.currentRowIndex],
            "productName",
            item.name
          );
          this.$set(
            this.dialogForm.product[this.currentRowIndex],
            "productModel",
            item.model
          );
          this.$set(
            this.dialogForm.product[this.currentRowIndex],
            "productSpec",
            item.spec
          );
          this.$set(
            this.dialogForm.product[this.currentRowIndex],
            "peelClothNo",
            item.peelClothNo
          );
          this.$set(
            this.dialogForm.product[this.currentRowIndex],
            "productSize",
            `${item.length}*${item.width}*${item.hight}`
          );
          this.$set(
            this.dialogForm.product[this.currentRowIndex],
            "productColor",
            item.color
          );
          this.$set(
            this.dialogForm.product[this.currentRowIndex],
            "productUnit",
            item.unit
          );
          this.$set(
            this.dialogForm.product[this.currentRowIndex],
            "unitPrice",
            item.price
          );
          this.$set(
            this.dialogForm.product[this.currentRowIndex],
            "productProcedureLabourPriceList",
            item.productProcedureLabourPriceList
          );
          this.$set(this.dialogForm.product[this.currentRowIndex], "ids", []);
          this.$set(
            this.dialogForm.product[this.currentRowIndex],
            "productCategoryName",
            item.productCategoryName
          );
        } else {
          this.dialogForm.product.push({
            productId: item.productId,
            productName: item.name,
            productModel: item.model,
            productSpec: item.spec,
            peelClothNo: item.peelClothNo,
            productSize: `${item.length}*${item.width}*${item.hight}`,
            productColor: item.color,
            productUnit: item.unit,
            productNum: "",
            productProcedureLabourPriceList:
              item.productProcedureLabourPriceList,
            unitPrice: item.price,
            ids: [],
            productCategoryName: item.productCategoryName,
          });
        }
      });
      this.innerVisible = false;
    },

    handleCloseSelectProduct() {
      this.innerVisible = false;
    },

    handleChangeCheckbox(val, index) {
      let findIndex = this.processOptions.findIndex(
        (item) => item.id === val[val.length - 1]
      );
      this.dialogForm.product[index].ids = [];
      this.processOptions.forEach((item1, index1) => {
        if (index1 <= findIndex) {
          this.dialogForm.product[index].ids.push(item1.id);
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
