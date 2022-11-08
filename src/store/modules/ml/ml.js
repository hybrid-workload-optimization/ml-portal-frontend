import request from '@/lib/request'
import { api } from '@/utils/common'

const resource = {
  namespaced: true,
  state: {
    dataList: [],
    detailInfo: {},
    clusterInfo: {},
    clusterSize: 0,

    mlStep: '',
    jobCount: '',
    deploymentCount: '',
    cronJobCount: '',
    daemonSetCount: '',
    replicaSetCount: '',

    dataClusterAllList: [],
    dataClusterList: [],
    dataGridClusterList: [],
    dataMemberAllList: [],
    dataMemberList: [],
    dataGridMemberList: [],
    dataUserAllListForSelect: [],
    dataUserClusterList: [],
    dataUserAllList: [],
    dataDetailClusterList: [],
    dataDetailUserList: [],
    userSize: 0,

    newProjectName: '',
    newDescription: '',
    newClusterList: [],
    newPmUser: null,
    newUserList: [],

    deleteClusterIdxs: [],

    dataUserRoleList: [],

    dataUserRoleAllList: [],

    dataManagerUserList: [],

    dataUserMenuList: [],

    editProjectName: '',
    editDescription: '',
    editClusterList: [],
    editPmUser: null,
    editUserList: [],
  },

  getters: {
    clusterInfo(state) {
      return state.clusterInfo
    },
    dataList(state) {
      return state.dataList
    },
    dataListSize(state) {
      return state.dataList.length
    },

    detailInfo(state) {
      return state.detailInfo
    },
    /* dataClusterAllList(state) {
      return state.dataClusterAllList
    },
    dataClusterList(state) {
      return state.dataClusterList
    }, */
    dataGridClusterList(state) {
      return state.dataGridClusterList
    },
    /* dataMemberAllList(state) {
      return state.dataMemberAllList
    },
    dataMemberList(state) {
      return state.dataMemberList
    }, */
    dataGridMemberList(state) {
      return state.dataGridMemberList
    },
    dataUserAllListForSelect(state) {
      return state.dataUserAllListForSelect
    },
    dataUserClusterList(state) {
      return state.dataUserClusterList
    },
    dataUserAllList(state) {
      return state.dataUserAllList
    },
    dataDetailClusterList(state) {
      return state.dataDetailClusterList
    },
    clusterSize(state) {
      return state.clusterSize
    },
    dataDetailUserList(state) {
      return state.dataDetailUserList
    },
    userSize(state) {
      return state.userSize
    },
    dataUserRoleList(state) {
      return state.dataUserRoleList
    },
    dataUserRoleAllList(state) {
      return state.dataUserRoleAllList
    },
    dataManagerUserList(state) {
      return state.dataManagerUserList
    },
    dataUserMenuList(state) {
      return state.dataUserMenuList
    },
  },

  mutations: {
    initProjectInfo(state) {
      state.newProjectName = ''
      state.newDescription = ''
      state.newPmUser = null
      state.newClusterList = []
      state.newUserList = []

      state.editProjectName = ''
      state.editDescription = ''
      state.editClusterList = null
      state.editPmUser = null
      state.editUserList = null
    },

    // ML 조회 리스트
    getMLList(state, payload) {
      const { data } = payload
      const { result } = data
      const dataList = []
      result.content.forEach(e => {
        const item = {
          id: e.id,
          mlId: e.mlId,
          name: e.name,
          description: e.description,
          mlStep: e.mlStep,
          status: e.status,
          resource: e.resourceCount,
          createdAt: e.createdAt,
          updatedAt: e.updatedAt,
          userId: e.userId,
        }
        dataList.push(item)
      })
      state.dataList = dataList
    },

    // ML 데이터 조회
    // TODO -> 추후 세분화 작업
    getMLDetail(state, payload) {
      state.detailInfo = {}
      const { data } = payload
      const { result } = data

      if (result) {
        state.detailInfo.id = result.id
        state.detailInfo.mlId = result.mlId
        state.detailInfo.name = result.name
        state.detailInfo.description = result.description
        state.detailInfo.mlStepCode = result.mlStepCode
        state.detailInfo.status = result.status
        state.detailInfo.projectPmEmail = result.projectPmEmail
        state.detailInfo.createdAt = result.createdAt
        state.detailInfo.updatedAt = result.updatedAt
        state.detailInfo.userId = result.userId

        state.detailInfo.activeCount = result.activeCount
        state.detailInfo.succeededCount = result.succeededCount
        state.detailInfo.failedCount = result.failedCount

        state.detailInfo.clusterInfo = result.cluster
        // TODO -> 파라미터로 clusterSize를 받을수 있나?
        let clusterSize = 0
        if (result.cluster.length === undefined) {
          clusterSize = 1
        } else {
          clusterSize = result.cluster.length
        }
        state.detailInfo.clusterSize = clusterSize

        state.detailInfo.mlStep = result.mlStep
        state.detailInfo.jobCount = result.jobCount
        state.detailInfo.deploymentCount = result.deploymentCount
        state.detailInfo.cronJobCount = result.cronJobCount
        state.detailInfo.daemonSetCount = result.daemonSetCount
        state.detailInfo.replicaSetCount = result.replicaSetCount

        state.detailInfo.resources = result.resources
      }
    },

    getProjectClusterAllList(state, payload) {
      const { data } = payload
      const { result } = data
      const dataClusterAllList = []
      result.forEach(e => {
        const item = {
          clusterIdx: e.clusterIdx,
          clusterName: e.clusterName,
          description: e.description,
          isAdded: false,
        }

        dataClusterAllList.push(item)
      })

      state.dataGridClusterList = dataClusterAllList
    },

    getProjectClusterList(state, payload) {
      const { data } = payload
      const { result } = data
      // const dataClusterList = []
      result.forEach(e => {
        const item = {
          clusterIdx: e.clusterIdx,
          clusterName: e.clusterName,
          description: e.description,
          isAdded: true,
        }

        state.dataGridClusterList.push(item)
      })
    },

    getProjectMemberAllList(state, payload) {
      const { data } = payload
      const { result } = data
      const dataMemberAllList = []
      result.forEach(e => {
        const item = {
          userId: e.userId,
          userName: e.userName,
          email: e.email,
          // projectUserRole: 'DE',
          userRoleIdx: 6,
          isAdded: false,
        }

        dataMemberAllList.push(item)
      })

      state.dataGridMemberList = dataMemberAllList
    },

    getProjectMemberList(state, payload) {
      const { data } = payload
      const { result } = data
      // const dataClusterList = []
      result.forEach(e => {
        const item = {
          userId: e.userId,
          userName: e.userName,
          email: e.email,
          // projectUserRole: e.projectUserRole,
          userRoleIdx: e.userRoleIdx,
          isAdded: true,
        }

        state.dataGridMemberList.push(item)
      })
    },

    getPortalUserAllListForSelect(state, payload) {
      const { data } = payload
      const { result } = data
      const dataUserListForSelect = []
      result.forEach(e => {
        const item = {
          text: `${e.userName} (${e.email})`,
          value: e.userId,
        }

        dataUserListForSelect.push(item)
      })

      state.dataUserAllListForSelect = dataUserListForSelect
    },

    getPortalUserClusterList(state, payload) {
      const { data } = payload
      const { result } = data
      const dataClusterList = []
      result.forEach(e => {
        const item = {
          clusterIdx: e.clusterIdx,
          clusterName: e.clusterName,
          description: e.description,
          isAdded: false,
        }

        dataClusterList.push(item)
      })

      state.dataUserClusterList = dataClusterList
    },

    getPortalUserAllList(state, payload) {
      const { data } = payload
      const { result } = data
      const dataUserList = []
      result.forEach(e => {
        const item = {
          userId: e.userId,
          userName: e.userName,
          email: e.email,
          // projectUserRole: 'DE',
          userRoleIdx: 6,
          isAdded: false,
        }

        dataUserList.push(item)
      })

      state.dataUserAllList = dataUserList
    },

    getProjectDetailClusterList(state, payload) {
      const { data } = payload
      const { result } = data
      const dataClusterList = []
      result.forEach(e => {
        const item = {
          img: 'icon_cloud.svg',
          id: e.clusterIdx,
          clusterName: e.clusterName,
          nodeCount: e.nodeCount,
          provider: e.provider,
          providerVersion: e.providerVersion,
          description: e.description,
          provisioningType: e.provisioningType,
          provisioningStatus: e.provisioningStatus,
          addedAt: e.addedAt,
          job: 'Cluster',
        }

        dataClusterList.push(item)
      })

      state.dataDetailClusterList = dataClusterList
      state.clusterSize = dataClusterList.length
    },

    getProjectDetailUserList(state, payload) {
      const { data } = payload
      const { result } = data
      const dataUserList = []
      result.forEach(e => {
        const item = {
          img: 'icon_people.svg',
          id: e.userId,
          userName: e.userName,
          email: e.email,
          organization: e.organization,
          // projectUserRole: e.projectUserRole,
          // projectUserRoleNm: e.projectUserRole === 4 ? 'Project Manager' : 'Developer',
          userRoleIdx: e.userRoleIdx,
          userRoleName: e.userRoleName,
          addedAt: e.createdAt,
          job: 'User',
        }

        dataUserList.push(item)
      })

      state.dataDetailUserList = dataUserList
      state.userSize = dataUserList.length
    },

    getPortalUserRoleListForSelect(state, payload) {
      const { data } = payload
      console.log('data === ', data)
      const { result } = data
      const userRoleList = []
      result.forEach(e => {
        const item = {
          value: e.userRoleIdx,
          text: e.userRoleName,
        }

        userRoleList.push(item)
      })

      state.dataUserRoleList = userRoleList
    },

    getAvaliableUserRoleList(state, payload) {
      const { data } = payload
      // console.log('============== ', data)
      const { result } = data
      const userRoleAllList = []
      result.forEach(e => {
        const item = {
          userRoleIdx: e.userRoleIdx,
          userRoleCode: e.userRoleCode,
        }

        userRoleAllList.push(item)
      })

      state.dataUserRoleAllList = userRoleAllList
    },

    getManagerUserList(state, payload) {
      const { data } = payload
      const { result } = data
      const managerUserList = []
      result.forEach(e => {
        const item = {
          text: `${e.userName} (${e.email})`,
          value: e.userId,
        }

        managerUserList.push(item)
      })

      state.dataManagerUserList = managerUserList
    },

    getUserMenuAllList(state, payload) {
      const { data } = payload
      const { result } = data
      const menuList = []
      result.forEach(e => {
        const item = {
          menuName: e.menuName,
          viewableYn: e.viewableYn,
          writableYn: e.writableYn,
        }

        menuList.push(item)
      })

      state.dataUserMenuList = menuList
    },

    getProjectCurrentClusterList(state, payload) {
      const { data } = payload
      const { result } = data
      const currentClusterList = []
      result.forEach(e => {
        const item = {
          clusterIdx: e.clusterIdx,
          clusterName: e.clusterName,
          description: e.description,
        }

        currentClusterList.push(item)
      })

      state.editClusterList = currentClusterList
    },

    getProjectCurrentMemberList(state, payload) {
      const { data } = payload
      const { result } = data
      const currentMemberList = []
      result.forEach(e => {
        const item = {
          userId: e.userId,
          userName: e.userName,
          email: e.email,
          userRoleIdx: e.userRoleIdx,
        }

        currentMemberList.push(item)
      })

      state.editUserList = currentMemberList
    },
  },

  actions: {
    async getList({ commit }, payload) {
      const param = {
        userId: payload.userId,
        name: payload.projectName,
        pageRequest: {
          page: 1,
          size: 100,
        },
      }

      // getAllData: 페이징정보를 활용하여 순차적으로 전체 데이터를 조회하는 함수 호출
      // getAllData는 옵션이다. 백엔드 API에 paging 구현이 되어있을 경우, 전체 데이터를 조회하고 싶을 경우 사용한다.
      // common.js 참고
      const response = await api.getAllData(request.getMlListUsingPOST, param)
      // const response = await request.getStatefulSetListUsingGET(payload)
      commit('getMLList', response)
    },

    // ML 상세 정보 조회 요청
    async getDetail({ commit }, payload) {
      const response = await request.getMlDetailUsingGET(payload)
      commit('getMLDetail', response)
    },

    // Project Cluster 전체 목록 조회 요청
    async getClusterAllList({ commit }, payload) {
      // const response = await request.getProjectClusterListExceptUseUsingGET(
      const response =
        await request.getProjecClusterListByNotUsedClustersUsingGET(payload)
      commit('getProjectClusterAllList', response)
    },

    // Project Cluster 목록 조회 요청
    async getClusterList({ commit }, payload) {
      const response = await request.getProjectClusterListUsingGET(payload)
      commit('getProjectClusterList', response)
    },

    // Project Mmber 전체 목록 조회 요청
    async getMemberAllList({ commit }, payload) {
      const response = await request.getProjectUserListExceptUseUsingGET(
        payload,
      )
      commit('getProjectMemberAllList', response)
    },

    // Project Member 목록 조회 요청(Project Manager 제외)
    async getMemberList({ commit }, payload) {
      const response = await request.getProjectUserListExceptManagerUsingGET(
        payload,
      )
      commit('getProjectMemberList', response)
    },

    // Project 상세 정보 수정 요청
    async updateProjectCluster(context, payload) {
      const response = await request.updateProjectClusterUsingPATCH(payload)
      return response
    },

    // Project Cluster 수정 요청
    async updateProject(context, payload) {
      const response = await request.updateProjectUsingPATCH(payload)
      return response
    },

    // Project User 수정 요청
    async updateProjectUser(context, payload) {
      const response = await request.updateProjectUserUsingPATCH(payload)
      return response
    },

    // 사용자 전체 목록 조회 요청 For Select Box
    async getUserAllListForSelect({ commit }, payload) {
      const response = await request.getProjecUserListByUseYnUsingGET(payload)
      commit('getPortalUserAllListForSelect', response)
      return response
    },

    // Project 신규 생성 요청
    async createProject(context, payload) {
      const response = await request.createProjectUsingPOST(payload)
      return response
    },

    // 프로젝트로 등록하지 않은 Cluster 리스트 조회
    async getUserClusterList({ commit }, payload) {
      const response =
        await request.getProjecClusterListByNotUsedClustersUsingGET(payload)
      commit('getPortalUserClusterList', response)
      return response
    },

    // 사용자 전체 목록 조회 요청
    async getUserAllList({ commit }, payload) {
      const response = await request.getProjecUserListByUseYnUsingGET(payload)
      commit('getPortalUserAllList', response)
      return response
    },

    // 상세 화면 Project Cluster 목록 조회 요청
    // async getDetailClusterList({ commit }, payload) {
    //   const response = await request.getProjectClusterListUsingGET(payload)
    //   commit('getProjectDetailClusterList', response)
    // },

    // 상세 화면 Project User 목록 조회 요청
    async getDetailUserList({ commit }, payload) {
      // const response = await request.getProjectUserListUsingGET(payload)
      const response = await request.getProjectUserListUsingGET(payload)
      commit('getProjectDetailUserList', response)
    },

    // // 상세 화면 Project Cluster 삭제 요청
    // async deleteProjectCluster(context, payload) {
    //   const response = await request.deleteProjectClusterUsingDELETE(payload)
    //   return response
    // },

    // // 상세 화면 Project User 삭제 요청
    // async deleteProjectUser(context, payload) {
    //   const response = await request.deleteProjectUserUsingDELETE(payload)
    //   return response
    // },

    // Project 삭제 요청
    async deleteProject(context, payload) {
      const response = await request.deleteProjectUsingDELETE(payload)
      return response
    },

    // 사용자 권한 목록 조회 요청 For Select Box
    async getUserRoleListForSelect({ commit }) {
      const response = await request.getProjectUserRoleListUsingGET()
      commit('getPortalUserRoleListForSelect', response)
      return response
    },

    // 모든 사용자 권한 목록 조회 요청
    async getUserRoleAllList({ commit }) {
      const response = await request.getUserRoleAllListUsingGET()
      commit('getAvaliableUserRoleList', response)
      return response
    },

    // 사용자 전체 목록 조회 요청 For Select Box
    async getUserWithManagerList({ commit }, payload) {
      const response = await request.getUserWithManagerListUsingGET(payload)
      commit('getManagerUserList', response)
      return response
    },

    // 사용자의 메뉴 현황
    async getUserMenuList({ commit }) {
      const response = await request.userMenuUsingGET()
      commit('getUserMenuAllList', response)
      return response
    },

    // 현재 Project Cluster 목록 조회 요청 - ProjectEdit.vue 에서 호출
    async getCurrentClusterList({ commit }, payload) {
      const response = await request.getProjectClusterListUsingGET(payload)
      commit('getProjectCurrentClusterList', response)
    },

    // 현재 Project Member 목록 조회 요청(Project Manager 제외) - ProjectEdit.vue 에서 호출
    async getCurrentMemberList({ commit }, payload) {
      const response = await request.getProjectUserListExceptManagerUsingGET(
        payload,
      )
      commit('getProjectCurrentMemberList', response)
    },
  },
}

export default resource
