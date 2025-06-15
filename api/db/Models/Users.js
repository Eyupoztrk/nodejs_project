const mongoose = require('mongoose');
const CustomError = require("../../lib/Error");
const Enum = require("../../config/Enum");
const is = require("is_js");
const bcrypt = require('bcrypt'); // Şifreleme için bcrypt modülünü içe aktar

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

    validPassword(password)
    {
        return bcrypt.compareSync(password,this.password);
    }

    static validateFieldsBeforeAuth(email,password)
    {
        if(typeof password !== "string" || password.length < Enum.PASS_LENGTH || is.not.email(email))
            throw new CustomError(Enum.HTTP_CODES.UNAUTHORIZED,"Valitadion Error", "Email or password is wrong");
        return null;
    }

}

userSchema.loadClass(Users); // userSchema'ya Users sınıfını yükler, böylece Users sınıfının metodlarını kullanabiliriz
module.exports = mongoose.model("users", userSchema); // users adında bir model oluşturur, bu modeli dışarıya açar