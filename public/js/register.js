$(document).ready(function () {
    let isUpdating = false;
    let updateId = null;
    const minChars = 12; // minimum karakter sayısı

    // Hata mesajlarını temizleme fonksiyonu
    const clearErrors = () => {
        $(".error-message, .valid-message").remove();
    };

    // Hata mesajı ekleme fonksiyonu
    const showError = (element, message) => {
        $(element).next(".error-message, .valid-message").remove();
        $(element).after(`<small class="text-danger error-message">${message}</small>`);
    };

    // Geçerli mesajı ekleme fonksiyonu
    const showValid = (element, message) => {
        $(element).next(".error-message, .valid-message").remove();
        $(element).after(`<small class="text-success valid-message">${message}</small>`);
    };
    const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

    // İçerik harf sınırını kontrol etme fonksiyonu
// Şifre kontrol fonksiyonu
const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
        return "Şifre en az 8 karakter olmalıdır!";
    }
    if (!hasUpperCase) {
        return "Şifre en az bir büyük harf içermelidir!";
    }
    if (!hasLowerCase) {
        return "Şifre en az bir küçük harf içermelidir!";
    }
    if (!hasNumber) {
        return "Şifre en az bir rakam içermelidir!";
    }
    if (!hasSpecialChar) {
        return "Şifre en az bir özel karakter içermelidir!";
    }
    return null; // Şifre geçerli
};

    // Form doğrulama fonksiyonu
    const validateForm = () => {
        clearErrors();
        let isValid = true;
        const password = $("#password").val();
        const email = $("#email").val();
        const username=$("#username").val();
        const charCount = password.length;
        const usernameCharCount=username.length;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if ($("#username").val().trim() === "") {
            showError("#username", "kullanıcı adı boş bırakılamaz!");
            isValid = false;
        } 
        else if(usernameCharCount<5){
            showError("#username", "Kullanıcı adı en az 5 karakter olmalıdır!");
            isValid = false;
        }
        
        else {
            showValid("#username", "kullanıcı adı geçerli.");
        }

        if (password.trim() === "") {
            showError("#password", "şifre boş bırakılamaz!");
            isValid = false;
        } else if (charCount < minChars) {
            showError("#password", "şifre 12 karakterden fazla olmalı!");
            isValid = false;
        }
        else if(hasUpperCase!==true){
            showError("#password", "Şifre en az bir büyük harf içermelidir!");
            isValid = false;
        }
        else if (hasLowerCase!==true) {
            showError("#password", "Şifre en az bir küçük harf içermelidir!");
            isValid = false;
        }
        else if(hasNumber!==true){
            showError("#password", "Şifre en az bir rakam içermelidir!");
            isValid = false;
        }
        else if(hasSpecialChar!==true){
            showError("#password", "Şifre en az bir özel karakter içermelidir!");
            isValid = false;
        }
         else {
            showValid("#password", "İçerik geçerli.");
        }

        if ($("#email").val().trim() === "") {
            showError("#email", "email adı boş bırakılamaz!");
            isValid = false;
        } 
        else if(!validateEmail(email)){
            showError("#email", "Geçerli bir email adresi giriniz!");
            isValid = false;
        }
        
        else {
            showValid("#email", "Geçerli.");
        }

        return isValid;
    };

    // Kullanıcı içerik alanına yazdıkça harf sayısını güncelle

    $("#username").on("input", function(){
        const username=$("#username").val();
        const charCount = username.length;
        const minChar=5

        if(charCount<minChar){
            showError("#username", "Kullanıcı adı en az 5 karakter olmalıdır!");
        }
        else{
            showValid("#username", "Geçerli.");
        }
    });
    $("#email").on("input", function(){
        const email = $("#email").val();
        if(!validateEmail(email)){
            showError("#email", "Geçerli bir email adresi giriniz!");
            isValid = false;
        }
        else {
            showValid("#email", "Geçerli.");
        }
    })
    // Kullanıcı input'a yazarken hataları kaldır ve geçerli mesaj ekle
    $("#password").on("input", function () {
        const field = $(this);
        const password = $("#password").val();
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const charCount = password.length;
        const minChars = 12; // minimum karakter sayısı
        if (field.val().trim() === "") {
            showError(field, "Bu alan boş bırakılamaz!");
        } 
        else if(hasUpperCase!==true){
            showError("#password", "Şifre en az bir büyük harf içermelidir!");
        
        }
        else if (hasLowerCase!==true) {
            showError("#password", "Şifre en az bir küçük harf içermelidir!");
        }
        else if(hasNumber!==true){
            showError("#password", "Şifre en az bir rakam içermelidir!");
        }
        else if(hasSpecialChar!==true){
            showError("#password", "Şifre en az bir özel karakter içermelidir!");
        }
        else if (charCount < minChars) {
            showError("#password", "Şifre 12 karakterden az olamaz!");
        }
        else {
            showValid(field, "Geçerli.");
        }
        
    });

    // Formu sıfırlama fonksiyonu
    const resetForm = () => {
        $("#register-form")[0].reset();
        isUpdating = false;
        updateId = null;
        $("#submit-btn").text("Kayıt Ol");
        clearErrors();
    };

    // Blog listesini getir
    const fetchRegisterList = () => {
        $.ajax({
            url: "/register/api",
            method: "GET",
            success: function (data) {
                const $tbody = $("#register-table tbody").empty();
                console.log("data", data);
                typeof data === "string"?data = JSON.parse(data):data

                console.log("data", data);
                
                data.forEach(item => {
                    const createDate = new Date(item.createdAt).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" });
                    const updateDate=new Date(item.updatedAt).toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" });
                    $tbody.append(`
                        <tr data-id="${item._id}">
                            <td>${item._id}</td>
                            <td>${item.username}</td>
                            <td>${item.password}</td>
                            <td>${item.email}</td>
                            <td>${createDate}</td>
                            <td>${updateDate}</td>
                            <td>
                                <button class="btn btn-primary edit-btn"><i class="fa-solid fa-wrench"></i></button>
                                <button class="btn btn-danger delete-btn"><i class="fa-solid fa-trash"></i></button>
                            </td>
                        </tr>
                    `);
                });
            },
            error: handleError
        });
    };

    // Hata yönetimi fonksiyonu
    const handleError = (xhr, status, error) => {
        console.error("İşlem başarısız:", error);
        alert("Beklenmeyen bir hata oluştu, lütfen tekrar deneyin.");
    };

    // Blog ekleme/güncelleme işlemi
    $("#register-form").on("submit", function (event) {
        event.preventDefault();

        // Form doğrulama
        if (!validateForm()) {
            return;
        }

        const registerData = {
            username: $("#username").val(),
            password: $("#password").val(),
            email: $("#email").val(),
            _csrf: $("input[name='_csrf']").val()
        };

        if (isUpdating && updateId) {
            $.ajax({
                url: `/register/api/${updateId}`,
                method: "PUT",
                data: registerData,
                success: function () {
                    fetchRegisterList();
                    resetForm();
                },
                error: handleError
            });
        } else {
            $.ajax({
                url: "/register/api",
                method: "POST",
                data: registerData,
                success: function () {
                    fetchRegisterList();
                    resetForm();
                },
                error: handleError
            });
        }
    });
    
    // Blog güncelleme işlemi
    $("#register-table tbody").on("click", ".edit-btn", function () {
        const row = $(this).closest("tr");
        const id = row.data("id");


        $("#username").val(row.find("td:eq(1)").text());
        $("#email").val(row.find("td:eq(3)").text());

        isUpdating = true;
        updateId = id;
        isUpdating ? $("#submit-btn").text("Güncelle") : $("#submit-btn").text("Kayıt Ol");
    });

    // Blog silme işlemi
    $("#register-table tbody").on("click", ".delete-btn", function () {
        const id = $(this).closest("tr").data("id");

        if (!confirm(`${id} nolu kullanıcıyı Silmek İstiyor musunuz?`)) return;

        $.ajax({
            url: `/register/api/${id}`,
            method: "DELETE",
            headers: {
                'CSRF-Token': $("input[name='_csrf']").val() // CSRF token'ını header'a ekle
            },
            success: fetchRegisterList,
            error: handleError
        });
    });

    // Sayfa yüklendiğinde blog listesini getir
    fetchRegisterList();
});