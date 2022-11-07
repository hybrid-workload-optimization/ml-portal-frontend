<template>
  <div class="sp-editor">
    <div class="sp-editor__code-box">
      <codemirror
        v-model="content2"
        :options="editorOptions"
        :mode="editMode === 'json' ? 'application/json' : 'text/x-yaml'"
        @ready="onCmReady"
        @focus="onCmFocus"
      />
    </div>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'codemirror/lib/codemirror.css'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'codemirror/theme/eclipse.css'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'codemirror/mode/yaml/yaml'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'codemirror/mode/javascript/javascript'

export default {
  components: {
    codemirror,
  },
  props: {
    editMode: {
      type: String,
      default: 'text/x-yaml',
      description:
        '에디터에 적용할 언어 선택. 기본값 yaml 적용 "json"을 입력시 json 에디터 기능 적용',
    },
    content: {
      type: String,
      default: '',
      description: '에디터에 세팅할 문자열',
    },
    readonly: {
      type: Boolean,
      default: false,
      description: '에디터 읽기전용 모드 설정',
    },
  },
  data() {
    return {
      lazyContent: this.content,
      editorOptions: {
        tabSize: 1,
        theme: 'eclipse',
        lineNumbers: true,
        line: true,
        indentWithTabs: false,
        lineWrapping: true,
        readOnly: this.readonly,
      },
    }
  },

  computed: {
    content2: {
      get() {
        return this.lazyContent
      },
      set(value) {
        this.lazyContent = value
        this.$emit('input', value)
      },
    },
  },
  watch: {
    content(value) {
      this.lazyContent = value
    },
  },
  methods: {
    editorInit(edit) {
      console.log(edit)
    },
    onCmReady(cm) {
      // console.log('the editor is ready!', cm)
      cm.setSize('100%', '400px')

      // if (this.content && this.content.length > 0) {
      //   cm.setSize('100%', '100%')
      // }
    },
    onCmFocus(cm) {
      // console.log('the editor is focused!', cm)
      cm.setSize('100%', '400px')
      // if (this.content && this.content.length > 0) {
      //   cm.setSize('100%', '100%')
      // }
    },
    // onEditorChange(newCode) {
    //   this.content = newCode
    //   this.$emit('input', this.content)
    // },
  },
}
</script>

<style lang="scss">
.CodeMirror {
  height: 400px;
}
.CodeMirror pre {
  white-space: pre-wrap;
  word-break: break-all;
  word-wrap: break-word;
}

.sp-card {
}
</style>
