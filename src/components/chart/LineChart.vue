<template>
  <div id="LineChart" style="width: 100%; height: 344px"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "LineChart",
  props: {
    lineChartdata: {
      type: Object,
      default: () => {
        return {
          xAxisData: [],
          seriesData1: [],
          seriesData2: [],
        };
      },
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.initChart();
  },
  watch: {
    lineChartdata: {
      handler(newValue, oldValue) {
        this.initChart();
      },
      deep: true,
    },
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById("LineChart"));
      let max1 = Math.max(...this.lineChartdata.seriesData1)
      let max2 = Math.max(...this.lineChartdata.seriesData2)
      const option = {
        color: ["#308CF3", "#FC7D7D"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985",
            },
          },
        },
        legend: {
          top: 0,
          right: 30,
          data: ["订单数", , "订单金额"],
          textStyle: {
            color: "#999",
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            axisLabel: {
              color: "#666",
            },
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            data: this.lineChartdata.xAxisData,
          },
        ],
        yAxis: [
          {
            name: "订单数",
            type: "value",
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            min: 0,
            max: max1 + 1,
            interval: 1,
            splitLine: {
              lineStyle: {
                type: "dashed",
              },
            },
          },
          {
            name: "订单金额",
            type: "value",
            min: 0,
            max: max2,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                type: "dashed",
              },
            },
            axisLabel: {
              show: true,
              formatter: "{value} w",
            },
          },
        ],
        series: [
          {
            name: "订单数",
            type: "line",
            stack: "Total",
            smooth: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#308CF3",
                },
                {
                  offset: 1,
                  color: "#FFFFFF",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            data: this.lineChartdata.seriesData1,
          },
          {
            name: "订单金额",
            type: "line",
            stack: "Total",
            smooth: true,
            lineStyle: {
              width: 0,
            },
            showSymbol: false,
            areaStyle: {
              opacity: 0.8,
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#FC7D7D",
                },
                {
                  offset: 1,
                  color: "#FFFFFF",
                },
              ]),
            },
            emphasis: {
              focus: "series",
            },
            tooltip: {
              valueFormatter: function (value) {
                return value + " 万";
              },
            },
            data: this.lineChartdata.seriesData2,
          },
        ],
      };
      this.chart.setOption(option, true);
      window.onresize = () => {
        this.chart.resize();
      };
    },
  },
};
</script>
