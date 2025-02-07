// MongoDB için veritabanı işlemlerinde kullanmak üzere `MongoBlogModel` adında model oluşturalım.
// Mongoose adında ki kütüphaneyi ekle ve bu kütüphaneye erişmek için `mongoose` adını kullan.
// mongoose paketini sisteme dahil ediyoruz.
// Mongoose MongoDB ile bağlantı kurarken sağlıklı ve hızlı bağlantısı için  bir ODM(Object Data Modeling)
// NOT: Eğer bu sayfada Typescript kullansaydım reqire yerine import kullanacaktım.
// Import
const mongoose = require("mongoose");

// Schema adından (BlogPostSchema)
const BlogRegisterSchema = new mongoose.Schema({
        // 1.YOL (HEADER)
        //header: String,

        // 2.YOL (USERNAME)
        username: {
            type: String,
            required: [true, " Username Başlığı için gereklidir"],
            trim: true,
            minleght: [5, "Username başlığı için minumum 5 karakter olmalıdır."],
            maxleght: [100, "Username başlığı için maksimum 100 karakter olmalıdır."],
        },

        // PASSWORD
        // content: String,
        password: {
            type: String,
            required: [true, " Password içeriği için gereklidir"],
            trim: true,
            minleght: [5, "Password için minumum 5 karakter olmalıdır."],
        },

        // EMAIL
    email: {
        type: String,
        required: [true, " Email içeriği için gereklidir"],
        trim: true,
        minleght: [5, "Email için minumum 5 karakter olmalıdır."],
    },

        // DATE
        dateInformation: {
            type: String, default: Date.now(),
        },


        // STATUS
        // Durum (Proje için bu bir taslak mı yoksa canlı ortam için mi ?)
        // Enum Durum Alanı: status: Blog gönderisinin durumu "draft" veya "published" olarak belirlenir. Bu, bir gönderinin taslak mı yoksa yayınlanmış mı olduğunu gösterir.
    }, //end BlogRegisterSchema {}
    {
        // Oluşturma ve güncellemem zamanları sisteme eklemek
        // Zaman Bilgileri: timestamps: createdAt ve updatedAt alanları otomatik olarak eklenir ve her işlemde güncellenir.
        timestamps: true,
    }); //end PostSchema

////////////////////////////////////////////////////////////////////
// Sanal alan (Virtuals) - İçerik özetini döndürme
// summary: Blog içeriğinin ilk 100 karakterini döndüren bir sanal alan ekledik.
// Bu, API cevaplarında sadece kısa bir özet göstermek için kullanılabilir.

// Şema için ön middleware - Her kaydetmeden önce başlık ve içeriği büyük harflerle güncelleme
// Şema Middleware (Pre-save Hook): pre("save"): Kaydedilmeden önce başlık ve içeriğin ilk harflerini büyük yapmak için bir ön middleware ekledik.


// Statik metot - Belirli bir yazara ait tüm blogları bulma
// Statik Metot: findByAuthor: Belirli bir yazara ait tüm blog gönderilerini bulmak için statik bir metot ekledik. Bu, belirli yazara göre blog filtrelemek için kullanılabilir.

// Instance metodu - Görüntüleme sayısını artırma
// Instance Metot: incrementViews: Her blog gönderisine ait görüntüleme sayısını artırmak için bir instance metot ekledik. Bu, bir gönderi görüntülendiğinde görüntüleme sayısını artırmanızı sağlar.


// Sanal alanların JSON'a dahil edilmesi
BlogRegisterSchema.set("toJSON", {virtuals: true});

// Module Exports modelName(BlogModel)
// BlogModel modelini dışa aktarmak
// Post kullanımı daha yaygındır
// module.exports = mongoose.model('Post', BlogRegisterSchema );

// Module
// 1.YOL
// module.exports = mongoose.model("MongoBlogModel", BlogRegisterSchema);

// 2.YOL
const Register = mongoose.model("MongoRegisterModel", BlogRegisterSchema);
module.exports = Register;