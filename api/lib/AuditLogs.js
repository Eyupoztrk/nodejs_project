const Enum = require("../config/Enum");
const AuditLogsDB = require("../db/Models/AuditLogs");


let instance = null;

class AuditLogs {
    constructor() {
        if (!instance)
            instance = this;

        return instance;
    }

    info(email, location, proc_type, log) {
        this.#saveToDB({
            level: Enum.LOG_LEVELS.INFO,
            email, location, proc_type, log
        });
    }

    warn(email, location, proc_type, log) {
        this.#saveToDB({
            level: Enum.LOG_LEVELS.WARN,
            email, location, proc_type, log
        });
    }

    debug(email, location, proc_type, log) {
        this.#saveToDB({
            level: Enum.LOG_LEVELS.DEBUG,
            email, location, proc_type, log
        });
    }

    // veritabanına kaydı await ile yapmadık çünkü her log kaydında bekleyecek ve çok fazla yavaşlar
    // # işareti koyduk başına ve bu sayede sadece bu class içinde erişilebilir olacak (pritave yaptık)
    #saveToDB({ level, email, location, proc_type, log }) {
        AuditLogsDB.create({
            level,
            email,
            location,
            proc_type,
            log
        });
    }

}

module.exports = new AuditLogs;