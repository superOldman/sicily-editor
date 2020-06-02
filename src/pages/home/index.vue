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
      option: {
        visualMap: {
          show: true,
          min: 0,
          max: 10,
          calculable: true
        },
        calendar: {
          range: "2020"
        },
        series: {
          type: "heatmap",
          coordinateSystem: "calendar",
          data: this.getVirtulData(2020)
        }
      },

      option2: {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: 10,
          data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center"
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "30",
                fontWeight: "bold"
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 335, name: "直接访问" },
              { value: 310, name: "邮件营销" },
              { value: 234, name: "联盟广告" },
              { value: 135, name: "视频广告" },
              { value: 1548, name: "搜索引擎" }
            ]
          }
        ]
      },

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




    };
  },
  mounted() {
    //  this.testFun(()=>{
    //    console.log(this)
    //  },1)
    this.resourceStats();
    this.test2();

    this.createDayMap();
  },
  methods: {
    add() {
      // this.$store.commit('add');
      this.$store.dispatch("addFun");
    },
    reduction() {
      // this.$store.commit('reduction')
      this.$store.dispatch("reductionFun");
    },
    cb() {
      console.log(this);
    },
    test() {
      var arr = [1];
      arr.map(function() {
        console.log(this);
      });

      arr.forEach(function(item, index) {
        console.log(item);
        console.log(index);
        console.log(this);
      });
    },
    test2() {
      [1].map(() => {
        console.log(this);
      });
    },
    testFun(callback, num) {
      if (num) {
        callback();
      }
    },
    getVirtulData(year) {
      year = year || "2020";
      var date = +echarts.number.parseDate(year + "-01-01");
      var end = +echarts.number.parseDate(+year + 1 + "-01-01");
      var dayTime = 3600 * 24 * 1000;
      var data = [];
      for (var time = date; time < end; time += dayTime) {
        data.push([echarts.format.formatTime("yyyy-MM-dd", time), 10]);
      }
      // console.log(data)
      return data;
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
      //  var  data = [["2000-06-05",116],["2000-06-06",129],["2000-06-08",129]];
       
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
          // result.data.reverse()[0].updated_at
          // for(let i =0;i<30;i++){


          // }


      console.log(data)
      data.reverse();

      var dateList = data.map(function (item) {
          return item[0];
      });
      var valueList = data.map(function (item) {
          return item[1];
      });
      setMax.sort((a,b)=>b-a);


      console.log(setMax)
      var option3= {
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

      var myChart = echarts.init(document.getElementById('dayMap'));
        console.log(myChart)
        // 绘制图表
        myChart.setOption(option3)

    },

    async resourceStats() {
      
      const result = await SkmService.resourceStats();
      this.sourceStats = result;
      const estimateCapacity = parseInt(this.estimateCapacity);

      this.sourceSpace = parseInt(this.sourceStats.pictureDetail.size) + parseInt(this.sourceStats.baseDataSize) / 1024 ;
      this.sourceStatsPercent = ( parseInt(this.sourceStats.pictureDetail.size) + parseInt(this.sourceStats.baseDataSize) / 1024 ) / estimateCapacity;

      console.log( estimateCapacity * 1024 + 'mb' )

    },

    mbOrgb(size) {
      if ((size / 1024 ) > 1) {
          return (size / 1024).toFixed(2) + 'gb'
      } else {
          return size  + 'mb'
      }
}
  }
};
</script>

<template>
  <layout>
    <div class="homeTop">
      <h4>容量监测</h4>

      <div class="homeTopContent" v-if="sourceStatsPercent">
        <div class="massive_css statsBlock">
          <h4>总容量</h4>
          <p>资源占有量：{{mbOrgb(sourceSpace)}}</p>
          <p>预估容量：20G</p>
          <el-progress class="statsBlock_progress"  :text-inside="true" :stroke-width="20" :percentage="sourceStatsPercent" status="success"></el-progress>
        </div>
        <div class="massive_css statsBlock">
          <h4>图片资源</h4>
          <p>图片：{{sourceStats.pictureDetail.count}} 个</p>
          <p>图片占有容量：{{sourceStats.pictureDetail.size}}</p>
          
        </div>
        <div class="massive_css statsBlock">
          <h4>文章资源</h4>
          <p>文章：{{sourceStats.paperDetail.count}} 篇</p>
          <p>文章占有量：{{sourceStats.paperDetail.size}}</p>
        </div>
      </div>


    </div>
    <div id="dayMap" style="width: 1200px;height:400px; position:relative"></div>
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
</style>