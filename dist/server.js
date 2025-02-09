"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// http://localhost:1111/daily/list
console.info("server.js Server 1111 portunda ayağa kalktı");
// Bitirme Projesi
// username
// password
// email
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Import
// Import Express (Express:  Node.js için esnek bir web uygulama çatısını inşa eder)
// Bu modüllerle beraber HTTP istekleri(request) işleyecek ve istemciye(server) yanıt dönecektir.
// DİKKAT: index.js  require("express") kullanılır 
// DİKKAT: index.ts  import("express") kullanılır.
// Express Import
const express = require("express");
// Mongoose Import
const mongoose = require("mongoose");
// CSRF Import
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
// Winston: Hata bilgilerini ve bilgi loglarını düzgün ve MORGAN'A göre daha gelişmiştir.
const winston = require("winston"); // Winston logger'ı ekle
// Helmet Import
const helmet = require("helmet");
// Swagger UI
// const swaggerJsDoc = require("swagger-jsdoc");
// const swaggerUi = require("swagger-ui-express");
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// bodyParser Import
const bodyParser = require("body-parser");
// App Import
const app = express();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Winston logger yapılandırması
const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.File({
            filename: "winston_error.log",
            level: "error",
        }),
        new winston.transports.File({ filename: "winston_combined.log" }),
    ],
});
if (process.env.NODE_ENV !== "production") {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mongo DB Bağlantısı
// username:  hamitmizrak
// password:  <password>
// mongodb+srv://hamitmizrak:<password>@offlinenodejscluster.l3itd.mongodb.net/?retryWrites=true&w=majority&appName=OfflineNodejsCluster
/*
mongosh

use mydb  // Veritabanınızı kullanın
db.getUsers()

VEYA

use admin
db.getUsers()

db.createUser({
  user: "blogAdmin",
  pwd: "BlogPass123",
  roles: [
    { role: "readWrite", db: "blogDB" } // blogDB üzerinde okuma ve yazma yetkisi
  ]
})


 */
// Localhostta MongoDB yüklüyse)
// Bu proje için docker-compose üzerinden 27017 porta sahip mongodb kurdum
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// 1.YOL (LOCALHOST)
// .env dosyasındaki bilgilerden bağlantı URL'si oluşturuluyor
const databaseLocalUrl = process.env.MONGO_USERNAME && process.env.MONGO_PASSWORD
    ? `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@127.0.0.1:${process.env.MONGO_PORT}/Cluster0`
    : "mongodb://ssevim20:Mongodbsifrem123.@127.0.0.1:27017/Cluster0";
// 2.YOL (LOCALHOST)
const databaseDockerUrl = "mongodb://localhost:27017/blogDB";
// MongoDB Cloud (username,password)
// 3.YOL (CLOUD)
const databaseCloudUrl = "mongodb+srv://ssevim20:Mongodbsifrem123.@cluster0.fz9n1pb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// 4.YOL (.dotenv)
require("dotenv").config();
// Localhostta MongoDB yüklüyse)
const databaseCloudUrlDotEnv = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.fz9n1pb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Local ve Cloud
const dataUrl = [
    databaseLocalUrl,
    databaseCloudUrl,
    databaseCloudUrlDotEnv,
];
// Connect
// 1.YOL
//mongoose.connect(`${dataUrl[1]}`).then().catch();
// 2.YOL
//mongoose.connect(`${databaseCloudUrl}`, {useNewUrlParser:true, useUnifiedTopology:true}) // Eski MongoDB sürümleride
mongoose
    // .connect(`${databaseDockerUrl}`)
    .connect(`${databaseDockerUrl}`)
    .then(() => {
    console.log("Mongo DB Başarıyla Yüklendi");
})
    .catch((err) => {
    console.error("Mongo DB Bağlantı Hatası", err);
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MIDDLEWARE
// Middleware'leri dahil et
// app.use(bodyParser.urlencoded({ extended: true }));
// Express.js uygulamalarındaki middleware'dir. Gelen isteklerin body(gövde) kısmını analiz ederek, form verilerini ve JSON verilerine erişebilir hale getirir.
// urlencoded: Burada gelen istek gövdelerini URL'ye kodlanmıi form verilerini işlemeye yarar.
// extended: true: Gelen veriler içim querystring(qs) adlı kütaphane kullanılır. Ve bunun sayesinde karmaşık nesleride ayrıştırabilir.
// URL' kodlanmış (x-www-form-urlencoded) biçimde gönderir. Bu middleware bu tür verileri ayrıştruu ve request.body nesnesine ekler.
// http://localhost:1111?name=Hamit&surname=Mızrak
/*
 {
name:"Hamit",
surname:"Mızrak"
}
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));
// Bu middleware gelen HTTP isteklerinin gövdesindeki JSIN verilerini ayrıştırır.
// Sunucusunun JSON formatından gelen GET,POST,DELETE,PUT gibi istekelrin anlamasını sağlar.
// Veriler analiz edildikten sonra ,ayrışmaztırılmış içerik request.body nesneini ekler
// app.use(cookieParser());
// HTTP istekelrinden gelen cooki'leri(çerez) ayrıştıran bir middleware'dir.
// Bu çerezler request.cookise adlı nesneye ekler.
app.use(cookieParser());
// CSRF Middleware
// CSRF(Cross-Site Request Forgery) saldırılarına karşı güvenliği sağlar.
// CSRF tokenlarını çerezler araçılığyla gönderilir.
const csrfProtection = csrf({ cookie: true });
// Express için Log
const morgan = require("morgan");
// Morgan Aktifleştirmek
// Morgan'ı Express.js uygulamasında kullanalım.
//app.use(morgan('dev')); //dev: kısa ve renkli loglar göster
app.use(morgan("combined")); //dev: uzun ve renkli loglar göster
// compression:
// npm install compression
// Gzip : Verilerin sıkıştırılmasıyla performansı artırmak
// ve ağ üzerinde sayfaya daha hızlı erişimi sağlar
// Tüm Http cevaplarını sıkıştırarak gönderilmesini sağlar.
// const compression = require('compression');
// app.use(compression);
// Rate Limiting (İstek Sınırlamasını):
// npm install express-rate-limit
// DDoS saldırlarına karşı korumayı sağlamak ve sistem performansını artırmak içindir.
// Gelen istekleri sınırlayabiliriz.
// Her 15 dakika içinde en fazla 100 istek atılabilinir.
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 100, // buy süre zarfında en fazla bu kadar isterk atabilirsiniz.
    message: "İstek sayısı fazla yapıldı, lütfen biraz sonra tekrar deneyiniz",
});
app.use("/blog/", limiter);
app.use("/register/", limiter);
// CORS
// npm install cors
// CORS (Cross-Origin Resource Sharing)
// Eğer API'niz başka portlardan da erişim sağlanacaksa bunu açmamız gerekiyor.
const cors = require("cors");
app.use(cors());
// Helmet: Http başlıkalrını güvenli hale getirir ve yaygın saldırı vektörlerini azaltır
//npm install helmet
// const helmet = require("helmet");
//app.use(helmet());
app.use(helmet.frameguard({ action: "deny" })); // Clickjacking'e karşı koruma
app.use(helmet.xssFilter()); // XSS saldırılarına karşı koruma
app.use(helmet.noSniff()); // MIME sniffing koruması
// CSRF
/*
CSRF (Cross-Site Request Forgery):  Türkçesi Siteler Arası istek Sahteciliğidir.
Bu saldırı türünde amaç, kötü niyetli bir kullanıcının, başka bir kullanının haberi olmadan onun adına istekler göndererek
işlem yapması halidir.
Kullanımı: Genellikle kullanıcı, başka bir sitede oturum açmışken, saldırganın tasarladğo kötü niyetli sitelerle veya bağlantılarla
istem dışı işlemler yapmasına saldırgan yönlendirir.
Kullanıcı browser üzerinden oturum açtığında ve kimlik doğrulama bilgilerie sahip olduğu sitelerde yapılır.

*/
// npm install csurf
// npm install cookie-parser
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// STATIC (Ts için public dizini oluşturduk)
// Uygulamada statik dosyaların HTL,CSS,JS,image v.b içerikler sunar.
// public klasörü, statik doyalar için kök dizin olarak belirlenir.
// Bu klasörde bulunan dosyalara tarayıcıdan direk erişim sağlanır.
// Örnek: public klasöründe style.css adlı bir dosya varsa biz buna şu şekilde erişim sağlarız.
// http://localhost:1111/style.css
// app.use(express.static("public"));
// 📌 Statik Dosya Servisi (index44.html'nin çalışması için)
const path_1 = __importDefault(require("path"));
app.use(express.static(path_1.default.join(__dirname, "../public")));
// 📌 Ana Sayfa (`index44.html`) Yönlendirmesi
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "public", "index.html"));
});
// Formu render eden rota ("/")
// Anasayfaya yönlendir.
app.get("/blog/api", csrfProtection, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    // İstek gövdesinde JSON(Javascript Object Notation) formatında veri göndereceğini belirtir.
    //response.setHeader("Content-Type", "application/json");
    //response.setHeader("Content-Type", "text/plain"); // name Hamit surnameMızrak
    response.setHeader("Content-Type", "text/html");
    //response.setHeader("Content-Type", "application/x-www-form-urlencoded"); // name=Hamit&surname=Mizrak
    // cache-control: Yanıtları hızlı sunmak için ve sunucya gereksiz istekleri azaltmak için
    response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    // Sitemizi başka sitelerde iframe ile açılmasını engellemek
    // clickjacking saldırılarına karşı korumayı sağlar
    response.setHeader("X-Frame-Options", "DENY");
    // X-XSS-Protection: Tarayıca tarafından XSS(Cross-Site Scripting) saldırılarıa karşı koruma
    // XSS saldırısını tespit ederse sayfanın yüklenmesini engeller.
    response.setHeader("X-XSS-Protection", "1; mode=block");
    // Access Control (CORS Başlıkları)
    // XBaşka bir kaynaktan gelen istekleri kontrol etmet için CORS başlığı ekleyebiliriz.
    response.setHeader("Access-Control-Allow-Origin", "https://example.com");
    // Access-Control-Allow-Methods
    // Sunucunun hangi HTTP yöntemlerini kabul etiğini gösterir.
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    // Access-Control-Allow-Headers
    // Bu başlıklar, taryıcınının sunucuya göndereceği özel başlıklar göndersin
    response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    // dist/server.js
    try {
        const BlogModel = require("../models/mongoose_blog_models"); // Modeli ekleyin
        const blogs = yield BlogModel.find(); // Tüm blog verilerini al
        response.json(blogs); // JSON formatında döndür
    }
    catch (error) {
        console.error("Veri alınırken hata oluştu:", error);
        response.status(500).send("Veri alınırken hata oluştu.");
    }
}));
app.get("/blog", csrfProtection, (request, response) => {
    response.render("blog", { csrfToken: request.csrfToken() });
});
app.get("/register", csrfProtection, (request, response) => {
    response.render("register", { csrfToken: request.csrfToken() });
});
app.get("/register/api", csrfProtection, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    // dist/server.js
    try {
        const RegisterModel = require("../models/mongoose_blog_register_models"); // Modeli ekleyin
        const registers = yield RegisterModel.find(); // Tüm register verilerini al
        response.setHeader("Content-Type", "application/json"); // Yanıtın JSON formatında olduğunu belirtir
        response.json(registers); // JSON formatında döndür
    }
    catch (error) {
        console.error("Veri alınırken hata oluştu:", error);
        response.status(500).send("Veri alınırken hata oluştu.");
    }
}));
// Form verilerini işleyen rota
// DİKKATT: Eğer  blog_api_routes.js post kısmında event.preventDefault(); kapatırsam buraki kodlar çalışır.
// blog için CSRF koruması eklenmiş POST işlemi
// app.post("/blog", csrfProtection, (request, response) => {
app.post("/blog/api", csrfProtection, (request, response) => {
    const blogData = {
        header: request.body.header,
        content: request.body.content,
        author: request.body.author,
        tags: request.body.tags,
    };
    if (!blogData.header || !blogData.content) {
        return response.status(400).send("Blog verisi eksik!");
    }
    if (!request.body) {
        console.log("Boş gövde alındı.");
        logger.info("Boş gövde alındı."); //logger: Winston
    }
    else {
        console.log(request.body);
        console.log("Dolu gövde alındı.");
        logger.info(request.body); //logger: Winston
        logger.info("Dolu gövde alındı."); //logger: Winston
    }
    const BlogModel = require("../models/mongoose_blog_models"); // Modeli ekleyin
    const newBlog = new BlogModel(blogData);
    newBlog
        .save()
        .then(() => {
        console.log("Blog başarıyla kaydedildi:", blogData);
        logger.info("Blog başarıyla kaydedildi:", blogData); //logger: Winston
        response.send("CSRF ile blog başarıyla kaydedildi.");
    })
        .catch((err) => {
        console.log("Veritabanı hatası:", err);
        logger.error("Veritabanı hatası:", err); //logger: Winston
        response.status(500).send("Veritabanı hatası oluştu.");
    });
});
app.post("/register/api", csrfProtection, (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const registerData = {
        username: request.body.username,
        password: request.body.password,
        email: request.body.email,
    };
    if (!registerData.username || !registerData.password) {
        return response.status(400).send("register verisi eksik!");
    }
    if (!request.body) {
        console.log("Boş gövde alındı.");
        logger.info("Boş gövde alındı."); //logger: Winston
    }
    else {
        console.log(request.body);
        console.log("Dolu gövde alındı.");
        logger.info(request.body); //logger: Winston
        logger.info("Dolu gövde alındı."); //logger: Winston
    }
    const RegisterModel = require("../models/mongoose_blog_register_models"); // Modeli ekleyin
    const newRegister = new RegisterModel(registerData);
    newRegister
        .save()
        .then(() => {
        console.log("register başarıyla kaydedildi:", registerData);
        logger.info("register başarıyla kaydedildi:", registerData); //logger: Winston
        response.send("CSRF ile blog başarıyla kaydedildi.");
    })
        .catch((err) => {
        console.log("Veritabanı hatası:", err);
        logger.error("Veritabanı hatası:", err); //logger: Winston
        response.status(500).send("Veritabanı hatası oluştu.");
    });
}));
app.delete("/register/api/:id", csrfProtection, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const RegisterModel = require("../models/mongoose_blog_register_models");
        yield RegisterModel.findByIdAndDelete(id);
        res.status(200).send("Kullanıcı silindi");
    }
    catch (error) {
        console.error("Silme hatası:", error);
        res.status(500).send("Silme işlemi sırasında hata oluştu");
    }
}));
// Kullanıcı güncelleme işlemi
app.put("/register/api/:id", csrfProtection, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { username, password, email } = req.body;
        const RegisterModel = require("../models/mongoose_blog_register_models");
        const updateData = { username, password, email };
        const updatedUser = yield RegisterModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedUser) {
            return res.status(404).send("Kullanıcı bulunamadı");
        }
        res.status(200).send("Kullanıcı başarıyla güncellendi");
    }
    catch (error) {
        console.error("Güncelleme hatası:", error);
        res.status(500).send("Güncelleme işlemi sırasında hata oluştu");
    }
}));
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EJS(Embedded JavaScript) Görüntüleme motorunu aktifleştirdim
// views/blog.ejs aktifleştirmek
app.set("view engine", "ejs");
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Router (Rotalar)
const blogRoutes = require("../routes/blog_api_routes");
const registerRoutes = require("../routes/blog_register_routes");
const { request } = require("http");
// http://localhost:1111/blog
app.use("/blog/", blogRoutes);
app.use("/register/", registerRoutes);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 404 Hata sayfası
app.use((request, response, next) => {
    response.status(404).render("404", { url: request.originalUrl });
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Windowsta 1111 portunu kapatmak
/*
Terminali Yönetici olarak Aç

# Çalışan portu gösteriyor
netstat -aon | findstr :1111

# TCP Protokolü için Portu Kapatma:
netsh advfirewall firewall add rule name="Block TCP Port 1111" protocol=TCP dir=in localport=1111 action=block

# UDP Protokolü için Portu Kapatma:
netsh advfirewall firewall add rule name="Block UDP Port 1111" protocol=UDP dir=in localport=1111 action=block

*/
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Sunucu başlatma
const PORT = process.env.LOCALHOST_PORT || 1111;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor http://localhost:${PORT}`);
    logger.info(`Sunucu ${PORT} portunda çalışıyor http://localhost:${PORT}`); //logger: Winston
});
