$(document).ready(function() {
    $('#addUserForm').on('submit', function(event) {
        event.preventDefault(); // предотвращаем стандартное поведение формы

        // Собираем данные формы
        var formData = $(this).serializeArray();
        var jsonData = {
            username: $('input[name="username"]').val(),
            lastName: $('input[name="lastName"]').val(),
            email: $('input[name="email"]').val(),
            password: $('input[name="password"]').val(),
            age: parseInt($('input[name="age"]').val()),
            roles: $('#newRoles').val().map(function(role) {
                return {
                    id: role === "ADMIN" ? 2 : 1,
                    name: role === "ADMIN" ? "ADMIN" : "USER"
                };
            })
        };
        console.log(jsonData);

        // Отправка данных на сервер
        $.ajax({
            url: '/api/user',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(jsonData),
            success: function() {
                // Скрыть форму
                $('#addUserForm')[0].reset();
                $('#nav-home-tab').tab('show');

                loadRoles();
                loadContent('ADMIN');
                loadUsers2();
            },
            error: function() {
                // Скрыть индикатор загрузки
                $('#loadingIndicator').hide();
                alert('Ошибка при добавлении пользователя');
            }
        });
    });
});