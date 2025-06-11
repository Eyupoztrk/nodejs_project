const mongoose = require('mongoose');

const auditLogsSchema = new mongoose.Schema(
    {
        level: String, // log seviyesi (info, warn, error vb.)
        email: String,
        location: String,
        proc_type: String,
        log: String, // log mesajı,

    },

    {
        versionKey: false, // __v alanını eklemez
        timestamps : true, // createdAt ve updatedAt alanlarını otomatik olarak ekler
    }
);

class AuditLogs extends mongoose.Model{

    //buraya sınıfının metodlarını yazabiliriz

}

auditLogsSchema.loadClass(AuditLogs); 
module.exports = mongoose.model("audit_logs", auditLogsSchema); 