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
      <div class="right-dialog-title">分配工序</div>
      <div>
        <el-button
          class="gray-btn"
          size="small"
          v-throttle
          @click="handleCloseDialog"
          >取消</el-button
        >
        <el-button
          class="light-blue-btn"
          size="small"
          v-throttle
          @click="handleSubmit"
          >确定分配</el-button
        >
      </div>
    </div>
    <div v-loading="loading" class="right-dialog-content">
      <div class="product">
        <div class="product-info" :gutter="20">
          <span>{{ detail.productCategoryName }}</span>
          <span>{{ detail.productSpec }}</span>
          <span>{{ detail.productColor }}</span>
          <el-button
            class="light-blue-btn"
            size="small"
            v-throttle
            @click="handleCloseDialog"
            >导出工序编号</el-button
          >
        </div>
        <el-row class="product-thead" type="flex">
          <el-col
            v-for="item in detail.dispatchLabourPriceList"
            :key="item.procedureId"
            >{{ item.procedureName }}</el-col
          >
        </el-row>
        <el-row class="product-tbody" type="flex">
          <el-col
            v-for="item in detail.dispatchLabourPriceList"
            :key="item.procedureId"
          >
            共{{ item.num }}
          </el-col>
        </el-row>
        <el-row class="product-tbody" type="flex">
          <el-col
            v-for="item in detail.dispatchLabourPriceList"
            :key="item.procedureId"
          >
            <el-select
              style="width: 120px"
              v-model="item.userId"
              placeholder="派工"
            >
              <el-option
                v-for="item in userOptions"
                :label="item.nickName"
                :value="item.userId"
                :key="item.userId"
              >
              </el-option> </el-select
          ></el-col>
        </el-row>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  getWorkProcedureDetail,
  workUserBatch,
} from "@/api/order/dispatchList";
import { getSelectAllMiniappUser } from "@/api/system/user";
export default {
  name: "AssignDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    multipleSelection: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      userOptions: [],
      detail: {
        productCategoryName: "",
        productSpec: "",
        productColor: "",
        dispatchLabourPriceList: [],
      },
      formData: {
        ids: [],
        procedure: [],
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      await this.getSelectAllMiniappUser();
      this.getWorkProcedureDetail();
    },

    getSelectAllMiniappUser() {
      getSelectAllMiniappUser().then((res) => {
        if (res.code === 200) {
          this.userOptions = res.data;
        }
      });
    },

    getWorkProcedureDetail() {
      this.formData.ids = this.multipleSelection.map((item) => item.id);
      getWorkProcedureDetail(this.formData.ids).then((res) => {
        if (res.code === 200) {
          console.log("getWorkProcedureDetail", res);
          this.detail = res.data;
        }
      });
    },

    onReset() {
      this.formData = {
        ids: [],
        procedure: [],
      };
    },
    handleCloseDialog() {
      this.onReset();
      this.$emit("onClose");
    },
    handleSubmit() {
      const flag = this.detail.dispatchLabourPriceList.some(
        (item) => item.userId === null
      );
      if (flag) {
        this.$message.error("请分配完后再提交!");
        return;
      }
      this.formData.procedure = this.detail.dispatchLabourPriceList.map(
        (item) => {
          return {
            procedureId: item.procedureId,
            userId: item.userId,
          };
        }
      );

      workUserBatch(this.formData).then((res) => {
        if (res.code === 200) {
          this.$message.success("操作成功!");
          this.onReset();
          this.$emit("onAssignCallback");
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.product {
  &-info {
    display: flex;
    align-items: center;
    color: #101010;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 30px;
    > span {
      margin-right: 20px;
    }
  }
  &-title {
    color: #101010;
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 10px;
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
