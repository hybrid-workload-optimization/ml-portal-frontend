<template>
  <div class="sp-editor-layout">
    <h1>에디터 컴포넌트 #22</h1>
    <div class="project-wrapper">
      <!-- mode='json' 추가 시 json 에디터로 사용 가능 -->
      <editor @input="onInputCode" />

      <sp-button class="sp-editor-layout__button" @click="translateIntoJson"
        >변환</sp-button
      >

      <p>Kind: {{ this.kind }}</p>
      <p>Label: {{ this.label.app }}</p>
    </div>
  </div>
</template>

<script>
import Editor from '@/components/Editor.vue'
import YAML from 'yamljs'

export default {
  components: {
    Editor,
  },
  data: () => ({
    content: '',
    kind: '',
    label: '',
  }),
  methods: {
    translateIntoJson() {
      const nativeObject = YAML.parse(this.content)
      const jsonString = JSON.stringify(nativeObject)
      const result = JSON.parse(jsonString)
      console.log('Raw JSON - ', jsonString)
      console.log('변환된 json 형식 - ', result)
      this.kind = result.kind
      this.label = result.metadata.labels
    },
    loadJsonToYaml() {
      const rawJson = JSON.parse(this.jsonData)
      const yamlString = YAML.stringify(rawJson)
      this.content = yamlString
    },
    onInputCode(newCode) {
      this.content = newCode
    },
  },
}
</script>

<style lang="scss" scoped>
.sp-editor-layout {
  width: 100%;
  .project-wrapper {
    border: 1px solid blue;
    $this: 'sp-editor-layout';

    .#{$this}__button {
      margin-top: 30px;
    }
  }
}
</style>
