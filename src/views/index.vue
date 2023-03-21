<template>
  <div class="home">
    <div class="date">
      <div class="date-left">
        <ul class="date-list">
          <li
            class="date-list-item"
            :class="{ 'date-list-item-active': formDate.type === item.value }"
            v-for="item in dateOptions"
            :key="item.value"
            @click="handleClickType(item.value)"
          >
            {{ item.label }}
          </li>
        </ul>
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="handleChangeDate"
        >
        </el-date-picker>
      </div>
      <div class="date-right">更新时间：{{ updateTime }}</div>
    </div>
    <div class="section">
      <div class="overview">
        <div class="common-title">经营概况</div>
        <ul class="overview-list">
          <li class="overview-list-item">
            <img
              class="overview-list-item-bg"
              src="../assets/images/overview-bg1.png"
            />
            <div class="overview-list-item-label">订单总数</div>
            <div class="overview-list-item-value">
              {{ overviewDetail.totalNum }}
            </div>
          </li>
          <li class="overview-list-item">
            <img
              class="overview-list-item-bg"
              src="../assets/images/overview-bg2.png"
            />
            <div class="overview-list-item-label">应收金额</div>
            <div class="overview-list-item-value">
              {{ overviewDetail.receivableAmount }}
            </div>
          </li>
          <li class="overview-list-item">
            <img
              class="overview-list-item-bg"
              src="../assets/images/overview-bg3.png"
            />
            <div class="overview-list-item-label">实收金额</div>
            <div class="overview-list-item-value">
              {{ overviewDetail.paidInAmount }}
            </div>
          </li>
          <li class="overview-list-item">
            <img
              class="overview-list-item-bg"
              src="../assets/images/overview-bg4.png"
            />
            <div class="overview-list-item-label">待收金额</div>
            <div class="overview-list-item-value">
              {{ overviewDetail.dueInAmount }}
            </div>
          </li>
          <li class="overview-list-item">
            <img
              class="overview-list-item-bg"
              src="../assets/images/overview-bg5.png"
            />
            <div class="overview-list-item-label">待完成订单</div>
            <div class="overview-list-item-value">
              {{ overviewDetail.noNum }}
            </div>
          </li>
          <li class="overview-list-item">
            <img
              class="overview-list-item-bg"
              src="../assets/images/overview-bg6.png"
            />
            <div class="overview-list-item-label">已完成订单</div>
            <div class="overview-list-item-value">
              {{ overviewDetail.yesNum }}
            </div>
          </li>
          <li class="overview-list-item">
            <img
              class="overview-list-item-bg"
              src="../assets/images/overview-bg7.png"
            />
            <div class="overview-list-item-label">待排工订单</div>
            <div class="overview-list-item-value">
              {{ overviewDetail.noDispatchNum }}
            </div>
          </li>
          <li class="overview-list-item">
            <img
              class="overview-list-item-bg"
              src="../assets/images/overview-bg8.png"
            />
            <div class="overview-list-item-label">排工中订单</div>
            <div class="overview-list-item-value">
              {{ overviewDetail.dispatchNum }}
            </div>
          </li>
        </ul>
      </div>
      <div class="turnover">
        <div class="turnover-title">
          <img class="money-icon" src="../assets/images/money-icon.png" />
          公司营业额统计​
        </div>
        <PieChart :seriesData="PieChartSeriesData" />
      </div>
    </div>
    <div class="section">
      <!-- <el-scrollbar> -->
      <div class="schedule">
        <div class="common-title">订单工序进度</div>
        <el-table
          class="schedule-table"
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column prop="customerName" label="客户" align="center" />
          <el-table-column
            prop="orderCode"
            label="订单编号"
            width="180"
            align="center"
          />
          <el-table-column
            prop="dispatchCode"
            label="任务单号"
            width="180"
            align="center"
          />
          <el-table-column label="商品数量" prop="productNum" align="center" />
          <el-table-column
            label="交货日期"
            prop="deliveryDate"
            width="100"
            align="center"
          />
          <el-table-column
            v-for="(item, index) in processOptions"
            :label="item.name"
            :key="index"
            align="center"
            width="200"
          >
            <el-table-column label="排工" align="center" prop="productNum">
              <template slot-scope="scope">
                <div
                  v-if="scope.row.dispatchLabourPriceList[index]"
                  class="select-wrap"
                >
                  <span style="margin-right: 10px">{{
                    scope.row.dispatchLabourPriceList[index]
                      .procedureFieldList[1].value
                  }}</span>
                </div>
                <div v-else>--</div>
              </template>
            </el-table-column>
            <el-table-column label="完工" align="center" prop="productNum">
              <template slot-scope="scope">
                <div
                  v-if="scope.row.dispatchLabourPriceList[index]"
                  class="select-wrap"
                >
                  <span style="margin-right: 10px">{{
                    scope.row.dispatchLabourPriceList[index]
                      .procedureFieldList[2].value
                  }}</span>
                </div>
                <div v-else>--</div>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <!-- </el-scrollbar> -->
      <div class="ranking">
        <div style="padding: 0 20px; border-bottom: 1px solid #f2f2f2">
          <div class="common-title">商品top10销售排行</div>
        </div>
        <ul class="ranking-list">
          <template v-if="rankingList.length">
            <li
              v-for="(item, index) in rankingList"
              :key="index"
              class="ranking-list-item"
            >
              <img
                v-if="index === 0"
                class="ranking-list-item-icon"
                src="../assets/images/ranking-icon1.png"
                alt="金牌"
              />
              <img
                v-else-if="index === 1"
                class="ranking-list-item-icon"
                src="../assets/images/ranking-icon2.png"
                alt="金牌"
              />
              <img
                v-else-if="index === 2"
                class="ranking-list-item-icon"
                src="../assets/images/ranking-icon3.png"
                alt="金牌"
              />
              <span class="ranking-list-item-icon" v-else>{{ index + 1 }}</span>
              <el-tooltip
                class="ranking-list-item-cell"
                style="width: 90px"
                effect="dark"
                :content="item.name"
                placement="top-start"
              >
                <span>{{ item.name }}</span>
              </el-tooltip>
              <el-tooltip
                class="ranking-list-item-cell"
                style="width: 76px"
                effect="dark"
                :content="item.spec"
                placement="top-start"
              >
                <span>{{ item.spec }}</span>
              </el-tooltip>
              <el-tooltip
                class="ranking-list-item-cell"
                style="width: 76px"
                effect="dark"
                :content="item.size"
                placement="top-start"
              >
                <span>{{ item.size }}</span>
              </el-tooltip>
              <el-tooltip
                class="ranking-list-item-cell"
                style="width: 45px"
                effect="dark"
                :content="item.color"
                placement="top-start"
              >
                <span>{{ item.color }}</span>
              </el-tooltip>
              <el-tooltip
                class="ranking-list-item-cell"
                style="width: 76px; color: #308cf3"
                effect="dark"
                :content="`销量${item.productNum}件`"
                placement="top-start"
              >
                <span>销量{{ item.productNum }}件</span>
              </el-tooltip>
            </li>
          </template>
          <li v-else class="ranking-list-item-empty">暂无数据</li>
        </ul>
      </div>
    </div>
    <div class="section">
      <div class="trend">
        <div class="trend-title">
          经营走势
          <el-date-picker
            v-model="yearMonth"
            type="month"
            format="yyyy-MM"
            value-format="yyyy-MM"
            placeholder="选择月"
            :clearable="false"
            @change="handleChangeYearMonth"
          >
          </el-date-picker>
        </div>
        <LineChartVue :lineChartdata="lineChartData" />
      </div>
      <div class="statistics">
        <div class="statistics-title">员工报工统计排行</div>

        <ul class="statistics-list">
          <template v-if="staffRankList.length">
            <li
              v-for="(item, index) in staffRankList"
              :key="index"
              class="statistics-list-item"
            >
              <el-tooltip
                class="statistics-list-item-name"
                effect="dark"
                :content="item.nickName"
                placement="top-start"
              >
                <span>{{ item.nickName }}</span>
              </el-tooltip>

              <div class="statistics-list-item-progress">
                <el-progress
                  :stroke-width="10"
                  :show-text="false"
                  :percentage="item.percentage"
                ></el-progress>
              </div>

              <el-tooltip
                class="statistics-list-item-num"
                effect="dark"
                :content="`报工${item.num}件`"
                placement="top-start"
              >
                <span>{{ item.procedureName }}、报工{{ item.num }}件</span>
              </el-tooltip>
            </li>
          </template>
          <li v-else class="statistics-list-item-empty">暂无数据</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import PieChart from "@/components/chart/PieChart.vue";
import LineChartVue from "@/components/chart/LineChart.vue";
import { getProcedureSelectList } from "@/api/basicData/productProcess";
import {
  getLastUpdateTime,
  getGeneralSituation,
  getDispatchIndexPageList,
  getProductTop10List,
  getTrendData,
  getStaffStatisticsList,
} from "@/api/home";
export default {
  name: "Home",
  components: {
    PieChart,
    LineChartVue,
  },
  data() {
    return {
      formDate: {
        type: "3",
        startTime: "",
        endTime: "",
      },
      dateOptions: [
        {
          label: "今日",
          value: "1",
        },
        {
          label: "最近7天",
          value: "2",
        },
        {
          label: "最近30天",
          value: "3",
        },
      ],
      dateValue: "",
      updateTime: "",
      overviewDetail: {
        totalNum: "",
        receivableAmount: "",
        paidInAmount: "",
        dueInAmount: "",
        noNum: "",
        yesNum: "",
        noDispatchNum: "",
        dispatchNum: "",
      },
      PieChartSeriesData: [
        { value: 0, name: "支出" },
        { value: 0, name: "收入" },
      ],
      loading: false,
      tableData: [],
      processOptions: [],
      rankingList: [],
      yearMonth: "",
      trendFormData: {
        year: "",
        month: "",
      },
      lineChartData: {
        xAxisData: [],
        seriesData1: [],
        seriesData2: [],
      },
      staffRankList: [],
    };
  },
  created() {
    this.init();
  },
  methods: {
    handleClickType(val) {
      this.formDate.type = val;
      this.formDate.startTime = "";
      this.formDate.endTime = "";
      this.dateValue = "";
      this.init();
    },

    handleChangeDate(val) {
      if (val) {
        this.formDate.startTime = val[0];
        this.formDate.endTime = val[1];
        this.formDate.type = "";
      } else {
        this.formDate.startTime = "";
        this.formDate.endTime = "";
        this.formDate.type = "3";
      }
      this.init();
    },

    init() {
      const date = new Date();
      this.trendFormData.year = date.getFullYear();
      this.trendFormData.month = date.getMonth() + 1;
      let month =
        this.trendFormData.month < 10
          ? `0${this.trendFormData.month}`
          : this.trendFormData.month;
      this.yearMonth = `${this.trendFormData.year}-${month}`;
      this.getLastUpdateTime();
      this.getGeneralSituation();
      this.getProcedureSelectList();
      this.getProductTop10List();
      this.getTrendData();
      this.getStaffStatisticsList();
    },

    getLastUpdateTime() {
      getLastUpdateTime(this.formDate).then((res) => {
        if (res.code === 200) {
          this.updateTime = res.msg;
        }
      });
    },

    getGeneralSituation() {
      getGeneralSituation(this.formDate).then((res) => {
        if (res.code === 200) {
          this.overviewDetail = res.data;
          this.PieChartSeriesData[0].value = this.overviewDetail.expendAmount;
          this.PieChartSeriesData[1].value = this.overviewDetail.incomeAmount;
        }
      });
    },

    getProcedureSelectList() {
      getProcedureSelectList().then((res) => {
        if (res.code === 200) {
          this.processOptions = res.data;
          this.getDispatchIndexPageList();
        }
      });
    },

    getDispatchIndexPageList() {
      getDispatchIndexPageList(this.formDate).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data.records || [];
        }
      });
    },

    getProductTop10List() {
      getProductTop10List(this.formDate).then((res) => {
        if (res.code === 200) {
          this.rankingList = res.data || [];
        }
      });
    },

    handleChangeYearMonth(val) {
      let temp = val.split("-");
      this.trendFormData.year = temp[0];
      this.trendFormData.month = temp[1];
      this.getTrendData();
    },

    getTrendData() {
      getTrendData(this.trendFormData).then((res) => {
        if (res.code === 200) {
          this.lineChartData.xAxisData = res.data.dateTimeList;
          this.lineChartData.seriesData1 = res.data.numList;
          this.lineChartData.seriesData2 = res.data.priceList;
        }
      });
    },

    getStaffStatisticsList() {
      getStaffStatisticsList(this.formDate).then((res) => {
        if (res.code === 200) {
          let staffRankList = res.data || [];
          if (staffRankList.length) {
            let max = staffRankList[0].num;
            this.staffRankList = staffRankList.map((item) => {
              let percentage = Number(((item.num / max) * 100).toFixed(4));
              return {
                ...item,
                percentage,
              };
            });
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  margin: 10px;
}
.date {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  background: #fff;
  border-radius: 6px;
  padding: 0 10px;
  margin-bottom: 10px;
  &-left {
    display: flex;
    align-items: center;
  }

  &-right {
    font-weight: 400;
    color: #707070;
  }

  &-list {
    display: flex;
    align-items: center;
    list-style: none;
    padding: 0;
    margin-right: 33px;
    background: #f8f8f8;
    border-radius: 4px;
    &-item {
      position: relative;
      font-size: 20px;
      font-weight: 400;
      color: #707070;
      width: 120px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      cursor: pointer;
      &:nth-of-type(2) {
        &:after {
          position: absolute;
          top: 11px;
          left: 0;
          z-index: 1;
          display: block;
          content: "";
          width: 1px;
          height: 18px;
          background-color: #ccc;
        }
        &:before {
          position: absolute;
          top: 11px;
          right: 0;
          z-index: 1;
          display: block;
          content: "";
          width: 1px;
          height: 18px;
          background-color: #ccc;
        }
      }
    }

    &-item-active {
      font-size: 20px;
      font-weight: bold;
      color: #ffffff;
      background: #308cf3;
      border-radius: 4px;
      border: 1px solid #02428a;
      &:after,
      &:before {
        display: none !important;
      }
    }
  }
}

.common-title {
  position: relative;
  font-size: 20px;
  font-weight: bold;
  color: #333;
  height: 66px;
  line-height: 66px;
  padding-left: 19px;
  &::before {
    position: absolute;
    top: 25px;
    left: 0;
    z-index: 1;
    display: block;
    content: "";
    width: 4px;
    height: 16px;
    border-radius: 4px;
    background-color: #308cf3;
  }
}

.section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.overview {
  // width: 1220px;
  flex: 1;
  height: 390px;
  padding: 0 20px;
  margin-right: 10px;
  border-radius: 6px;
  background-color: #fff;
  overflow: auto;
  &-list {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    &-item {
      position: relative;
      width: 280px;
      height: 140px;
      &:nth-of-type(-n + 4) {
        margin-bottom: 20px;
      }

      &-bg {
        width: 100%;
        height: 100%;
      }

      &-label {
        position: absolute;
        top: 30px;
        left: 20px;
        z-index: 1;
        font-size: 18px;
        font-weight: 400;
        color: #fff;
      }

      &-value {
        position: absolute;
        bottom: 15px;
        left: 20px;
        z-index: 1;
        font-size: 40px;
        font-weight: bold;
        color: #fff;
      }
    }
  }
}

.turnover {
  flex-shrink: 0;
  width: 390px;
  height: 390px;
  border-radius: 6px;
  background-color: #fff;
  overflow: hidden;
  &-title {
    display: flex;
    align-items: center;
    padding: 20px 20px 0;
    font-size: 20px;
    font-weight: 400;
    color: #000;
    .money-icon {
      width: 22px;
      height: 22px;
      margin-right: 15px;
    }
  }
}

.schedule {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 20px 20px;
  overflow: auto;
  margin-right: 10px;
  border-radius: 6px;
  background-color: #fff;

  .schedule-table {
    flex: 1;
    overflow: auto;
    /* 设置滚动条的样式 */
    ::-webkit-scrollbar {
      width: 12px;
      height: 8px;
    }
    /* 滚动槽 */
    ::-webkit-scrollbar-track {
      -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.8);
      border-radius: 10px;
    }
    /* 滚动条滑块 */
    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background: rgba(0, 0, 0, 0.1);
      -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
    }
  }

  ::v-deep {
    .el-table .el-table__header-wrapper th,
    .el-table .el-table__fixed-header-wrapper th {
      background-color: #6bb1ff !important;
      height: 48px;
    }
  }
}

.ranking {
  flex-shrink: 0;
  width: 540px;
  height: 570px;
  border-radius: 6px;
  background-color: #fff;
  &-list {
    padding: 0 10px;
    &-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 50px;
      padding: 0 15px;

      &:nth-of-type(2n) {
        border-radius: 10px;
        background-color: #f1f7ff;
      }

      &-icon {
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
      }

      &-cell {
        color: #333;
        font-size: 14px;
        margin-left: 20px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
      }
    }

    &-item-noMore {
      color: #333;
      font-size: 14px;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50px;
    }

    &-item-empty {
      color: #333;
      font-size: 14px;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50px;
    }
  }
}

.trend {
  flex: 1;
  height: 410px;
  // padding: 0 10px;
  margin-right: 10px;
  border-radius: 6px;
  background-color: #fff;
  &-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    font-size: 20px;
    font-weight: bold;
    color: #333;
    height: 58px;
    padding: 0 30px;
    &::before {
      position: absolute;
      top: 20px;
      left: 10px;
      z-index: 1;
      display: block;
      content: "";
      width: 4px;
      height: 16px;
      border-radius: 4px;
      background-color: #308cf3;
    }
  }
}

.statistics {
  flex-shrink: 0;
  width: 540px;
  height: 410px;
  border-radius: 6px;
  background-color: #fff;
  &-title {
    position: relative;
    font-size: 20px;
    font-weight: bold;
    color: #333;
    height: 56px;
    line-height: 56px;
    padding-left: 29px;
    border-bottom: 1px solid #f2f2f2;
    &::before {
      position: absolute;
      top: 20px;
      left: 10px;
      z-index: 1;
      display: block;
      content: "";
      width: 4px;
      height: 16px;
      border-radius: 4px;
      background-color: #308cf3;
    }
  }

  &-list {
    padding: 15px;
    &-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;

      &-name {
        color: #666;
        font-size: 14px;
        // margin-left: 15px;
        width: 60px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
      }

      &-progress {
        width: 296px;
        ::v-deep {
          .el-progress-bar__inner {
            background: linear-gradient(to top right, #ffad8f, #ff573b);
          }
        }
      }

      &-num {
        width: 100px;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        text-align: right;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
      }
    }

    // &-item-noMore {
    //   color: #333;
    //   font-size: 14px;
    //   display: flex;
    //   justify-content: center;
    //   align-items: center;
    //   height: 50px;
    // }

    &-item-empty {
      color: #333;
      font-size: 14px;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50px;
    }
  }
}
</style>
