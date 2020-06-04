<script type='text/ecmascript-6'>
/* COMPONENT DOCUMENT
 * author: skm
 * date: 2020/03/17
 * desc: home
 */
import echarts from "echarts";

import SkmService from "../../services/api";
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
      pushPaperCountData:[],
    };
  },
  mounted() {

    // 显示状态栏
    this.resourceStats();
    // 访问表
    this.createDayMap();

    this.getVirtulData();

  },
  methods: {
  
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
      }else{
          nowTime = new Date();
      }      
      return {
        date_year_mounth : `${nowTime.getFullYear()}-${ addZero(nowTime.getMonth() + 1)}-${addZero(nowTime.getDate())}`,
        date_hour_min_sec : `${addZero(nowTime.getHours())}:${addZero(nowTime.getMinutes())}:${addZero(nowTime.getSeconds())}`
      }

       function addZero(num){
         return  num >= 10 ? num : `0${num}` 
       }
    },
    async createDayMap() {
      //  let  data = [["2000-06-05",116],["2000-06-06",129],["2000-06-08",129]];
       
      const result = await SkmService.visitList();
      let  resultData = [];
      let setMax = [];
      result.data.forEach( item =>{
        resultData.push([this.getMyTime(item.updated_at).date_year_mounth, item.visit]);
        setMax.push(item.visit)
      })
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth();
      let day = date.getDate();
      let data = [];
      for (let i = 0; i < 30; i++) {
          let theDate = this.getMyTime(new Date(year, month, day)).date_year_mounth;
          let _index;
          for(let j = 0; j < resultData.length; j++){
            if(resultData[j].includes(theDate)){
              _index = j
            }
          }
          let pushData;
          if(_index){
            pushData = [ theDate, resultData[_index][1] ]
          }else{
             pushData = [ theDate, 0.1]
          }

          data.push(pushData)
          day--;
      }
      
      data.reverse();

      let dateList = data.map(function (item) {
          return item[0];
      });
      let valueList = data.map(function (item) {
          return item[1];
      });
      setMax.sort((a,b)=>b-a);

      let option3= {
        // Make gradient line here
        visualMap: [{
            show: false,
            type: 'continuous',
            seriesIndex: 0,
            min: -1,
            max: setMax[0],
        }],
        title: [{
            left: 'center',
            text: 'Gradient along the y axis'
        }],
        tooltip: {
            trigger: 'axis'
        },
        xAxis: [{
            data: dateList
        }],
        yAxis: [{
            splitLine: {show: false}
        }],
        // grid: [{
        //     bottom: '60%'
        // }],
        series: [{
            type: 'line',
            showSymbol: false,
            data: valueList
        }]
      }
      // 绘制图表
      let myChart = echarts.init(document.getElementById('dayMap'));
      myChart.setOption(option3)

    },

    async resourceStats() {
      
      const result = await SkmService.resourceStats();
      this.sourceStats = result;
      const estimateCapacity = parseInt(this.estimateCapacity);

      this.sourceSpace = parseInt(this.sourceStats.pictureDetail.size) + parseInt(this.sourceStats.baseDataSize) / 1024 ;
      this.sourceStatsPercent = ( parseInt(this.sourceStats.pictureDetail.size) + parseInt(this.sourceStats.baseDataSize) / 1024 ) / estimateCapacity;

      

    },

    mbOrgb(size) {
      if ((size / 1024 ) > 1) {
          return (size / 1024).toFixed(2) + 'gb'
      } else {
          return size.toFixed(2)  + 'mb'
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
            { gte: 5, color: colorBox[4] },
        ]
        return pieces;
    },

    // 提交表
    lastYearPushPaperCount(){
      let option = {
        visualMap: {
            // show: false,
            min: 0,
            max: 5,
            calculable: true,
            orient: 'horizontal',
            bottom: 'bottom',
            right: '50px',
            type: 'piecewise', // 类型为分段型
            pieces: this.generatePieces() // 自定义颜色规则
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
            itemStyle: {
                normal: {
                    color: '#ebedf0',
                    borderWidth: 2,
                    borderColor: '#fff'
                },
            }
        },
        series: {
            type: "heatmap",
            coordinateSystem: "calendar",
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
        let myChart = echarts.init(document.getElementById('dayMap2'));
        myChart.setOption(option)
    }

  }
};
</script>

<template>
  <layout>
    <div class="homeTop">
      <h4>容量监测</h4>

      <div class="homeTopContent" v-if="sourceStatsPercent">
        <div class="massive_css2 statsBlock">
          <h4>总容量</h4>
          <p>资源占有量：{{mbOrgb(sourceSpace)}}</p>
          <p>预估容量：20G</p>
          <el-progress class="statsBlock_progress"  :text-inside="true" :stroke-width="20" :percentage="sourceStatsPercent" status="success"></el-progress>
        </div>
        <div class="massive_css2 statsBlock">
          <h4>图片资源</h4>
          <p>图片：{{sourceStats.pictureDetail.count}} 个</p>
          <p>图片占有容量：{{sourceStats.pictureDetail.size}}</p>
          
        </div>
        <div class="massive_css2 statsBlock">
          <h4>文章资源</h4>
          <p>文章：{{sourceStats.paperDetail.count}} 篇</p>
          <p>文章占有量：{{sourceStats.paperDetail.size}}</p>
        </div>
      </div>


    </div>
    <div class="mid">
      <h4>博客访问量：</h4>
      <div id="dayMap" style="width: 1200px;height:400px; position:relative"></div>
    </div>
    <div class="bot">
      <h4>文章提交统计：</h4>
      <div id="dayMap2" style="width: 1200px;height:250px; position:relative"></div>
    </div>
  </layout>
</template>

<style  scoped >
.homeTop{
  text-align: left;
}
.homeTopContent{
  display: flex;

}
.statsBlock{
  width: 300px;
  height: 100px;
  text-align: left;
  padding: 10px;
  margin: 10px;
}
.statsBlock_progress{

  width: 80%;
  
}
.mid,.bot{
  text-align: left;
}
</style>