const express = require('express'); // Express framework'ü içe aktar
const router = express.Router(); // Router nesnesi oluştur
const Enum = require('../config/Enum');
const Response = require('../lib/Response');
const moment = require('moment'); // zaman yönetimi sağlayan kütüphanedir

const AuditLogs = require('../db/Models/AuditLogs');


router.post('/', async (req, res) => {  // post yaptık çünkü req.body ile daha iyi veri alınır post yaparsak

    try {
        // Auditlogs çok büyük bir tablo olacğaından daha düzenli hale getirmek gerekiyor
        let body = req.body;
        let query = {};

        let skip = body.skip;
        let limit = body.limit;

        if(typeof body.skip !== "numeric")
        {
            skip = 0;
        }
        if(typeof body.limit !=="numeric" || body.limit >500)
        {
            limit = 500;
        }

        if (body.begin_date && body.end_date)  // eğer hali hazırda bir tarih aralığı varsa
        {
            // eğer oluşum zamanı başlangıç zamanından büyük ve bitiş zamamından küçükse querye atama yap
            query.created_at = {
                $gte: moment(body.begin_date),
                $lte: moment(body.end_date)
            }
        }
        else {
            // 'created_at' alanı, bugünün tarihine göre SON 1 GÜN içindeki verileri filtreler:
            // $gte (greater than or equal) -> bugünden 1 gün önceki tarihin 00:00'ı (günün başlangıcı)
            // $lte (less than or equal) -> şu anki an (şu saniye)
            // moment().subtract(1, "day").startOf("day") -> dünden itibaren saat 00:00
            // moment() -> şu anki zaman
            query.created_at = {
                $gte: moment().subtract(1, "day").startOf("day"),
                $lte: moment()
            };


        }

        let auditLogs = await AuditLogs.find(query).sort({created_at: -1}).skip(skip).limit(limit); // 500 satır getir demek ve skip ile süreki sürekli 500er olarak getir demek
        // ve created_at ile yani ilk yapılanlara göre tersten sıralama demek (-1 oluğu için)
        res.json(Response.successResponse(auditLogs));


    } catch (err) {
        res.json(Response.errorResponse(err, Enum.HTTP_CODES.BAD_REQUEST, "BAD REQUEST"));
    }

});

module.exports = router; // Bu router'ı dışarıya açar, böylece diğer dosyalarda kullanılabilir hale getirir