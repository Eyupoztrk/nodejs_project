var express = require('express');
var router = express.Router();
var Users = require('../db/Models/Users'); // Users modelini içe aktarır
var UserRoles = require('../db/Models/UserRoles'); // Kullanıcı rolleri modelini içe aktarır
var Roles = require('../db/Models/Roles'); // Roller modelini içe aktarır
var Response = require('../lib/Response'); // Response sınıfını içe aktarır
const CustomError = require('../lib/Error'); // Hata yönetimi için Error modülünü içe aktar
const Enum = require('../config/Enum'); // Enum yapılandırmasını içe aktar
const bcrypt = require('bcrypt'); // Şifreleme için bcrypt modülünü içe aktar
const is = require('is_js'); // Veri doğrulama için is_js modülünü içe aktar
const config = require('../config');
const RolePrivileges = require('../db/Models/RolePrivileges');
const JWT = require("jwt-simple");

/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    let users = await Users.find({}); // Users modelinden tüm kullanıcıları bulur

    res.json(Response.successResponse(users)); // Başarılı bir yanıt döner

  } catch (err) {
    res.json(Response.errorResponse(err)); // Hata durumunda hata mesajını döner
  }
});


router.post('/add', async (req, res) => {
  try {
    let body = req.body;

    if (!body.email)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, Enum.RESPONSE_MESSAGES.BAD_REQUEST, "Email field is required"); // Hata fırlatır
    if (!is.email(body.email)) // Eğer email formatı geçerli değilse
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, Enum.RESPONSE_MESSAGES.BAD_REQUEST, "Email format is not valid"); // Hata fırlatır
    if (!body.password)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, Enum.RESPONSE_MESSAGES.BAD_REQUEST, "Password field is required"); // Hata fırlatır

    if (!body.roles || !Array.isArray(body.roles) || body.roles.length == 0) {
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, Enum.RESPONSE_MESSAGES.BAD_REQUEST, "roles field is required"); // Hata fırlatır

    }

    let roles = await Roles.find({ _id: { $in: body.roles } });
    if (roles.length == 0) {
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, Enum.RESPONSE_MESSAGES.BAD_REQUEST, "roles field is required"); // Hata fırlatır

    }

    let passwordHash = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8), null); // hashSync ile şifreyi hashler

    let user = await new Users({
      email: body.email,
      password: passwordHash,
      is_active: body.is_active || true, // is_active alanı isteğe bağlıdır, varsayılan olarak true
      first_name: body.first_name,
      last_name: body.last_name,
      phone_number: body.phone_number,
      createdBy: req.user?.id // Kullanıcının kimliğini alır
    });

    for (let i = 0; i < roles.length; i++) {
      await UserRoles.create({
        role_id: roles[i]._id,
        user_id: user._id
      });
    }

    await user.save() // Kullanıcıyı veritabanına kaydeder
    res.json(Response.successResponse(Enum.RESPONSE_MESSAGES.CREATED)); // Başarılı bir yanıt döndürür

  }
  catch (err) {
    res.json(Response.errorResponse(err)); // Hata durumunda hata mesajını döner
  }
});


router.post('/update', async (req, res) => {
  let body = req.body;

  try {
    if (!body._id) // Eğer _id alanı boş ise
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, Enum.RESPONSE_MESSAGES.BAD_REQUEST, "id field is required");

    let updates = {};

    if (!body._id)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, Enum.RESPONSE_MESSAGES.BAD_REQUEST, "id field is required"); // Hata fırlatır

    if (body.password) {
      updates.password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8), null); // Şifreyi hashler
    }

    if (body.first_name) updates.first_name = body.first_name; // İlk adı günceller
    if (body.last_name) updates.last_name = body.last_name; // Soyadı günceller
    if (typeof body.is_active === "boolean") updates.is_active = body.is_active; // Aktiflik durumunu günceller
    if (body.phone_number) updates.phone_number = body.phone_number; // Telefon numarasını günceller

    if (!Array.isArray(body.roles) || body.roles.length == 0) {
      let userRoles = await UserRoles.find({ user_id: body._id });

      let removedRoles = userRoles.filter(p => !body.roles.includes(p.role_id.toString())); // Kaldırılacak izinleri alır
      let newRoles = body.roles.filter(p => !userRoles.map(pr => pr.role_id).includes(p)); // Yeni izinleri alır

      if (removedRoles.length > 0) { // Eğer kaldırılacak izinler varsa
        {
          await RolePrivileges.deleteMany({
            _id: { $in: removedRoles.map(p => p._id.toString()) } // Kaldırılacak izinleri veritabanından siler
          });
        }

        if (newRoles.length > 0) { // Eğer yeni izinler varsa
          for (let i = 0; i < newRoles.length; i++) { // İzinleri döngü ile kaydeder
            let userRole = new RolePrivileges({
              role_id: newRoles[i], // Rol ID'sini atar
              user_id: body._id // İzin anahtarını atar

            });

            await userRole.save(); // İzni veritabanına kaydeder

          }
        }


      }

    }
    let roles = await Roles.find({ _id: { $in: body.roles } });
    if (roles.length == 0) {
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, Enum.RESPONSE_MESSAGES.BAD_REQUEST, "roles field is required"); // Hata fırlatır

    }


    updates.updatedBy = req.user?.id; // Güncelleyen kullanıcıyı atar

    await Users.updateOne({ _id: body._id }, { $set: updates }); // Kullanıcıyı günceller

    res.json(Response.successResponse(Enum.RESPONSE_MESSAGES.UPDATED)); // Başarılı bir yanıt döndürür

  } catch (err) {
    res.json(Response.errorResponse(err)); // Hata durumunda hata mesajını döner
  }
});

router.post('/delete', async (req, res) => {
  let body = req.body;

  try {
    if (!body._id) // Eğer _id alanı boş ise
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, Enum.RESPONSE_MESSAGES.BAD_REQUEST, "id field is required"); // Hata fırlatır

    await Users.deleteOne({ _id: body._id }); // Kullanıcıyı siler

    await UserRoles.deleteMany({ user_id: body._id });

    res.json(Response.successResponse(Enum.RESPONSE_MESSAGES.DELETED)); // Başarılı bir yanıt döndürür

  } catch (err) {
    res.json(Response.errorResponse(err)); // Hata durumunda hata mesajını döner
  }
});

router.post('/register', async (req, res) => {
  try {
    let body = req.body;

    let userExist = await Users.findOne({}); // await koyduk çünkü veritabanından asenkron olarak kullanıcıları buluyoruz
    if (userExist) // eğer hiç kullanıcı yoksa yeni bir kkullanıcı eklesin eğer varsa diğer dönsün
    {
      return res.sendStatus(Enum.HTTP_CODES.NOT_FOUND);
    }


    if (!body.email)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, Enum.RESPONSE_MESSAGES.BAD_REQUEST, "Email field is required"); // Hata fırlatır
    if (!is.email(body.email)) // Eğer email formatı geçerli değilse
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, Enum.RESPONSE_MESSAGES.BAD_REQUEST, "Email format is not valid"); // Hata fırlatır
    if (!body.password)
      throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, Enum.RESPONSE_MESSAGES.BAD_REQUEST, "Password field is required"); // Hata fırlatır

    let passwordHash = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8), null); // hashSync ile şifreyi hashler





    // önce kullanıcıyı oluşturuyoruz
    // ardından kullanıcı rolünü oluşturuyoruz
    let user = new Users({
      email: body.email,
      password: passwordHash,
      is_active: body.is_active || true, // is_active alanı isteğe bağlıdır, varsayılan olarak true
      first_name: body.first_name,
      last_name: body.last_name,
      phone_number: body.phone_number,
      createdBy: req.user?.id // Kullanıcının kimliğini alır
    });
    // Kullanıcıyı veritabanına kaydederken, varsayılan olarak Admin rolü oluşturuyoruz
    // ve bu rolü kullanıcının UserRoles modeline ekliyoruz
    let role = await Roles.create({
      role_name: "Admin", // Varsayılan olarak Admin rolü oluşturur
      is_active: true, // Rol aktif olarak ayarlanır
      created_by: user._id // Rolü oluşturan kullanıcının kimliğini atar
    });
    // Kullanıcı rolünü UserRoles modeline ekler
    // UserRoles modeline kullanıcı rolünü ekler
    await UserRoles.create({
      role_id: role._id, // Kullanıcının rol kimliğini atar
      user_id: user._id // Kullanıcının kimliğini atar

    });



    await user.save() // Kullanıcıyı veritabanına kaydeder
    res.json(Response.successResponse(Enum.RESPONSE_MESSAGES.CREATED)); // Başarılı bir yanıt döndürür

  }
  catch (err) {
    res.json(Response.errorResponse(err)); // Hata durumunda hata mesajını döner
  }
});


router.post('/auth', async (req, res) => {
  try {
    let { email, password } = req.body;

    Users.validateFieldsBeforeAuth(email, password);
    let user = await Users.findOne({ email });
    

    if (!user)
      throw new CustomError(Enum.HTTP_CODES.UNAUTHORIZED, "validation", "Email or Password wrong");

    console.log("bbb");
    if (!user.validPassword(password))
      throw new CustomError(Enum.HTTP_CODES.UNAUTHORIZED, "validation", "Email or Password wrong");
    console.log("ccc");

    let payload = {
      id: user._id,
      exp: parseInt(Date.now() / 1000) * config.JWT.EXP_TIME // token süresi hesaplanıyor

    }

    let token = JWT.encode(payload, config.JWT.SECRET);
    let userData = {
      id: user._id,
      first_name: user.first_name,
      last_name: user.last_name
    }


    res.json(Response.successResponse({ token, user: userData }));

  } catch (err) {
    res.json(Response.errorResponse(err)); // Hata durumunda hata mesajını döner

  }
});

module.exports = router;
