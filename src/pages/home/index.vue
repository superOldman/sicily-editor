<script type='text/ecmascript-6'>
/* COMPONENT DOCUMENT
* author: skm
* date: 2020/03/17
* desc: home
*/
export default {
  data () {
    return {
    }
  },
  mounted () {
    //  this.testFun(()=>{
    //    console.log(this)
    //  },1)
     this.test()
     this.test2()
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
    }
  }
}
</script>

<template>
  <layout>
     state{{this.$store.state.count}}<br>
     getters{{this.$store.getters.getToCounts}}<br>
     <button @click="add">+</button>
     <button @click="reduction">-</button>
  </layout>
</template>

<style  scoped >
</style>