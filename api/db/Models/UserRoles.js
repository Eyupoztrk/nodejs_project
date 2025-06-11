const mongoose = require('mongoose');

const userRolesSchema = new mongoose.Schema(
    {
        role_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true, // bu alan zorunludur
        },
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true, // bu alan zorunludur
        },
      
    },

    {
        versionKey: false, // __v alanını eklemez
        timestamps : true, // createdAt ve updatedAt alanlarını otomatik olarak ekler
    }
);

class UserRoles extends mongoose.Model{

    //buraya sınıfının metodlarını yazabiliriz

}

userRolesSchema.loadClass(UserRoles); 
module.exports = mongoose.model("user_roles", userRolesSchema); 