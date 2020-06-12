import  axios from 'axios';
import {Message,Loading,MessageBox} from 'element-ui'
import userInfo from './userInfo'
import route from '../router'

/**
 * 请求方法封装
 * 方便统一管理加载提示、错误异常提示、操作成功提示
 * 参考文档：MAP00_KF\00开发规范\前端开源框架Element参考文档\vue与uap前后端交互的几种常见方式.md
 * @type {{getList: (function(*=): (PromiseLike<T | never> | Promise<T | never> | *)), getOne: (function(*=): (PromiseLike<T | never> | Promise<T | never> | *)), save: (function(*=): (PromiseLike<T | never> | Promise<T | never> | *)), delete: (function(*=): (PromiseLike<T | never> | Promise<T | never> | *)), base: (function(*=): Promise<AxiosResponse<any>>)}}
 */
const request={
  api_pre:process.env.API_PRE,//api前缀
  version:function(url){
    let v;
    let timestamp=new Date().getTime()
    let opt="?"
    if(url.indexOf("?")!=-1)
    {
      opt="&"
    }
    v=opt+"v="+timestamp
    return  v
  },
  /**
   * axios原始方法，增加了错误提示
   * @param options
   * @returns {Promise<AxiosResponse<any> | never>}
   */
  axios:function (options) {
    options.url=request.api_pre+options.url+request.version(options.url)
    return axios(options)
      .then(response => {
        return response
      })
      .catch(error => {
        if (!error.response) {
          return
        }
        let status= error.response.status
        let msg=error.response.data.error
        let type='error'
        let duration=0
        if (status===400){
          type='warning';
          duration=5000
        } else if (status===404){
          type='warning';
          duration=5000
        }else if (status===401) {
          route.push('/login')
          return ;
        }

        //这里应该做错误提示
        Message({
          type: type,
          duration: duration,
          showClose: true,
          message: '加载失败。' +error
        })
        return Promise.reject(error);
      })
  },
  /**
   * 最基础的用法：类似this.axios，差别在有统一的提示
   * @param options
   * @returns {Promise<AxiosResponse<any>>}
   */
    base:function (options) {

      const loadingInstance=Loading.service({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    options.url=request.api_pre+options.url+request.version(options.url)
    if (userInfo.getJwt()){
      options.headers={"token":userInfo.getJwt()}
    }
      return axios(options)
        .then(response => {
          userInfo.setJwt(response.headers['x-auth-token'])
          return response
        })
        .catch(error => {
          if (!error.response) {
            return
          }
         let status= error.response.status
          let msg=error.response.data.error
          let type='error'
          let duration=0
          if (status===400){
            type='warning';
            duration=5000
          }  else if (status===404){
            type='warning';
            duration=5000
          }else if (status===401) {
            route.push('/login')
            return ;
          }

          //这里应该做错误提示
          Message({
            type: type,
            duration: duration,
            showClose: true,
            message: msg
          })
          return Promise.reject(error);
        }) .finally(() => {
          loadingInstance.close();
        })
    },
  /**
   * 无遮罩 请求，用于 首页 刷新 待办任务和今日告警数目
   * @param options
   * @returns {Promise<AxiosResponse<any>>}
   */
    baseNoMask:function (options) {
    options.url=request.api_pre+options.url+request.version(options.url)
    if (userInfo.getJwt()){
      options.headers={"token":userInfo.getJwt()}
    }
      return axios(options)
        .then(response => {
          userInfo.setJwt(response.headers['x-auth-token'])
          return response
        })
        .catch(error => {
          if (!error.response) {
            return
          }
         let status= error.response.status
          let msg=error.response.data.error
          let type='error'
          let duration=0
          if (status===400){
            type='warning';
            duration=5000
          }  else if (status===404){
            type='warning';
            duration=5000
          }else if (status===401) {
            route.push('/login')
            return ;
          }

          //这里应该做错误提示
          Message({
            type: type,
            duration: duration,
            showClose: true,
            message: msg
          })
          return Promise.reject(error);
        }) .finally(() => {

        })
    },
 
   /**
   * 获取列表--uap中获取列表都用这个方法
   * @param options
   * @returns {PromiseLike<T | never> | Promise<T | never> | *}
   */
    getList:function (options) {
      return this.base(options)
        .then(function (response) {
          return response;
       })
    },
  /**
   * 获取单条--使用场景：编辑或者查看时需要重新到数据库中查询出这条数据
   * @param options
   * @returns {PromiseLike<T | never> | Promise<T | never> | *}
   */
    getOne:function (options) {
      return this.base(options)
        .then(function (response) {
          return response;
        })
    },
  /**
   * 保存或者修改
   * @param options
   * @returns {PromiseLike<T | never> | Promise<T | never> | *}
   */
    save:function (options) {
      options.method="post";
      options.headers={
        'Content-type': 'application/json'
      }
      return this.base(options)
        .then(function (response) {
          Message({
            type: 'success',
            message: '保存操作成功。'
          });
          return response;
        })
    },

  /**
   * 保存或者修改(不加消息)
   * @param options
   * @returns {PromiseLike<T | never> | Promise<T | never> | *}
   */
  saveWithNoMessage:function (options) {
    options.method="post";
    options.headers={
      'Content-type': 'application/json'
    }
    return this.base(options)
      .then(function (response) {
        return response;
      })
  },
  /**
   * 删除
   * @param options
   * @returns {PromiseLike<T | never> | Promise<T | never> | *}
   */
    delete:function (options) {
      options.method="delete";
      return  this.base(options)
        .then(function (response) {
          Message({
            type: 'success',
            message: '删除操作成功。'
          });
          return response;
        })
    },
  /**
   * 删除(不加消息)
   * @param options
   * @returns {PromiseLike<T | never> | Promise<T | never> | *}
   */
    deleteWithNoMessage:function (options) {
      options.method="delete";
      return  this.base(options)
        .then(function (response) {
          return response;
        })
    },
  /**
   * post--基础的post请求；使用场景：例如向后台请求更新状态
   * @param options
   * @returns {PromiseLike<T | never> | Promise<T | never> | *}
   */
  post:function (options) {
    options.method="post";
    return  this.base(options)
      .then(function (response) {
        if (response.status==200) {
          if (response.data.message){
            Message({
              type: 'success',
              message: response.data.message
            });
          }
          return response;
        } else {
          Message({
            type: 'error',
            duration: 0,
            showClose: true,
            message: response.data.error
          });
        }
      })
  },
  /**
   * post--基础的post请求(没有提示)；使用场景：例如向后台请求更新状态
   * @param options
   * @returns {PromiseLike<T | never> | Promise<T | never> | *}
   */
  postWithNoMessage:function (options) {
    options.method="post";
    return  this.base(options)
      .then(function (response) {
        if (response.status==200) {
          if (response.data.message){
          }
          return response;
        } else {
          Message({
            type: 'error',
            duration: 0,
            showClose: true,
            message: response.data.error
          });
        }
      })
  },

  /**
   * get--基础的get方法，获取成功时没有任何提示；使用场景：例如打开新增页时需要给表单赋默认值，例如附件id
   * @param options
   * @returns {PromiseLike<T | never> | Promise<T | never> | *}
   */
  get:function (options) {
    options.method="get";
    return  this.base(options)
      .then(function (response) {
        return response;
      })
  },
  /**
   * postValue--基础的post请求；使用场景：例如向后台请求   操作成功 无返回提醒，操作异常，会有异常提醒
   * @param options
   * @returns {PromiseLike<T | never> | Promise<T | never> | *}
   */
  postValue:function (options) {
    options.method="post";
    return  this.base(options)
      .then(function (response) {
        if (response.status==200) {
          /*if (response.data.message){
            Message({
              type: 'success',
              message: response.data.message
            });
          }*/
          return response;
        } else {
          Message({
            type: 'error',
            duration: 0,
            showClose: true,
            message: response.data.error
          });
        }
      })
  },
}
export default request;
