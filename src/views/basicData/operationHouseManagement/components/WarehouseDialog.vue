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
        <div class="right-dialog-title">工序出库</div>
        <el-button
        class="light-blue-btn"
        size="small"
        v-throttle
        @click="handleCloseDialog"
        >关闭</el-button>
    </div>
    <div v-loading="loading" class="right-dialog-content">
        <div class="product">
          <el-row class="product-thead" type="flex">
            <el-col>商品名称</el-col>
            <el-col>型号</el-col>
            <el-col>规格</el-col>
            <el-col>尺寸</el-col>
            <el-col>皮布号</el-col>
            <el-col>颜色</el-col>
         </el-row>
         <el-row class="product-tbody" type="flex">
            <el-col>{{detail.name}}</el-col>
            <el-col>{{detail.model}}</el-col>
            <el-col>{{detail.spec}}</el-col>
            <el-col>{{detail.productSize}}</el-col>
            <el-col>{{detail.peelClothNo}}</el-col>
            <el-col>{{detail.color}}</el-col>
         </el-row>
        </div>
        <el-row class="row-title">
            工序
        </el-row>
        <el-table :data="detail.productStockss">
            <el-table-column label="工序" align="center" prop="procedureName" />
            <el-table-column label="库存" align="center" prop="realStock" />
            <el-table-column fixed="right" label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button
                    class="light-blue-btn"
                    @click="onSelectProduct"
                    size="small"
                    :disabled="scope.row.realStock ==='0'"
                    >
                    出库
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
        <CustomerOrderDialog 
        v-if="customerOrderDialogVisible" 
        :productId="productId" 
        :procedureId="procedureId"
        :visible="customerOrderDialogVisible"
        @onClose="customerOrderDialogVisible=false"
        />
    </div>
   </el-dialog>
</template>
<script>
import CustomerOrderDialog from "./CustomerOrderDialog.vue"
import {
    getProductStock
} from "@/api/basicData/operationHouseManagement";
export default{
    name:"WarehouseDialog",
    components:{
        CustomerOrderDialog,
    },
    props:{
        id:{
            type:String|Number,
            default:"",
        },
        visible:{
          type: Boolean,
          default: false,
        },
    },
    data(){
        return{
            loading:false,
            detail:{
                productId:"",
                procedureId:"",
                name:"",
                model:"",
                spec:"",
                productSize:"",
                peelClothNo:"",
                color:"",
                productStockss:[{realStock:"123"}]
            },
            
            formData:{
                
                current: 1,
                size: 10,
                
                
            },
            //表格
            loading: false,
            tableData: [],
            total: 0,
            //打开订单
            outWarehousId:'',
            customerOrderDialogVisible:false
        }
    },
    created(){
        this.getTableData(this.id);
        //this.getTableDataGx();
    },
    methods:{
      handleCloseDialog() {
        this.$emit("onClose");
      },
      onSelectProduct() {

        this.customerOrderDialogVisible=true;
      },
      getTableData(id){
        
            this.loading=false;
            getProductStock(id).then((res)=>{
                this.productId=res.data.productId;
                this.procedureId=8;
                this.detail=res.data;
                
                this.loading=false;
            })
      },
      getTableDataGx(){
            this.loading=true;
            // materList(this.formData).then((res)=>{
            //     this.tableDataGx=res.data.records;
            //     this.total=res.data.total;
            //     this.loading=false;
            // })
      },
    }
}
</script>
<style lang="scss" scoped>
.row-title {
  color: #101010;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 18px;
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