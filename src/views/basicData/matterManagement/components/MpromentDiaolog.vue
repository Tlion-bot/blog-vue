<template>
  <div class="print-container">
    <el-dialog
      :visible.sync="visible"
      top="0vh"
      width="1200px"
      custom-class="right-dialog"
      :show-close="false"
      :before-close="onClose"
      :close-on-click-modal="false"
    >
      <div class="container" ref="imageDom">
        <div id="html-canvas">
        <div class="right-dialog-header">
          <div class="right-dialog-title">物料采购</div>
          <div class="right-dialog-text">订单编号：{{ this.storageCode }}</div>
          <div>
            <el-button class="gray-btn" size="small" v-throttle @click="onClose"
              >关闭</el-button
            >
            <el-button
              class="dark-green-btn"
              size="small"
              v-throttle
              @click="onSave(tableData)"
              >保存</el-button
            >
            <el-button
              class="light-blue-btn"
              size="small"
              @click="onDownload"
              v-throttle
              >打印</el-button
            >
          </div>
        </div>
        <div class="right-dialog-content">
          
            <el-table style="width: 100%" v-loading="loading" :data="tableData">
              <el-table-column
                type="index"
                label="序号"
                width="50"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="productName"
                label="物料名称"
                align="center"
              >
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.productCategoryId"
                    placeholder="选择物料"
                  >
                    <el-option
                      v-for="item in productCategoryOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column prop="productSpec" label="规格" align="center">
                <template slot-scope="scope">
                  <el-input
                    type="text"
                    style="width: 90px"
                    v-model="scope.row.productSpec"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="productModel" label="型号" align="center">
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.showInput"
                    type="text"
                    style="width: 90px"
                    v-model="scope.row.productModel"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="productUnit" label="单位" align="center">
                <template slot-scope="scope">
                  <el-input
                    type="text"
                    style="width: 90px"
                    v-model="scope.row.productUnit"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="productNum" label="数量" align="center">
                <template slot-scope="scope">
                  <el-input
                    type="number"
                    :min="0"
                    style="width: 90px"
                    @input="calculate(scope.row)"
                    v-model="scope.row.productNum"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="needDate" label="需求日期" align="center">
                <template slot-scope="scope">
                  <el-date-picker
                  value-format="yyyy-MM-dd"
                    style="width: 90px"
                    v-model="scope.row.needDate"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="unitPrice" label="单价" align="center">
                <template slot-scope="scope">
                  <el-input
                    type="number"
                    :min="0"
                    style="width: 90px"
                    v-model="scope.row.unitPrice"
                    @input="calculate(scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="totalPrice" label="小计" align="center">
                <template slot-scope="scope">
                  <el-input
                    type="text"
                    style="width: 90px"
                    :min="0"
                    v-model="scope.row.totalPrice"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" align="center">
                <template slot-scope="scope">
                  <el-input
                    type="text"
                    style="width: 90px"
                    v-model="scope.row.remark"
                  />
                </template>
              </el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="60"
                align="center"
              >
                <template slot-scope="scope">
                  <el-button
                    v-hasPermi="['basicData:matterManagement:delete']"
                    type="text"
                    size="small"
                    style="color: #19a4c7"
                    @click="handleDelete(scope.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <div style="height: 60px" class="btn-item">
              <el-button
                class="light-blue-btn"
                size="small"
                v-throttle
                @click="addLine"
                >添加一行</el-button
              >
            </div>

            <div>
              <el-row class="info-item" :gutter="30">
                <el-col :span="6">申请人：</el-col>
                <el-col :span="6">部门主管：</el-col>
                <el-col :span="6">采购经办：</el-col>
                <el-col :span="6">厂长：</el-col>
              </el-row>
              <el-row style="height: 60px" class="info-item" :gutter="30">
                <el-col :span="6">日期：</el-col>
                <el-col :span="6">日期：</el-col>
                <el-col :span="6">日期：</el-col>
                <el-col :span="6">日期：</el-col>
              </el-row>
            </div>
          
        </div>
      </div>
    </div>
    </el-dialog>
  </div>
</template>
<script>
import html2Canvas from "html2canvas";
import {
  addtable,
  getMatterCategorySelectList,
  getGenerateNum,
} from "@/api/basicData/matterManagement";
export default {
  name: "MpromentDiaolog",
  // components:{
  //   html2canvas
  // },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      productCategoryOptions: [],
      formData: {
        productCategoryId: "",
        current: 1,
        size: 10,
      },
      tableData: [],
      loading: false,
      i: 1,
      storageCode: "",
      imgUrl: "",
    };
  },
  created() {
    this.getCurrentTime();
    this.getMatterCategorySelectList();
  },

  methods: {
    onDownload() {
      // window.print()
      const element = document.getElementById("html-canvas");
      const scale = 1;
      const opts = {
        scale,
        useCORS: true, // 允许加载跨域的图片
        allowTaint: false, // 允许图片跨域，和 useCORS 二者不可共同使用
        tainttest: true, // 检测每张图片已经加载完成
      };
      html2Canvas(element, opts).then((canvas) => {
        const link = document.createElement("a"); // 创建一个超链接对象实例
        const event = new MouseEvent("click"); // 创建一个鼠标事件的实例
        link.download = `物料采购`; // 设置要下载的图片的名称
        link.href = canvas.toDataURL(); // 将图片的URL设置到超链接的href中
        link.dispatchEvent(event); // 触发超链接的点击事件
      });
    },

    getMatterCategorySelectList() {
      getMatterCategorySelectList().then((res) => {
        this.productCategoryOptions = res.data;
      });
    },

    getCurrentTime() {
      getGenerateNum().then((res) => {
        this.storageCode = res.data.storageCode;
      });
    },

    onClose() {
      this.$emit("onClose");
    },

    onSave(tableData) {
      let storageProductList = tableData;
      let data = {
        storageProductList,
      };
      
      addtable(data).then((res) => {
        this.$message.success("新增成功！");
        this.$emit("onClose");
      });
    },
    addLine() {
      this.tableData.push({
        line: ++this.i,
        showInput: true,
      });
    },
    handleDelete(row) {
      console.log(row);
      var ids = row.id;
      if (ids == "" || ids == null || ids == undefined) {
        return (this.tableData = this.tableData.filter(
          (x) => x.line != row.line
        ));
      }
      this.$modal
        .confirm("是否确认删除该数据项？")
        .then(function () {
          return delDetail([ids]);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    calculate(row) {
    if(row.productNum && row.unitPrice){
      row.totalPrice = row.productNum * row.unitPrice;
    } else
    {
      row.totalPrice=null;
    }
    },
  },
};
</script>
<style lang="scss" scoped>
.print-container {
  width: 1200px;
  margin: 0 auto;
}
.right-dialog-text {
  color: #30869b;
  font-size: 18px;
}

.row-title {
  color: #101010;
  font-size: 18px;
  margin-bottom: 18px;
}

.info-item {
  color: #101010;
  font-size: 14px;
  margin-bottom: 33px;
  &:nth-last-of-type(1) {
    margin-bottom: 28px;
  }
}
