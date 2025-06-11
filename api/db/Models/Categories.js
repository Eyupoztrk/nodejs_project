const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema(
    {
        is_active: {type: Boolean, default: true}, // is_active alanı varsayılan olarak true'dur
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true, // bu alan zorunludur
        }

    },

    {
        versionKey: false, // __v alanını eklemez
        timestamps : true, // createdAt ve updatedAt alanlarını otomatik olarak ekler
    }
);

class Categories extends mongoose.Model{

    //buraya sınıfının metodlarını yazabiliriz

}

categoriesSchema.loadClass(AuditLogs); 
module.exports = mongoose.model("categories", categoriesSchema); 