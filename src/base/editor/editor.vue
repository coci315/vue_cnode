    <template>
        <div id="editor">
            <mavon-editor style="height: 100%"
                          default_open="edit"
                          placeholder="说点什么吧..."
                          :toolbars="toolbars"
                          :value="value"
                          @change="passChange"
            ></mavon-editor>
        </div>
    </template>
    <script>
    // Local Registration
    import { mavonEditor } from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'
    export default {
      props: {
        value: {
          type: String,
          default: ''
        }
      },
      name: 'editor',
      components: {
        mavonEditor
            // or 'mavon-editor': mavonEditor
      },
      data () {
        return {
          toolbars: {
            bold: true, // 粗体
            italic: true, // 斜体
            header: false, // 标题
            underline: false, // 下划线
            strikethrough: false, // 中划线
            mark: false, // 标记
            superscript: false, // 上角标
            subscript: false, // 下角标
            quote: true, // 引用
            ol: true, // 有序列表
            ul: true, // 无序列表
            link: true, // 链接
            imagelink: true, // 图片链接
            code: true, // code
            table: false, // 表格
            subfield: true, // 是否需要分栏
            fullscreen: false, // 全屏编辑
            readmodel: false, // 沉浸式阅读
            htmlcode: false, // 展示html源码
            help: false, // 帮助
      /* 1.3.5 */
            undo: false, // 上一步
            redo: false, // 下一步
            trash: false, // 清空
            save: false, // 保存（触发events中的save事件）
      /* 1.4.2 */
            navigation: false, // 导航目录
      /* 2.1.8 */
            alignleft: false, // 左对齐
            aligncenter: false, // 居中
            alignright: false // 右对齐
          }
        }
      },
      methods: {
        passChange (value, render) {
          this.$emit('change', value, render)
        }
      }
    }
    </script>
    <style>
    #editor {
        width: 100%;
        height: 100%;
    }
    </style>
