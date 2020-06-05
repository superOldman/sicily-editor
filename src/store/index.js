import Vue from 'vue'
import Vuex from 'vuex'
// import userDetails from './modules/userDetails';
// import loadingStatus from './modules/loadingStatus';

import load from './load/index';
import user from './user/index';

Vue.use(Vuex)


const store = new Vuex.Store({
  // ...load,
  modules: {
    userMessageModule: {
      namespaced: true,
      ...user
    },
    pageStatsModule: {
      namespaced: true,
      ...load
    }
  }
})


console.log(store)





// const store = new Vuex.Store({
//   state: {
//     loadingStatus,
//     userDetails
//   }, 
//   // state: userDetails,
//   getters: {
//     getToCounts: function (state) {
//       return state.count + 1;
//     },
//     getUserInfo(state){
//       return state.userDetails.userDetails
//     }
//   },
//   mutations: {
//     add: function (state) {
//       state.count++
//     },
//     reduction: function (state) {
//       state.count--
//     },
//     refushUser: function (state, newValue) {
//       state.userDetails.userDetails = newValue;
//     },
//     clearUser(state) {
//       state,userDetails.userDetails = {}
//     },



//     changeLoadingStatus: function (state) {
//       state.loadingStatus.loading = !state.loadingStatus.loading
//     }
//   },
//   actions: {
//     addFun: function (context) {
//       context.commit('add')
//     },
//     reductionFun: function (context) {
//       context.commit('reduction')
//     },
//     // refushUserFun: function(context,newValue){
//     //   context.commit('refushUser')
//     // }
//   }
// });

export default store;