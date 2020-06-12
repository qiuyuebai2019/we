// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "babel-polyfill"
import Vue from 'vue'
import ElementUI from 'element-ui';
import elementUIVerify from 'element-ui-verify'
import 'element-ui/lib/theme-chalk/index.css';
import './scss/element-variables.scss'
import './scss/components/UiForm.scss'
import "./scss/style.scss";
import App from './App'
import router from './router'
import  request from './utils/request';
import commonUtils from './utils/common';

import commonMixin from './components/common-mixin'
import printJs from './components/print-js/src';

import print from './utils/print'

import html2word from './utils/html2word'
// import html2pdf from './utils/html2pdf'

import store from './store'
Vue.config.productionTip = false;
ElementUI.Dialog.props.closeOnClickModal=false;//
//ElementUI.Dialog.props.destroyOnClose=true;//
Vue.use(ElementUI,{    size: 'mini'});
let errorMessageTemplate={
  empty: '必填',
  length: '请输入{length}位字符',
  minLength: '输入内容至少{minLength}位',
  number: '请输入数字',
  int: '请输入整数',
  lt: '输入数字应小于{lt}',
  lte: '输入数字不能大于{lte}',
  gt: '输入数字应大于{gt}',
  gte: '输入数字不能小于{gte}',
  maxDecimalLength: '该输入项最多接受{maxDecimalLength}位小数',
  phone: '请输入正确的手机号',
  email: '请输入正确的邮箱',
  verifyCode: '请输入正确的验证码',
  zipCode:'请输入正确的邮编',
  idCard:'请输入正确的身份证号'
}

Vue.use(elementUIVerify, {
  errorMessageTemplate: errorMessageTemplate,
  fieldChange: 'clear'
})

/**校验邮编**/
elementUIVerify.addRule('zipCode', () => [
  {
    validator(rule, val, callback) {
      if (!commonUtils.checkZipCode(val)) {
        const errorMessage = elementUIVerify.getErrorMessage('zipCode')
        callback(Error(errorMessage))
      } else callback()
    },
  },
])
/**校验身份证**/
elementUIVerify.addRule('idCard', () => [
  {
    validator(rule, val, callback) {
      if (!commonUtils.checkIdCard(val)) {
        const errorMessage = elementUIVerify.getErrorMessage('idCard')
        callback(Error(errorMessage))
      } else callback()
    },
  },
])

/**
 * phoneEnc 手机号校验，将中间4位设置为数字再校验
 */
elementUIVerify.addRule('phoneEnc', () => [
  {
    validator(rule, val, callback) {
      if (val.indexOf("****")!==-1){
        //说明存在****，则需要替换成实际数字再来校验
        val=val.substr(0,3) + "0000" + val.substr(7)
      }
     let pattern= /^(?=\d{11}$)^1(?:3\d|4[57]|5[^4\D]|6[67]|7[^249\D]|8\d|9[189])\d{8}$/
      if (!pattern.test(val)) {
        const errorMessage = elementUIVerify.getErrorMessage('phone')
        callback(Error(errorMessage))
      } else callback()
    },
  },
])

import axios from 'axios';
import VueAxios from 'vue-axios';
import constant from './constant';
import pinyin from 'js-pinyin'
axios.defaults.withCredentials=true;
Vue.use(VueAxios,axios);
Vue.use(print) // 注册
Vue.prototype.printJs=printJs// 注册
Vue.prototype.html2word=html2word
// Vue.prototype.html2pdf=html2pdf
Vue.prototype.constant=constant;
Vue.prototype.request=request;
Vue.prototype.commonUtils=commonUtils
Vue.mixin(commonMixin);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

// Vue.use(elementUI)
Vue.use(elementUIVerify)

import  VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)
