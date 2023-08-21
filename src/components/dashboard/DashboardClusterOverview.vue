<template>
  <div>
    <div class="overview-header">
      Cluster ({{ dashboardData.clusterCount }})
    </div>
    <template v-if="data.length === 0">
      <sp-card class="sp-overview cluster-summary-wrapper" elevation="0">
        <div class="no-message">클러스터가 존재하지 않습니다.</div>
      </sp-card>
    </template>
    <template v-else>
      <sp-card
        v-for="(item, index) in data"
        :key="item.provider"
        class="sp-overview cluster-summary-wrapper"
        elevation="0"
      >
        <div>
          <div class="overview-content-start">
            <div class="summary-wrapper">
              <div class="summary-left">
                <img
                  width="45"
                  height="45"
                  :src="getProviderImage(item.provider)"
                  alt="provider logo"
                />
              </div>
              <div class="summary-right">
                <div class="summary-top">
                  <div class="summary-top-title">
                    <b class="summary-name" :title="item.name">
                      {{ item.name }}
                    </b>
                    <div class="summary-status">
                      <sp-image
                        contain
                        class="healthy-image"
                        width="22px"
                        height="22px"
                        :lazySrc="setImageState(item.status)"
                        :src="setImageState(item.status)"
                      />
                      {{ item.status }}
                    </div>
                  </div>

                  <div class="summary-des">
                    {{ item.description }}
                  </div>
                </div>
                <div class="summary-item">
                  <div class="summary-title">Provider</div>
                  <div class="list-value">{{ item.provider }}</div>
                </div>
                <div class="summary-item">
                  <div class="summary-title">Region</div>
                  <div class="list-value" v-if="item.region">
                    {{ item.region }}
                  </div>
                  <div v-else class="list-value">-</div>
                </div>
                <div class="summary-item">
                  <div class="summary-title">Version</div>
                  <div class="list-value">{{ item.vision }}</div>
                </div>
                <div class="summary-item">
                  <div class="summary-title">Provisioner</div>
                  <div class="list-value">{{ item.createBy }}</div>
                </div>
                <div class="summary-item">
                  <div class="summary-title">Created</div>
                  <div class="list-value">{{ item.createAt }}</div>
                </div>
              </div>
            </div>

            <div class="chart-wrapper">
              <div class="overview-chart-wrapper">
                <apexchart
                  v-if="totalCpu.length > 0"
                  type="donut"
                  height="210px"
                  :series="totalCpu[index].series"
                  :options="totalCpu[index].options"
                />
                <span class="donut-bottom-txt">
                  {{ item.cpuUsage / 1000 }}Core /
                  {{ item.cpuTotal / 1000 }}Core</span
                >
              </div>

              <div class="overview-chart-wrapper">
                <apexchart
                  v-if="totalCpu.length > 0"
                  type="donut"
                  height="210"
                  :series="totalMem[index].series"
                  :options="totalMem[index].options"
                />
                <span class="donut-bottom-txt"
                  >{{ bytesToGB(item.memoryUsage) }}GB /
                  {{ bytesToGB(item.memoryTotal) }}GB</span
                >
              </div>
              <div class="overview-chart-wrapper">
                <apexchart
                  v-if="totalCpu.length > 0"
                  type="donut"
                  height="210px"
                  :series="totalStorage[index].series"
                  :options="totalStorage[index].options"
                />
                <span class="donut-bottom-txt"
                  >{{ bytesToGB(item.storageUsage) }}GB /
                  {{ bytesToGB(item.storageTotal) }}GB</span
                >
              </div>
            </div>
            <div class="content-right">
              <div class="list-item">
                <div class="list-value">{{ item.countNode }}</div>
                <div class="list-title">Node</div>
              </div>
              <div class="list-item">
                <div class="list-value">{{ item.countNamespace }}</div>
                <div class="list-title">Namespace</div>
              </div>
              <div class="list-item">
                <div class="list-value">{{ item.countPV }}0</div>
                <div class="list-title">Persisten Volume</div>
              </div>
              <div class="list-item">
                <div class="list-value">{{ item.countWorkload }}</div>
                <div class="list-title">Workload</div>
              </div>
              <div class="list-item">
                <div class="list-value">{{ item.countPod }}</div>
                <div class="list-title">Pod</div>
              </div>
            </div>
          </div>
        </div>
      </sp-card>
    </template>
  </div>
</template>

<script>
import * as _ from 'lodash'
import { createNamespacedHelpers } from 'vuex'
import iconAzuer from '@/assets/images/icon_azuer.svg'
import iconVmare from '@/assets/images/icon_vm-ware.png'
import iconK8s from '@/assets/images/icon_k8s.svg'

const dashboardMapUtils = createNamespacedHelpers('dashboard')

const defaultOptions = {
  // 도넛 차트 공통 스타일
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: '50',
        labels: {
          show: true,
          total: {
            show: true,
            formatter: w => {
              const dataValue = w.globals.series[0] // 첫 번째 데이터 값
              const seriesTotal = w.globals.seriesTotals.reduce(
                (acc, val) => acc + val,
                0,
              ) // 전체 데이터 합
              const ratio = (dataValue / seriesTotal) * 100
              return `${ratio.toFixed(1)}%`
            },
          },
          name: { show: false, color: '#36A2EB' },
        },
      },
      customScale: 1,
    },
  },
}

export default {
  data() {
    return {
      totalCpu: [],
      totalMem: [],
      totalStorage: [],
      defaultCpu: {
        series: [0, 0], // 차트 데이터
        options: {
          labels: ['사용', '미사용'], // 데이터 명칭
          title: {
            text: 'Total CPU 사용률',
            align: 'center',
            style: { fontSize: '18px' },
          },
          colors: ['#EA1606', '#29AA54'],
          tooltip: {
            y: {
              formatter(value) {
                return `${value} Core`
              },
            },
          },
          ...defaultOptions,
        },
      },
      defaultMem: {
        series: [0, 0], // 차트 데이터
        options: {
          labels: ['사용', '미사용'], // 데이터 명칭
          chart: { height: '180px' },
          title: {
            text: 'Total Memory 사용률',
            align: 'center',
            style: { fontSize: '18px' },
          },
          colors: ['#29AA54', '#FFCD56'],
          legend: { show: false },
          tooltip: {
            y: {
              formatter(value) {
                return `${value} GB`
              },
            },
          },
          ...defaultOptions,
        },
      },
      defaultStorage: {
        series: [0, 0], // 차트 데이터
        options: {
          labels: ['사용', '미사용'], // 데이터 명칭
          chart: { height: '180px' },
          title: {
            text: 'Total Storage 사용률',
            align: 'center',
            style: { fontSize: '18px' },
          },
          colors: ['#29AA54', '#FFCD56'],
          legend: { show: false },
          tooltip: {
            y: {
              formatter(value) {
                return `${value} GB`
              },
            },
          },
          ...defaultOptions,
        },
      },

      donutColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      donutLabel: 'Total',
      chartOptionProps: {
        responsive: true,
        maintainAspectRatio: false, // 다른 도넛 차트 옵션 설정
      },
    }
  },
  computed: {
    ...dashboardMapUtils.mapGetters(['dashboardData']),
    data() {
      return this.dashboardData.clusterSummaryList
    },
  },
  watch: {
    data(newVal) {
      if (newVal.length > 0) this.setChartData()
    },
  },
  methods: {
    setChartData() {
      this.totalCpu.splice(0)
      this.totalMem.splice(0)
      this.totalStorage.splice(0)

      this.data.forEach(chartData => {
        const cpuData = _.cloneDeep(this.defaultCpu)
        const memData = _.cloneDeep(this.defaultMem)
        const storageData = _.cloneDeep(this.defaultStorage)

        cpuData.series = [
          chartData.cpuUsage / 1000,
          chartData.cpuTotal / 1000 - chartData.cpuUsage / 1000,
        ]
        memData.series = [
          this.bytesToGB(chartData.memoryUsage),
          this.bytesToGB(chartData.memoryTotal - chartData.memoryUsage),
        ]
        storageData.series = [
          this.bytesToGB(chartData.storageUsage),
          this.bytesToGB(chartData.storageTotal - chartData.storageUsage),
        ]

        this.totalCpu.push(cpuData)
        this.totalMem.push(memData)
        this.totalStorage.push(storageData)
      })
    },
    bytesToGB(bytes) {
      const GB = bytes / (1024 * 1024 * 1024)
      return parseFloat(GB.toFixed(1)) // 소수점 이하 두 자리까지 표시
    },
    setImageState(state) {
      switch (state) {
        case 'Deploying':
          return 'icon_loading.gif'
        case 'Unhealthy':
          return 'icon_unhealthy.svg'
        case 'Healthy':
          return 'icon_healthy.svg'
        case 'Fail':
          return 'icon_unhealthy.svg'
        case 'Error':
          return 'icon_unhealthy.svg'
        case 'Waiting':
        case 'FINISHED':
          return 'icon_healthy.svg'
        case 'Deleting':
          return 'icon_loading.gif'
        case 'Scale in':
          return 'icon_loading.gif'
        case 'Scale out':
          return 'icon_loading.gif'
        default:
          return ''
      }
    },
    getProviderImage(provider) {
      if (provider === 'Azuer') return iconAzuer
      if (provider === 'VMware') return iconVmare
      if (provider === 'Kubernetes') return iconK8s
      return ''
    },
  },
}
</script>

<style lang="scss" scoped>
.overview-header {
  font-size: 18px;
  font-weight: bold;
  padding: 8px 10px;
}
.overview-content-start {
  display: flex;
  flex-wrap: nowrap;
}

.summary-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  gap: 8px;
  width: 25%;

  & .summary-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 232px;
  }

  & .summary-left {
    height: 232px;
    padding-top: 24px;
  }

  .summary-top {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    margin-bottom: 8px;

    & .summary-top-title {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      gap: 8px;
    }
    & .summary-name {
      font-size: 22px;
      width: 100%;
      min-width: 120px;
      max-width: 182px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    & .summary-status {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 4px;
      width: 110px;
    }
    & .summary-des {
      width: 100%;
      min-width: 170px;
      max-width: 300px;
      color: #9d9d9d;
    }
  }

  .summary-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
  }
}

.chart-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 55%;
  height: 232px;

  .donut-bottom-txt {
    color: $sp-grey-400;
  }
}

.content-right {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 20%;
  height: 232px;
  gap: 8px;

  .list-item {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    gap: 32px;
  }
  .list-title {
    color: $sp-grey-400;
    width: 156px;
  }
  .list-value {
    font-size: 24px;
  }
}

.cluster-summary-wrapper {
  position: relative;
  height: 252px;
  & .no-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 20px;
  }
  .overview-wrapper {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding-top: 8px !important;
  }

  .list-value {
    white-space: nowrap;
    font-weight: 600;
  }
  .overview-chart-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 33%;
  }

  .overview-box-right {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 0 !important;
    height: 180px;
    & > div {
      display: flex;
      justify-content: flex-start;
      gap: 16px;
      width: 240px;
    }
    .list-title {
      width: 48px;
      font-size: 18px;
      text-align: right;
    }
    .list-value {
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
</style>
