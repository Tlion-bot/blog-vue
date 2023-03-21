<template>
  <div id="BarChart" style="width: 100%; height: 344px"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "BarChart",
  props: {
    seriesData: {
      type: Array,
      default: () => [],
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
    seriesData: {
      handler(newValue, oldValue) {
        this.initChart();
      },
      deep: true,
    },
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById("BarChart"));
      const option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: 30,
          right: 15,
        },
        series: [
          {
            name: "公司营业额统计​",
            type: "pie",
            radius: [60, 105],
            avoidLabelOverlap: false,
            label: {
              show: true,
              formatter: "{c}",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 16,
                fontWeight: 400,
              },
            },
            labelLine: {
              show: true,
              length1: 2,
              length2: 40,
            },
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorList = [
                    {
                      colorStart: "#BBA7FE",
                      colorEnd: "#7971F4",
                    },
                    {
                      colorStart: "#FCD885",
                      colorEnd: "#FF9652",
                    },
                  ];
                  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: colorList[params.dataIndex]["colorStart"],
                    }, //渐变头部色
                    {
                      offset: 1,
                      color: colorList[params.dataIndex]["colorEnd"],
                    },
                  ]);
                },
              },
            },
            data: this.seriesData,
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
