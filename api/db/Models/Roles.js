const mongoose = require('mongoose');

const rolesSchema = new mongoose.Schema(
    {
        role_name: {type: String, required: true}, // role_name alanı zorunludur
        is_active: {type: Boolean, default: true}, // is_active alanı varsayılan olarak true'dur
        created_by: {
            type: mongoose.Schema.Types.ObjectId, // ObjectId türünde bir alan
            required: true, // bu alan zorunludur
        },
    },

    {
        versionKey: false, // __v alanını eklemez
        timestamps : true, // createdAt ve updatedAt alanlarını otomatik olarak ekler
    }
);

class Roles extends mongoose.Model{

    //buraya Roles sınıfının metodlarını yazabiliriz

}

rolesSchema.loadClass(Roles); // rolesScheme'ya Roles sınıfını yükler, böylece Roles sınıfının metodlarını kullanabiliriz
module.exports = mongoose.model("roles", rolesSchema); // roles adında bir model oluşturur, bu modeli dışarıya açar