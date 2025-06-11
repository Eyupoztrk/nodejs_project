const mongose = require('mongoose');
// Mongoose ile MongoDB bağlantısı için gerekli ayarlar

let instance = null;
class Database{
    constructor() {
        if(!instance)
        {
            this.mongoConnetion = null; // MongoDB bağlantısı için kullanılacak değişken
            instance = this;  // singleton
        }
        return instance;
    }

    async connect(options)
    {
        let db = await mongose.connect(options.CONNECTION_STRING);
        this.mongoConnetion = db.connection; // Bağlantı başarılı ise bağlantı nesnesini sakla
        console.log("MongoDB bağlantısı başarılı");
    }



}

module.exports = Database; // bu dosyayı dışarıya açar, diğer dosyalarda kullanılabilir hale getirir