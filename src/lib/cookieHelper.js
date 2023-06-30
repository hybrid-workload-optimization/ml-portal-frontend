const cookieHelper = {
  setCookie: (key, value, validSec, date) => {
    if (!validSec) {
      validSec = 60 * 60 * 24
    }
    if (date) {
      date = new Date(date * 1000)
    }
    if (!date) {
      const currentDate = new Date()
      date = new Date(currentDate.getTime() + validSec * 1000)
    }

    // document.cookie = `${key}=${value};expires=${date.toString()};path=/`
    document.cookie = `${key}=${value};expires=${date.toUTCString()};path=/` // 브라우저 종료시에 refresh token이 남아있어서 expires 삭제
  },
  getCookie: key => {
    const value = document.cookie.match(`(^|;) ?${key}=([^;]*)(;|$)`)
    return value ? value[2] : null
  },
  removeCookie: key => {
    const date = new Date()
    document.cookie = `${key}= ; expires=${date.toUTCString()}; path=/`
  },
}

export default cookieHelper
