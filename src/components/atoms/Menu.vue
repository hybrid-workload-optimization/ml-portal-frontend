<template>
  <v-menu
    class="menu"
    :class="{ ...className }"
    :absolute="absolute"
    :activator="activator"
    :allow-overflow="allowOverflow"
    :attach="attach"
    :auto="auto"
    :bottom="bottom"
    :close-delay="closeDelay"
    :close-on-click="closeOnClick"
    :close-on-content-click="closeOnContentClick"
    :content-class="contentClass"
    :dark="dark"
    :disable-keys="disableKeys"
    :disabled="disabled"
    :eager="eager"
    :internal-activator="internalActivator"
    :left="left"
    :light="light"
    :max-height="maxHeigth"
    :max-width="maxWidth"
    :min-height="minHeigth"
    :min-width="minWidth"
    :nudge-bottom="nudgeBottom"
    :nudge-left="nudgeLeft"
    :nudge-right="nudgeRight"
    :nudge-top="nudgeTop"
    :nudge-width="nudgeWidth"
    :offset-overflow="offsetOverflow"
    :offset-x="offsetX"
    :offset-y="offsetY"
    :open-delay="openDelay"
    :open-on-click="openOnClick"
    :open-on-focus="openOnFocus"
    :open-on-hover="openOnHover"
    :origin="origin"
    :position-x="positionX"
    :position-y="positionY"
    :return-value="returnValue"
    :right="right"
    :rounded="rounded"
    :tile="tile"
    :top="top"
    :transition="transition"
    :value="value"
    :z-index="zIndex"
    @input="onChangeMenu"
  >
    <template v-slot:default>
      <slot name="default"></slot>
    </template>
    <template v-slot:activator="item">
      <slot name="item" :item="item"> </slot>
    </template>
  </v-menu>
</template>

<script>
const tag = '[Buttons]'

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
    absolute: {
      type: Boolean,
      default: false,
      description: '구성 요소에 위치: absolute 를 적용',
    },
    activator: {
      default: undefined,
      description:
        '액티베이터 슬롯을 사용하지 않는 경우 사용자 지정 액티베이터를 지정합니다. String은 모든 유효한 querySelector가 될 수 있고 Object는 모든 유효한 Node가 될 수 있습니다.',
    },
    allowOverflow: {
      type: Boolean,
      default: false,
      description: '콘텐츠에 대한 오버플로 재배치 제거',
    },
    attach: {
      default: false,
      description: '이 구성 요소가 분리되어야 하는 DOM 요소를 지정',
    },
    auto: {
      type: Boolean,
      default: false,
      description: '선택한 요소의 중앙 목록',
    },
    bottom: {
      type: Boolean,
      default: false,
      description: '구성요소를 아래쪽으로 정렬',
    },
    closeDelay: {
      type: [String, Number],
      default: 0,
      description:
        '구성 요소를 닫기 전에 대기할 밀리초입니다. 호버 열기에서만 작동 됨.',
    },
    closeOnClick: {
      type: Boolean,
      default: true,
      description: '외부 활성기 클릭 시 메뉴를 닫아야 하는지 지정',
    },
    closeOnContentClick: {
      type: Boolean,
      default: true,
      description: '콘텐츠를 클릭할 때 메뉴를 닫아야 하는지 여부를 지정.',
    },
    contentClass: {
      type: String,
      default: undefined,
      description: '분리된 요소에 사용자 정의 클래스를 적용.',
    },
    dark: {
      type: Boolean,
      default: false,
      description: '구성 요소에 어두운 테마 변형을 적용',
    },
    disableKeys: {
      type: Boolean,
      default: false,
      description: '모든 키보드 상호 작용 제거',
    },
    disabled: {
      type: Boolean,
      default: false,
      description: '메뉴 비활성화',
    },
    eager: {
      type: Boolean,
      default: false,
      description: '마운트 시 구성 요소 콘텐츠를 강제로 렌더링',
    },
    internalActivator: {
      type: Boolean,
      default: false,
      description: '구성 요소 내부의 메뉴 콘텐츠를 분리',
    },
    left: {
      type: Boolean,
      default: false,
      description:
        '구성요소를 왼쪽으로 정렬, This should be used with the absolute or fixed props.',
    },
    light: {
      type: Boolean,
      default: false,
      description: '구성 요소에 밝은 테마 변형을 적용',
    },
    maxHeigth: {
      type: [String, Number],
      default: undefined,
      description: '구성요소의 최대 높이를 설정',
    },
    maxWidth: {
      type: [String, Number],
      default: undefined,
      description: '구성요소의 최대 가로를 설정',
    },
    minHeigth: {
      type: [String, Number],
      default: undefined,
      description: '구성요소의 최소 높이를 설정',
    },
    minWidth: {
      type: [String, Number],
      default: undefined,
      description: '구성요소의 최소 가로를 설정',
    },
    nudgeBottom: {
      type: [String, Number],
      default: 0,
      description: '내용을 맨 아래로 이동',
    },
    nudgeLeft: {
      type: [String, Number],
      default: 0,
      description: '내용을 맨 왼쪽으로 이동',
    },
    nudgeRight: {
      type: [String, Number],
      default: 0,
      description: '내용을 맨 오른쪽으로 이동',
    },
    nudgeTop: {
      type: [String, Number],
      default: 0,
      description: '내용을 맨 위로 이동',
    },
    nudgeWidth: {
      type: [String, Number],
      default: 0,
      description: '내용 가로 길이',
    },
    offsetOverflow: {
      type: Boolean,
      default: false,
      description: '오버플로로 인해 재배치될 때 구성요소가 반대쪽으로 뒤집힘',
    },
    offsetX: {
      type: Boolean,
      default: false,
      description: 'x축에서 메뉴를 오프셋합니다. 왼쪽/오른쪽 방향과 함께 작동',
    },
    offsetY: {
      type: Boolean,
      default: false,
      description: 'y축에서 메뉴를 오프셋합니다. 왼쪽/오른쪽 방향과 함께 작동',
    },
    openDelay: {
      type: [String, Number],
      default: 0,
      description:
        '구성 요소를 열기 전에 대기하는 밀리초입니다. 호버 열기에서만 작동',
    },
    openOnClick: {
      type: Boolean,
      default: true,
      description: '액티베이터 클릭 시 메뉴를 열어야 하는지 여부를 지정',
    },
    openOnFocus: {
      type: Boolean,
      default: false,
      description: '',
    },
    openOnHover: {
      type: Boolean,
      default: false,
      description: '액티베이터 호버 시 메뉴를 열어야 하는지 여부를 지정',
    },
    origin: {
      type: String,
      default: 'top left',
      description: '요소의 전환 원점을 설정',
    },
    positionX: {
      type: Number,
      default: undefined,
      description:
        '액티베이터 슬롯을 사용하지 않을 때 콘텐츠의 위치를 ​​지정하는 데 사용',
    },
    positionY: {
      type: Number,
      default: undefined,
      description:
        '액티베이터 슬롯을 사용하지 않을 때 콘텐츠의 위치를 ​​지정하는 데 사용',
    },
    returnValue: {
      default: undefined,
      description: '메뉴가 닫힐 때 업데이트되는 값',
    },
    right: {
      type: Boolean,
      default: false,
      description:
        '구성요소를 오른쪽으로 정렬. This should be used with the absolute or fixed props.',
    },
    rounded: {
      type: Boolean,
      default: false,
      description: '입력에 테두리 반경을 추가',
    },
    tile: {
      type: Boolean,
      default: false,
      description: 'border-radius 속성 제거',
    },
    top: {
      type: Boolean,
      default: false,
      description: '콘텐츠를 위쪽으로 정렬',
    },
    transition: {
      type: [Boolean, String],
      description: '구성 요소 전환을 설정',
    },
    value: {
      default: undefined,
      description: '입력 값',
    },
    zIndex: {
      type: [Number, String],
      default: undefined,
      description: '구성 요소에 사용된 z-인덱스',
    },
  },
  methods: {
    /*  
        @brief onChange 이벤트 함수
        @date 2021/11/08
        @return 
        @param
          - event: EventTarget(이벤트 값)
    */
    onChangeMenu(event) {
      console.log(tag, 'onChangeMenu')
      this.$emit('change', event)
    },
  },
}
</script>

<style lang="scss" scoped></style>
<style lang="scss"></style>
