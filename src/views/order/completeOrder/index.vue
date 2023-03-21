<template>
  <div class="app-container">
    <el-form
      class="search-form"
      ref="formData"
      :model="formData"
      :inline="true"
    >
      <el-form-item prop="yearMonth">
        <el-date-picker
          v-model="formData.yearMonth"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择月"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="orderCode">
        <el-input v-model="formData.orderCode" placeholder="订单编号" />
      </el-form-item>
      <el-form-item prop="status">
        <el-select v-model="formData.status" placeholder="报工状态">
          <el-option
            v-for="item in orderStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="userId">
        <el-select v-model="formData.userId" placeholder="选择员工">
          <el-option
            v-for="item in staffOptions"
            :key="item.userId"
            :label="item.nickName"
            :value="item.userId"
          >
          </el-option>
        </el-select>
      </el-form-item>
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
        v-hasPermi="['order:completeOrder:export']"
        class="light-blue-btn"
        @click="onExport"
        v-throttle
        >导出</el-button
      >
      <el-button
        v-hasPermi="['order:completeOrder:delete']"
        class="red-btn"
        @click="onDelete"
        >删除</el-button
      >
    </div>
    <el-table
      class="table-wrapper"
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50" align="center">
      </el-table-column>

      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            :data="props.row.dispatchLabourPriceList"
            stripe
            style="width: 100%"
          >
            <el-table-column prop="procedureName" label="工序" align="center">
            </el-table-column>
            <el-table-column label="工序编号" align="center">
              <template slot-scope="scope">
                <el-button
                  class="light-blue-btn"
                  v-hasPermi="['order:completeOrder:view']"
                  @click="onViewProcess(scope.row)"
                  size="small"
                  :disabled="scope.row.enable === '0'"
                  >查看
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="结算" align="center">
              <template slot-scope="scope">
                <div>
                  {{
                    (scope.row.procedureFieldList &&
                      scope.row.procedureFieldList[0].value) ||
                    "--"
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="排工" align="center">
              <template slot-scope="scope">
                <div>
                  {{
                    (scope.row.procedureFieldList &&
                      scope.row.procedureFieldList[1].value) ||
                    "--"
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="完工" align="center">
              <template slot-scope="scope">
                <div>
                  {{
                    (scope.row.procedureFieldList &&
                      scope.row.procedureFieldList[2].value) ||
                    "--"
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="尚余" align="center">
              <template slot-scope="scope">
                <div>
                  {{
                    (scope.row.procedureFieldList &&
                      scope.row.procedureFieldList[3].value) ||
                    "--"
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="生产工" align="center">
              <template slot-scope="scope">
                <div>
                  {{
                    (scope.row.procedureFieldList &&
                      scope.row.procedureFieldList[4].value) ||
                    "--"
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="报工状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.status === '0'">排工中</span>
                <span v-else-if="scope.row.status === '1'">进行中</span>
                <span v-else>已完成</span>
              </template>
            </el-table-column>
            <el-table-column prop="workNickName" label="报工人" align="center">
            </el-table-column>
            <el-table-column prop="workTime" label="报工日期" align="center">
            </el-table-column>
            <!-- <el-table-column prop="name" label="生产说明" align="center">
            </el-table-column> -->
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.status === '2'"
                  class="dark-green-btn"
                  v-hasPermi="['order:completeOrder:work']"
                  @click="onComplete(scope.row)"
                  :disabled="scope.row.enable === '0'"
                  size="small"
                  >已完工
                </el-button>
                <el-button
                  v-else
                  class="light-blue-btn"
                  v-hasPermi="['order:completeOrder:work']"
                  @click="onComplete(scope.row)"
                  :disabled="scope.row.enable === '0'"
                  size="small"
                  >报工
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>

      <el-table-column
        prop="dispatchCode"
        label="任务单号"
        width="180"
        align="center"
      />
      <el-table-column
        prop="orderCode"
        label="订单编号"
        width="180"
        align="center"
      />
      <el-table-column
        prop="productCategoryName"
        label="商品类别"
        align="center"
      />
      <el-table-column prop="deliveryDate" label="交货日期" align="center" />

      <el-table-column prop="productNum" label="下单量" align="center" />

      <el-table-column prop="orderTime" label="派工日期" align="center" />

      <el-table-column label="产品" align="center">
        <el-table-column
          prop="productName"
          label="名称"
          width="100"
          align="center"
        />
        <el-table-column
          prop="productSpec"
          label="规格"
          width="100"
          align="center"
        />
        <el-table-column
          prop="peelClothNo"
          label="皮布号"
          width="100"
          align="center"
        />
        <el-table-column
          prop="productModel"
          label="型号"
          width="100"
          align="center"
        />
        <el-table-column
          prop="productSize"
          label="尺寸"
          width="100"
          align="center"
        />
        <el-table-column
          prop="productColor"
          label="颜色"
          width="100"
          align="center"
        />
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      style="margin-bottom: 20px"
      :page.sync="formData.current"
      :limit.sync="formData.size"
      @pagination="getTableData"
    />
    <el-dialog
      :visible.sync="dialogVisible"
      width="800px"
      custom-class="middle-dialog"
      :show-close="false"
      :before-close="handleCloseDialog"
    >
      <div class="right-dialog-header">
        <div class="right-dialog-title">工序编号</div>
        <div>
          <span style="margin-right: 20px"
            >排工日期：{{ workProcedureCodeDetail.orderTime }}</span
          >
          <span style="font-weight: 600"
            >工序：{{ workProcedureCodeDetail.procedureName }}</span
          >
        </div>
        <div>
          <el-button
            class="dark-green-btn"
            size="small"
            v-throttle
            @click="handleCloseDialog"
            >关闭</el-button
          >
          <!-- <el-button
            class="dark-green-btn"
            size="small"
            v-throttle
            @click="handleSubmitPerfect('perfectForm')"
            >保存</el-button
          > -->
        </div>
      </div>
      <div class="middle-dialog-content">
        <el-row class="list">
          <el-col
            class="list-item"
            v-for="item in workProcedureCodeDetail.workCodeList"
            :key="item.id"
            :span="12"
            >工序编号：{{ item.procedureCode }}</el-col
          >
          <el-col
            v-if="workProcedureCodeDetail.workCodeList.length % 2 !== 0"
            class="list-item"
            :span="12"
          ></el-col>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="completeDialogVisible"
      width="800px"
      custom-class="middle-dialog"
      :show-close="false"
      :before-close="handleCloseProcessDialog"
    >
      <div class="right-dialog-header">
        <div class="right-dialog-title">工序报工</div>
        <div>
          <span style="margin-right: 20px"
            >排工日期：{{ workProcedureCodeDetail.orderTime }}</span
          >
          <span style="font-weight: 600"
            >工序：{{ workProcedureCodeDetail.procedureName }}</span
          >
        </div>
        <div>
          <span style="font-weight: 600; margin-right: 20px"
            >排工：{{ workProcedureCodeDetail.num }}</span
          >
          <span style="font-weight: 600"
            >生产工：{{ workProcedureCodeDetail.userNickName }}</span
          >
        </div>
        <div>
          <el-button
            class="dark-green-btn"
            size="small"
            v-throttle
            @click="handleCloseProcessDialog"
            >关闭</el-button
          >
          <el-button
            class="dark-green-btn"
            size="small"
            v-throttle
            @click="onSubmit"
            :disabled="completeDialogFormData.ids.length === 0"
            >确定报工</el-button
          >
        </div>
      </div>
      <div class="middle-dialog-content">
        <el-row class="action-row" :gutter="20">
          <el-col :span="4">
            <el-button
              class="dark-green-btn"
              size="small"
              v-throttle
              @click="handleCheckAll"
              :disabled="surplus === 0"
              >全选</el-button
            >
          </el-col>
          <el-col class="action-row-cell" :span="10"
            >报工数量：<el-input
              v-model="workNum"
              style="width: 150px"
              readonly
              placeholder="报工数量"
            ></el-input
          ></el-col>
          <el-col class="action-row-cell" :span="10"
            >尚余：<el-input
              v-model="surplus"
              style="width: 150px"
              readonly
              placeholder="尚余"
            ></el-input
          ></el-col>
        </el-row>
        <el-checkbox-group v-model="completeDialogFormData.ids">
          <el-row class="list">
            <el-col
              class="list-item"
              v-for="item in workProcedureCodeDetail.workCodeList"
              :key="item.id"
              :span="12"
            >
              <el-checkbox :label="item.id" :disabled="item.status !== '0'"
                >工序编号：{{ item.procedureCode }}</el-checkbox
              >
            </el-col>
            <el-col
              v-if="workProcedureCodeDetail.workCodeList.length % 2 !== 0"
              class="list-item"
              :span="12"
            ></el-col>
          </el-row>
        </el-checkbox-group>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCompleteOrderPageList,
  getWorkProcedureCode,
  reportWork,
  deleteDispatchOrder,
} from "@/api/order/completeOrder";
import { getProcedureSelectList } from "@/api/basicData/productProcess";
import { getSelectAllMiniappUser } from "@/api/system/user";
import { downLoadXlsx } from "@/utils/zipdownload";
export default {
  name: "CompleteOrder",
  data() {
    return {
      // 搜索
      formData: {
        yearMonth: "",
        orderCode: "",
        status: "",
        userId: "",
        dataType: "1",
        current: 1,
        size: 10,
      },
      orderStatusOptions: [
        {
          label: "已完成",
          value: "2",
        },
        {
          label: "未完成",
          value: "1",
        },
      ],
      staffOptions: [],
      processOptions: [],
      // 表格
      loading: false,
      tableData: [],
      total: 0,
      multipleSelection: [],
      dialogVisible: false,
      workProcedureCodeDetail: {
        id: "",
        procedureId: "",
        procedureName: "",
        orderTime: "",
        num: "",
        userNickName: "",
        workCodeList: [],
      },
      completeDialogFormData: {
        id: "",
        procedureId: "",
        ids: [],
      },
      completeDialogVisible: false,
    };
  },
  computed: {
    workNum: function () {
      return this.completeDialogFormData.ids.length;
    },
    surplus: function () {
      let tempArr = this.workProcedureCodeDetail.workCodeList.filter(
        (item) => item.status === "0"
      );
      return tempArr.length - this.workNum;
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      await this.getProcedureSelectList();
      this.getTableData();
      this.getSelectAllMiniappUser();
    },

    getTableData() {
      this.loading = true;
      getCompleteOrderPageList(this.formData)
        .then((res) => {
          this.tableData = res.data.records;
          this.total = res.data.total;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },

    getSelectAllMiniappUser() {
      getSelectAllMiniappUser().then((res) => {
        this.staffOptions = res.data;
      });
    },

    getProcedureSelectList() {
      getProcedureSelectList().then((res) => {
        this.processOptions = res.data;
      });
    },

    // handleChangeDate(value) {
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
      this.getTableData();
    },

    onExport() {
      downLoadXlsx("/manager/dispatchOrder/exportWork", {
        yearMonth: this.formData.yearMonth,
        orderCode: this.formData.orderCode,
        status: this.formData.status,
        userId: this.formData.userId,
        dataType: "1",
      });
    },

    onDelete() {
      if (!this.multipleSelection.length) {
        this.$message.warning("请至少选择一个订单!");
        return;
      }
      this.$confirm("订单删除后无法恢复，确定要删除吗？", "删除确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let ids = this.multipleSelection.map((item) => {
            return item.id;
          });
          if (this.tableData.length === ids.length) {
            this.formData.current =
              this.formData.current === 1 ? 1 : this.formData.current - 1;
          }
          deleteDispatchOrder(ids.join()).then((res) => {
            this.$message.success("删除成功!");
            this.getTableData();
          });
        })
        .catch(() => {});
    },

    // 选择行
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    onView({ id }) {
      this.$router.push({
        path: "/order/detail",
        query: {
          id,
        },
      });
    },

    getWorkProcedureCode(formData) {
      getWorkProcedureCode(formData).then((res) => {
        if (res.code === 200) {
          this.workProcedureCodeDetail = res.data;
        }
      });
    },

    async onViewProcess(row) {
      let formData = {
        id: row.dispatchOrderId,
        procedureId: row.procedureId,
      };
      await this.getWorkProcedureCode(formData);
      this.dialogVisible = true;
    },

    handleCloseDialog() {
      this.dialogVisible = false;
    },

    async onComplete(row) {
      let formData = {
        id: row.dispatchOrderId,
        procedureId: row.procedureId,
      };
      this.completeDialogFormData.id = row.dispatchOrderId;
      this.completeDialogFormData.procedureId = row.procedureId;
      await this.getWorkProcedureCode(formData);
      this.completeDialogVisible = true;
    },

    handleCheckAll() {
      console.log("handleCheckAll");
      this.completeDialogFormData.ids =
        this.workProcedureCodeDetail.workCodeList.reduce((arr, item) => {
          if (item.status === "0") {
            arr.push(item.id);
          }
          return arr;
        }, []);
    },

    onSubmit() {
      if (!this.completeDialogFormData.ids.length) {
        this.$message.warning("请至少选择一个工序编号");
        return;
      }
      console.log("this.completeDialogFormData", this.completeDialogFormData);
      reportWork(this.completeDialogFormData).then((res) => {
        if (res.code === 200) {
          this.$message.success("操作成功！");
          this.resetCompleteDialogFormData();
          this.completeDialogVisible = false;
          this.getTableData();
        }
      });
    },

    resetCompleteDialogFormData() {
      this.workProcedureCodeDetail = {
        id: "",
        procedureId: "",
        procedureName: "",
        orderTime: "",
        num: "",
        userNickName: "",
        workCodeList: [],
      };
      this.completeDialogFormData = {
        id: "",
        procedureId: "",
        ids: [],
      };
    },

    handleCloseProcessDialog() {
      this.resetCompleteDialogFormData();
      this.completeDialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.search-form {
  ::v-deep {
    .el-input {
      width: 160px;
    }
  }
}

.textColor {
  color: #30869b;
}

.action-row {
  margin-bottom: 20px;
  &-cell {
    display: flex;
    align-items: center;
  }
}

.list {
  border: 1px solid #ddd;
  border-bottom: none;
  &-item {
    height: 40px;
    line-height: 40px;
    text-align: center;
    border-bottom: 1px solid #ddd;
    // &:nth-last-of-type(1) {
    //   border-bottom: none;
    // }
  }
}
</style>
