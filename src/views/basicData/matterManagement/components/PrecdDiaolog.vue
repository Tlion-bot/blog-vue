<template>
    <el-dialog
    :visible.sync="visible"
    top="0vh"
    width="1100px"
    custom-class="right-dialog"
    :show-close="false"
    :before-close="onClose"
    >
      <div class="right-dialog-header">
        <div class="right-dialog-title">采购记录</div>
        <div>
        <el-button class="gray-btn" size="small" v-throttle @click="onClose"
          >关闭</el-button
        >
        <el-button
          class="dark-green-btn"
          size="small"
          v-throttle
          @click="onExport"
          >导出</el-button
        >
      </div>
      </div>
      <div class="right-dialog-content">
        <el-form ref="formData" :model="formData" :inline="true" @submit.native.prevent>
          <el-form-item prop="productCategoryId">
            <el-select
              v-model="formData.productCategoryId"
              placeholder="全部物料"
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
        <el-form-item  prop="dateValue">
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
      </el-form-item>
        <el-form-item>
          <el-button class="dark-green-btn" @click="onSearch">搜索</el-button>
          <el-button class="gray-btn" @click="onReset">重置</el-button
          >
        </el-form-item>
    </el-form>

    <el-table
    v-loading="loading"
        :data="tableData"
        style="width: 100%"
    >
    <el-table-column type="index" label="序号" width="50" align="center">
      </el-table-column>
      <el-table-column prop="productCategoryName" label="物料名称" align="center" >
      </el-table-column>
      <el-table-column prop="productSpec" label="规格" align="center" >
        <template slot-scope="scope">
          <el-input v-if="isshow[scope.$index]" v-model="scope.row.productSpec"/>
          <span v-if="!isshow[scope.$index]">{{ scope.row.productSpec }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="productModel" label="型号" align="center" >
        <template slot-scope="scope">
          <el-input v-if="isshow[scope.$index]" v-model="scope.row.productModel"/>
          <span v-if="!isshow[scope.$index]">{{ scope.row.productModel }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="productUnit" label="单位" align="center" >
        <template slot-scope="scope">
          <el-input v-if="isshow[scope.$index]" v-model="scope.row.productUnit"/>
          <span v-if="!isshow[scope.$index]">{{ scope.row.productUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="productNum" label="数量" align="center" >
        <template slot-scope="scope">
          <el-input type="number" :min="0"  :step="1" v-if="isshow[scope.$index]" v-model="scope.row.productNum"/>
          <span v-if="!isshow[scope.$index]">{{ scope.row.productNum }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="needDate" label="需求日期" align="center" >
        <template slot-scope="scope">
          <el-date-picker  value-format="yyyy-MM-dd" v-if="isshow[scope.$index]" v-model="scope.row.needDate"/>
          <span v-if="!isshow[scope.$index]">{{ scope.row.needDate }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unitPrice" label="单价" align="center" >
        <template slot-scope="scope">
          <el-input type="number" :min="0" v-if="isshow[scope.$index]" v-model="scope.row.unitPrice"/>
          <span v-if="!isshow[scope.$index]">{{ scope.row.unitPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalPrice" label="小计" align="center" >
        <template slot-scope="scope">
          <el-input type="number" :min="0"  v-if="isshow[scope.$index]" v-model="scope.row.totalPrice"/>
          <span v-if="!isshow[scope.$index]">{{ scope.row.totalPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="采购日期" align="center" />
      <el-table-column fixed="right" label="操作" width="120" align="center">
           <template slot-scope="scope">
            <el-button
              v-hasPermi="['basicData:matterManagement:edit']"
              type="text"
              size="small"
              style="color:#19a4c7"
              :disabled="scope.row.status ==='1'"
              @click="putStorage(scope)"
              >{{scope.row.status === '0' ? '确定入库' : '已入库'}}</el-button>
              <el-button
              v-hasPermi="['basicData:matterManagement:edit']"
              v-if="!isshow[scope.$index]"
              type="text"
              size="small"
              style="color: #19a4c7"
              @click="onEdit(scope.$index)"
              >编辑</el-button>
              <el-button
              v-hasPermi="['basicData:materialManagement:edit']"
              v-if="isshow[scope.$index]"
              @click="onSave(scope.$index,scope)"
              type="text"
              size="small"
              style="color: #19a4c7"
              >保存
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
      </div>
    </el-dialog>
</template>
<script>
import { 
  materList,
  getMatterCategorySelectList,
  confirm,
  getMatterEdit
} from "@/api/basicData/matterManagement" 
import {downLoadXlsx} from "@/utils/zipdownload"
export default{
    name:"PrecdDiaolog",
    props:{
        visible:{
            type:Boolean,
            default:false,
        }
    },
    data(){
        return{
            productCategoryOptions:[],
            // 控制参数表格输入显示
            isshow: [],
            formData:{
                productCategoryId: "",
                dateValue:"",
                startTime: "",
                productName:"",
                endTime: "",
                orderCode:"",
                current: 1,
                size: 10,
            },
            loading:false,
            tableData:[],
            total:0,
            multipleSelection:[],
            dialogVisible:false,
            dialogTitle:"",
            dialogForm:{
              id:"",
              name:"",
            },
        }
    },
    created(){
        this.getTableData();
        this.getMatterCategorySelectList();
    },
    methods:{
      
     
      getTableData(){
            this.loading=true;
            materList(this.formData).then((res)=>{
                
                this.tableData=res.data.records;
                this.total=res.data.total;
                this.loading=false;
            })
      },
      getMatterCategorySelectList(){
        getMatterCategorySelectList().then((res)=>{
          this.productCategoryOptions=res.data;
          
        })
      },
      putStorage(scope){
        let val=scope.row;
        
        this.$confirm("确定要入库吗？","入库确认",{
                confirmButtonText:"确定",
                cancelButtonText:"取消",
                type:"warning"
            }).then(()=>{
              confirm(val).then((res)=>{
                    this.$message.success("入库成功！");
                    
                    
                    this.getTableData();
                })
            })
            .catch(()=>{});
        
      },
      onEdit(index){
        
        this.$set(this.isshow, index, true);
      },
      onSave(index,scope){
        let val=scope.row;
        
        getMatterEdit(val).then((res)=>{
                            this.$message.success("保存成功");
                           
                            this.getTableData();
                        })
        this.$set(this.isshow, index, false);
      },
     //导出
     onExport(){
            
            downLoadXlsx("/manager/storageProduct/export",{
                name:this.formData.name,startTime:this.formData.startTime,endTime:this.formData.endTime,productCategoryId:this.formData.productCategoryId
            })
        },
      onClose() {
        this.onReset();
        this.$emit("onClose");
      },
      onSearch() {
      this.formData.current = 1;
      this.getTableData();
      },
      onReset() {
      this.formData.current = 1;
      this.$refs["formData"].resetFields();
      },
      handleChangeDate(value) {
      if (value) {
        this.formData.startTime = value[0];
        this.formData.endTime = value[1];
      } else {
        this.formData.startTime = "";
        this.formData.endTime = "";
      }
    },
    //关闭对话框
    handleCloseDialog(){
            this.dialogTitle="";
            this.$refs["rightDialogForm"].resetFields();
            this.dialogForm={
                id:"",
                name:"",
                eable:"0"
            };
            this.dialogVisible=false;
        },
    }
}
</script>