import Vue from 'vue'
import Vuex from 'vuex'
import userDetails from './modules/userDetails'
import loadingStatus from './modules/loadingStatus'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    loadingStatus,
    userDetails
  }, 
  // state: userDetails,
  getters: {
    getToCounts: function (state) {
      return state.count + 1;
    }
  },
  mutations: {
    add: function (state) {
      state.count++
    },
    reduction: function (state) {
      state.count--
    },
    refushUser: function (state, newValue) {

      state.userDetails.userDetails = newValue;
    },
    changeLoadingStatus: function (state) {
      state.loadingStatus.loading = !state.loadingStatus.loading
    }
  },
  actions: {
    addFun: function (context) {
      context.commit('add')
    },
    reductionFun: function (context) {
      context.commit('reduction')
    },
    // refushUserFun: function(context,newValue){
    //   context.commit('refushUser')
    // }
  }
});

export default store;