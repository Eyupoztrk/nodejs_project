const express = require('express'); // Express framework'ü içe aktar
const router = express.Router(); // Router nesnesi oluştur
const Roles = require('../db/Models/Roles'); // Roller modelini içe aktar
const CustomError = require("../lib/Error");
const RolePrivileges = require('../db/Models/RolePrivileges'); // Roller ve izinler modelini içe aktar
const Response = require('../lib/Response'); // Yanıt yönetimi için Response modülünü içe aktar
const Enum = require('../config/Enum'); // Enum yapılandırmasını içe aktar
const role_privileges = require('../config/role_privileges'); // Rol izinlerini içe aktar
router.get('/', async (req, res) => {

    try {
        let roles = await Roles.find({}); // Veritabanından tüm rolleri getirir
        res.json(Response.successResponse(roles)); // Başarılı bir yanıt döndürür
    }
    catch (err) {
        res.json(Response.errorResponse(err));
    }
});

router.post('/add', async (req, res) => {
    let body = req.body;

    try {
        if (!body.role_name) // eğer role name alanı boş ise
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, Enum.RESPONSE_MESSAGES.BAD_REQUEST, "Name field is required"); // Hata fırlatır
        if (!body.permissions || !Array.isArray(body.permissions) || body.permissions.length == 0) // eğer permissions alanı boş ise veya dizi değilse
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, Enum.RESPONSE_MESSAGES.BAD_REQUEST, "Permission error"); // Hata fırlatır

        let role = new Roles({
            role_name: body.role_name,
            is_active: body.is_active,
            created_by: req.user?.id // Kullanıcının kimliğini alır
        });

        await role.save(); // Rolü veritabanına kaydeder

        for (let i = 0; i < body.permissions.length; i++) { // İzinleri döngü ile kaydeder
            let priv = new RolePrivileges({
                role_id: role._id, // Rol ID'sini atar
                permision: body.permissions[i], // İzin anahtarını atar
                created_by: req.user?.id // Kullanıcının kimliğini atar
            });

            await priv.save(); // İzni veritabanına kaydeder

        }

        res.json(Response.successResponse(Enum.RESPONSE_MESSAGES.CREATED)); // Başarılı bir yanıt döndürür


    }
    catch (err) {
        res.json(Response.errorResponse(err)); // Hata durumunda hata yanıtı döndürür
    }


});


router.post('/update', async (req, res) => {
    let body = req.body;

    try {
        if (!body._id) // eğer role name alanı boş ise
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, Enum.RESPONSE_MESSAGES.BAD_REQUEST, "id field is required"); // Hata fırlatır

        let updates = {};

        if (body.role_name) updates.role_name = body.role_name;
        if (typeof body.is_active === "boolean") updates.is_active = body.is_active;


        if (body.permissions && !Array.isArray(body.permissions) && body.permissions.length > 0) // eğer permissions alanı boş ise veya dizi değilse
        {
            let permissions = await RolePrivileges.find({ role_id: body._id }); // Rol izinlerini alır

            // body.permissions => [ "user_view", "user_add" ]
            // permissions => [ { permision: "user_view" }, { permision: "user_add" }, { permision: "user_update" } ]


            let removedPermissions = permissions.filter(p => !body.permissions.includes(p.permision)); // Kaldırılacak izinleri alır
            let newPermissions = body.permissions.filter(p => !permissions.map(pr => pr.permision).includes(p)); // Yeni izinleri alır

            if (removedPermissions.length > 0) { // Eğer kaldırılacak izinler varsa
                {
                    await RolePrivileges.deleteMany({
                        _id: { $in: removedPermissions.map(p => p._id) } // Kaldırılacak izinleri veritabanından siler
                    });
                }

                if (newPermissions.length > 0) { // Eğer yeni izinler varsa
                    for (let i = 0; i < newPermissions.length; i++) { // İzinleri döngü ile kaydeder
                        let priv = new RolePrivileges({
                            role_id: body._id, // Rol ID'sini atar
                            permision: newPermissions[i], // İzin anahtarını atar
                            created_by: req.user?.id // Kullanıcının kimliğini atar
                        });

                        await priv.save(); // İzni veritabanına kaydeder

                    }
                }


            }
            


        }

        await Roles.updateOne(
                { _id: body._id },
                updates // Güncellenecek kategori ID'si
            );

            res.json(Response.successResponse(Enum.RESPONSE_MESSAGES.UPDATED)); // Başarılı bir yanıt döndürür
    }
    catch (err) {
            res.json(Response.errorResponse(err)); // Hata durumunda hata yanıtı döndürür
        }


    });

router.post('/delete', async (req, res) => {
    let body = req.body;

    try {
        if (!body._id) // eğer role name alanı boş ise
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, Enum.RESPONSE_MESSAGES.BAD_REQUEST, "id field is required"); // Hata fırlatır

        await Roles.deleteOne({
            _id: body._id // Silinecek kategori ID'si
        });


        res.json(Response.successResponse(Enum.RESPONSE_MESSAGES.DELETED)); // Başarılı bir yanıt döndürür


    }
    catch (err) {
        res.json(Response.errorResponse(err)); // Hata durumunda hata yanıtı döndürür
    }


});

router.get('/privileges', async (req, res) => {
    try {
        let privileges = role_privileges.privileges; // Rol izinlerini alır
        res.json(Response.successResponse(privileges)); // Başarılı bir yanıt döndürür
    }
    catch (err) {
        res.json(Response.errorResponse(err)); // Hata durumunda hata yanıtı döndürür
    }
});





module.exports = router; // Bu router'ı dışarıya açar, böylece diğer dosyalarda kullanılabilir hale getirir