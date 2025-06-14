// erişmek istediğimiz format:
// [2025-05-05 12:12:12] INFO: [emil:sdsas] [location:dczx] [proc_type:asdaf] [log:{}]

const {format, createLogger, transports} = require("winston"); // bu şekilde winston objesi yapmak yerine onun fonksiyonlarını import ettik
const {LOG_LEVEL} = require("../../config")

const formats = format.combine(
    format.timestamp({format: "YYYY-MM-DD HH:mm:ss.SSS"}),  // tarih ve saat formatı
    format.simple(),
    format.splat(),
    format.printf(info => `${info.timestamp} ${info.level.toUpperCase()}: [email:${info.message.email}] [location:${info.message.location}] [procType:${info.message.proc_type}] [log:${info.message.log}]`)
);

const logger = createLogger(
{
    level: LOG_LEVEL,
    transports: [
        new (transports.Console)({format: formats})
    ]
});

module.exports = logger;
