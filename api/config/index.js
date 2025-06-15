/* eslint-disable no-undef */
module.exports ={
    "PORT": process.env.PORT || "3000", // Uygulamanın dinleyeceği port, varsayılan olarak 3000 olarak ayarlanır
    "LOG_LEVEL": process.env.LOG_LEVEL || "info", // Log seviyesi, varsayılan olarak "info" olarak ayarlanır
    "CONNECTION_STRING": process.env.CONNECTION_STRING || "mongodb://localhost:27017/deneme", // MongoDB bağlantı dizesi, varsayılan olarak "mongodb://localhost:27017/mydatabase" olarak ayarlanır
    "JWT": {
        "SECRET": "123456",
        "EXP_TIME": !isNaN(parseInt(process.env.TOKEN_EXPIRE_TIME)) ? parseInt(process.env.TOKEN_EXPIRE_TIME) : 24 * 60 * 60
    }
}