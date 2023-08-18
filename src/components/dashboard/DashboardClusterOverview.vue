<template>
  <div>
    <sp-card class="sp-overview cluster-summary-wrapper" elevation="0">
      <div v-if="data.length > 0">
        <div class="overview-header">Cluster ()</div>
        <div class="overview-content-start">
          <!-- <div class="summary-wrapper">
            <div class="summary-item">
              <div class="summary-title">Provider</div>
              <div class="list-value">{{ data[0].provider }}</div>
            </div>
            <div class="summary-item">
              <div class="summary-title">Region</div>
              <div class="list-value" v-if="data[0].region">
                {{ data[0].region }}
              </div>
              <div v-else class="list-value">-</div>
            </div>
            <div class="summary-item">
              <div class="summary-title">Version</div>
              <div class="list-value">{{ data[0].vision }}</div>
            </div>
            <div class="summary-item">
              <div class="summary-title">Status</div>
              <div class="list-value">{{ data[0].status }}</div>
            </div>
            <div class="summary-item">
              <div class="summary-title">Created</div>
              <div class="list-value">{{ data[0].createAt }}</div>
            </div>
            <div class="summary-item">
              <div class="summary-title">Provisioner</div>
              <div class="list-value">{{ data[0].createBy }}</div>
            </div>
          </div> -->
          <div class="summary-wrapper">123</div>

          <div class="chart-wrapper">
            <div class="overview-chart-wrapper">
              <apexchart
                type="donut"
                height="210px"
                :series="totalMem.series"
                :options="totalMem.options"
              />
              <span class="donut-bottom-txt">
                {{ data[0].cpuUsage / 1000 }}Core /
                {{ data[0].cpuTotal / 1000 }}Core</span
              >
            </div>

            <div class="overview-chart-wrapper">
              <apexchart
                type="donut"
                height="210"
                :series="totalMem.series"
                :options="totalMem.options"
              />
              <span class="donut-bottom-txt"
                >{{ bytesToGB(data[0].memoryUsage) }}GB /
                {{ bytesToGB(data[0].memoryTotal) }}GB</span
              >
            </div>
            <div class="overview-chart-wrapper">
              <apexchart
                type="donut"
                height="210px"
                :series="totalStorage.series"
                :options="totalStorage.options"
              />
              <span class="donut-bottom-txt"
                >{{ bytesToGB(data[0].storageUsage) }}GB /
                {{ bytesToGB(data[0].storageTotal) }}GB</span
              >
            </div>
          </div>
          <div class="content-right">
            <div class="list-item">
              <div class="list-value">{{ data[0].countNode }}</div>
              <div class="list-title">Node</div>
            </div>
            <div class="list-item">
              <div class="list-value">{{ data[0].countNamespace }}</div>
              <div class="list-title">Namespace</div>
            </div>
            <div class="list-item">
              <div class="list-value">{{ data[0].countPV }}0</div>
              <div class="list-title">Persisten Volume</div>
            </div>
            <div class="list-item">
              <div class="list-value">{{ data[0].countWorkload }}</div>
              <div class="list-title">Workload</div>
            </div>
            <div class="list-item">
              <div class="list-value">{{ data[0].countPod }}</div>
              <div class="list-title">Pod</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no-message">클러스터가 존재하지 않습니다.</div>
    </sp-card>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

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
      totalCpuData: {
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
      totalMem: {
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

      totalStorage: {
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
      this.totalCpuData.series = [
        this.data[0].cpuUsage / 1000,
        this.data[0].cpuTotal / 1000 - this.data[0].cpuUsage / 1000,
      ]
      this.totalMem.series = [
        this.bytesToGB(this.data[0].memoryUsage),
        this.bytesToGB(this.data[0].memoryTotal - this.data[0].memoryUsage),
      ]
      this.totalStorage.series = [
        this.bytesToGB(this.data[0].storageUsage),
        this.bytesToGB(this.data[0].storageTotal - this.data[0].storageUsage),
      ]
    },
    bytesToGB(bytes) {
      const GB = bytes / (1024 * 1024 * 1024)
      return parseFloat(GB.toFixed(1)) // 소수점 이하 두 자리까지 표시
    },
  },
}
</script>

<style lang="scss" scoped>
.overview-content-start {
  display: flex;
  flex-wrap: nowrap;
}

.summary-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
  width: 24%;
  margin-top: 10px;
  min-width: 320px;

  .summary-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 24px;

    .summary-title {
      width: 130px;
    }
  }
}

.chart-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 56%;
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
  height: 284px;
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
