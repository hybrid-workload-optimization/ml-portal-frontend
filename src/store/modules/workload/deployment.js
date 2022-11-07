import request from '@/lib/request'
import moment from 'moment'
import { api, date } from '@/utils/common'

const resource = {
  namespaced: true,
  state: {
    deploymentList: [],
    detailInfo: {
      projectIdx: '',
      resourceInfo: {
        strategy: '-',
        selector: [],
      },
      rollingUpdateStrategy: {
        maxSurge: '',
        maxUnavailable: '',
      },
      podState: {
        updated: '',
        replicas: '',
        ready: '',
      },
      condition: [],
    },
    podList: [],
  },
  getters: {
    deploymentList(state) {
      return state.deploymentList
    },
    deploymentListSize(state) {
      return state.deploymentList.length
    },
    deploymentDetailInfo(state) {
      return state.detailInfo
    },
    podList(state) {
      return state.podList
    },
  },
  mutations: {
    // state 데이터 초기화
    initDeployment(state) {
      state.deploymentList = []
      state.detailInfo = {
        projectIdx: '',
        resourceInfo: {
          strategy: '-',
          selector: [],
        },
        rollingUpdateStrategy: {
          maxSurge: '',
          maxUnavailable: '',
        },
        podState: {
          updated: '',
          replicas: '',
          ready: '',
        },
        condition: [],
      }
    },
    initDeploymentList(state) {
      state.deploymentList = []
    },

    changeDataList(state, payload) {
      state.deploymentList = []
      const { data } = payload
      const { result } = data
      const deploymentList = []
      result.content.forEach(e => {
        if (!e.podReady) {
          e.podReady = 0
        }
        if (!e.podReplicas) {
          e.podReplicas = 0
        }
        const item = {
          idx: e.idx,
          name: e.name,
          clusterName: e.clusterName,
          namespace: e.namespaceName,
          pod: `${e.podReady}/${e.podReplicas}`,
          image: e.image,
          age: `${date.getDiffFromToday(e.createdAt)}`,
          label: '',
        }
        if (e.label) {
          e.label = JSON.parse(e.label)
          let count = 0
          for (const [key, value] of Object.entries(e.label)) {
            if (count >= 1) {
              item.label += ', '
            }
            item.label += `${key}:${value}`
            count += 1
          }
        }

        deploymentList.push(item)
      })
      state.deploymentList = deploymentList
    },

    changeDetailInfo(state, payload) {
      state.detailInfo = {
        projectIdx: '',
        resourceInfo: {
          strategy: '-',
          selector: [],
        },
        rollingUpdateStrategy: {
          maxSurge: '',
          maxUnavailable: '',
        },
        podState: {
          updated: '',
          replicas: '',
          ready: '',
        },
        condition: [],
      }

      const { data } = payload
      const { result } = data
      if (result) {
        state.detailInfo.idx = result.idx
        state.detailInfo.title = `${result.clusterName} / ${result.name}`
        state.detailInfo.name = result.name
        state.detailInfo.namespace = result.namespaceName
        state.detailInfo.uid = result.uid
        state.detailInfo.image = result.image
        state.detailInfo.createdAt = moment(result.createdAt).format(
          'YYYY-MM-DD HH:mm:ss',
        )
        state.detailInfo.clusterId = result.clusterId
        state.detailInfo.clusterIdx = result.clusterIdx
        state.detailInfo.replicaSetUid = result.replicaSetUid
        state.detailInfo.projectIdx = result.projectIdx
        // state.detailInfo.yaml = result.yaml

        if (result.label) {
          if (typeof result.selector === 'string') {
            result.label = JSON.parse(result.label)
          }
          state.detailInfo.label = []
          for (const [key, value] of Object.entries(result.label)) {
            state.detailInfo.label.push(`${key}:${value}`)
          }
        }
        if (result.annotation && !result.annotation === 'null') {
          if (typeof result.selector === 'string') {
            result.annotation = JSON.parse(result.annotation)
          }
          state.detailInfo.annotation = []
          for (const [key, value] of Object.entries(result.annotation)) {
            state.detailInfo.annotation.push(`${key}:${value}`)
          }
        }
        const selectors = []
        if (result.selector) {
          if (typeof result.selector === 'string') {
            result.selector = JSON.parse(result.selector)
          }

          for (const [key, value] of Object.entries(result.selector)) {
            selectors.push(`${key}:${value}`)
          }
        }
        state.detailInfo.resourceInfo = {
          strategy: result.strategy,
          selector: selectors,
        }
        state.detailInfo.rollingUpdateStrategy = {
          maxSurge: `${result.maxSurge}`,
          maxUnavailable: `${result.maxUnavailable}`,
        }
        state.detailInfo.podState = {
          updated: result.podUpdated,
          replicas: result.podReplicas,
          ready: result.podReady,
        }
        if (result.condition) {
          if (typeof result.condition === 'string') {
            result.condition = JSON.parse(result.condition)
          }
          result.condition.forEach(e => {
            e.lastUpdateTime = moment(e.lastUpdateTime).format(
              'YYYY-MM-DD HH:mm:ss',
            )
            e.lastTransitionTime = moment(e.lastTransitionTime).format(
              'YYYY-MM-DD HH:mm:ss',
            )
            state.detailInfo.condition.push(e)
          })
        }
      }
    },

    // [파드 리스트 정보] 객체 생성
    changePodList(state, payload) {
      state.podList = []
      const { data } = payload
      const { result } = data
      const podList = []
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
    async getDeploymentList({ commit }, payload) {
      const param = {
        page: 1,
        size: 100,
        clusterIdx: payload.clusterIdx,
        namespaceIdx: payload.namespaceIdx,
      }

      const response = await api.getAllData(
        request.getDeploymentListUsingGET,
        param,
      )
      commit('changeDataList', response)
    },

    async getDeploymentDetail({ commit }, payload) {
      const response = await request.getDeploymentUsingGET(payload)
      commit('changeDetailInfo', response)
    },

    async getDeploymentYaml(context, payload) {
      const response = await request.getDeploymentYamlUsingGET(payload)
      return response
    },

    async createDeployment(context, payload) {
      const response = await request.postDeploymentUsingPOST(payload)
      return response
    },

    async updateDeployment(context, payload) {
      const response = await request.putDeploymentUsingPUT(payload)
      return response
    },

    async deleteDeployment(context, payload) {
      const response = await request.deleteDeploymentUsingDELETE(payload)
      return response
    },
    async getPodList({ commit }, payload) {
      const response = await request.getPodListByOwnerUsingPOST(payload)
      commit('changePodList', response)
    },
  },
}

export default resource
