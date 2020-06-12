<template>
  <div :style="{height: '300px'}">
    <quill-editor class="editor"
                  v-model="newValue"
                  ref="myQuillEditor"
                  :options="editorOption"
                  @change="onEditorChange($event)"
                  @ready="onEditorReady($event)"
                  max-height="300px"
                  height="300px">
    </quill-editor>
  </div>
</template>
<script>

  export default {
    props: {
      // placeholder
      placeholder: {
        type: String,
        default: ''
      },
      // 是否可编辑 true表示可编辑， false表示禁用
      disabled: {
        type: Boolean,
        default: true
      },
      // 富文本内容
      content: {
        type: String,
        default: null
      }
    },
    data() {
      return {
        editorOption: {
          placeholder: this.placeholder,
        },

        newValue: null,
      };
    },
    methods: {
      //内容改变事件
      onEditorChange({editor, html, text}) {

      },

      // 富文本准备时的事件
      onEditorReady() {

      },
    },

    mounted() {
      this.newValue = null;
      this.newValue = this.content;
    },

    watch: {
      newValue: function (val) {
        this.$emit('update:content', val)
      },

      content: function (val) {
        this.newValue = val;
      },

      disabled: function (val) {
        // 控制富文本禁用
        this.$refs.myQuillEditor.quill.enable(val);
      },
    }
  }
</script>

<style>

  /*这里可以自定义样式以及安放的位置*/
  .quill-editor {
    height: 270px;
  }

  p {
    margin: 10px;
  }


  .ql-snow .ql-picker.ql-size .ql-picker-label::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: "14px";
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
    content: "10px";
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
    content: "18px";
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
    content: "32px";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: "文本";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: "标题1";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: "标题2";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: "标题3";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: "标题4";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: "标题5";
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: "标题6";
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item::before {
    content: "标准字体";
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
    content: "衬线字体";
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
    content: "等宽字体";
  }

</style>
