# js系统和业务常量

## 文件说明

* `src/constant/common.js` 存放一些公共常量和系统常量
* `src/constant/index.js` 为常量入口，所有常量文件在此引入
* `src/constant/xxxx.js` 业务常量，例如xykc.js,每个模块都需要有一个常量文件；然后引入到index.js

## 使用

vue文件中直接通过 `this.constant.xxx.XXX 调用;例如：

```javascript
  this.constant.xykc.MAP_XYKC_KSTJSQD_SHSTATE_SQYSHTH;
```
