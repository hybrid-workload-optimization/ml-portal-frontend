const cookieHelper = {
  setCookie: (key, value, validSec) => {
    // 저장시 encrypt 할지 생각 해 볼것
    if (!validSec) {
      validSec = 60 * 60 * 24
    }
    const date = new Date()
    date.setTime(date.getTime() + validSec * 1000)
    // document.cookie = `${key}=${value};expires=${date.toString()};path=/`
    document.cookie = `${key}=${value};path=/` // 브라우저 종료시에 refresh token이 남아있어서 expires 삭제
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
