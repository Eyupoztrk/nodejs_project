const express = require('express'); // Express framework'ü içe aktar
const router = express.Router(); // Router nesnesi oluştur

router.get("/",(req,res,next) =>{
    console.log("Categories GET isteği alındı");
    next(); // Bir sonraki middleware'e geç
});

router.get('/',(rep, res,next) =>{
    // req ve res parametreleri ile gelen istek ve cevapları kullanabiliriz 
    // next fonksiyonu ile bir sonraki middleware'e geçebiliriz eğer başka bir get falan varsa
    // "/" endpoint'ine gelen GET isteği için bir cevap döndür

    console.log("2. Categories GET isteği alındı");
    res.json({
        sussecs: true});

});

module.exports = router; // Bu router'ı dışarıya açar, böylece diğer dosyalarda kullanılabilir hale getirir