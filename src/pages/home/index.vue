<script type='text/ecmascript-6'>
/* COMPONENT DOCUMENT
 * author: skm
 * date: 2020/03/17
 * desc: home
 */
import echarts from 'echarts';
import SkmService from '../../services/api';
// const echarts = require('echarts');
export default {
  data() {
    return {
      sourceStats: {
        // pictureDetail: {
        //   count: 16,
        //   size: "19.21mb"
        // },
        // baseDataSize: "1.04kb",
        // paperDetail: {
        //   count: 1,
        //   size: "0.31kb"
        // }
      },
      sourceSpace: 0,
      sourceStatsPercent: 0,
      estimateCapacity: '20G',
      pushPaperCountData: [],
      myLineChart: null,
      myCalendarChart: null
    };
  },
  async mounted() {
    // 显示状态栏
    this.resourceStats();
    // 访问表
    this.createDayMap();

    this.getVirtulData();
    await this.$nextTick();
    this.resizeEcharts();
  },
  methods: {
    /** 重回图标 */
    resizeEcharts() {
      setTimeout(() => {
        window.onresize = () => {
          this.myLineChart.resize();
          this.myCalendarChart.resize();
        };
      }, 200);
    },
    async getVirtulData() {
      // year = year || "2020";
      // let date = +echarts.number.parseDate(year + "-01-01");
      // let end = +echarts.number.parseDate(+year + 1 + "-01-01");
      // let dayTime = 3600 * 24 * 1000;
      // let data = [];
      // for (let time = date; time < end; time += dayTime) {
      //   data.push([echarts.format.formatTime("yyyy-MM-dd", time), 10]);
      // }
      const result = await SkmService.pushPaperCount();

      this.pushPaperCountData = result.data;
      this.lastYearPushPaperCount();
    },

    getMyTime(time) {
      let nowTime;
      if (time) {
        nowTime = new Date(time);
      } else {
        nowTime = new Date();
      }
      return {
        date_year_mounth: `${nowTime.getFullYear()}-${ addZero(nowTime.getMonth() + 1)}-${addZero(nowTime.getDate())}`,
        date_hour_min_sec: `${addZero(nowTime.getHours())}:${addZero(nowTime.getMinutes())}:${addZero(nowTime.getSeconds())}`
      };
      function addZero(num) {
        return  num >= 10 ? num : `0${num}`;
      }
    },
    async createDayMap() {
      //  let  data = [["2000-06-05",116],["2000-06-06",129],["2000-06-08",129]];
      const result = await SkmService.visitList();
      let resultData = [];
      let setMax = [];
      result.data.forEach( item => {
        resultData.push([this.getMyTime(item.updated_at).date_year_mounth, item.visit]);
        setMax.push(item.visit);
      });
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth();
      let day = date.getDate();
      let data = [];

      for (let i = 0; i < 30; i++) {
        let theDate = this.getMyTime(new Date(year, month, day)).date_year_mounth;
        let _index;
        for (let j = 0; j < resultData.length; j++) {
          if (resultData[j].includes(theDate)) {
            _index = j;
          }
        }
        let pushData;
        if (_index) {
          pushData = [theDate, resultData[_index][1]];
        } else {
          pushData = [theDate, 0.1];
        }

        data.push(pushData);
        day--;
      }

      data.reverse();

      let dateList = data.map(function (item) {
        return item[0];
      });
      let valueList = data.map(function (item) {
        return item[1];
      });
      setMax.sort((a, b)=>b-a);
      const mainColor = '#06beb6';
      let option3 = {
        title: {
          text: '博客访问量',
          textStyle: {
            color: mainColor,
            lineHeight: '50'
          },
          left: 'center'
        },
        // Make gradient line here
        visualMap: [{
          show: false,
          type: 'continuous',
          seriesIndex: 0,
          min: -1,
          max: setMax[0]
        }],
        // title: [{
        //     left: 'center',
        //     text: 'Gradient along the y axis'
        // }],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: mainColor
            }
          }
        },
        xAxis: [{
          data: dateList,
          axisLine: {
            lineStyle: {
              color: mainColor
            }
          }
        }],
        yAxis: [{
          splitLine: { show: false },
          axisLine: {
            lineStyle: {
              color: mainColor
            }
          }
        }],
        // grid: [{
        //     bottom: '60%'
        // }],
        series: [{
          type: 'line',
          showSymbol: false,
          data: valueList,
          lineStyle: {
            color: mainColor
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: mainColor // 0% 处的颜色
              }, {
                offset: 1, color: 'rgba(0, 0, 0, 0)' // 100% 处的颜色
              }],
              global: false // 缺省为 false
            }
          }
        }]
      };
      // 绘制图表
      this.myLineChart = echarts.init(document.getElementById('dayMap'));
      this.myLineChart.setOption(option3);

    },

    async resourceStats() {
      const { data } = await SkmService.resourceStats();
      this.sourceStats = data;
      const estimateCapacity = parseInt(this.estimateCapacity);
      // 算比例
      const allSize = data.pictureDetail.size + data.paperDetail.size + data.baseDataSize;
      this.sourceSpace =( allSize / 1024 / 1024 ).toFixed(2) + 'mb';
      this.sourceStatsPercent = Math.max( (allSize / 1024 / 1024  / 1024  / estimateCapacity ).toFixed(2), 0.01 );
      // 换算
      this.sourceStats.pictureDetail.size = this.getUnit(this.sourceStats.pictureDetail.size);
      this.sourceStats.paperDetail.size = this.getUnit(this.sourceStats.paperDetail.size);
    },

    getUnit(size) {
      if((size / 1024 / 1024 / 1024 ) > 1) {
        return (size / 1024 / 1024 / 1024 ).toFixed(2) + 'gb';
      }
      else if ((size / 1024 / 1024  ) > 1) {
        return (size / 1024 / 1024  ).toFixed(2) + 'mb';
      }
      else if((size / 1024 ) > 1) {
        return (size/1024).toFixed(2)  + 'kb';
      }else{
        return size;
      }
    },
    /**
     * 封装服务次数区间数据
     * @param {*} maxValue 最大值
     * @param {*} colorBox 区间颜色集
     */
    generatePieces() {
      let colorBox = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];
      // gte >             lte <
      let pieces = [
        { lt: 1, label: 0, color: colorBox[0] },
        { lte: 1, label: 1, color: colorBox[1] },
        { gte: 2, lte: 3, color: colorBox[2] },
        { gte: 4, lte: 5, color: colorBox[3] },
        { gte: 5, color: colorBox[4] }
      ];
      return pieces;
    },

    // 提交表
    lastYearPushPaperCount() {
      const mainColor= '#06beb6';
      let option = {
        title: {
          text: '文章提交统计',
          textStyle: {
            color: mainColor,
            lineHeight: '20'
          },
          left: 'center'
        },
        visualMap: {
          // show: false,
          min: 0,
          max: 5,
          calculable: true,
          orient: 'horizontal',
          bottom: '20',
          right: '50',
          type: 'piecewise', // 类型为分段型
          pieces: this.generatePieces(), // 自定义颜色规则
          textStyle: {
            color: mainColor
          }
        },
        tooltip: {},
        calendar: {
          // top: 120,
          // left: 30,
          // right: 30,
          range: (new Date()).getFullYear(),
          // splitLine: {
          // show: false
          // lineStyle: {
          //     color: 'red'
          // }
          // },
          cellSize: ['auto', 20],
          splitLine: {
            lineStyle: {
              color: mainColor,
              width: 2
            }
          },
          itemStyle: {
            normal: {
              color: 'rgba(72, 177, 191, 0.6)',
              borderWidth: 1,
              borderColor: '#fff'
              // shadowColor: '#fff',
            }
          },
          monthLabel: {
            color: mainColor
          },
          dayLabel: {
            color: mainColor
          },
          yearLabel: {
            color: mainColor
          }
        },
        series: {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: this.pushPaperCountData
        }
      };


      // function getVirtulData(year) {
      //     year = year || "2020";
      //     let date = +echarts.number.parseDate(year + "-01-01");
      //     let end = +echarts.number.parseDate(+year + 1 + "-01-01");
      //     let dayTime = 3600 * 24 * 1000;
      //     let data = [];
      //     // for (let time = date; time < end; time += dayTime) {
      //     //     data.push([echarts.format.formatTime("yyyy-MM-dd", time), Math.floor(Math.random() * 10)]);
      //     // }
      //     data = [["2020-06-01", 2], ["2020-06-02", 19], ["2020-06-03", 1], ["2020-06-04", 0]]
      //     return data;
      // };
      // 绘制图表
      this.myCalendarChart = echarts.init(document.getElementById('dayMap2'));
      this.myCalendarChart.setOption(option);

    }

  }
};
</script>

<template>
  <div class="homeWarp">
    <div class="homeTop">
      <!-- <h4 class="homeMainTitle">容量监测</h4> -->

      <el-row class="homeTopContent" :gutter="20" type="flex" v-if="sourceStatsPercent">
        <el-col :span="8" class="statsBlock">
          <div class="cardTitle" style="color: #FDC830">总容量</div>
          <p class="cardInfo">资源占有量：{{sourceSpace}}</p>
          <p class="cardInfo">预估容量：20G</p>
          <el-progress class="statsBlock_progress" :text-inside="true" :stroke-width="18" :percentage="sourceStatsPercent" status="success" color="#FDC830"/>
        </el-col>
        <el-col :span="8" class="statsBlock">
          <div class="cardTitle" style="color: #fd746c">图片资源</div>
          <p class="cardInfo">图片：{{sourceStats.pictureDetail.count}} 个</p>
          <p class="cardInfo">图片占有容量：{{sourceStats.pictureDetail.size}}</p>

        </el-col>
        <el-col :span="8" class="statsBlock">
          <div class="cardTitle" style="color: #ACB6E5">文章资源</div>
          <p class="cardInfo">文章：{{sourceStats.paperDetail.count}} 篇</p>
          <p class="cardInfo">文章占有量：{{sourceStats.paperDetail.size}}</p>
        </el-col>
      </el-row>
    </div>
    <div class="homeMid borderBox">
      <div id="dayMap"></div>
    </div>
    <div class="homeBot borderBox">
      <div id="dayMap2"></div>
    </div>
  </div>
</template>

<style  lang="less">
@main-color: #06beb6;
@white-color: #fff;

.homeWarp {
  .statsBlock {
    color: @white-color;
    text-align: left;
    padding: 20px;
    margin: 10px;
    border: 1px solid rgb(109, 213, 250);
    box-shadow: @main-color 0px 0px 10px inset;
    background: rgba(72, 177, 191, 0.2);
    .cardTitle {
      color: #134E5E;
      text-align: center;
      line-height: 30px;
      font-weight: bold;
    }
    .cardInfo {
      font-size: 14px;
      line-height: 30px;
      // color: #bdc3c7;
    }
  }
  .borderBox {
    border: 1px solid rgb(109, 213, 250);
    box-shadow: @main-color 0px 0px 10px inset;
    background: rgba(72, 177, 191, 0.2);
    margin-bottom: 20px;
  }
  .homeMid {
    #dayMap {
      width: 100%;
      height: 400px
    }
  }
  .homeBot {
    #dayMap2 {
      width: 96%;
      height: 250px;
      padding-top: 20px;
    }
  }


}
</style>