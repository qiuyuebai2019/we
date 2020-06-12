/**
 * 公共常量
 * @type {{}}
 */
const constant={
  title:'官网',
  //versionStr:'版权所有：中国电力科学研究院有限公司 地址：北京市海淀区清河小营东路15号',
  // title:'这是一个很厉害很牛很宽广的大系统',
   versionStr:'版权所有：XXXXXX有限公司',
  /**是否-应用于整个系统**/
  SF_YN_Y:"Y",//是
  SF_YN_N:"N",//否

  sfjl:'N',//是否是吉林演示系统20200330 liukp
  //CONFIG
  TABLE_INDEX_WIDTH:'60',//表格序号

  ISC_EXT_ID:"402880e96ce17120016ce18d34f20015",//组织内部机构定义ID  MAP的根节点单位id
  ISC_YWDEPT_ID:"ff8080816c849153016c84ee8f1f0064",//isc 的根节点单位 业务组织id
  ISC_BASEORG_ID:"",//isc 的根节点单位 基准组织id

  /**
   * 文件常用后缀名
   */
  IMAGE:".bmp,.jpg,.jpeg,.png,.gif,.psd",//图片文件后缀名
  PDF:".pdf,",//pdf文件
  EXCEL:".xlsx,.xls,",//excel文件
  WORD:".docx,.doc,",//word文件
  PPT:".ppt,.pptm,.pptx,",//ppt文件
  APK:'.apk',//android app文件
  BIN:'.bin',//标签固件文件

  ZIP:".zip,.rar,.7z,.tar,.wim,",//压缩文件
  VIDEO:".mp4,.avi,",//视频文件
  AUDIO:".mp3,.wav,",//音频文件
  OTHER_FILE:".vsd,",//其他文件



  CHECK_JE_YUAN:999999999999.99,//金额元最大数
  CHECK_JE_WAN_YUAN:99999999.999999,//金额万元最大数
  CHECK_DJ_YUAN:99999999.99999999,//单价元最大数
}
export default constant;
