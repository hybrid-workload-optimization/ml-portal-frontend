<template>
  <div class="cluster-detail-popup-wrapper">
    <div class="cluster-detail-popup__content-wrapper">
      <!-- <div class="cluster-detail-popup__content-menu"> -->
      <!-- <sub-list @sendTabName="subListOnClick" /> -->
      <!-- </div> -->
      <div class="cluster-detail-popup__right-content">
        <cluster-resource-nav
          :mainMenu="selectLabel"
          :subMenu="selectResource"
        ></cluster-resource-nav>
        <div class="cluster-detail-popup__content-info">
          <sp-card>
            <cluster-overview
              v-if="selectResource === 'Overview' && !$route.query.detail"
            />

            <cluster-catalog
              v-else-if="selectResource === 'Catalog' && !$route.query.detail"
            />

            <cluster-node
              v-else-if="selectResource === 'Node' && !$route.query.detail"
            />
            <cluster-node-detail
              v-else-if="selectResource === 'Node' && $route.query.detail"
            />
            <cluster-namespace
              v-else-if="selectResource === 'Namespace' && !$route.query.detail"
            />
            <cluster-namespace-detail
              v-else-if="selectResource === 'Namespace' && $route.query.detail"
            />
            <cluster-persistent-volume
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
              v-else-if="
                selectResource === 'Deployment' && !$route.query.detail
              "
            />
            <deployment-detail
              v-else-if="selectResource === 'Deployment' && $route.query.detail"
            />
            <stateful-set-list
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
              v-else-if="selectResource === 'Pod' && !$route.query.detail"
            />
            <pod-detail
              v-else-if="selectResource === 'Pod' && $route.query.detail"
            />
            <cron-job-list
              v-else-if="selectResource === 'Cron Job' && !$route.query.detail"
            />
            <cron-job-detail
              v-else-if="selectResource === 'Cron Job' && $route.query.detail"
            />
            <job-list
              v-else-if="selectResource === 'Job' && !$route.query.detail"
            />
            <job-detail
              v-else-if="selectResource === 'Job' && $route.query.detail"
            />
            <replica-set-list
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
              v-else-if="
                selectResource === 'Daemon Set' && !$route.query.detail
              "
            />
            <daemon-set-detail
              v-else-if="selectResource === 'Daemon Set' && $route.query.detail"
            />
            <service-list
              v-else-if="selectResource === 'Service' && !$route.query.detail"
            />
            <service-detail
              v-else-if="selectResource === 'Service' && $route.query.detail"
            />
            <ingress-list
              v-else-if="selectResource === 'Ingress' && !$route.query.detail"
            />
            <ingress-detail
              v-else-if="selectResource === 'Ingress' && $route.query.detail"
            />
            <ingress-controller-list
              v-else-if="
                selectResource === 'Ingress Controller' && !$route.query.detail
              "
            />
            <persistent-volume-claim-list
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
              v-else-if="
                selectResource === 'Config Map' && !$route.query.detail
              "
            />
            <config-map-detail
              v-else-if="selectResource === 'Config Map' && $route.query.detail"
            />
            <secret-list
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
import ClusterOverview from '@/views/cluster/components/ClusterOverview.vue'
import ClusterCatalog from '@/views/cluster/components/ClusterAddonCardList.vue'

import ClusterNode from '@/views/cluster/components/resource/cluster/ClusterNodeList.vue'
import ClusterNodeDetail from '@/views/cluster/components/resource/cluster/ClusterNodeDetail.vue'
import ClusterNamespace from '@/views/cluster/components/resource/cluster/ClusterNamespaceList.vue'
import ClusterNamespaceDetail from '@/views/cluster/components/resource/cluster/ClusterNamespaceDetail.vue'
import ClusterPersistentVolume from '@/views/cluster/components/resource/cluster/ClusterPersistentVolumeList.vue'
import ClusterPersistentVolumeDetail from '@/views/cluster/components/resource/cluster/ClusterPersistentVolumeDetail.vue'
import ClusterStorageClass from '@/views/cluster/components/resource/cluster/ClusterStorageClassList.vue'
import ClusterStorageClassDetail from '@/views/cluster/components/resource/cluster/ClusterStorageClassDetail.vue'

import DeploymentList from '@/views/cluster/components/resource/workload/deployment/DeploymentList.vue'
import DeploymentDetail from '@/views/cluster/components/resource/workload/deployment/DeploymentDetail.vue'
import StatefulSetList from '@/views/cluster/components/resource/workload/stateful-set/StatefulSetList.vue'
import StatefulSetDetail from '@/views/cluster/components/resource/workload/stateful-set/StatefulSetDetail.vue'
import PodList from '@/views/cluster/components/resource/workload/pod/PodList.vue'
import PodDetail from '@/views/cluster/components/resource/workload/pod/PodDetail.vue'
import CronJobList from '@/views/cluster/components/resource/workload/cron-job/CronJobList.vue'
import CronJobDetail from '@/views/cluster/components/resource/workload/cron-job/CronJobDetail.vue'
import JobList from '@/views/cluster/components/resource/workload/job/JobList.vue'
import JobDetail from '@/views/cluster/components/resource/workload/job/JobDetail.vue'
import ReplicaSetList from '@/views/cluster/components/resource/workload/replica-set/ReplicaSetList.vue'
import ReplicaSetDetail from '@/views/cluster/components/resource/workload/replica-set/ReplicaSetDetail.vue'
import DaemonSetList from '@/views/cluster/components/resource/workload/daemon-set/DaemonSetList.vue'
import DaemonSetDetail from '@/views/cluster/components/resource/workload/daemon-set/DaemonSetDetail.vue'

import ServiceList from '@/views/cluster/components/resource/networking/service/ServiceList.vue'
import ServiceDetail from '@/views/cluster/components/resource/networking/service/ServiceDetail.vue'
import IngressList from '@/views/cluster/components/resource/networking/ingress/IngressList.vue'
import IngressDetail from '@/views/cluster/components/resource/networking/ingress/IngressDetail.vue'
import IngressControllerList from '@/views/cluster/components/resource/networking/ingress-controller/IngressControllerList.vue'

import PersistentVolumeClaimList from '@/views/cluster/components/resource/config/persistent-volume-claim/PersistentVolumeClaimList.vue'
import PersistentVolumeClaimDetail from '@/views/cluster/components/resource/config/persistent-volume-claim/PersistentVolumeClaimDetail.vue'
import ConfigMapList from '@/views/cluster/components/resource/config/config-map/ConfigMapList.vue'
import ConfigMapDetail from '@/views/cluster/components/resource/config/config-map/ConfigMapDetail.vue'
import SecretList from '@/views/cluster/components/resource/config/secret/SecretList.vue'
import SecretDetail from '@/views/cluster/components/resource/config/secret/SecretDetail.vue'
import ClusterResourceNav from '@/components/cluster/resource/ClusterResourceNav.vue'

export default {
  data() {
    return {
      selectResource: 'Overview',
      selectLabel: 'General',
    }
  },
  components: {
    ClusterResourceNav,
    ClusterOverview,
    ClusterCatalog,
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
  watch: {
    $route(to, from) {
      if (to.hash !== from.hash) {
        this.selectResource = to.hash.substring(1)
        this.getSelectLabel()
      }
    },
  },
  methods: {
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
        this.selectLabel = 'Cluster'
      } else if (
        this.selectResource === 'Deployment' ||
        this.selectResource === 'Stateful Set' ||
        this.selectResource === 'Pod' ||
        this.selectResource === 'Cron Job' ||
        this.selectResource === 'Job' ||
        this.selectResource === 'Replica Set' ||
        this.selectResource === 'Daemon Set'
      ) {
        this.selectLabel = 'Workload'
      } else if (
        this.selectResource === 'Service' ||
        this.selectResource === 'Ingress' ||
        this.selectResource === 'Ingress Controller'
      ) {
        this.selectLabel = 'Network'
      } else if (
        this.selectResource === 'Persistent Volume Claim' ||
        this.selectResource === 'Config Map' ||
        this.selectResource === 'Secret'
      ) {
        this.selectLabel = 'Config'
      } else if (
        this.selectResource === 'Overview' ||
        this.selectResource === 'Catalog'
      ) {
        this.selectLabel = 'General'
      }
      return this.selectLabel
    },
  },
  created() {
    // const resourceHash = this.$route.hash.substring(1)
    // this.selectResource = resourceHash
  },
}
</script>

<style lang="scss">
@import '@/styles/_mixin.scss';
$this: 'cluster-detail-popup';
.cluster-detail-popup-wrapper {
  .#{$this}__content-wrapper .sp-card {
    box-shadow: none;
    transform: none;
  }
  border: 0px !important;
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
