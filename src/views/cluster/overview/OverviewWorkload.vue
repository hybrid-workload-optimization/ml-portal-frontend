<template>
  <sp-card class="sp-overview" :class="{ isMini }" elevation="0">
    <div class="overview-header">Workload</div>

    <div class="overview-content">
      <div class="overview-left">
        <div class="workload-wrapper">
          <div class="workload-list-item">
            <div class="list-title">Deployment</div>
            <div class="list-value">{{ data.deployments.length }}</div>
          </div>
          <div class="workload-list-item">
            <div class="list-title">Stateful Set</div>
            <div class="list-value">{{ data.statefulSets.length }}</div>
          </div>
          <div class="workload-list-item">
            <div class="list-title">Cron Job</div>
            <div class="list-value">{{ data.cronJobs.length }}</div>
          </div>
          <div class="workload-list-item">
            <div class="list-title">Job</div>
            <div class="list-value">{{ data.jobs.length }}</div>
          </div>
          <div class="workload-list-item">
            <div class="list-title">Replica Set</div>
            <div class="list-value">{{ data.replicaSets.length }}</div>
          </div>
          <div class="workload-list-item">
            <div class="list-title">Daemon</div>
            <div class="list-value">{{ data.daemonSets.length }}</div>
          </div>
        </div>
        <div class="chart-wrapper">
          <apexchart
            type="donut"
            width="380px"
            height="auto"
            :series="workloadData.series"
            :options="workloadData.options"
          />
        </div>
      </div>
      <div class="list-wrapper">
        <div class="list-title">
          {{ today }} 배포 내역 ({{ data.todayDeployedWorkload.length }})
          <!-- <v-icon
            class="expand-list-item-icon material-icons-outlined mb-1"
            size="medium"
            >mdi-triangle-down</v-icon
          > -->
        </div>
        <div v-if="data.todayDeployedWorkload.length > 0" class="list-content">
          <div
            class="list-item"
            v-for="item in data.todayDeployedWorkload"
            :key="item.id"
          >
            <div class="list-item-title">({{ item.kind }}) {{ item.name }}</div>
            <div class="list-item-date">{{ toTimeString(item.createAt) }}</div>
          </div>
        </div>
        <div v-else class="no-list-content">
          <span class="no-data-msg">배포 내역이 존재하지 않습니다.</span>
        </div>
      </div>
    </div>
  </sp-card>
</template>

<script>
const defaultOptions = {
  // 도넛 차트 공통 스타일
  legend: { show: true, position: 'right', offsetY: 6 },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      offsetY: 16,
      donut: { size: '50' },
    },
  },
}

export default {
  props: {
    data: {
      type: Object,
    },
  },
  data() {
    return {
      workloadData: {
        series: [], // 차트 데이터
        options: {
          title: {
            text: 'Workload 배포 현황',
            align: 'center',
            style: { fontSize: '16px' },
            offsetY: -2,
          },
          labels: [],
          colors: [
            '#29AA54',
            '#06ABEA',
            '#FFCD56',
            '#A4A9B2',
            '#FF8000',
            '#0078FF',
          ],
          ...defaultOptions,
        },
      },

      chartData: [],
      today: '',
    }
  },
  computed: {
    isMini() {
      return this.$store.state.sideNav.isMini
    },
  },
  created() {
    this.getChartData()
  },
  mounted() {
    // 현재 날짜를 가져와서 today 데이터에 저장합니다.
    const date = new Date()
    this.today = this.formatDate(date) // 날짜를 원하는 형식으로 포맷팅해도 됩니다.
  },
  methods: {
    getChartData() {
      // const parseData = Object.keys(this.data).map(key => ({
      //   name: key,
      //   value: this.data[key].length,
      // }))

      const keysArray = Object.keys(this.data)

      const valuesArray = Object.values(this.data)
      const lengthsArray = valuesArray.map(value => value.length)

      this.workloadData.series = lengthsArray
      this.workloadData.options.labels = keysArray
    },
    formatDate(date) {
      // 날짜를 원하는 형식으로 포맷팅하는 함수 예시
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0') // 월은 0부터 시작하므로 +1을 해주고, 두 자리로 포맷팅
      const day = String(date.getDate()).padStart(2, '0') // 일은 두 자리로 포맷팅
      return `${year}-${month}-${day}` // 'YYYY-MM-DD' 형식으로 반환
    },
    toTimeString(datetime) {
      const date = new Date(datetime)
      const time = date.toTimeString().slice(0, 8)

      return time
    },
  },
}
</script>

<style lang="scss" scoped>
.overview-left {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 60%;
}
.workload-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 30%;
  gap: 8px;

  .workload-list-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    gap: 24%;
    .list-title {
      max-width: 150px;
      min-width: 100px;
      width: 100%;
      white-space: nowrap;
    }
    .list-value {
      font-weight: bold;
    }
  }
}

.chart-wrapper {
  width: 70%;
  height: 200px;

  ::v-deep {
    & div {
      margin: 0 auto;
    }
  }
}

.overview__contents-box {
  align-items: flex-start !important;
  padding: 0 !important;

  .overview-left-wrapper {
    display: flex;
    gap: 100px;
  }
  .overview-right {
    margin-top: 2px;
    min-width: 500px !important;

    .no-deploy-wrapper {
      border: 1px solid $sp-grey-300;
    }

    .overview-list-wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 180px;
      overflow: auto;

      .no-deploy-msg {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 18px;
        color: $sp-grey-400;
      }
    }
    .overview-row-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .overview-title {
      font-size: 16px !important;
      font-weight: bold !important;
      width: 100%;
    }
  }

  .overview__long-box.overview-box {
    justify-content: center !important;
    gap: 10px;
    padding: 0 !important;
    height: 180px;
  }

  .overview-title {
    width: 160px;
  }
}
</style>
