const crypto = require('crypto')

encryptionPassword =  password =>{
    let encryption = crypto.createHash('sha512').update(password).digest('base64')
    return encryption
}

module.exports = encryptionPassword