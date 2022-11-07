import CryptoJS from 'crypto-js'

const cryptLib = (() => {
  // console.error(process.env.VUE_APP_ENC_KEY)
  // console.log(CryptoJS)

  const encrypt = data => {
    const encrypted = CryptoJS.AES.encrypt(
      data,
      process.env.VUE_APP_ENC_KEY,
    ).toString()
    return encrypted
  }

  const decrypt = encrypted => {
    const bytes = CryptoJS.AES.decrypt(encrypted, process.env.VUE_APP_ENC_KEY)
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)
    return decrypted
  }

  return { encrypt, decrypt }
})()

export default cryptLib
