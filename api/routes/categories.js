const express = require('express'); // Express framework'ü içe aktar
const router = express.Router(); // Router nesnesi oluştur
const Categories = require('../db/Models/Categories'); // Kategoriler modelini içe aktar
const Response = require('../lib/Response');
const CustomError = require('../lib/Error'); // Hata yönetimi için Error modülünü içe aktar
const Enum = require('../config/Enum'); // Enum yapılandırmasını içe aktar
const AuditLogs = require("../lib/AuditLogs"); // kendi yaptığımız loglama kodu
const logger = require("../lib/Logger/LoggerClass"); // system ile daha profesyonel loglama yapılır

/**
 * Create 
 * Read
 * Update
 * Delete
 */

const auth = require("../lib/auth")();  // token bilgilerine bakacak sınıf ve bu sınıf fonksiyon olduğu için () ile import edilmeli


router.all('*', auth.authenticate(),  (req, res, next) => {
    next(); // eğer token bilgisi varsa yani kullanıcının tokeni varsa diğer auditlogs işlemlerini yapsın yoksa hiç next olamaz
});

router.get('/', auth.checkRoles("category_view"), async (req, res) => {
    // req ve res parametreleri ile gelen istek ve cevapları kullanabiliriz 
    // next fonksiyonu ile bir sonraki middleware'e geçebiliriz eğer başka bir get falan varsa
    // "/" endpoint'ine gelen GET isteği için bir cevap döndür

    try {
        let categories = await Categories.find({});  // veritabanından tüm kategorileri getirir
        res.json(Response.successResponse(categories)); // Başarılı bir yanıt döndürür

    } catch (err) {
        res.json(Response.errorResponse(err));
    }

});

router.post('/add', auth.checkRoles("category_add"),async (req, res) => {
    let body = req.body; // İstek gövdesinden gelen veriyi alır
    try {
        if (!body.name) // Eğer name alanı boş ise
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, Enum.RESPONSE_MESSAGES.BAD_REQUEST, "Name field is required"); // Hata fırlatır

        let category = new Categories({
            name: body.name,
            is_active: body.is_active || true, // is_active alanı isteğe bağlıdır, varsayılan olarak true
            createdBy: req.user?.id

        });

        await category.save(); // Kategoriyi veritabanına kaydeder
        AuditLogs.info(req.user?.email, "Categories", "Add", "Added");
        res.json(Response.successResponse(Enum.RESPONSE_MESSAGES.CREATED)); // Başarılı bir yanıt döndürür
    }
    catch (err) {
        logger.error(req.user?.email, "Category", "Add", err);
        res.json(Response.errorResponse(err));
    }

});

router.post('/update', auth.checkRoles("category_update"),async (req, res) => {
    let body = req.body;

    try {
        if (!body._id) // Eğer _id alanı boş ise
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, Enum.RESPONSE_MESSAGES.BAD_REQUEST, "id field is required");

        let updates = {};

        if (body.name) updates.name = body.name;
        if (typeof body.is_active === "boolean") updates.is_active = body.is_active;

        await Categories.updateOne(
            { _id: body._id },
            updates // Güncellenecek kategori ID'si
        );
        AuditLogs.info(req.user?.email, "Categories", "Update", "Updated");

        res.json(Response.successResponse(Enum.RESPONSE_MESSAGES.UPDATED)); // Başarılı bir yanıt döndürür
    }
    catch (err) {
        res.json(Response.errorResponse(err));
    }

});

router.post('/delete', auth.checkRoles("category_delete"),async (req, res) => {
    let body = req.body;
    try {
        if (!body._id) // Eğer _id alanı boş ise
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, Enum.RESPONSE_MESSAGES.BAD_REQUEST, "id field is required");

        await Categories.deleteOne({
            _id: body._id // Silinecek kategori ID'si
        });

        AuditLogs.info(req.user?.email, "Categories", "Delete", "Deleted");

        res.json(Response.successResponse(Enum.RESPONSE_MESSAGES.DELETED)); // Başarılı bir yanıt döndürür
    }
    catch (err) {
        res.json(Response.errorResponse(err));
    }

});

module.exports = router; // Bu router'ı dışarıya açar, böylece diğer dosyalarda kullanılabilir hale getirir