<template>
  <div class="sp-box-layout">
    <h1>프로젝트 카드 컴포넌트 #9 (완료)</h1>
    <div class="sp-project-wrapper">
      <project
        v-for="{
          id,
          ownerName,
          title,
          isNew,
          isOwner,
          tags,
          clustersNum,
          membersNum,
          authority,
          createdAt,
        } in project"
        :key="id"
        :id="id"
        :ownerName="ownerName"
        :isNew="isNew"
        :isOwner="isOwner"
        :title="title"
        :tags="tags"
        :clustersNum="clustersNum"
        :membersNum="membersNum"
        :authority="authority"
        :createdAt="createdAt"
      />
    </div>
    <div class="form-layout__description">
      <div>이벤트</div>

      <br />
      <br />
      <div>값</div>

      <br />
      <br />
    </div>
    <h1>빈 목록 카드 컴포넌트 #15 (완료)</h1>
    <empty
      title="Member가 존재하지 않습니다."
      description="Member를 추가하려면 Add Member 버튼을 클릭하시기 바랍니다."
    />
    <div class="form-layout__description">
      <div>이벤트</div>

      <br />
      <br />
      <div>값</div>

      <br />
      <br />
    </div>
    <h1>자원 현황 박스 (완료)</h1>
    <resource-box
      class="form-layout__resource-box"
      title="Master"
      value="1"
      outlined
      width="160px"
      minHeight="0"
      height="142px"
      elevation="0"
    ></resource-box>
    <div class="form-layout__description">
      <div>이벤트</div>

      <br />
      <br />
      <div>값</div>

      <br />
      <br />
    </div>
    <h1>클러스터 애드온 박스 (22.03.29 추가요청)</h1>
    <div class="addon-box-wrapper">
      <addon-box
        width="300px"
        height="400px"
        v-for="(data, idx) in addon"
        :key="idx"
        :addonData="data"
        class="addon-box"
      ></addon-box>
    </div>
    <div class="form-layout__description">
      <div>이벤트</div>

      <br />
      <br />
      <div>값</div>

      <br />
      <br />
    </div>
  </div>
</template>

<script>
import Project from '@/components/Project.vue'
import Empty from '@/components/Empty.vue'
import ResourceBox from '@/components/molcule/ResourceBox.vue'
import ProjectData from '@/assets/data/project'
import AddonBox from '@/components/ClusterAddonCard.vue'
import addonData from '@/assets/data/clusterAddon'
// const tags = '[BoxLayout]'

export default {
  components: { Project, Empty, ResourceBox, AddonBox },
  data() {
    return {
      project: ProjectData,
      addon: addonData,
    }
  },
  methods: {},
}
</script>
<style lang="scss">
$this: 'form-layout';
.sp-box-layout {
  width: 100%;
  .sp-project-wrapper {
    display: flex;
    flex-wrap: wrap;
  }
  .#{$this}__resource-box {
    .card-body {
      height: 100%;
    }
  }
  .addon-box-wrapper {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 10px;
    .addon-box {
      margin-right: 10px;
    }
  }
}
</style>
