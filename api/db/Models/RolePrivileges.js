const mongoose = require('mongoose');

const rolePrivilegesSchema = new mongoose.Schema(
    {
        role_id:{
            type: mongoose.Schema.Types.ObjectId,
            required: true, // bu alan zorunludur
        },
        permision: {typer: String, required: true}, // permission alanı zorunludur
        created_by:{
            type: mongoose.Schema.Types.ObjectId, // ObjectId türünde bir alan
            required: true, // bu alan zorunludur
        }
    },

    {
        versionKey: false, // __v alanını eklemez
        timestamps : true, // createdAt ve updatedAt alanlarını otomatik olarak ekler
    }
);

class RolePrivileges extends mongoose.Model{

    //buraya sınıfının metodlarını yazabiliriz

}

rolePrivilegesSchema.loadClass(RolePrivileges); 
module.exports = mongoose.model("rolePrivileges", rolePrivilegesSchema); 