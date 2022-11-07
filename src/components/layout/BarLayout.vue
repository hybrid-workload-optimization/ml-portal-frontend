<template>
  <div class="sp-bar-layout">
    <h1>멀티 셀렉트 컴포넌트 #6 (완료)</h1>
    <multi-select selectCount="2" />
    <div class="form-layout__description">
      <div>이벤트</div>
      - onChangeFirstSelect : 첫 번째 셀렉트 이벤트 (선택시)
      <br />
      - onChangeSecondSelect : 두 번째 셀렉트 이벤트 (선택시)
      <br />
      - onChangeThirdSelect : 세 번째 셀렉트 이벤트 (선택시)
      <br />
      - onClickNewDeployment : 새로운 배포 추가 이벤트
      <br />
      <br />
      <div>값</div>
      - firstSelectValue : 첫 번째 선택된 셀렉트 값
      <br />
      - secondSelectValue : 두 번째 선택된 셀렉트 값
      <br />
      - thirdSelectValue : 세 번째 선택된 셀렉트 값
      <br />
      <br />
      <div>셀렉트 전체 데이터 값들</div>
      - selectsFirst : 첫 번째 셀렉트 값들
      <br />
      - selectsSecond : 두 번째 셀렉트 값들
      <br />
      - selectsThird : 세 번째 셀렉트 값들
      <br />
      <br />
      Props
      <br />
      - selectCount : 셀렉트 갯수 값
    </div>

    <h1>클러스터 목록 상단 컴포넌트 #13 (완료)</h1>
    <search
      class="sp-cluster-search"
      todo-count="10"
      title="Cluster"
      :search="clusterSearch"
      @change="onChangeClusterSearch"
    >
      <template v-slot:extend>
        <sp-button
          @click="onClickSortData"
          icon
          class="cluster-search__arrange-button"
        >
          <v-icon>unfold_more</v-icon>
        </sp-button>
      </template>
    </search>
    <div class="form-layout__description">
      <div>이벤트</div>
      - onChangeClusterSearch : 클러스터 검색 이벤트 (입력시)
      <br />
      - onClickSortData : 클러스터 정렬 이벤트
      <br />
      <br />
      <div>값</div>
      - clusterSearch : 클러스터 검색 값
      <br />
    </div>

    <h1>기본 카드 화면 상단 컴포넌트 #8 (완료)</h1>
    <search
      button-text="New Project"
      title="Project"
      @click="onClickNew"
      @change="onChangeMultiSearch"
      :search-chips="multiSearch"
      :multi-data="multiData"
      multiple
      todo-count="10"
    />
    <search
      class="sp-basic-search"
      button-text="New Cluster"
      title="Cluster"
      @click="onClickNew"
      @change="onChangeMultiSearch"
      :search="clusterSearch"
      todo-count="10"
    >
      <template v-slot:btn-group>
        <v-btn-toggle
          slot="btn-group"
          v-model="toggleIdx"
          rounded
          mandatory
          dense
          class="sp-basic-toggle-button"
        >
          <sp-button class="sp-basic-toggle--click" @click="onClickToggle(0)">
            <v-icon class="icon__list-bullet">format_list_bulleted</v-icon>
          </sp-button>
          <sp-button class="sp-basic-toggle--click" @click="onClickToggle(1)">
            <v-icon class="icon__web-asset">web_asset</v-icon>
          </sp-button>
        </v-btn-toggle></template
      >
    </search>
    <div class="form-layout__description">
      <div>이벤트</div>
      - onClickNew : 새로운 프로젝트 추가 이벤트
      <br />
      - onChangeMultiSearch: 다중 검색 이벤트 (입력시)
      <br />
      <br />
      <div>값</div>
      - multiSearch : 다중 검색 값
      <br />
      - multiData : 다중 검색 데이터
      <br />
    </div>

    <h1>프로젝트 카드 상단 기본정보 컴포넌트 #13 (완료)</h1>
    <detail-title
      :titleData="detailTitleData"
      @click-edit="onClickEdit"
      @click-delete="onClickDelete"
    >
      <template #additional-buttons>
        <sp-button outlined class="console-button">Console</sp-button>
        <sp-button outlined class="log-button">Log</sp-button>
      </template>
    </detail-title>
    <div class="form-layout__description">
      <div>이벤트</div>
      - onClickEdit : 수정 버튼 클릭 이벤트
      <br />
      - onClickDelete: 삭제 버튼 클릭 이벤트
      <br />
      <br />
      <div>값</div>
      - detailTitleData : 프로젝트 상세 정보
    </div>
  </div>
</template>

<script>
import MultiSelect from '@/components/MultiSelect.vue'
import Search from '@/components/molcule/DataTableSearch.vue'
import DetailTitle from '@/components/molcule/CardTitleWithDetail.vue'
import { titleData } from '@/assets/data/TitleData'

const tag = '[BarLayout]'

export default {
  props: {},
  components: {
    MultiSelect,
    Search,
    DetailTitle,
  },
  data() {
    return {
      toggleIdx: 0,
      detailTitleData: titleData.CardTitleWithDetail,
      clusterSearch: '',
      multiSearch: [],
      multiData: [
        {
          text: '전체',
          value: 'all',
        },
        {
          text: '안녕',
          value: 'hi',
        },
      ],
    }
  },
  methods: {
    onClickNew() {
      console.log(tag, 'onClickNew')
      alert('onClickNew')
    },
    onClickEdit() {
      console.log(tag, '수정 버튼 클릭')
    },
    onClickDelete() {
      console.log(tag, '삭제 버튼 클릭')
    },
    onChangeClusterSearch(value) {
      console.log(tag, 'onChangeClusterSearch')
      this.clusterSearch = value
    },
    onChangeMultiSearch(value) {
      console.log(tag, value, 'onChangeMultiSearch')
      this.multiSearch = value
    },
    onClickSortData() {
      console.log(tag, 'onClickSortData')
    },
    onClickToggle(toggleIndex) {
      console.log(tag, 'onClickToggle')
      this.toggleIdx = toggleIndex
    },
  },
}
</script>
<style lang="scss">
@import '@/styles/_mixin.scss';
.sp-bar-layout {
  width: 100%;
  .console-button,
  .log-button {
    border-width: thin;
    font-weight: bold;
  }
  .log-button {
    margin-left: 10px;
    margin-right: 20px;
  }
  .sp-cluster-search {
    .cluster-search__arrange-button {
      .v-icon {
        @include set-text(normal, 20, rgba($color: #000, $alpha: 0.2));
      }
    }
  }
  .sp-basic-search {
    .sp-basic-toggle-button {
      padding-right: 10px;
      .sp-basic-toggle--click {
        background-color: #f5f8fbcc;
        border: 1px solid rgba($color: #4b556680, $alpha: 1);
        &.v-item--active {
          background-color: $sp-teriary;
          .v-icon {
            @include set-text(normal, 20, rgba($color: #fff, $alpha: 0.2));
            color: #fff !important;
          }
        }

        .v-icon {
          @include set-text(
            normal,
            20,
            rgba($color: $sp-box-border, $alpha: 1)
          );
          color: $sp-sky-blue-500 !important;
        }
      }
    }
    .search-wrapper {
      width: 40%;
      @include desktop-small {
        width: 60%;
      }
    }
  }
}
</style>
