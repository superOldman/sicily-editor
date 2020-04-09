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
     
  },
  methods: {
    add(){
      // this.$store.commit('add');
      this.$store.dispatch('addFun')
    },
    reduction(){
      // this.$store.commit('reduction')
      this.$store.dispatch('reductionFun')
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