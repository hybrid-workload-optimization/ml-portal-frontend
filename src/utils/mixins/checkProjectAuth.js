export const checkProjectAuth = {
  data() {
    return { isProjectAuth: false, projectUserRoleList: [] }
  },
  mounted() {},
  methods: {
    checkProjectAuth(projectIdx) {
      if (!projectIdx) {
        // Project 메뉴가 아닌경우 기본 권한을 따라감
        this.checkDefaultAuth()
        return
      }
      const { userInfo } = this.$store.state.loginUser
      if (
        userInfo &&
        userInfo.userRole &&
        ['SYSTEM_ADMIN', 'PORTAL_ADMIN'].includes(
          userInfo.userRole.userRoleCode,
        )
      ) {
        // 관리자의 경우 Default 권한을 따라감
        this.checkDefaultAuth()
      } else {
        // Manager 및 Member는 Project 권한을 따라감
        this.projectUserRoleList = this.$store.state.loginUser.projectUserRole
        if (projectIdx) {
          const { currentMenuInfo } = this.$store.state.loginUser
          const projectUserRole = this.projectUserRoleList[projectIdx]
          if (projectUserRole) {
            const result = this.findMenuByMenuIdx(
              projectUserRole,
              currentMenuInfo.menuIdx,
            )
            this.isProjectAuth = result
          } else {
            this.isProjectAuth = false
          }
        } else {
          this.isProjectAuth = false
        }
      }
    },
    checkDefaultAuth() {
      const { currentMenuInfo } = this.$store.state.loginUser
      // console.log(currentMenuInfo)
      this.isProjectAuth = currentMenuInfo.writableYn === 'Y'
    },
    findMenuByMenuIdx(menuList, menuIdx) {
      return menuList.some(menu => {
        if (menu.menuIdx === menuIdx && menu.writableYn === 'Y') {
          return menu
        }
        if (menu.subMenuList && menu.subMenuList.length) {
          return this.findMenuByMenuIdx(menu.subMenuList, menuIdx)
        }
        return false
      })
    },
  },
}
