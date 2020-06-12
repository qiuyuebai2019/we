//common mutations
export default {
  addVisitedViews(state,view){
    state.visitedViews.push(
      view
    )
  },
  removeVisitedView(state){

  },
  /**
   * 根据name增加缓存视图
   * @param state
   * @param name
   */
  addCachedViews(state,name){
    if (state.cachedViews.includes(name)) return
    state.cachedViews.push(name)
  },
  /**
   * 移除对应的缓存视图
   * @param state
   * @param name
   */
  removeCachedViews(state,name){
    for (const i of state.cachedViews) {
      if (i === name) {
        const index = state.cachedViews.indexOf(i)
        state.cachedViews.splice(index, 1)
        break
      }
    }
  },
  //清空
  clearCachedViews(state){

  },

  //更新当前活动页
  updateActivePath(state,value){
    state.activePath=value
  },

  /**
   * 根据默认值初始化visitedViews
   * @param state
   */
  initVisitedViews(state){
    state.visitedViews=JSON.parse(JSON.stringify(state.affixViews))
  },

  //业务方法
  addTab(state,view){
    if (view.path)
    if (view.path.indexOf('?')!==-1){
      view.path=view.path.substring(0,view.path.indexOf('?') )
    }
    this.commit('updateActivePath',view.path)
    this.commit('updateViewIsOpen',view.path)
    if (state.viewIsOpen)return
    this.commit('addVisitedViews',view)
  },

  //判断页面是否已打开
  updateViewIsOpen(state,path){
    state.viewIsOpen=false
    state.visitedViews.forEach(item=>{
      let path1=item.path
      let path2=path
      // // 如果存在
      // if (path1.indexOf('?')!==-1){
      //   path1=path1.substring(0,path1.indexOf('?') )
      // }
      // if (path2.indexOf('?')!==-1){
      //   path2=path2.substring(0,path2.indexOf('?') )
      // }
      if(path1===path2){
        //alert('存在这个元素');
        state.viewIsOpen=true
      }
    })
  },

  /**
   * 切换到最后一个view
   * @param state
   */
  toLastView(state) {
    const latestView = state.visitedViews.slice(-1)[0]
    if (latestView) {
      this.commit('updateActivePath',latestView.path)
      state.lastView=latestView.path
    } else {
      state.lastView='/'
    }
  },
  /**
   * 清空lastView
   * @param state
   */
  clearLastView(state){
    state.lastView=""
  },
  //关闭所有页面
  closeAllViews(state){
    state.visitedViews=JSON.parse(JSON.stringify(state.affixViews))
    state.cachedViews=[];//清除了所有的缓存；可能需要完善 TODO
    this.commit('toLastView')
  },
  //关闭其他页面
  closeOtherViews(state,componentName){
    let tmp=null
    state.visitedViews.forEach(item=>{
      if(item.path===state.activePath){
        tmp=item
      }
    })
    state.visitedViews=JSON.parse(JSON.stringify(state.affixViews))
    this.commit("addVisitedViews",tmp)
    state.cachedViews=[];
    this.commit('addCachedViews',componentName);
  },
  //关闭标签
  closeTab(state,view,componentName){
    const _self=this
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1)
        _self.commit('removeCachedViews',componentName);
        break
      }
    }
    _self.commit('toLastView');
  },
  addMenuOriginalList(state,menuOriginalList){
    state.menuOriginalList=menuOriginalList
  },
  setIsShowThisRouter(state,bool){
    state.isShowThisRouter=bool
  }
}
