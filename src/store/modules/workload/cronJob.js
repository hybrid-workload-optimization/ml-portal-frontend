import request from '@/lib/request'
import { api, date } from '@/utils/common'

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
      annotation: [],
      label: {},
      createdAt: '',
      clusterName: '',
      projectIdx: '',
      // yaml: '',
    },
    resourceInfo: {
      schedule: '',
      active: 0,
      pause: '',
      lastSchedule: '',
      concurrencyPolicy: '',
    },
    activeJobList: [],
    inactiveJobList: [],
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
    activeJobList(state) {
      return state.activeJobList
    },
    inactiveJobList(state) {
      return state.inactiveJobList
    },
  },
  mutations: {
    // state 데이터 초기화
    initCronJobState(state) {
      state.dataList = []
      state.detailInfo = {
        id: null,
        name: '',
        namespace: '',
        uid: '',
        annotation: [],
        label: {},
        createdAt: '',
        clusterId: '',
        clusterName: '',
        projectIdx: '',
        // yaml: '',
      }
      state.resourceInfo = {
        schedule: '',
        activeJob: 0,
        status: '',
        lastSchedule: '',
        concurrencyPolicy: '',
      }
    },
    initCronJobDataList(state) {
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
        state.detailInfo.clusterName = result.clusterName
        state.detailInfo.projectIdx = result.projectIdx
        // state.detailInfo.yaml = result.yaml

        if (result.annotation) {
          state.detailInfo.annotation = []
          for (const [key, value] of Object.entries(result.annotation)) {
            state.detailInfo.annotation.push(`${key}:${value}`)
          }
        }

        state.resourceInfo = {
          schedule: result.schedule,
          active: result.active.toString(),
          pause: result.pause,
          lastSchedule: result.lastSchedule,
          concurrencyPolicy: result.concurrencyPolicy,
        }

        state.activeJobList = result.activeJobs
        state.inactiveJobList = result.inactiveJobs
      }
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
        commit('initCronJobDataList')
        const response = await api.getAllData(
          request.getCronJobListUsingGET,
          param,
        )
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
        const response = await request.getCronJobUsingGET(payload)
        await commit('changeDetailInfo', response)
      } catch (error) {
        console.error(error)
        commit('alert/openAlert', '데이터를 가져오는데 실패했습니다.', {
          root: true,
        })
      }
    },
    // CronJob yaml 정보 조회 요청
    async getCronJobYaml(context, payload) {
      const response = await request.getCronJobYamlUsingGET(payload)
      return response
    },
    // CronJob 생성 요청
    async createCronJob(context, payload) {
      const response = await request.postCronJobUsingPOST(payload)
      return response
    },
    // CronJob 수정 요청
    async updateCronJob(context, payload) {
      const response = await request.putCronJobUsingPUT(payload)
      return response
    },
    // CronJob 삭제 요청
    async deleteCronJob(context, payload) {
      const response = await request.deleteCronJobUsingDELETE(payload)
      return response
    },
  },
}

export default resource
