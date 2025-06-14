const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        email: {type: String, required: true, unique: true}, // email alanı zorunludur ve benzersiz olmalıdır
        password: {type: String, required: true}, // password alanı zorunludur
        is_active: {type: Boolean, default: true},
        first_name: String,
        last_name: String,
        phone_number: String,
    },

    {
        timestamps : true, // createdAt ve updatedAt alanlarını otomatik olarak ekler
    }
);

class Users extends mongoose.Model{

    //buraya Users sınıfının metodlarını yazabiliriz

}

userSchema.loadClass(Users); // userSchema'ya Users sınıfını yükler, böylece Users sınıfının metodlarını kullanabiliriz
module.exports = mongoose.model("users", userSchema); // users adında bir model oluşturur, bu modeli dışarıya açar