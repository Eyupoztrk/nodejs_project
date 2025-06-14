const mongoose = require('mongoose');
const RolePrivileges = require('./RolePrivileges');

const rolesSchema = new mongoose.Schema(
    {
        role_name: {type: String, required: true, unique: true}, // role_name alanı zorunludur
        is_active: {type: Boolean, default: true}, // is_active alanı varsayılan olarak true'dur
        created_by: {
            type: mongoose.Schema.Types.ObjectId // ObjectId türünde bir alan
             // bu alan zorunludur
        },
    },

    {
        versionKey: false, // __v alanını eklemez
        timestamps : true, // createdAt ve updatedAt alanlarını otomatik olarak ekler
    }
);

class Roles extends mongoose.Model{

    async deleteOne(query)
    {
        if(query._id) // Eğer sorguda _id varsa  
          await RolePrivileges.deleteOne({ role_id: query._id }) // RolePrivileges modelinden role_id'si eşleşen kayıtları siler

       await super.deleteOne(query); // deleteOne metodunu kullanır
    }
    
}

rolesSchema.loadClass(Roles); // rolesScheme'ya Roles sınıfını yükler, böylece Roles sınıfının metodlarını kullanabiliriz
module.exports = mongoose.model("roles", rolesSchema); // roles adında bir model oluşturur, bu modeli dışarıya açar