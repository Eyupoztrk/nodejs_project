const express = require('express'); // Express framework'ü içe aktar
const router = express.Router(); // Router nesnesi oluştur


router.get('/',(rep, res,next) =>{
    // req ve res parametreleri ile gelen istek ve cevapları kullanabiliriz 
    // next fonksiyonu ile bir sonraki middleware'e geçebiliriz eğer başka bir get falan varsa
    // "/" endpoint'ine gelen GET isteği için bir cevap döndür

    res.json({
        body: rep.body,
        query: rep.query,
        params: rep.params,
        headers: rep.headers,
    })

});

module.exports = router; // Bu router'ı dışarıya açar, böylece diğer dosyalarda kullanılabilir hale getirir