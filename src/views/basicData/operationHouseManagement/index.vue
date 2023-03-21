<template>
    <div class="app-container">
        <el-form
        class="search-form"
        ref="formData"
        :model="formData"
        :inline="true"
        >
            <el-form-item prop="name">
                <el-input v-model="formData.name" placeholder="商品名称"/>
            </el-form-item>
            <el-form-item prop="productCategoryId">
                <el-select v-model="formData.productCategoryId" placeholder="请选择类别">
                    <el-option
            v-for="item in productCategoryOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="productSize">
                <el-input v-model="formData.productSize" placeholder="输入尺寸"/>
            </el-form-item>
            <el-form-item prop="color">
                <el-input v-model="formData.color" placeholder="输入颜色"/>
            </el-form-item>
            <el-form-item>
               <el-button class="dark-green-btn" @click="onSearch" v-throttle>搜索</el-button>
            </el-form-item>
            <el-form-item>
               <el-button class="gray-btn" @click="onReset('formData')"  v-throttle>重置</el-button>
            </el-form-item>
        </el-form>
        <el-table
        v-loading="loading"
        style="width: 100%"
        :data="tableData"
        >
            <el-table-column prop="name" label="商品名称" align="center"/>
            <el-table-column prop="model" label="型号" align="center" />
            <el-table-column prop="spec" label="规格" align="center"/>
            <el-table-column prop="productSize" label="尺寸" align="center" />
            <el-table-column prop="peelClothNo" label="皮布号" align="center"/>
            <el-table-column prop="color" label="颜色" align="center" />
            <el-table-column
              v-for="(item, index) in processOptions"
              :label="item.name"
              :key="item.id"
              align="center"
            >
            <el-table-column label="库存" align="center">
          <template slot-scope="scope">
            {{scope.row.productStocks[index].realStock}}
          </template>
        </el-table-column>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100" align="center">
                <template slot-scope="scope">
                    <el-button
                    v-hasPermi="['basicData:operationHouseManagement:onout']"
                    @click="onOut(scope.row.id)"
                    type="text"
                    size="small"
                    v-throttle
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
        <WarehouseDialog 
        v-if="outWarehouseDialogVisible" 
        :id="outWarehousId" 
        :visible="outWarehouseDialogVisible"
        @onClose="outWarehouseDialogVisible=false"
        />
    </div>
</template>
<script>
import WarehouseDialog from "./components/WarehouseDialog.vue"
import { getProductCategorySelectList } from "@/api/basicData/materialManagement";
import {
    pageList,
} from "@/api/basicData/operationHouseManagement";
import { getProcedureSelectList } from "@/api/basicData/productProcess";
export default{
    name:"OperationHouseManagement",
    components:{
        WarehouseDialog,
    },
    data(){
        return{
            productCategoryOptions: [],
            //搜索
            formData:{
                name:"",
                current: 1,
                size: 10,
                productSize:"",
                color:"",
                productCategoryId:""
            },
            //表格
            loading: false,
            tableData: [],
            processOptions: [],
            total: 0,
            // 出库
            outWarehousId: '',
            outWarehouseDialogVisible: false,
        }
    },
    computed:{},
    created(){
        this.init();
       
        this.getProductCategorySelectList();
        
    },
    methods:{
        async init() {
      await this.getProcedureSelectList();
      this.getTableData();
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
        onOut(id){
         this.outWarehousId=id;
         
         this.outWarehouseDialogVisible=true;
        },
        getTableData(){
            this.loading=true;
            pageList(this.formData).then((res)=>{

                this.tableData=res.data.records;
                this.tableData.forEach((item)=>{
                    let productStocks=this.processOptions.map(
                        (item2)=>{
                         let findIndex = item.productStocks.findIndex(
                          (item3) => item3.procedureId === item2.id
                         );
                         return{
                            ...item2,
                            realStock:
                            findIndex>-1
                            ? item.productStocks[findIndex].realStock
                            :""
                         };
                        }
                    )
                    this.$set(
                        item,
                        "productStocks",
                        productStocks
                    );
                });
                this.total=res.data.total;
                this.loading=false;
            })
      },
      getProductCategorySelectList() {
      getProductCategorySelectList().then((res) => {
        this.productCategoryOptions = res.data;
      });
    },
    getProcedureSelectList() {
      getProcedureSelectList().then((res) => {
        this.processOptions = res.data;
      });
    },
    }
}
</script>