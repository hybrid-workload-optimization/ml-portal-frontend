import request from '@/lib/request'
import { date } from '@/utils/common'
import moment from 'moment'

const resource = {
  namespaced: true,
  state: {
    dataList: [],
    detailInfo: {
      uid: null,
      name: '',
      size: 0,
      accessMode: '',
      annotation: [],
      reclaimPolicy: '',
      status: '',
      claim: '',
      storageClassName: '',
      createdAt: '',
    },
    resourceInfo: {
      status: '',
      reclaim: '',
      reclaimPolicy: '',
      storageClassName: '',
      accessMode: '',
    },
    source: {
      type: '',
      path: '',
    },
    volume: {
      resourceName: '',
      size: '',
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
    source(state) {
      return state.source
    },
    volume(state) {
      return state.volume
    },
  },
  mutations: {
    initClusterPersistentVolumeListState(state) {
      state.dataList = []
      state.detailInfo = {
        uid: null,
        name: '',
        size: 0,
        accessMode: '',
        reclaimPolicy: '',
        status: '',
        claim: '',
        storageClassName: '',
        createdAt: '',
        annotation: '',
      }
    },
    initClusterPersistentVolumeDataList(state) {
      state.dataList = []
    },

    // [리스트 정보] 객체 생성
    changeDateList(state, payload) {
      const { data } = payload
      const { result } = data
      const dataList = []
      result.forEach(e => {
        const item = {
          uid: e.uid,
          name: e.name,
          size: e.size,
          status: e.status,
          accessMode: e.accessMode,
          reclaimPolicy: e.reclaimPolicy,
          claim: e.claim,
          storageClassName: e.storageClass,
          createdAt: `${date.getDiffFromToday(e.createdAt)}`,
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
      console.log(result)
      if (result) {
        state.detailInfo.id = result.id
        state.detailInfo.name = result.name
        state.detailInfo.uid = result.uid
        state.detailInfo.status = result.status
        state.detailInfo.createdAt = moment(result.createdAt).format(
          'YYYY-MM-DD HH:mm:ss',
        )
        state.detailInfo.clusterIdx = result.clusterIdx
        state.detailInfo.clusterId = result.clusterId
        state.detailInfo.annotation = result.annotation
        if (result.label) {
          state.detailInfo.label = []
          for (const [key, value] of Object.entries(result.label)) {
            state.detailInfo.label.push(`${key}:${value}`)
          }
        }
        state.resourceInfo = {
          status: result.status,
          reclaim: result.reclaim,
          reclaimPolicy: result.reclaimPolicy,
          storageClassName: result.storageClassName,
          accessMode: result.accessMode,
        }
        state.source = {
          type: result.type,
          path: result.path,
        }
        state.volume = {
          resourceName: result.resourceName,
          size: result.size,
        }
      }
    },
  },
  actions: {
    //  리스트 정보 조회 요청
    async getList({ commit }, param) {
      // getAllData: 페이징정보를 활용하여 순차적으로 전체 데이터를 조회하는 함수 호출
      // getAllData는 옵션이다. 백엔드 API에 paging 구현이 되어있을 경우, 전체 데이터를 조회하고 싶을 경우 사용한다.
      // common.js 참고
      const response = await request.getPersistentVolumeListUsingGET(param)
      // const response = await request.getClusterPersistentVolumeListUsingGET(payload)
      console.log('getdatalist', response)
      commit('changeDateList', response)
    },
    //  상세 정보 조회 요청
    async getDetail({ commit }, payload) {
      const response = await request.getClusterPersistentVolumeDetailUsingGET_1(
        payload,
      )
      commit('changeDetailInfo', response)
    },
    //  상세 정보 조회 요청
    async getDetailV2({ commit }, payload) {
      const response = await request.getPersistentVolumeDetailUsingGET(payload)
      commit('changeDetailInfo', response)
    },
    //  yaml 정보 조회 요청
    async getClusterPersistentVolumeYaml(context, payload) {
      const response = await request.getPersistentVolumeYamlUsingGET(payload)
      return response
    },
    //  생성 요청
    async createClusterPersistentVolume(context, payload) {
      const response = await request.registerClusterPersistentVolumeUsingPOST(
        payload,
      )
      return response
    },
    //  수정 요청
    async updateClusterPersistentVolume(context, payload) {
      const response = await request.updateClusterPersistentVolumeUsingPUT(
        payload,
      )
      return response
    },
    // 삭제 요청
    async deleteClusterPersistentVolume(context, payload) {
      const response = await request.deleteClusterPersistentVolumeUsingDELETE(
        payload,
      )
      return response
    },
  },
}

export default resource
