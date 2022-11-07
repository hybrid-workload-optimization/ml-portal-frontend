import request from '@/lib/request'
import { api, date } from '@/utils/common'
import moment from 'moment'

const resource = {
  namespaced: true,
  state: {
    dataList: [],
    detailInfo: {
      id: null,
      status: '',
      k8sVersion: '',
      allocatedCpu: 0,
      allocatedMemory: 0,
      createdAt: '',
      clusterIdx: 0,
      role: '',
      annotation: '',
      label: '',
    },
    resourceInfo: {
      name: '',
      ip: '',
      podCidr: '',
    },
    systemInfo: {
      osImage: '',
      kernelVersion: '',
      architecture: '',
      kubeletVersion: '',
      kubeproxyVersion: '',
    },
    conditions: [],
    podList: [],
    chartDto: {
      allocatedPods: 0,
      podCapacity: 0,
      podFraction: 0,
      cpuCapacity: 0,
      cpuLimits: 0,
      cpuLimitsFraction: 0,
      cpuRequests: 0,
      cpuRequestsFraction: 0,
      memoryCapacity: 0,
      memoryLimits: 0,
      memoryLimitsFraction: 0,
      memoryRequests: 0,
      memoryRequestsFraction: 0,
    },
    cpuData: {
      cpuRequestCores: 0,
      cpuLimitsCores: 0,
      cpuRequestData: [],
    },
  },
  getters: {
    dataList(state) {
      return state.dataList
    },
    dataListSize(state) {
      return state.dataList.length
    },
    detailInfo(state) {
      return state.detailInfo
    },
    resourceInfo(state) {
      return state.resourceInfo
    },
    systemInfo(state) {
      return state.systemInfo
    },
    conditionList(state) {
      return state.conditions
    },
    podList(state) {
      return state.podList
    },
    chartDto(state) {
      return state.chartDto
    },
    cpuData(state) {
      const result = {
        cpuRequestCores: (state.chartDto.cpuRequests * 0.001).toFixed(3),
        cpuLimitsCores: (state.chartDto.cpuLimits * 0.001).toFixed(3),
        cpuRequestData: [
          {
            name: 'Request 사용량',
            value: state.chartDto.cpuRequests * 0.001,
          },
          {
            name: 'Request 잔여량',
            value:
              (state.chartDto.cpuCapacity - state.chartDto.cpuRequests) * 0.001,
          },
        ],
        cpuLimitData: [
          {
            name: 'Limit 사용량',
            value: state.chartDto.cpuLimits * 0.001,
          },
          {
            name: 'Limit 잔여량',
            value:
              (state.chartDto.cpuCapacity - state.chartDto.cpuLimits) * 0.001,
          },
        ],
      }
      return result
    },
    // 메모리데이터는 현재 바이트 단위로 오고있음
    memoryData(state) {
      const result = {
        memoryRequestMib: Math.round(
          state.chartDto.memoryRequests / 1024 / 1024,
        ),
        memoryLimitsMib: Math.round(state.chartDto.memoryLimits / 1024 / 1024),
        memoryRequestData: [
          {
            name: 'Request 사용량',
            value: Math.round(state.chartDto.memoryRequests / 1024 / 1024),
          },
          {
            name: 'Request 잔여량',
            value: Math.round(
              (state.chartDto.memoryCapacity - state.chartDto.memoryRequests) /
                1024 /
                1024,
            ),
          },
        ],
        memoryLimitData: [
          {
            name: 'Limit 사용량',
            value: Math.round(state.chartDto.memoryLimits / 1024 / 1024),
          },
          {
            name: 'Limit 잔여량',
            value: Math.round(
              (state.chartDto.memoryCapacity - state.chartDto.memoryLimits) /
                1024 /
                1024,
            ),
          },
        ],
      }
      return result
    },
    podData(state) {
      const result = {
        podsCount: state.chartDto.allocatedPods,
        podAllocationData: [
          {
            name: '사용량',
            value: state.chartDto.allocatedPods,
          },
          {
            name: '잔여량',
            value: state.chartDto.podCapacity - state.chartDto.allocatedPods,
          },
        ],
      }
      return result
    },
  },
  mutations: {
    initClusterNodeListState(state) {
      state.dataList = []
      state.detailInfo = {
        id: null,
        name: '',
        ip: '',
        status: '',
        k8sVersion: '',
        allocatedCpu: 0,
        allocatedMemory: 0,
        createdAt: '',
        clusterIdx: 0,
        role: '',
      }
      state.resourceInfo = {
        osImage: '',
        ip: '',
        podCidr: '',
      }
      state.systemInfo = {
        osImage: '',
        kernelVersion: '',
        architecture: '',
        kubeletVersion: '',
        kubeproxyVersion: '',
      }
      state.conditions = []
      state.podList = []
      state.chartDto = {
        allocatedPods: 0,
        podCapacity: 0,
        podFraction: 0,
        cpuCapacity: 0,
        cpuLimits: 0,
        cpuLimitsFraction: 0,
        cpuRequests: 0,
        cpuRequestsFraction: 0,
        memoryCapacity: 0,
        memoryLimits: 0,
        memoryLimitsFraction: 0,
        memoryRequests: 0,
        memoryRequestsFraction: 0,
      }
      state.cpuData = {
        cpuRequestCores: 0,
        cpuLimitsCores: 0,
        cpuRequestData: [],
      }
    },
    initClusterNodeDataList(state) {
      state.dataList = []
    },

    // [리스트 정보] 객체 생성
    changeDateList(state, payload) {
      const { data } = payload
      const { result } = data
      const dataList = []
      result.content.forEach(e => {
        const item = {
          id: e.id,
          name: e.name,
          ip: e.ip,
          status: e.status,
          k8sVersion: e.k8sVersion,
          allocatedCpu: e.allocatedCpu,
          allocatedMemory: Math.round(e.allocatedMemory / 1024),
          clusterIdx: e.clusterIdx,
          role: e.role.length ? e.role.join(', ') : '',
        }
        dataList.push(item)
      })
      state.dataList = dataList
    },

    //
    changeDetailInfo(state, payload) {
      state.detailInfo = {}

      const { data } = payload
      const { result } = data
      if (result) {
        state.detailInfo.id = result.id
        state.detailInfo.name = result.name
        state.detailInfo.ip = result.ip
        state.detailInfo.uid = result.uid
        state.detailInfo.status = result.status
        state.detailInfo.k8sVersion = result.k8sVersion
        state.detailInfo.allocatedCpu = result.allocatedCpu
        state.detailInfo.allocatedMemory = result.allocatedMemory
        state.detailInfo.createdAt = moment(result.createdAt).format(
          'YYYY-MM-DD HH:mm:ss',
        )
        state.detailInfo.podCidr = result.podCidr
        state.detailInfo.osImage = result.osImage
        state.detailInfo.kernelVersion = result.kernelVersion
        state.detailInfo.architecture = result.architecture
        state.detailInfo.kubeletVersion = result.kubeletVersion
        state.detailInfo.kubeproxyVersion = result.kubeproxyVersion
        state.detailInfo.clusterIdx = result.clusterIdx
        state.detailInfo.clusterId = result.clusterId
        if (result.annotation) {
          state.detailInfo.annotation = []
          for (const [key, value] of Object.entries(result.annotation)) {
            state.detailInfo.annotation.push(`${key}:${value}`)
          }
        }
        if (result.label) {
          state.detailInfo.label = []
          for (const [key, value] of Object.entries(result.label)) {
            state.detailInfo.label.push(`${key}:${value}`)
          }
        }
        if (result.condition) {
          state.detailInfo.condition = []
          for (const [key, value] of Object.entries(result.condition)) {
            state.detailInfo.condition.push(`${key}:${value}`)
          }
        }
        state.detailInfo.role = result.role.length ? result.role.join(', ') : ''

        state.resourceInfo = {
          name: result.name,
          ip: result.ip,
          podCidr: result.podCidr,
        }
        state.systemInfo = {
          osImage: result.osImage,
          kernelVersion: result.kernelVersion,
          architecture: result.architecture,
          kubeletVersion: result.kubeletVersion,
          kubeproxyVersion: result.kubeproxyVersion,
        }
        state.conditions = result.condition
        state.chartDto = result.chartDto
      }
    },

    // [파드 리스트 정보] 객체 생성
    changePodList(state, payload) {
      state.podList = []
      const { data } = payload
      const { result } = data
      const podList = []
      console.log('podList ::', result)
      result.forEach(e => {
        const item = {
          ...e,
          label: '',
          createdAt: moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss'),
          age: `${date.getDiffFromToday(e.createdAt)}`,
        }
        if (e.label) {
          let count = 1
          for (const [key, value] of Object.entries(e.label)) {
            if (count > 1) {
              item.label += ', '
            }
            item.label += `${key}:${value}`
            count += 1
          }
        }

        podList.push(item)
      })
      state.podList = podList
    },
  },
  actions: {
    //  리스트 정보 조회 요청
    async getList({ commit }, param) {
      // getAllData: 페이징정보를 활용하여 순차적으로 전체 데이터를 조회하는 함수 호출
      // getAllData는 옵션이다. 백엔드 API에 paging 구현이 되어있을 경우, 전체 데이터를 조회하고 싶을 경우 사용한다.
      // common.js 참고
      try {
        const response = await api.getAllData(
          request.getClusterNodeListUsingGET,
          param,
        )
        // const response = await request.getClusterNodeListUsingGET(payload)
        console.log('getdatalist', response)
        commit('changeDateList', response)
      } catch (error) {
        console.error(error)
      }
    },
    // 상세 정보 조회 요청
    async getDetail({ commit }, payload) {
      const response = await request.getClusterNodeDetailUsingGET(payload)
      commit('changeDetailInfo', response)
    },
    // yaml 정보 조회 요청
    async getClusterNodeYaml(context, payload) {
      const response = await request.getStaefulSetYamlUsingGET(payload)
      return response
    },
    // 생성 요청
    async createClusterNode(context, payload) {
      const response = await request.registerClusterUsingPOST(payload)
      return response
    },
    // 수정 요청
    async updateClusterNode(context, payload) {
      const response = await request.updateClusterNodeUsingPATCH(payload)
      return response
    },
    // 삭제 요청
    async deleteClusterNode(context, payload) {
      const response = await request.deleteClusterNodeUsingDELETE(payload)
      return response
    },
    // podList 조회
    async getPodList({ commit }, payload) {
      const response = await request.getPodListByOwnerUsingPOST(payload)
      commit('changePodList', response)
    },
  },
}

export default resource
