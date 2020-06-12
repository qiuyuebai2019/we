import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex)
import mutations from './mutations'
import state from './state'
import xykc from './modules/xykc'
const store = new Vuex.Store({
  state: state,
  mutations: mutations,
  modules:{
    xykc
  }
})
export default store
