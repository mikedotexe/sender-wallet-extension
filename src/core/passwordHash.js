const CryptoJS = require('crypto-js')

const saltChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const saltCharsCount = saltChars.length

function generateSalt() {
  let salt = ''
  for (let i = 0; i < 8; i += 1) {
    salt += saltChars.charAt(Math.floor(Math.random() * saltCharsCount))
  }
  return salt
}

function generateHash(salt, password) {
  const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA512, salt)
  hmac.update(password)
  const hash = hmac.finalize()
  return hash.toString()
}

module.exports.generateSalt = () => generateSalt()

module.exports.generate = (salt, password) => {
  if (typeof (password) !== 'string') throw new Error('Invalid password')
  return generateHash(salt, password)
}

module.exports.verify = (password, salt, hashedPassword) => {
  if (!password || !hashedPassword) return false
  return generateHash(salt, password) === hashedPassword
}
