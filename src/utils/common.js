import {Message} from 'element-ui'
import request from "./request";
import userInfo from "./userInfo";
/**
 * 公共函数
 * @type {{isStrIsNull: commonUtils.isStrIsNull}}
 */
const commonUtils = {
  /**
   * 字符串是否是空
   * @param str
   * @returns {Boolean}
   * @author wht
   */
  isStrIsNull: function (str) {
    if (str === null || str === "" || str === undefined|| str === "undefined"|| str === "null") {
      return true;
    }
    return false;
  },
  /**
   * 将后端返回的下拉枚举值根
   * @param dictsBackend 后端返回的枚举值 ;后端返回的是一个数组，类似：[{name:"sf",values:[{text:"是",value:"Y"}]}]，根据此方法转为{sf:[{text:"是",value:"Y"}]}
   * @param tableFrontend  前台定义的数据列表变量
   * @param dictsFrontend  前台定义的枚举值变量
   * @author wht
   */
  translateDicts: function (dictsBackend, tableFrontend, dictsFrontend) {
    //调整下拉枚举
    for (let i = 0; i < dictsBackend.length; i++) {
      dictsFrontend[dictsBackend[i].name] = dictsBackend[i].values
    }
    //调整列表
    if (tableFrontend.tableData) {
      for (let j = 0; j < tableFrontend.tableData.length; j++) {
        for (let i = 0; i < dictsBackend.length; i++) {
          let value = tableFrontend.tableData[j][dictsBackend[i].name]
          if (dictsBackend[i].values){
            for (let k = 0; k < dictsBackend[i].values.length; k++) {
              //如果是数据值是数值类型则把下拉项也定义为数值
              if(typeof value==='number'){
                dictsBackend[i].values[k].value=parseInt(dictsBackend[i].values[k].value)
              }
              if (dictsBackend[i].values[k].value == value) {//'0'==0 true是允许的，所以不能使用===
                tableFrontend.tableData[j][dictsBackend[i].name + 'Label'] = dictsBackend[i].values[k].text
              }
            }
          }
        }
      }
    }

    },
  /**
   * 抽取公共分页
   * @returns {number[]}
   */
  paginationPageSize: function () {
    return [10, 20, 30, 40]
  },
  /**
   * 列表页索引
   * @param curPageNum 当前页码
   * @param pageSize 每页数据条数
   * @param index 索引
   * @returns {*}
   */
  getTableIndex: function (curPageNum,pageSize,index) {
    return (curPageNum - 1) * pageSize + index + 1;
  },

  checkForm: function (ruleForm, _self) {
    var bool = false
    _self.$refs[ruleForm].validate((valid) => {
      bool = valid
      if (!valid) {
        Message('表单有字段校验未通过，请检查标红输入框');
      }
    })
    return bool
  },
  checkFormWithMsg: function (ruleForm, _self,msg) {//20200203 liukp新增自定义提示
    var bool = false
    _self.$refs[ruleForm].validate((valid) => {
      bool = valid
      if (!valid) {
        Message(msg);
      }
    })
    return bool
  },
  //身份证验证 idCard:身份证字段值
  checkIdCard: function (idCard) {
    //15位和18位身份证号码的正则表达式
    var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    //如果通过该验证，说明身份证格式正确，但准确性还需计算
    if (regIdCard.test(idCard)) {
      if (idCard.length == 18) {
        var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //将前17位加权因子保存在数组里
        var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
        var idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
        for (var i = 0; i < 17; i++) {
          idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
        }
        var idCardMod = idCardWiSum % 11;//计算出校验码所在数组的位置
        var idCardLast = idCard.substring(17);//得到最后一位身份证号码
        //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
        if (idCardMod == 2) {
          if (idCardLast == "X" || idCardLast == "x") {
            return true;
          } else {
            return false;
          }
        } else {
          //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
          if (idCardLast == idCardY[idCardMod]) {
            //alert("恭喜通过验证啦！");
            return true;
          } else {
            return false;
          }
        }
      }
    } else {
      return false;
    }

  },
  /**
   * 校验动态弹窗的 参数是否符合格式
   * @param param
   */
  checkPopupParam(param){
    let popParmArray=param.split(",")
    if(popParmArray.length!=3){
      this.message('当前弹窗配置参数个数有误，参数格式应为：kbqdid=xxxx,selectReturn=选择的字段&目标字段&展示的字段,filtersql=自定义过滤sql');
      return  false;
    }
    //检查校验 库表清单id配置
    let kbdqdArr=popParmArray[0].split("=");
    if(kbdqdArr.length!=2){
      this.message('当前弹窗配置的库表清单有误，参数格式应为：kbqdid=xxxx,selectReturn=选择的字段&目标字段&展示的字段,filterSql=自定义过滤sql');
      return  false;
    }
    if(kbdqdArr[0]=='kbqdid'){
      //this.popKbqdid=kbdqdArr[1]//弹窗的 库表清单id
    }else{
      this.message('当前弹窗配置参数有误，参数格式应为：kbqdid=xxxx,selectReturn=选择的字段&目标字段&展示的字段,filterSql=自定义过滤sql');
      return  false;
    }
    //检查校验 选择和返回的配置
    let selectRetArr=popParmArray[1].split("=");
    if(selectRetArr.length!=2){
      this.message('当前弹窗配置的选择返回参数有误，参数格式应为：selectReturn=选择的字段1#选择的字段2&目标字段1#目标字段2&展示的字段');
      return  false;
    }
    if(selectRetArr[0]=='selectReturn'){
      let returnColumn=selectRetArr[1].split("&");
      if(returnColumn.length!=3){
        this.message('当前弹窗配置参数有误，参数格式应为：kbqdid=xxxx,selectReturn=选择的字段&目标字段&展示的字段,filterSql=自定义过滤sql');
        return  false;
      }else{
        //this.popSelectReturnColumn=selectRetArr[1]//弹窗的 库表清单id
      }
    }else{
      this.message('当前弹窗配置参数有误，参数格式应为：kbqdid=xxxx,selectReturn=选择的字段&目标字段&展示的字段,filterSql=自定义过滤sql');
      return  false;
    }
    if(!popParmArray[2].startsWith("filterSql=")){
      this.message('当前弹窗配置参数有误，参数格式应为：kbqdid=xxxx,selectReturn=选择的字段&目标字段&展示的字段,filterSql=自定义过滤sql');
      return  false;
    }else{
      // let filterArr=popParmArray[2].split("=");
      //this.popFilterSql=filterArr[1];
    }
    return  true;
},
  /**
   * 邮编校验
   * @param zipCode
   * @returns {boolean}
   */
  checkZipCode(zipCode){
    var re= /^[1-9][0-9]{5}$/
    return re.test(zipCode);
  },
  /**
   * 时间对比方法
   * @param s1 开始时间
   * @param s2 结束时间
   * @returns {boolean}
   */
  compareDate(s1,s2){
    if (this.isStrIsNull(s1)){
      s1="0"
    }
    if (this.isStrIsNull(s2)){
      s2="0"
    }
     return ((new Date(s1.replace(/-/g,"\/")))<=(new Date(s2.replace(/-/g,"\/"))));
  },

  /**
   * 手机号脱敏：中间4位显示星号
   * @param phone
   * @returns {string}
   */
  encryptionPhone(phone){
    if(commonUtils.isStrIsNull(phone)){
      return phone;
    }
    phone=phone.substr(0,3) + "****" + phone.substr(7)
    return phone
  },
  /**
   * 邮箱脱敏
   * @param email
   * @returns {string|*}
   */
  encryptionEmail(email){
    if(commonUtils.isStrIsNull(email)){
      return email;
    }
    let at="@";
    let star="***"
    let name = email.split(at)[0];
    let company = email.split(at)[1];
    if(!commonUtils.isStrIsNull(name)){
      let name_length=name.length
      if (name_length>3) {
        email=name.substr(0,name_length-3)+star+at+company
      }else {
        if (name_length===3){
          star="**"
        } else if (name_length===2){
          star="*"
        }
        email=name.substr(0,1)+star+at+company
      }
    }
    return email
  },
  /**
   * 数字脱敏：所有数字分三份，中间用*号替代
   * @param val
   * @returns {string|*}
   */
  encryptionNumber(val){
    if(commonUtils.isStrIsNull(val)){
      return val;
    }
    let star=""
    let param=parseInt(val.length/3);
    for (let i=0;i<param;i++){
      star+="*";
    }
    val=
      val.substr(0,param)
      +star
      +val.substr(param*2,val.length-1);
    return val
  },
  /**
   * 地址脱敏:字符串分三份，最后一份用星号表示
   * @param val
   * @returns {*}
   */
  encryptionAddress(val){
    if(commonUtils.isStrIsNull(val)){
      return val;
    }
    let star=""
    let param=parseInt(val.length/3);
    for (let i=0;i<param;i++){
      star+="*";
    }
    val=
      val.substr(0,param*2)
      +star
    return val
  },
  /**
   * 手机号；电话号；邮箱；
   * {
   *     phone:[],
   *     email:[],
   *     tel:[]
   * }
   * @param formData
   * @param fields
   */
  encryptionData(formData, fields) {
    if (!process.env.IS_ENC_MODE) {
      return formData;
    }
    debugger
    let phone = fields['phone']
    let email = fields['email']
    let tel = fields['tel']
    let bankCard = fields['bankCard']
    let idCard = fields['idCard'];
    let address=fields['address'];
    if (phone){
      for (let i = 0; i < phone.length; i++) {
        formData[phone[i]] = commonUtils.encryptionPhone(formData[phone[i]])
      }
    }
    if (email){
      for (let i = 0; i < email.length; i++) {
        formData[email[i]] = commonUtils.encryptionEmail(formData[email[i]])
      }
    }
    if (tel){
      for (let i = 0; i < tel.length; i++) {
        formData[tel[i]] = commonUtils.encryptionNumber(formData[tel[i]])
      }
    }
    if (bankCard){
      for (let i = 0; i < bankCard.length; i++) {
        formData[bankCard[i]] = commonUtils.encryptionNumber(formData[bankCard[i]])
      }
    }
    if (idCard){
      for (let i = 0; i < idCard.length; i++) {
        formData[idCard[i]] = commonUtils.encryptionNumber(formData[idCard[i]])
      }
    }
    if (address){
      for (let i = 0; i < address.length; i++) {
        formData[address[i]] = commonUtils.encryptionAddress(formData[address[i]])
      }
    }
    return formData;
  },
  /**
   * date格式化
   * @param date
   * @returns {String}
   */
  dateFormat(date) {
    let Y = date.getFullYear();
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    let D = date.getDate();
    if (D < 10) {
      D = "0" + D
    }
    let h = date.getHours();
    if (h < 10) {
      h = "0" + h
    }
    let m = date.getMinutes();
    if (m < 10) {
      m = "0" + m
    }
    let s = date.getSeconds();
    if (s < 10) {
      s = "0" + s
    }
    return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
  },
  /**
   * 日期格式化， 把列上的日期列只保留 年月日
   * @param row
   * @param column
   * @param cellValue
   * @param index
   * @returns {string | *}
   */
  getDate(row, column, cellValue, index){
    if(cellValue!==null&&cellValue!=undefined){
      return cellValue.substr(0,10);
    }
  },
  getDefaultFilter:function (searchForm) {
    let filter = "";
    let _self=this;
    if (!(JSON.stringify(searchForm) === "{}")) {
      Object.keys(searchForm).forEach(function (key) {
        let symbol="&"
        if (filter===""){
          symbol=""
        }
        if (searchForm[key]!=null) {
          if (typeof searchForm[key] == "object") {
            var d0 = searchForm[key][0];
            var d1 = searchForm[key][1];
            filter +=symbol+ key+"_begin" + "=" + _self.dateFormat(d0)
            filter +="&"+ key+"_end" + "=" + _self.dateFormat(d1)
          } else {
            filter += symbol+key + "=" + searchForm[key]
          }
        }

      })
    }
   return filter
  },
  /**
   * 资产台账动态查询条件 一些popup查询条件是_label只是用来展示的 不可以作为查询条件
   * @param searchForm
   * @returns {string}
   */
  getZctzFilter:function (searchForm) {
    let filter = "";
    let _self=this;
    if (!(JSON.stringify(searchForm) === "{}")) {
      Object.keys(searchForm).forEach(function (key) {
        let symbol="&"
        if (filter===""){
          symbol=""
        }
        if(!key.endsWith("_label")){
          if (searchForm[key]!=null) {
            if (typeof searchForm[key] == "object") {
              var d0 = searchForm[key][0];
              var d1 = searchForm[key][1];
              filter +=symbol+ key+"_begin" + "=" + _self.dateFormat(d0)
              filter +="&"+ key+"_end" + "=" + _self.dateFormat(d1)
            } else {
              filter += symbol+key + "=" + searchForm[key]
            }
          }
        }
      })
    }
   return filter
  },
  /**
   * 字符串是否存在于数组中
   * @param arr
   * @param str
   * @returns {boolean}
   */
  inArray: function (arr, str) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === str) {
        return true;
      }
    }
    return false;
  },
  //编辑
  editRow(row){
    row.edit=true;
  },
  //双击单元格事件--编辑
  editTableRow(row, column, cell, event){
    commonUtils.editRow(row)
  },
  /**
   * 获取需要保存的数据
   * @param fields //需要保存到后台字段(数组)
   * @param tableData//列表数据
   * @returns {Array}
   */
  getEnableToSave(fields,tableData){
    let tempData=[];
    for (let i=0;i<tableData.length;i++){
      if (tableData[i].edit){
        let tempRow={};
        for (let j=0;j<fields.length;j++){
          tempRow[fields[j]]=tableData[i][fields[j]]
        }
        tempRow.id=tableData[i].id;//主键必须是id
        tempData.push(tempRow)
      }
    }
    return tempData;
  },
  setTableDataDefaultEdit(tableData,_self){
    //给edit附默认值
    return tableData.map(v => {
      _self.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
      return v
    });
  },
  /**
   * 获取数据的ids 字符串
   * @param data
   * @returns {string}
   */
  getTableDataIds(data){
      return (commonUtils.getTableDataIdsArr(data)).toString()
  },
  /**
   * 获取数据的ids 数组
   * @param data
   * @returns {Array}
   */
  getTableDataIdsArr(data){
    let ids = [];
    for (let i = 0; i < data.length; i++) {
      ids.push(data[i].id)
    }
    return ids
  },
  /**
   * 普通消息或者提示
   * 例如:请至少选择两条数据
   * @param message
   */
  message(message){
    Message(
      {
        showClose: true,
        message: message,
      }
    )
  },
  /**
   * 重大错误；这个错误必须让用户知道，用户自己关掉提示
   * 例如: XXX操作异常，请联系管理员。
   * @param message
   */
  error(message){
    Message({
      showClose: true,
      duration: 0,
      message: message,
      type: 'error'
    });
  },
  getUserInfo(){
    // if (localStorage.getItem("userInfo")){
    //   return JSON.parse(localStorage.getItem("userInfo"));
    // }else {
    //   return null
    // }
  },
  setUserInfo(userInfo){
    // localStorage.setItem("userInfo",JSON.stringify(userInfo));
  },
  clearUserInfo(){
    localStorage.removeItem("jwt");
    localStorage.removeItem("realname");
  },
  formatMoney(row, column, value, index) {
   return commonUtils.formatMoneyNormal(value)
  },
  formatMoneyNormal(value){
    if (value && !isNaN(value)) {
      value = parseFloat(value);
      if (value > 999 || value < 0) {
        value = value.toLocaleString();
      }
    }
    return value;
  },
  /**
   * 实现tr选中改变样式(背景颜色)功能
   * @param event
   * @deprecated
   */
  toggleSelectTrStyle1(event){
    let style='background-color:red'
    let attr=event.currentTarget.getAttribute('style')
    if (attr===style) {
      event.currentTarget.removeAttribute('style')
    }else{
      event.currentTarget.setAttribute('style',style)
    }
  },
  /**
   * 实现tr选中改变样功能（选中数据发生变化时执行）
   * @todo 待优化，可能会影响性能
   * @param _self
   */
  toggleSelectTrStyle(_self){
    _self.$nextTick(() => {
      //先移除已选中的数据
      let allTr=document.querySelectorAll("tr.map-selected-tr")
      allTr.forEach(function (ele) {
        ele.classList.remove("map-selected-tr")
      })
      //重新遍历已选中的数据
      let allSelect=document.querySelectorAll("label.is-checked")
      allSelect.forEach(function (ele) {
        ele.parentNode.parentNode.parentNode.classList.add("map-selected-tr")
      })
    });
  },
  /**
   *获取x年x月x日
   * @param str 例如 2019-10-29 18:07:10
   * @returns {string|null} 2019年10月29日
   */
  getYMD(str){
    if (str==null) {return null}
    const date = new Date(str.replace(/-/g, '/'));
    const Y = date.getFullYear() ;
    const M = date.getMonth();
    const D = date.getDate();
    return Y+"年"+M+"月"+D+"日"
  }  ,
  /**
   * 日期格式化
   * @param today
   * 返回格式 YYYY-MM-DD hh:mm:ss
   */
  getYMDHMS(today){
    var month = today.getMonth() + 1;
    month = month < 10 ? '0'+month : month;
    var day = today.getDate() < 10 ? '0'+today.getDate() : today.getDate();
    var hours = today.getHours() < 10 ? '0'+today.getHours() : today.getHours();
    var mins = today.getMinutes() < 10 ? '0'+today.getMinutes() : today.getMinutes();
    var secs = today.getSeconds() < 10 ? '0'+today.getSeconds() : today.getSeconds();
    var now1 = today.getFullYear() + '-' + month + '-' + day + " " + hours + ":" + mins + ":" + secs ;
    return now1
  },
  //用于生成uuid
  /**
   * @return {string}
   */
  S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  },
  /**
   * 生成uuid
   * @returns {string}
   */
  uuid() {
    return (commonUtils.S4() + commonUtils.S4() + commonUtils.S4() + commonUtils.S4() + commonUtils.S4() + commonUtils.S4() + commonUtils.S4() + commonUtils.S4() + "");
  },
  /**
   * 预留:
   * @returns {number}
   */
  getPageSize(){
    return 5
  },
  formatDateNormal(str) {
    if (commonUtils.isStrIsNull(str)){
      return str
    }
    var date = new Date(str).toJSON();
    return new Date(+new Date(date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
  },
  /**
   * 格式化时间
   * @param row
   * @param column
   * @param value
   * @param index
   * @returns {*|string}
   */
  formatDate(row, column, value, index) {
    return commonUtils.formatDateNormal(value)
  },


  /**
   * 排序20200403 liukp
   * @param array 需要排序的对象
   * @param key  排序的字段属性
   * @returns {*}
   */
  sortKey(array, key) {
    return array.sort(function(a, b) {
      var x = a[key];
      var y = b[key];
      return x > y ? -1 : x < y ? 1 : 0;
    });
  },
  /**
   * 生成带有前缀以及token的url
   * 例如：/jspeed/sysAttach/doDownLoadFile?id=xxx&token=xxx
   * @param url
   * @returns {*}
   */
  buildTokenUrl(url){
    return request.api_pre + url+"&token="+userInfo.getJwt()
  }
};
export default commonUtils;
