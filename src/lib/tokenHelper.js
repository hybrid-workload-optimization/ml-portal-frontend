import cryptoJs from 'crypto-js'

const tokenHelper = {
  encrypt(token, url, method, timestamp) {
    let returnStr = ''
    try {
      const keyStr = this.generateKey(url, method, timestamp)
      const ivStr = keyStr.substring(0, 16)
      const key = cryptoJs.enc.Utf8.parse(keyStr)
      const iv = cryptoJs.enc.Utf8.parse(ivStr)
      returnStr = cryptoJs.AES.encrypt(token, key, { iv }).toString()
    } catch (error) {
      console.error(error)
    }
    return returnStr
  },
  generateKey(url, method, timestamp) {
    const hashModule = cryptoJs.algo.MD5.create()
    hashModule.update(url)
    hashModule.update(method.toUpperCase())
    hashModule.update(String(timestamp))
    const returnKey = hashModule.finalize().toString()

    return returnKey
  },
}

export default tokenHelper
