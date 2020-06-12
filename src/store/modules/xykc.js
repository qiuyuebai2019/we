const state={
  zxhShowExportDialog:false//征询函列表弹窗是否显示
}
const mutations={
  updateZxhShowExportDialog(state,bool){
    state.zxhShowExportDialog=bool
  }
}
export default {
  namespaced: true,
  state,
  mutations
}
