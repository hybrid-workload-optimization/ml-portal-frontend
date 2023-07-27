import request from '@/lib/request'
import { api, date } from '@/utils/common'
import moment from 'moment'

const resource = {
  namespaced: true,
  state: {
    dataList: [],
    detailInfo: {
      id: null,
      clusterId: '',
      name: '',
      namespace: '',
      uid: '',
      podState: {},
      annotation: [],
      label: {},
      createdAt: '',
      clusterName: '',
      projectIdx: '',
      // yaml: '',
    },
    resourceInfo: {
      completed: '',
      parallel: '',
      image: '',
    },
    podState: {
      active: '',
      succeeded: '',
    },
    podList: [],
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
    podList(state) {
      return state.podList
    },
    podState(state) {
      return state.podState
    },
  },
  mutations: {
    // state 데이터 초기화
    initJobState(state) {
      state.dataList = []
      state.detailInfo = {
        id: null,
        clusterId: '',
        name: '',
        namespace: '',
        uid: '',
        podState: {},
        annotation: [],
        label: {},
        createdAt: '',
        clusterName: '',
        projectIdx: '',
        // yaml: '',
      }
      state.resourceInfo = {
        completed: '',
        parallel: '',
        image: '',
      }
      state.conditions = []
    },
    initJobDataList(state) {
      state.dataList = []
    },
    changeDateList(state, payload) {
      const { data } = payload
      const { result } = data
      const dataList = []
      result.content.forEach(e => {
        const item = {
          ...e,
          age: `${date.getDiffFromToday(e.createdAt)}`,
          label: '',
        }
        if (e.label) {
          for (const [key, value] of Object.entries(e.label)) {
            item.label += `${key}:${value}`
          }
        }
        dataList.push(item)
      })

      state.dataList = dataList
    },

    // [스테이트풀셋 상세 정보] 객체 생성
    changeDetailInfo(state, payload) {
      state.detailInfo = {}

      const { data } = payload
      const { result } = data
      if (result) {
        state.detailInfo.id = result.id
        state.detailInfo.name = result.name
        state.detailInfo.namespace = result.namespace
        state.detailInfo.uid = result.uid
        state.detailInfo.label = result.label
        state.detailInfo.createdAt = result.createdAt
        state.detailInfo.clusterId = result.clusterId
        state.detailInfo.clusterIdx = result.clusterIdx
        state.detailInfo.clusterName = result.clusterName
        state.detailInfo.podState = result.podState
        state.detailInfo.projectIdx = result.projectIdx
        // state.detailInfo.yaml = result.yaml

        if (result.annotation) {
          state.detailInfo.annotation = []
          for (const [key, value] of Object.entries(result.annotation)) {
            state.detailInfo.annotation.push(`${key}:${value}`)
          }
        }

        state.resourceInfo = {
          completed: result.completed?.toString(),
          parallel: result.parallel?.toString(),
          image: result.image,
        }

        state.podState = {
          active: result.active?.toString(),
          succeeded: result.succeeded?.toString(),
        }
        // state.podList = result.pods || []
      }
    },
    // [파드 리스트 정보] 객체 생성
    changePodList(state, payload) {
      state.podList = []
      // const { data } = payload
      const result = payload
      const podList = []

      result.forEach(e => {
        const item = {
          uid: e.uid,
          name: e.name,
          namespace: e.namespace,
          label: '',
          node: e.node,
          status: e.status,
          createdAt: moment(e.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        }
        if (e.labels) {
          let count = 1
          for (const [key, value] of Object.entries(e.labels)) {
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
    async getList({ commit }, payload) {
      const param = {
        page: 1,
        size: 100,
        ...payload,
      }
      try {
        commit('initJobDataList')
        const response = await api.getAllData(request.getJobListUsingGET, param)
        commit('changeDateList', response)
      } catch (error) {
        commit('alert/openAlert', '데이터를 가져오는데 실패했습니다.', {
          root: true,
        })
      }
    },
    // 스테이트풀셋 상세 정보 조회 요청
    async getDetail({ commit }, payload) {
      try {
        const response = await request.getJobUsingGET(payload)
        await commit('changeDetailInfo', response)
      } catch (error) {
        console.error(error)
        commit('alert/openAlert', '데이터를 가져오는데 실패했습니다.', {
          root: true,
        })
      }
    },
    async getDetailNew({ commit }, payload) {
      try {
        const response = await request.getDetailUsingPOST(payload)
        console.log(response)
        await commit('changeDetailInfo', response)
        await commit('changePodList', response.data.result.pods)
      } catch (error) {
        console.error(error)
        commit('alert/openAlert', '데이터를 가져오는데 실패했습니다.', {
          root: true,
        })
      }
    },

    // job yaml 정보 조회 요청
    async getJobYaml(context, payload) {
      const response = await request.getJobYamlUsingGET(payload)
      return response
    },
    // job 생성 요청
    async createJob(context, payload) {
      console.log('payload === ', payload)
      const response = await request.postJobUsingPOST(payload)
      return response
    },
    // job 수정 요청
    async updateJob(context, payload) {
      const response = await request.putJobUsingPUT(payload)
      return response
    },
    // job 삭제 요청
    async deleteJob(context, payload) {
      const response = await request.deleteJobUsingDELETE(payload)
      return response
    },
    async getPodList({ commit }, payload) {
      const response = await request.getPodListByOwnerUsingPOST(payload)
      commit('changePodList', response)
    },
  },
}

export default resource
