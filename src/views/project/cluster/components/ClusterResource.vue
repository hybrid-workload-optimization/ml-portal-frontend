<template>
  <div class="authority-page-wrapper">
    <div class="authority-page__content-wrapper">
      <div class="authority-page__content-menu" v-if="!$route.query.detail">
        <sub-list @sendTabName="subListOnClick" />
      </div>
      <div class="authority-page__right-content">
        <div class="authority-page__content-info">
          <sp-card headered :label="getSelectLabel()" outlined elevation="0">
            <cluster-node
              :clusterId="clusterId"
              v-if="selectResource === 'Node' && !$route.query.detail"
            />
            <cluster-node-detail
              v-else-if="selectResource === 'Node' && $route.query.detail"
            />
            <cluster-namespace
              :clusterId="clusterId"
              v-else-if="selectResource === 'Namespace' && !$route.query.detail"
            />
            <cluster-namespace-detail
              v-else-if="selectResource === 'Namespace' && $route.query.detail"
            />
            <cluster-persistent-volume
              :clusterId="clusterId"
              v-else-if="
                selectResource === 'Persistent Volume' && !$route.query.detail
              "
            />
            <cluster-persistent-volume-detail
              v-else-if="
                selectResource === 'Persistent Volume' && $route.query.detail
              "
            />
            <cluster-storage-class
              :clusterId="clusterId"
              v-else-if="
                selectResource === 'Storage Class' && !$route.query.detail
              "
            />
            <cluster-storage-class-detail
              v-else-if="
                selectResource === 'Storage Class' && $route.query.detail
              "
            />
            <deployment-list
              :clusterId="clusterId"
              v-else-if="
                selectResource === 'Deployment' && !$route.query.detail
              "
            />
            <deployment-detail
              v-else-if="selectResource === 'Deployment' && $route.query.detail"
            />
            <stateful-set-list
              :clusterId="clusterId"
              v-else-if="
                selectResource === 'Stateful Set' && !$route.query.detail
              "
            />
            <stateful-set-detail
              v-else-if="
                selectResource === 'Stateful Set' && $route.query.detail
              "
            />
            <pod-list
              :clusterId="clusterId"
              v-else-if="selectResource === 'Pod' && !$route.query.detail"
            />
            <pod-detail
              v-else-if="selectResource === 'Pod' && $route.query.detail"
            />
            <cron-job-list
              :clusterId="clusterId"
              v-else-if="selectResource === 'Cron Job' && !$route.query.detail"
            />
            <cron-job-detail
              v-else-if="selectResource === 'Cron Job' && $route.query.detail"
            />
            <job-list
              :clusterId="clusterId"
              v-else-if="selectResource === 'Job' && !$route.query.detail"
            />
            <job-detail
              v-else-if="selectResource === 'Job' && $route.query.detail"
            />
            <replica-set-list
              :clusterId="clusterId"
              v-else-if="
                selectResource === 'Replica Set' && !$route.query.detail
              "
            />
            <replica-set-detail
              v-else-if="
                selectResource === 'Replica Set' && $route.query.detail
              "
            />
            <daemon-set-list
              :clusterId="clusterId"
              v-else-if="
                selectResource === 'Daemon Set' && !$route.query.detail
              "
            />
            <daemon-set-detail
              v-else-if="selectResource === 'Daemon Set' && $route.query.detail"
            />
            <service-list
              :clusterId="clusterId"
              v-else-if="selectResource === 'Service' && !$route.query.detail"
            />
            <service-detail
              v-else-if="selectResource === 'Service' && $route.query.detail"
            />
            <ingress-list
              :clusterId="clusterId"
              v-else-if="selectResource === 'Ingress' && !$route.query.detail"
            />
            <ingress-detail
              v-else-if="selectResource === 'Ingress' && $route.query.detail"
            />
            <ingress-controller-list
              :clusterId="clusterId"
              v-else-if="
                selectResource === 'Ingress Controller' && !$route.query.detail
              "
            />
            <persistent-volume-claim-list
              :clusterId="clusterId"
              v-else-if="
                selectResource === 'Persistent Volume Claim' &&
                !$route.query.detail
              "
            />
            <persistent-volume-claim-detail
              v-else-if="
                selectResource === 'Persistent Volume Claim' &&
                $route.query.detail
              "
            />
            <config-map-list
              :clusterId="clusterId"
              v-else-if="
                selectResource === 'Config Map' && !$route.query.detail
              "
            />
            <config-map-detail
              v-else-if="selectResource === 'Config Map' && $route.query.detail"
            />
            <secret-list
              :clusterId="clusterId"
              v-else-if="selectResource === 'Secret' && !$route.query.detail"
            />
            <secret-detail
              v-else-if="selectResource === 'Secret' && $route.query.detail"
            />
          </sp-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SubList from '@/components/cluster/resource/SubList.vue'

import ClusterNode from '@/views/project/cluster/components/resource/cluster/ClusterNodeList.vue'
import ClusterNodeDetail from '@/views/cluster/components/ClusterNodeDetail.vue'
import ClusterNamespace from '@/views/project/cluster/components/resource/cluster/ClusterNamespaceList.vue'
import ClusterNamespaceDetail from '@/views/cluster/components/ClusterNamespaceDetail.vue'
import ClusterPersistentVolume from '@/views/project/cluster/components/resource/cluster/ClusterPersistentVolumeList.vue'
import ClusterPersistentVolumeDetail from '@/views/cluster/components/ClusterPersistentVolumeDetail.vue'
import ClusterStorageClass from '@/views/project/cluster/components/resource/cluster/ClusterStorageClassList.vue'
import ClusterStorageClassDetail from '@/views/cluster/components/ClusterStorageClassDetail.vue'

import DeploymentList from '@/views/project/cluster/components/resource/workload/deployment/DeploymentList.vue'
import DeploymentDetail from '@/views/project/cluster/components/resource/workload/deployment/DeploymentDetail.vue'
import StatefulSetList from '@/views/project/cluster/components/resource/workload/stateful-set/StatefulSetList.vue'
import StatefulSetDetail from '@/views/project/cluster/components/resource/workload/stateful-set/StatefulSetDetail.vue'
import PodList from '@/views/project/cluster/components/resource/workload/pod/PodList.vue'
import PodDetail from '@/views/project/cluster/components/resource/workload/pod/PodDetail.vue'
import CronJobList from '@/views/project/cluster/components/resource/workload/cron-job/CronJobList.vue'
import CronJobDetail from '@/views/project/cluster/components/resource/workload/cron-job/CronJobDetail.vue'
import JobList from '@/views/project/cluster/components/resource/workload/job/JobList.vue'
import JobDetail from '@/views/project/cluster/components/resource/workload/job/JobDetail.vue'
import ReplicaSetList from '@/views/project/cluster/components/resource/workload/replica-set/ReplicaSetList.vue'
import ReplicaSetDetail from '@/views/project/cluster/components/resource/workload/replica-set/ReplicaSetDetail.vue'
import DaemonSetList from '@/views/project/cluster/components/resource/workload/daemon-set/DaemonSetList.vue'
import DaemonSetDetail from '@/views/project/cluster/components/resource/workload/daemon-set/DaemonSetDetail.vue'

import ServiceList from '@/views/project/cluster/components/resource/networking/service/ServiceList.vue'
import ServiceDetail from '@/views/project/cluster/components/resource/networking/service/ServiceDetail.vue'
import IngressList from '@/views/project/cluster/components/resource/networking/ingress/IngressList.vue'
import IngressDetail from '@/views/project/cluster/components/resource/networking/ingress/IngressDetail.vue'
import IngressControllerList from '@/views/project/cluster/components/resource/networking/ingress-controller/IngressControllerList.vue'

import PersistentVolumeClaimList from '@/views/project/cluster/components/resource/config/persistent-volume-claim/PersistentVolumeClaimList.vue'
import PersistentVolumeClaimDetail from '@/views/project/cluster/components/resource/config/persistent-volume-claim/PersistentVolumeClaimDetail.vue'
import ConfigMapList from '@/views/project/cluster/components/resource/config/config-map/ConfigMapList.vue'
import ConfigMapDetail from '@/views/project/cluster/components/resource/config/config-map/ConfigMapDetail.vue'
import SecretList from '@/views/project/cluster/components/resource/config/secret/SecretList.vue'
import SecretDetail from '@/views/project/cluster/components/resource/config/secret/SecretDetail.vue'

export default {
  props: {
    clusterId: Number,
  },
  data() {
    return {
      selectResource: 'Node',
      selectLabel: 'Cluster > Node',
      projectIdx: null,
    }
  },
  components: {
    SubList,
    ClusterNode,
    ClusterNodeDetail,
    ClusterNamespace,
    ClusterNamespaceDetail,
    ClusterPersistentVolume,
    ClusterPersistentVolumeDetail,
    ClusterStorageClass,
    ClusterStorageClassDetail,
    DeploymentList,
    DeploymentDetail,
    StatefulSetList,
    StatefulSetDetail,
    PodList,
    PodDetail,
    CronJobList,
    CronJobDetail,
    JobList,
    JobDetail,
    ReplicaSetList,
    ReplicaSetDetail,
    DaemonSetList,
    DaemonSetDetail,
    ServiceList,
    ServiceDetail,
    IngressList,
    IngressDetail,
    IngressControllerList,
    PersistentVolumeClaimList,
    PersistentVolumeClaimDetail,
    ConfigMapList,
    ConfigMapDetail,
    SecretList,
    SecretDetail,
  },
  mounted() {
    this.projectIdx = this.$route.params.id
    this.initDetail()
  },
  methods: {
    initDetail() {
      if (this.$route.query.detail) {
        this.$router.replace({
          path: `/project/detail/${this.projectIdx}`,
          hash: this.$route.hash,
        })
      }
    },
    subListOnClick(resource) {
      this.selectResource = resource
    },
    getSelectLabel() {
      if (
        this.selectResource === 'Node' ||
        this.selectResource === 'Namespace' ||
        this.selectResource === 'Persistent Volume' ||
        this.selectResource === 'Storage Class'
      ) {
        this.selectLabel = `Cluster > ${this.selectResource}`
      } else if (
        this.selectResource === 'Deployment' ||
        this.selectResource === 'Stateful Set' ||
        this.selectResource === 'Pod' ||
        this.selectResource === 'Cron Job' ||
        this.selectResource === 'Job' ||
        this.selectResource === 'Replica Set' ||
        this.selectResource === 'Daemon Set'
      ) {
        this.selectLabel = `Workload > ${this.selectResource}`
      } else if (
        this.selectResource === 'Service' ||
        this.selectResource === 'Ingress' ||
        this.selectResource === 'Ingress Controller'
      ) {
        this.selectLabel = `Network > ${this.selectResource}`
      } else if (
        this.selectResource === 'Persistent Volume Claim' ||
        this.selectResource === 'Config Map' ||
        this.selectResource === 'Secret'
      ) {
        this.selectLabel = `Config > ${this.selectResource}`
      }
      return this.selectLabel
    },
  },
  created() {
    // this.$router.replace({
    //   path: `/project/detail/${this.projectIdx}/cluster/${this.$route.params.cid}/Node`,
    //   hash: this.$route.hash,
    // })
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
$this: 'authority-page';
.authority-page-wrapper {
  .#{$this}__content-wrapper {
    display: flex;
    .#{$this}__content-menu {
      width: 25%;
      margin-left: 15px;
      height: 100%;
    }
    .#{$this}__right-content {
      width: 100%;
      margin-left: 15px;
      height: 100%;
      .#{$this}__content-info {
        margin-bottom: 15px;
      }
    }
  }
  .#{$this}__title-wrapper {
    margin-bottom: 25px;
    .title-text {
      font-size: toRem(34);
      font-weight: bold;
      color: $sp-title;
      margin-right: 20px;
    }
    .title-icon {
      color: $sp-warning;
      margin-right: 10px;
      font-size: toRem(18);
    }
    .subtitle-text {
      font: {
        family: $sub-font;
        size: toRem(16);
      }
      color: $sp-title;
    }
  }
}
</style>
