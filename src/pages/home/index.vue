<script type='text/ecmascript-6'>
/* COMPONENT DOCUMENT
* author: skm
* date: 2020/03/17
* desc: home
*/
import echarts from 'echarts'
// const echarts = require('echarts');
export default {
  data () {
    return {
      option : {
          visualMap: {
              show: true,
              min: 0,
              max: 10,
              calculable: true
          },
          calendar: {
              range: '2020'
          },
          series: {
              type: 'heatmap',
              coordinateSystem: 'calendar',
              data: this.getVirtulData(2020)
          }
      }
    }
  },
  mounted () {
    //  this.testFun(()=>{
    //    console.log(this)
    //  },1)
     this.test()
     this.test2()

     this.createDayMap();
  },
  methods: {
    add(){
      // this.$store.commit('add');
      this.$store.dispatch('addFun')
    },
    reduction(){
      // this.$store.commit('reduction')
      this.$store.dispatch('reductionFun')
    },
    cb(){
      console.log(this)
    },
    test() {
      var arr = [1];
      arr.map(function() {
        console.log(this);
      })

      arr.forEach(function(item,index){
        
        console.log(item)
        console.log(index)
        console.log(this)
      })
    },
    test2() {
      [1].map(() => {
        console.log(this);
      })
    },
    testFun(callback,num){
      if(num){
        callback()
      }
    },
    getVirtulData(year) {
        year = year || '2020';
        var date = +echarts.number.parseDate(year + '-01-01');
        var end = +echarts.number.parseDate((+year + 1) + '-01-01');
        var dayTime = 3600 * 24 * 1000;
        var data = [];
        for (var time = date; time < end; time += dayTime) {
            data.push([
                echarts.format.formatTime('yyyy-MM-dd', time),
                10
            ]);
        }
        console.log(data)
        return data;
    },
    createDayMap(){
      var myChart = echarts.init(document.getElementById('dayMap'));
      console.log(myChart)
      // 绘制图表
      myChart.setOption(this.option)
    }
  }
}
</script>

<template>
  <layout>
    state{{this.$store.state.count}}
    <br />
    getters{{this.$store.getters.getToCounts}}
    <br />
    <button @click="add">+</button>
    <button @click="reduction">-</button>

    <div>-----------------------</div>
    <div id="dayMap" style="width: 1200px;height:400px;"></div>
  </layout>
</template>

<style  scoped >
</style>