<template>
  <div class="app-container" v-loading="show">
    <el-form
      class="search-form"
      ref="formData"
      :model="formData"
      :inline="true"
    >
      <el-form-item prop="orderStatus">
        <el-select v-model="formData.orderStatus" placeholder="派工状态">
          <el-option label="已全部派工" value="1"> </el-option>
          <el-option label="待派工" value="0"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="productName">
        <el-input v-model="formData.productName" placeholder="商品名称" />
      </el-form-item>
      <el-form-item prop="orderCode">
        <el-input v-model="formData.orderCode" placeholder="订单编号" />
      </el-form-item>
      <el-form-item prop="productCategoryName">
        <el-select
          v-model="formData.productCategoryName"
          placeholder="商品类别"
        >
          <el-option
            v-for="item in productCategoryOptions"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="productSize">
        <el-input v-model="formData.productSize" placeholder="商品尺寸" />
      </el-form-item>
      <el-form-item prop="productColor">
        <el-input v-model="formData.productColor" placeholder="商品颜色" />
      </el-form-item>
      <!-- <el-form-item prop="dateValue">
        <el-date-picker
          v-model="formData.dateValue"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleChangeDate"
        >
        </el-date-picker>
      </el-form-item> -->
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
        v-hasPermi="['order:dispatchList:export']"
        class="dark-green-btn"
        @click="onExport"
        v-throttle
        >导出订单</el-button
      >
      <!-- <el-button
        v-hasPermi="['order:dispatchList:delete']"
        class="red-btn"
        @click="onDelete"
        >删除</el-button
      > -->
      <el-button
        v-hasPermi="['order:dispatchList:assign']"
        class="blue-btn"
        :disabled="disabled"
        @click="onAssign"
        >分派工序</el-button
      >
      <el-button
        v-hasPermi="['order:dispatchList:delete']"
        class="light-blue-btn"
        :disabled="exportDisabled"
        @click="onExportSerialNumber"
        >导出工序编号</el-button
      >
    </div>
    <el-table
      class="table-wrapper"
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center">
      </el-table-column>
      <el-table-column prop="orderCode" label="订单编号" align="center" />
      <el-table-column prop="dispatchCode" label="任务单号" align="center" />
      <el-table-column label="产品信息" align="center">
        <el-table-column label="商品名称" align="center" prop="productName" />
        <el-table-column
          label="商品类别"
          align="center"
          prop="productCategoryName"
        />
        <el-table-column label="型号" align="center" prop="productModel" />
        <el-table-column label="规格" align="center" prop="productSpec" />
        <el-table-column label="尺寸" align="center" prop="productSize" />
        <el-table-column label="颜色" align="center" prop="productColor" />
        <el-table-column label="皮布号" align="center" prop="peelClothNo" />
        <el-table-column label="数量" align="center" prop="productNum" />
        <!-- <el-table-column label="单位" align="center" prop="productUnit" />  -->
      </el-table-column>

      <el-table-column label="工序" align="center">
        <el-table-column
          v-for="(item, index) in processOptions"
          :label="item.name"
          :key="index"
          align="center"
          width="200"
        >
          <template slot-scope="scope">
            <div
              v-if="scope.row.dispatchLabourPriceList[index]"
              class="select-wrap"
            >
              <span style="margin-right: 10px">{{
                scope.row.dispatchLabourPriceList[index].num
              }}</span>
              <el-select
                style="width: 120px"
                v-model="scope.row.dispatchLabourPriceList[index].userId"
                placeholder="派工"
                :disabled="
                  scope.row.dispatchLabourPriceList[index].userId !== null
                "
                @change="
                  (val) =>
                    onDispatch(
                      scope.row.id,
                      scope.row.dispatchLabourPriceList[index].procedureId,
                      val
                    )
                "
              >
                <el-option
                  v-for="item in userOptions"
                  :label="item.nickName"
                  :value="item.userId"
                  :key="item.userId"
                >
                </el-option>
              </el-select>
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      style="margin-bottom: 20px"
      :page.sync="formData.current"
      :limit.sync="formData.size"
      @pagination="getTableData"
    />
    <AssignDialog
      v-if="dialogVisible"
      :visible="dialogVisible"
      :multipleSelection="multipleSelection"
      @onClose="dialogVisible = false"
      @onAssignCallback="onAssignCallback"
    />

    <div
      v-show="show"
      id="pdfDom"
      style="width: 794px; min-height: 1123px; margin: 0 auto"
    >
      <div
        v-for="(item, index) in printWorkCodeList"
        :key="index"
        style="width: 794px; height: 1123px; padding: 0 30px"
      >
        <div
          style="
            height: 80px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #666;
          "
        >
          <div style="display: flex; align-items: center">
            <img
              style="width: 25px; height: 25px; margin-right: 15px"
              src="../../../assets/images/user-icon.png"
            />
            <span style="font-size: 22px; font-weight: 400; color: #333"
              >{{ item.userNickName }}/{{ item.procedureName }}</span
            >
          </div>
          <div style="font-size: 18px; font-weight: 400; color: #666666">
            {{ item.orderTime }}
          </div>
        </div>
        <div
          style="
            height: 54px;
            display: flex;
            align-items: center;
            font-size: 18px;
            font-weight: 400;
            color: #666;
          "
        >
          <span style="margin-right: 72px">订单编号：{{ item.orderCode }}</span>
          <span>任务单号：{{ item.dispatchCode }}</span>
        </div>
        <div
          style="
            font-size: 19px;
            font-weight: 400;
            color: #000000;
            height: 52px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f2f2f2;
            border: 1px solid #999999;
          "
        >
          <div style="flex: 1; text-align: center">工序编号</div>
          <div style="flex: 1; text-align: center">工序编号</div>
          <div style="flex: 1; text-align: center">工序编号</div>
        </div>
        <div
          style="
            height: 52px;
            display: flex;
            align-items: center;
            font-size: 18px;
            font-weight: 400;
            padding: 0 16px;
            border: 1px solid #999999;
            border-top: none;
          "
          v-for="item2 in item.workCodeList"
          :key="item2.id"
        >
          <div
            style="flex: 1; height: 100%; display: flex; align-items: center"
            v-for="(item3, index3) in item2"
            :key="index3"
          >
            <span
              style="
                font-size: 17px;
                font-weight: 400;
                color: #666666;
                margin-right: 29px;
              "
              >{{ item3.procedureCode }}</span
            >
            <span
              style="
                display: block;
                width: 30px;
                height: 30px;
                border: 1px solid #707070;
              "
            ></span>
          </div>
          <div
            v-if="item2.length === 2"
            style="flex: 1; height: 100%; display: flex; align-items: center"
          ></div>
          <div
            v-if="item2.length === 1"
            style="
              flex: 1;
              height: 100%;
              padding: 0 16px;
              display: flex;
              align-items: center;
            "
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import html2Canvas from "html2canvas";
import JsPDF from "jspdf";
import AssignDialog from "./components/AssignDialog";
import {
  getDispatchOrderPageList,
  workUser,
  getPrintWorkCodeList,
} from "@/api/order/dispatchList";
import { getProcedureSelectList } from "@/api/basicData/productProcess";
import { getProductCategorySelectList } from "@/api/basicData/materialManagement";
import { getSelectAllMiniappUser } from "@/api/system/user";
import { downLoadXlsx } from "@/utils/zipdownload";
export default {
  name: "DispatchList",
  components: {
    AssignDialog,
  },
  data() {
    return {
      // 搜索
      formData: {
        // dateValue: "",
        // orderTimeStart: "",
        // orderTimeEnd: "",
        orderStatus: "",
        productName: "",
        orderCode: "",
        productCategoryName: "",
        productSize: "",
        productColor: "",
        current: 1,
        size: 10,
      },
      userOptions: [],
      productCategoryOptions: [],
      processOptions: [],
      // 表格
      loading: false,
      tableData: [],
      total: 0,
      multipleSelection: [],
      // 批量分派工序
      dialogVisible: false,
      show: false,
      printWorkCodeList: [],
    };
  },
  computed: {
    disabled: function () {
      if (this.multipleSelection.length) {
        let flag = this.multipleSelection.every((item) => {
          return (
            item.productId === this.multipleSelection[0].productId &&
            item.orderStatus === "0"
          );
        });
        return flag ? false : true;
      }
      return true;
    },
    exportDisabled: function () {
      if (this.multipleSelection.length) {
        let flag = this.multipleSelection.every((item) => {
          return (
            item.productId === this.multipleSelection[0].productId &&
            item.orderStatus !== "0"
          );
        });
        return flag ? false : true;
      }
      return true;
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      await this.getProcedureSelectList();
      await this.getSelectAllMiniappUser();
      this.getTableData();
      this.getProductCategorySelectList();
      console.log("js_getDPI", this.js_getDPI());
    },

    js_getDPI() {
      var arrDPI = new Array();
      if (window.screen.deviceXDPI != undefined) {
        arrDPI[0] = window.screen.deviceXDPI;
        arrDPI[1] = window.screen.deviceYDPI;
      } else {
        var tmpNode = document.createElement("DIV");
        tmpNode.style.cssText =
          "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
        document.body.appendChild(tmpNode);
        arrDPI[0] = parseInt(tmpNode.offsetWidth);
        arrDPI[1] = parseInt(tmpNode.offsetHeight);
        tmpNode.parentNode.removeChild(tmpNode);
      }
      return arrDPI;
    },

    getTableData() {
      this.loading = true;
      getDispatchOrderPageList(this.formData).then((res) => {
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

    getSelectAllMiniappUser() {
      getSelectAllMiniappUser().then((res) => {
        this.userOptions = res.data;
      });
    },

    getProcedureSelectList() {
      getProcedureSelectList().then((res) => {
        this.processOptions = res.data;
      });
    },

    // handleChangeDate(value) {
    //   console.log("handleChangeDate", value);
    //   if (value) {
    //     this.formData.orderTimeStart = value[0];
    //     this.formData.orderTimeEnd = value[1];
    //   } else {
    //     this.formData.orderTimeStart = "";
    //     this.formData.orderTimeEnd = "";
    //   }
    // },

    onSearch() {
      this.formData.current = 1;
      this.getTableData();
    },

    onReset(formName) {
      this.formData.current = 1;
      this.$refs[formName].resetFields();
      // this.formData.dateValue = "";
      // this.formData.orderTimeStart = "";
      // this.formData.orderTimeEnd = "";
      this.getTableData();
    },

    onExport() {
      downLoadXlsx("/manager/dispatchOrder/exportDispatch", {
        orderStatus: this.formData.orderStatus,
        productName: this.formData.productName,
        orderCode: this.formData.orderCode,
        productCategoryName: this.formData.productCategoryName,
        productSize: this.formData.productSize,
        productColor: this.formData.productColor,
      });
    },

    onAssign() {
      this.dialogVisible = true;
    },

    onAssignCallback() {
      this.dialogVisible = false;
      this.getTableData();
    },

    onExportSerialNumber() {
      let id = this.multipleSelection.map((item) => item.id);
      getPrintWorkCodeList(id.join(",")).then((res) => {
        if (res.code === 200) {
          let printWorkCodeList = res.data;
          this.recursion(printWorkCodeList);
          printWorkCodeList.forEach((item) => {
            let tempList = [];
            for (let i = 0; i < item.workCodeList.length; i += 3) {
              tempList.push(item.workCodeList.slice(i, i + 3));
            }
            item.workCodeList = tempList;
          });

          console.log("printWorkCodeList", printWorkCodeList);
          this.printWorkCodeList = JSON.parse(
            JSON.stringify(printWorkCodeList)
          );
          this.show = true;
          this.$nextTick(() => {
            this.download();
          });
        }
      });
    },

    arrayChunk(array, size) {
      let data = [];
      for (let i = 0; i < array.length; i += size) {
        data.push(array.slice(i, i + size));
      }
      return data;
    },

    recursion(array) {
      for (let i = 0; i < array.length; i++) {
        const item = array[i];
        const workCodeList = item.workCodeList;
        if (workCodeList.length > 51) {
          let tempArr = this.arrayChunk(item.workCodeList, 51);
          tempArr = tempArr.map((item2) => {
            return {
              ...item,
              workCodeList: item2,
            };
          });
          console.log("tempArr", tempArr);
          array.splice(i, 1, ...tempArr);
          this.recursion(array);
        }
      }

      // array.forEach((item, index) => {
      //   let length = item.workCodeList.length;
      //   if (length > 51) {
      //     let tempArr = this.arrayChunk(item.workCodeList, 51);
      //     tempArr = tempArr.map((item2) => {
      //       return {
      //         ...item,
      //         workCodeList: item2,
      //       };
      //     });
      //     console.log("tempArr", tempArr);
      //     // array.splice(index, 1, ...tempArr);
      //   }
      // });
    },

    download() {
      const element = document.getElementById("pdfDom");
      const width = element.offsetWidth;
      const height = element.offsetHeight;
      const scale = 2;
      const opts = {
        scale,
        width,
        height,
        useCORS: true, // 允许加载跨域的图片
        allowTaint: false, // 允许图片跨域，和 useCORS 二者不可共同使用
        tainttest: true, // 检测每张图片已经加载完成
      };

      html2Canvas(element, opts)
        .then((canvas) => {
          console.log("canvas", canvas);
          const contentWidth = canvas.width;
          const contentHeight = canvas.height;
          // 一页pdf显示html页面生成的canvas高度;
          const pageHeight = (contentWidth / 794) * 1123;
          // 未生成pdf的html页面高度
          let leftHeight = contentHeight;
          // 页面偏移
          let position = 0;
          // a4纸的尺寸[794,1123]，html页面生成的canvas在pdf中图片的宽高
          const imgWidth = 794;
          const imgHeight = (794 / contentWidth) * contentHeight;
          const pageData = canvas.toDataURL("image/jpeg", 1.0);
          // a4纸纵向，一般默认使用；new JsPDF('landscape'); 横向页面
          const PDF = new JsPDF("", "pt", [794, 1123]);

          // 当内容未超过pdf一页显示的范围，无需分页
          if (leftHeight < pageHeight) {
            // addImage(pageData, 'JPEG', 左，上，宽度，高度)设置
            PDF.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
          } else {
            // 超过一页时，分页打印（每页高度841.89）
            while (leftHeight > 0) {
              PDF.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
              leftHeight -= pageHeight;
              position -= 1123;
              if (leftHeight > 0) {
                PDF.addPage();
              }
            }
          }
          PDF.save("工序编号" + ".pdf");
        })
        .catch((err) => {
          console.log("html2Canvas", err);
        })
        .finally(() => {
          this.show = false;
        });
    },

    // 选择行
    handleSelectionChange(val) {
      console.log("handleSelectionChange", val);
      this.multipleSelection = val;
    },

    // 派工
    onDispatch(id, procedureId, val) {
      let formData = {
        id,
        procedureId,
        userId: val,
      };
      workUser(formData).then((res) => {
        if (res.code === 200) {
          this.$message.success("派工成功!");
          this.getTableData();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.textColor {
  color: #30869b;
}
.right-dialog-text {
  color: #30869b;
  font-size: 14px;
}

.el-icon-check {
  color: #30869b;
  font-size: 24px;
  font-weight: bold;
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

.row {
  color: #101010;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 14px;
  &-item {
    display: flex;
    align-items: center;

    &-label {
      font-weight: normal;
      margin-right: 8px;
    }

    ::v-deep {
      .el-input {
        width: 90px;
      }
    }
  }
}

.canvas-img {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.qr-code {
  display: flex;
  justify-content: center;
  margin-bottom: 22px;
}

.select-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
