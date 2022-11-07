<template>
  <v-breadcrumbs
    class="sp-breadcrumb"
    :class="{ ...className }"
    :dark="dark"
    :divider="divider"
    :items="items"
    :large="large"
    :light="light"
  >
    <template v-slot:default>
      <slot name="default"></slot>
    </template>
    <template v-slot:divider>
      <slot name="divider"></slot>
    </template>
    <template v-slot:item="{ item }">
      <slot name="item" :item="item"> </slot>
    </template>
  </v-breadcrumbs>
</template>

<script>
export default {
  props: {
    /*
     @brief 클래스 이름 값 할당
     @date 2021/11/04
     @example
     {
       클래스 이름 : {
         타입: '',
         필수유무: Boolean
         디폴트: 값
       }
     }
    */
    className: {
      type: Object,
      description: '클래스 이름 값 할당',
      isActive: {
        type: Boolean,
        description: '액티브 유무',
      },
    },
    dark: {
      type: Boolean,
      default: false,
      description: '구성 요소에 어두운 테마 변형을 적용',
    },
    divider: {
      type: String,
      default: '/',
      description: '항목 간의 구분 문자를 지정',
    },
    items: {
      type: Array,
      default() {
        return []
      },
      description:
        '객체의 배열 또는 문자열의 배열이 될 수 있습니다. 개체를 사용할 때 텍스트, 값 및 비활성화된 키를 찾습니다.',
    },
    large: {
      type: Boolean,
      default: false,
      description: '구성요소 large 사이즈',
    },
    light: {
      type: Boolean,
      default: false,
      description: '구성 요소에 밝은 테마 변형을 적용',
    },
  },
}
</script>

<style lang="scss" scoped></style>
<style lang="scss"></style>
