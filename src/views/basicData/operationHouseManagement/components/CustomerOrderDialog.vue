<template>
    <el-dialog
      :visible.sync="visible"
      top="0vh"
      width="52%"
      custom-class="right-dialog"
      append-to-body
      :show-close="false"
      :before-close="handleCloseDialog"
    >
      <div class="right-dialog-header">
        <div class="right-dialog-title">选择客户订单</div>
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
            >确定出库</el-button
          >
        </div>
      </div>
  
      <div class="right-dialog-content">
        <el-form ref="rightDialogForm" :model="formData" :inline="true">
          <el-form-item prop="customerName">
            <el-input v-model="formData.customerName" placeholder="请输入客户姓名"></el-input>
          </el-form-item>

          <el-form-item prop="customerPhone">
            <el-input v-model="formData.customerPhone" placeholder="客户联系电话"></el-input>
          </el-form-item>
          <el-form-item prop="customerOrderCode">
            <el-input v-model="formData.customerOrderCode" placeholder="任务单号/订单编号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="gray-btn"
              @click="onReset('rightDialogForm')"
              v-throttle
              >重置
            </el-button>
            <el-button class="dark-green-btn" @click="onSearch" v-throttle
              >搜索
            </el-button>
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
          <el-table-column prop="customerName" label="客户" align="center" />
          <el-table-column prop="customerPhone" label="电话" align="center" />
          <el-table-column prop="customerOrderCode" label="订单编号" align="center"/>
          <el-table-column prop="productName" label="商品名称" align="center" />
          <el-table-column prop="productModel" label="型号" align="center" />
          <el-table-column prop="productNum" label="订单数量" align="center" />
          <el-table-column prop="deliveryDate" label="交货日期" align="center" />
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
  import { getProductPageList,outCustomerOrder } from "@/api/basicData/operationHouseManagement";
  export default {
    name: "SelectProduct",
    props: {
      productId:{
        type:String|Number,
            default:"",
      },
      procedureId:{
        type:String|Number,
            default:"",
      },
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
          customerName: "",
          customerPhone:"",
          customerOrderCode:"",
          current: 1,
          size: 10,
        },
        loading: false,
        tableData: [],
        total: 0,
        multipleSelection: [],
        productionOrderIds:[]
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
        this.formData.productId=this.productId;
        this.formData.procedureId=this.procedureId
        this.loading = true;
        getProductPageList(this.formData).then((res) => {
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
        console.log(this.multipleSelection)
      },
  
      handleCloseDialog() {
        this.$emit("onClose");
      },
  
      submitForm() {
        if(!this.multipleSelection.length){
          this.$message.warning("请至少选择一个产品!");
          return;
        }
        let ids=this.multipleSelection.map((item)=>{
          return item.id;
        });
        let data={
          productId:this.productId,
          procedureId:this.procedureId,
          productionOrderIds:[]
        };
        data.productionOrderIds=this.multipleSelection.map((item) => {
        return item.id;
       });
       
       outCustomerOrder(data).then((res)=>{
        if (res.code === 200) {
          this.$message.success("操作成功!");
        
        }
       })

      },
    },
  };
  </script>
  