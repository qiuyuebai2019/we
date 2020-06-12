// import './FileSaver'
import saveAs from './FileSaver';
const  html2word=function(fileName) {
    fileName = typeof fileName !== 'undefined' ? fileName : "jQuery-Word-Export";
    var statics = {
        mhtml: {
            top: '<!--Mime-Version: 1.0\n' +
              'Content-Base: ' + location.href + '\n' +
              'Content-Type: Multipart/related; boundary="NEXT.ITEM-BOUNDARY";type="text/html"\n' +
              '\n' +
              '--NEXT.ITEM-BOUNDARY\n' +
              'Content-Type: text/html; charset="utf-8"\n' +
              'Content-Location: ' + location.href + '\n' +
              '\n' +
              '-->\n<!DOCTYPE html>\n<html>\n_html_' +
              '</html>\n' +
              '<!--\n'+
              '--NEXT.ITEM-BOUNDARY--\n'+
              '-->',
            head:'<head>\n' +
              '<meta http-equiv=Content-Type content="text/html; charset=utf-8">\n' +
              '<meta name=Generator content="Microsoft Word 15 (filtered)">\n' +
              '<style>\n' +
              '_styles_' +
              '</style>\n' +
              '</head>',
            body: '<body>_body_</body>'
        }
    };
    var options = {
        maxWidth: 624
    };
    var word_element=document.getElementsByClassName("map-print-wrap")[0];
    var styles = "body, h1, h2, h3, h4, h5, h6, hr, p, blockquote, dl, dt, dd, ul, ol, li, pre, form, fieldset, legend, button, input, textarea, th, td { margin:0; padding:0; }\n" +
      "body, button, input, select, textarea { font:14px/1.5 \"Microsoft YaHei\", tahoma, arial, \\5b8b\\4f53; }\n" +
      "h1, h2, h3, h4, h5, h6{ font-size:100%; }\n" +
      "address, cite, dfn, em, var { font-style:normal; }\n" +
      "code, kbd, pre, samp { font-family:couriernew, courier, monospace; }\n" +
      "small{ font-size:12px; }\n" +
      "ul, ol { list-style:none; }\n" +
      "a { text-decoration:none; color: inherit;}\n" +
      "a:hover { text-decoration:none;}\n" +
      "sup { vertical-align:text-top; }\n" +
      "sub{ vertical-align:text-bottom; }\n" +
      "legend { color:#000; }\n" +
      "fieldset, img { border:0; }\n" +
      "button, input, select, textarea { font-size:100%; }\n" +
      "table { border-collapse:collapse; border-spacing:0; }\n" +
      ".container{min-width: 768px;}\n" +
      "body,html{height: 100%;}\n" +
      "\n" +
      ".text-align-left{\n" +
      "  text-align: left;\n" +
      "}\n" +
      ".text-align-right{\n" +
      "  text-align: right;\n" +
      "}\n" +
      ".text-align-center{\n" +
      "  text-align: center;\n" +
      "}\n" +
      "/**打印\n" +
      " */\n" +
      "\n" +
      "/**\n" +
      "常用字体\n" +
      "一级标题 方正小标宋_GBK 小一 33\n" +
      "副标题  方正小标宋_GBK 二号 30\n" +
      "二级标题 方正黑体_GBK 三号 16\n" +
      " */\n" +
      ".map-print{\n" +
      "  font-family: \"FangSong_GB2312\",\"仿宋_GB2312\",\"宋体\", \"Microsoft YaHei\", \"微软雅黑\", Arial, sans-serif;\n" +
      "  font-size:16px;\n" +
      "  color: #000;\n" +
      "  /*padding:70px 90px;*/\n" +
      "}\n" +
      ".map-print-wrap{\n" +
      "  width: 562px;\n" +
      "  margin: 0 auto;\n" +
      "}\n" +
      ".map-print{\n" +
      "\n" +
      "}\n" +
      ".map-print h1{\n" +
      "  font-family: \"方正小标宋_GBK\", serif;\n" +
      "  font-size: 33px;\n" +
      "}\n" +
      "@media print{\n" +
      "\n" +
      "  .map-print h1{\n" +
      "    /*margin-bottom:  45px;*/\n" +
      "  }\n" +
      "  .no-print{\n" +
      "    display: none !important;\n" +
      "  }\n" +
      "\n" +
      "  @page {\n" +
      "    margin: 25.4mm 31.8mm;\n" +
      "  }\n" +
      "\n" +
      "}\n" +
      "\n" +
      ".map-print h2{\n" +
      "  font-family: \"方正黑体_GBK\", serif;\n" +
      "  font-size: 21px;\n" +
      "}\n" +
      ".map-print h3{\n" +
      "  font-family: \"方正楷体_GBK\",serif;\n" +
      "  font-size: 18px;\n" +
      "}\n" +
      ".map-print p{\n" +
      "  text-indent:30px\n" +
      "}\n" +
      ".map-print-table{border-collapse:collapse;border-right:1px solid #000;border-bottom:1px solid #000;width: 100%}\n" +
      ".map-print-table td,.map-print-table th{border-left:1px solid #000;border-top:1px solid #000;" +
      "border-collapse:collapse;}\n" +
      ".map-print-table{\n" +
      "  line-height: 18px;\n" +
      "  font-size: 12px;\n" +
      "}\n" +
      ".map-to-next-page{\n" +
      "   mso-special-character:line-break;page-break-before:always\n" +
      "}\n" +
      ".map-word-next-page{\n" +
      "   mso-special-character:line-break;page-break-before:always\n" +
      "}\n" +
      "#printIframe{\n" +
      "  height: 0;\n" +
      "}\n" +
      "\n" +
      "\n";

    // Aggregate parts of the file together
    //表格兼容wps
    var word_table_element=word_element.getElementsByTagName("table")
    for (let i=0;i<word_table_element.length;i++ ){
      word_table_element[i].setAttribute("style","border-collapse:collapse");
      word_table_element[i].setAttribute("cellspacing",0)
      word_table_element[i].setAttribute("cellpadding",0)
    }
   var needRemove= word_element.getElementsByClassName("no-word")
    for (let i=0;i<needRemove.length;i++){
      needRemove[i].remove()
    }
    var word_html=word_element.innerHTML
    //实现分页，兼容谷歌浏览器
    word_html=word_html.replace(/word-page-break=""/g,'style="mso-special-character:line-break;page-break-before:always"')
    word_html=word_html.replace(/word-page-break/g,'style="mso-special-character:line-break;page-break-before:always"')
    var fileContent = statics.mhtml.top.replace("_html_", statics.mhtml.head.replace("_styles_", styles) + statics.mhtml.body.replace("_body_", word_html));

    // Create a Blob with the file contents
    var blob = new Blob([fileContent], {
        type: "application/msword;charset=utf-8"
    });
    saveAs(blob, fileName + ".doc");
    //谷歌浏览器可以不是用FileSaver（但是href的长度有限，所以还是使用FileSaver吧）
  // var element = document.createElement('a');
  // element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContent));
  // element.setAttribute('download', fileName + ".doc");
  // element.style.display = 'none';
  // document.body.appendChild(element);
  // element.click();
  // document.body.removeChild(element);
}

export default html2word;
