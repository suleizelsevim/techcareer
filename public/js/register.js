$(document).ready(function () {
    let isUpdating = false;
    let updateId = null;
    const maxChars = 2000; // Maksimum harf sayısı

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

    // İçerik harf sınırını kontrol etme fonksiyonu
    const updateCharCount = () => {
        const content = $("#password").val();
        const charCount = content.length;
        const remainingChars = maxChars - charCount;

        $("#char-count").text(`Kalan Harf Sayısı: ${remainingChars}`);

        if (remainingChars < 0) {
            $("#char-count").removeClass("text-success").addClass("text-danger");
            showError("#password", "İçerik 2000 harften fazla olamaz!");
        } else {
            $("#char-count").removeClass("text-danger").addClass("text-success");
            $(".error-message").remove();
        }
    };

    // Form doğrulama fonksiyonu
    const validateForm = () => {
        clearErrors();
        let isValid = true;
        const password = $("#password").val();
        const charCount = password.length;

        if ($("#username").val().trim() === "") {
            showError("#username", "kullanıcı adı boş bırakılamaz!");
            isValid = false;
        } else {
            showValid("#username", "kullanıcı adı geçerli.");
        }

        if (password.trim() === "") {
            showError("#password", "şifre boş bırakılamaz!");
            isValid = false;
        } else if (charCount > maxChars) {
            showError("#password", "şifre 2000 harften fazla olamaz!");
            isValid = false;
        } else {
            showValid("#password", "İçerik geçerli.");
        }

        if ($("#email").val().trim() === "") {
            showError("#email", "Yazar adı boş bırakılamaz!");
            isValid = false;
        } else {
            showValid("#email", "Yazar adı geçerli.");
        }

        return isValid;
    };

    // Kullanıcı içerik alanına yazdıkça harf sayısını güncelle


    // Kullanıcı input'a yazarken hataları kaldır ve geçerli mesaj ekle
    $("#username, #password, #email").on("input", function () {
        const field = $(this);
        if (field.val().trim() === "") {
            showError(field, "Bu alan boş bırakılamaz!");
        } else {
            showValid(field, "Geçerli.");
        }
    });

    // Formu sıfırlama fonksiyonu
    const resetForm = () => {
        $("#register-form")[0].reset();
        isUpdating = false;
        updateId = null;
        $("#submit-btn").text("Ekle");
        clearErrors();
        updateCharCount();
    };

    // Blog listesini getir
    const fetchRegisterList = () => {
        $.ajax({
            url: "/register/api",
            method: "GET",
            success: function (data) {
                const $tbody = $("#register-table tbody").empty();
                data = JSON.parse(data);
                console.log("data", data);
                
                data.forEach(item => {
                    $tbody.append(`
                        <tr data-id="${item._id}">
                            <td>${item._id}</td>
                            <td>${item.username}</td>
                            <td>${item.password}</td>
                            <td>${item.email}</td>
                            <td>${item.date}</td>
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
        $("#password").val(row.find("td:eq(2)").text());
        $("#email").val(row.find("td:eq(3)").text());

        isUpdating = true;
        updateId = id;
        $("#submit-btn").text("Güncelle");
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
    updateCharCount(); // Başlangıçta harf sayacını güncelle
});