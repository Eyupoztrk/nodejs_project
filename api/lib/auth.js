/* eslint-disable no-unused-vars */
const passport = require('passport');
const { ExtractJwt, Strategy } = require('passport-jwt');
const config = require("../config");
const Users = require("../db/Models/Users");
const UserRoles = require("../db/Models/UserRoles");
const RolePrivileges = require('../db/Models/RolePrivileges');
const privs = require('../config/role_privileges');
const Response = require('../lib/Response');
const CustomError = require('./Error');
const Enum = require('../config/Enum');

module.exports = function () {
    // JWT stratejisini tanımlıyoruz
    let strategy = new Strategy({
        secretOrKey: config.JWT.SECRET, // JWT token'larını doğrulamak için kullanılan gizli anahtar
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() // Token'ı Authorization header'ından al
    },
        async (payload, done) => { // Token çözülünce çalışacak callback fonksiyonu

            try {
                // users tablosunda token içindeki _id ile eşleşen kullanıcıyı arıyoruz
                let user = Users.findOne({ _id: payload._id });

                if (user) {
                    // Kullanıcının sahip olduğu rolleri user_id ile çekiyoruz
                    let userRoles = await UserRoles.find({ user_id: payload._id });

                    // Kullanıcının rollerine ait tüm yetkileri (privilege) çekiyoruz
                    let rolePrivileges = await RolePrivileges.find({ role_id: { $in: userRoles.map(ur => ur.role_id) } });
                    let privileges = rolePrivileges.map(rp => privs.privileges.find(x => x.key == rp.permision));
                    privs.privileges

                    // Kullanıcı bulundu ve yetkileriyle birlikte geri döndürülüyor
                    done(null, {
                        id: user._id,
                        roles: privileges,
                        email: user.email,
                        firs_name: user.firs_name,
                        last_name: user.last_name,
                        exp: parseInt(Date.now() / 1000) + config.JWT.EXP_TIME // token süresi hesaplanıyor
                    });
                } else {
                    // Kullanıcı bulunamazsa hata döndürülüyor
                    done(new Error("user not fount"), null);
                }
            }
            catch (err) {
                // Beklenmeyen bir hata olursa done ile hata döndürülüyor
                done(err, null);
            }

        }
    );

    // Passport'a bu stratejiyi kullanmasını söylüyoruz
    passport.use(strategy);

    return {
        initialize: function () {
            return passport.initialize();
        },
        authenticate: function () {
            return passport.authenticate("jwt", { session: false })
        },
        checkRoles: (...expectedRoles) => { // dizi parametresini kullanıyoruz
            return (req, res, next) => {
                let i = 0;
                let privileges = req.user.roles.map(x => x.key);  // req.user done fonksiyonu içindeki bilgileri kapsar

                // expectedRoles dizisindeki rollerden herhangi biri privileges içinde bulunana kadar döngü devam eder
                // Eğer bulunan bir eşleşme olursa döngü durur (yetkisi olan ilk rol bulunmuş olur)
                while (i < expectedRoles.length && !privileges.includes(expectedRoles[i])) i++;

                if(i >= expectedRoles.length)
                {
                    res.json(Response.errorResponse(new CustomError(Enum.HTTP_CODES.UNAUTHORIZED,"Need Permission","Need Permission")))
                }
                else
                {
                    return next();
                }

            }
        }

    }
}
