import request from '@/lib/request'
import { api, date } from '@/utils/common'
import moment from 'moment'

const resource = {
  namespaced: true,
  state: {
    dataList: [],
    detailInfo: {
      resourceInfo: {
        type: '',
        clusterIp: '',
        sessionAffinity: '',
      },
    },
    endpointList: [],
    podList: [],
  },
  getters: {
    serviceList(state) {
      return state.dataList
    },
    serviceListSize(state) {
      return state.dataList.length
    },
    serviceDetailInfo(state) {
      return state.detailInfo
    },
    endpointList(state) {
      return state.endpointList
    },
    podList(state) {
      return state.podList
    },
  },
  mutations: {
    // state 데이터 초기화
    initServiceState(state) {
      state.dataList = []
      state.detailInfo = {}
    },
    initServiceDataList(state) {
      state.dataList = []
    },
    changeServiceList(state, payload) {
      const { data } = payload
      const { result } = data
      const dataList = []

      result.content.forEach(e => {
        const item = {
          id: e.id,
          name: e.name,
          clusterName: e.clusterName,
          projectIdx: e.projectIdx,
          namespace: e.namespace,
          label: '',
          type: e.type,
          internalEndpoint: '',
          externalEndpoint: '',
          age: `${date.getDiffFromToday(e.age)}`,
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

        if (e.internalEndpoints) {
          let internalEndpoint = ''
          let count = 1
          for (const [, obj] of Object.entries(e.internalEndpoints)) {
            const { protocol } = obj
            const { port } = obj
            const { nodePort } = obj
            // const portName = obj.name != null ? obj.name : e.name
            const portName = e.name
            if (count > 1) {
              item.label += ', '
            }
            if (nodePort) {
              internalEndpoint = `${portName}:${port} ${protocol}, `
              internalEndpoint += `${portName}:${nodePort} ${protocol}`
            } else {
              internalEndpoint += `${portName}:${port} ${protocol}`
            }
            item.internalEndpoint += internalEndpoint
            count += 1
          }
        }
        if (e.externalEndpoints) {
          let externalEndpoint = ''
          for (const [, obj] of Object.entries(e.externalEndpoints)) {
            const { protocol } = obj
            const { port } = obj
            const portName = obj.name != null ? obj.name : e.name
            externalEndpoint = `${portName}:${port} ${protocol}\n`
            item.externalEndpoint += externalEndpoint
          }
        }
        dataList.push(item)
      })
      state.dataList = dataList
    },
    changeServiceDetailInfo(state, payload) {
      state.detailInfo = {}

      const { data } = payload
      const { result } = data

      if (result) {
        state.detailInfo.id = result.id
        state.detailInfo.title = `${result.clusterName} / ${result.serviceName}`
        state.detailInfo.clusterId = result.clusterId
        state.detailInfo.name = result.serviceName
        state.detailInfo.namespace = result.namespaceName
        state.detailInfo.clusterIdx = result.clusterIdx
        state.detailInfo.createdAt = moment(result.createdAt).format(
          'YYYY-MM-DD HH:mm:ss',
        )
        state.detailInfo.clusterIp = result.clusterIp
        state.detailInfo.internalEndpoint = '-'
        state.detailInfo.externalEndpoint = '-'

        state.detailInfo.resourceInfo = {
          type: result.type,
          clusterIp: result.clusterIp,
          sessionAffinity: result.sessionAffinity,
        }

        if (result.annotation) {
          state.detailInfo.annotations = []
          for (const [key, value] of Object.entries(result.annotation)) {
            state.detailInfo.annotations.push(`${key}:${value}`)
          }
        }
        if (result.label) {
          state.detailInfo.labels = []
          for (const [key, value] of Object.entries(result.label)) {
            state.detailInfo.labels.push(`${key}:${value}`)
          }
        }
        if (result.selector) {
          state.detailInfo.selectors = []
          for (const [key, value] of Object.entries(result.selector)) {
            state.detailInfo.selectors.push(`${key}:${value}`)
          }
        }
        if (result.internalEndpoints) {
          for (const [, obj] of Object.entries(result.internalEndpoints)) {
            const { protocol } = obj
            const { port } = obj
            const { nodePort } = obj
            // const portName = obj.name != null ? obj.name : result.serviceName
            const portName = result.serviceName
            if (nodePort) {
              state.detailInfo.internalEndpoint = `${portName}:${port} ${protocol}, `
              state.detailInfo.internalEndpoint += `${portName}:${nodePort} ${protocol}\n`
            } else {
              state.detailInfo.internalEndpoint = `${portName}:${port} ${protocol}\n`
            }
          }
        }

        if (result.externalEndpoints) {
          for (const [, obj] of Object.entries(result.externalEndpoints)) {
            const { protocol } = obj
            const { port } = obj
            const portName = obj.name != null ? obj.name : result.serviceName
            state.detailInfo.externalEndpoint = `${portName}:${port} ${protocol}`
          }
        }

        state.detailInfo.projectIdx = result.projectIdx
      }
    },
    changeEndpointList(state, payload) {
      state.endpointList = []
      const { data } = payload
      const { result } = data
      const dataList = []
      result.endpoints.forEach(e => {
        const item = {
          id: e.id,
          host: e.host,
          name: e.endpointName,
          port: e.port,
          protocol: e.protocol,
          node: e.nodeName,
          status: e.ready,
        }
        dataList.push(item)
      })
      state.endpointList = dataList
    },
    changePodList(state, payload) {
      state.podList = []
      const { data } = payload
      const { result } = data
      const podList = []
      console.log('result:', result)
      result.forEach(e => {
        const item = {
          id: e.id,
          name: e.name,
          namespace: e.namespace,
          label: '',
          node: e.node,
          status: e.status,
          createdAt: moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss'),
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
    async getServiceList({ commit }, payload) {
      const param = {
        page: 1,
        size: 100,
        clusterIdx: payload.clusterIdx,
        namespaceIdx: payload.namespaceIdx,
      }
      const response = await api.getAllData(request.getServicesUsingGET, param)
      commit('changeServiceList', response)
    },
    async getServiceDetail({ commit }, payload) {
      const response = await request.getServiceUsingGET(payload)
      commit('changeServiceDetailInfo', response)
      commit('changeEndpointList', response)
    },
    async getServiceYaml(context, payload) {
      const response = await request.getServiceYamlUsingGET(payload)
      return response
    },
    async createService(context, payload) {
      const response = await request.createServiceUsingPOST(payload)
      return response
    },
    async updateService(context, payload) {
      const response = await request.updateServiceUsingPUT(payload)
      return response
    },
    async deleteService(context, payload) {
      const response = await request.deleteServiceUsingDELETE(payload)
      return response
    },
    async getPodList({ commit }, payload) {
      const response = await request.getPodListByOwnerUsingPOST(payload)
      commit('changePodList', response)
    },
  },
}

export default resource
