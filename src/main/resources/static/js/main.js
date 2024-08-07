$(document).ready(function () {
    async function fetchDataAndProcess() {
        try {
            loadNavbar()
            loadRoles()
            loadUsers2()
            loadUsersUser()
        } catch (error) {
            handleError(error);
        }
    }

    fetchDataAndProcess();

    $('body').on('show.bs.modal', '#editUser', function (event) {
        console.log("обработчик модалки editUser");
        var button = $(event.relatedTarget); // Кнопка, которая вызвала модальное окно
        var user = button.data('user');
        var roles = button.data('roles');
        console.log(user);
        console.log(roles);

        // Получаем ссылку на модальное окно
        var modal = $(this);

        // Заполняем поля модального окна данными пользователя
        modal.find('#editusername').val(user.username);
        modal.find('#editlastName').val(user.lastName);
        modal.find('#userid').val(user.id);
        modal.find('#editage').val(user.age);
        modal.find('#editemail').val(user.email);
        modal.find('#ueditpassword').val(user.password);
        $.ajax({
            url: '/api/roles', // Указываем URL сервера, который возвращает роли
            method: 'PUT',
            beforeSend: function () {
                // Блокируем UI перед выполнением запроса
                $('#loadingIndicator').show();
            },
            success: function (AllRoles) {
                var set1 = new Set(AllRoles.map(item => item.name));
                var set2 = new Set(roles.map(item => item.name));
                var intersection = AllRoles.filter(item => set2.has(item.name));
                console.log("совпадения")
                console.log(intersection)
                var rolesEdit = modal.find('#rolesEdit');
                rolesEdit.empty(); // Очищаем текущие значения
                AllRoles.forEach(function (role) {
                    var intersection2 = roles.map(item => item.name);
                    rolesEdit.append($('<option>', {
                        text: role.name,
                        value: role.name,
                        selected:  intersection2.includes(role.name)

                    }));
                });
            },
            error: function (error) {
                // Обрабатываем ошибку ответа
                console.error('Ответ сети не в порядке', error);
            },
            complete: function () {
                // Разблокируем UI после завершения запроса
                $('#loadingIndicator').hide();
            }
        });
    })

    // Обработчик для кнопки "Сохранить изменения"
    $('#editForm').on('submit', function(event) {
        event.preventDefault(); // предотвращаем стандартное поведение формы
        // Собираем данные формы
        var jsonData1 = {
            id: $('#userid').val(),
            username: $('#editusername').val(),
            lastName: $('#editlastName').val(),
            email: $('#editemail').val(),
            password: $('#editpassword').val(),
            age: parseInt($('#editage').val()),
            roles: $('#rolesEdit').val().map(function(role) {
                return {
                    id: role === "ADMIN" ? 2 : 1,
                    name: role === "ADMIN" ? "ADMIN" : "USER"
                };
            })
        };
        console.log(jsonData1);


        $.ajax({
            url: '/api/users/' , // Указываем URL для обновления пользователя
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(jsonData1),
            beforeSend: function () {
                // Блокируем UI перед выполнением запроса
                $('#loadingIndicator').show();
            },
            success: function (response) {
                console.log('Пользователь успешно обновлен', response);
                // Закрываем модальное окно
                $('#editUser').modal('hide');
                loadRoles();
                loadContent('ADMIN');
                loadUsers2();

            },
            error: function (error) {
                // Обрабатываем ошибку ответа
                console.error('Ошибка при обновлении пользователя', error);
            },
            complete: function () {
                // Разблокируем UI после завершения запроса
                $('#loadingIndicator').hide();
            }
        });
    });


    $('body').on('show.bs.modal', '#deleteUserModal2', function (event) {
        console.log("обработчик модалки");
        var button = $(event.relatedTarget); // Кнопка, которая вызвала модальное окно
        var user = button.data('user');
        var roles = button.data('roles');
        console.log(user);
        console.log(roles);

        // Получаем ссылку на модальное окно
        var modal = $(this);

        // Заполняем поля модального окна данными пользователя
        modal.find('#usernameDelete').val(user.username);
        modal.find('#lastNameDelete').val(user.lastName);
        modal.find('#ageDelete').val(user.age);
        modal.find('#emailDelete').val(user.email);
        modal.find('#userIdDelete').val(user.id);

        // Заполняем список ролей
        var rolesSelect = modal.find('#rolesDelete');
        rolesSelect.empty(); // Очищаем текущие значения
        roles.forEach(function (role) {
            rolesSelect.append($('<option>', {
                text: role.name,
                selected: true
            }));
        });

    })
    $('#deleteForm').on('submit', function (event) {
        event.preventDefault(); // Предотвращаем стандартное поведение формы

        var userId = $('#userIdDelete').val();
        console.log(userId);
        $.ajax({
            url: '/api/user/' + userId, // URL для удаления пользователя
            type: 'DELETE',
            success: function (response) {
                console.log('Пользователь удален:', response);
                loadUsers2();
                // Закрываем модальное окно
                $('#deleteUserModal2').modal('hide');

                // Обновляем таблицу пользователей (или можно удалить строку пользователя из таблицы)
                // Например, можно вызвать функцию для обновления таблицы пользователей

            },
            error: function (xhr, status, error) {
                console.error('Ошибка при удалении пользователя:', error);
                // Обработка ошибок
            }
        });
    });
});

function loadRoles() {
    $.ajax({
        url: '/api/user/roles', // Указываем URL сервера, который возвращает роли
        method: 'GET',
        beforeSend: function () {
            // Блокируем UI перед выполнением запроса
            $('#loadingIndicator').show();
        },
        success: function (data) {
            const rolesList = $('#roles-list');
            rolesList.empty(); // Очистить список перед добавлением новых элементов
            const listItem = $('<li></li>');
            const link = $('<a></a>');
            const hasAdminRole = data.some(role => role.name === 'ADMIN');
            if (hasAdminRole) {
                data.forEach(function (role) {
                    listItem.addClass('list-group-item');
                    link.attr('href', '#').text(role.name);
                    link.on('click', function (event) {
                        event.preventDefault();
                        listItem.addClass('active');
                        userItem.removeClass('active');
                        link.addClass('active');
                        userLink.removeClass('active');
                        loadContent(role.name);

                    });
                    listItem.append(link);
                    rolesList.append(listItem);
                    loadContent('ADMIN');
                });
            }
            // Создаем элемент списка для USER
            const userItem = $('<li></li>').addClass('list-group-item');
            const userLink = $('<a></a>').attr('href', '#').text('USER');
            userLink.on('click', function (event) {
                event.preventDefault(); // Предотвращаем переход по ссылке
                userItem.addClass('active');
                rolesList.find('li').not(userItem).removeClass('active');
                userLink.addClass('active');
                rolesList.find('a').not(userLink).removeClass('active');
                loadContent('USER');
            });
            userItem.append(userLink);
            rolesList.append(userItem);

            if (hasAdminRole) {
                listItem.addClass('active');
                userItem.removeClass('active');
                link.addClass('active');
                userLink.removeClass('active');
                loadContent('ADMIN');

            } else {
                userItem.addClass('active');
                userLink.addClass('active');
                loadContent('USER');


            }
        },
        error: function (error) {
            console.error('Error fetching roles:', error);
        }
    });
}

function loadContent(role) {
    $('#content-area > div').removeClass('active');
    if (role === 'ADMIN') {
        $('#div1').addClass('active');
        console.log("я админ сработал")
    } else if (role === 'USER') {
        loadUsersUser();
        $('#div2').addClass('active');
        console.log("я юзер  сработал")
    } else {
        $('#div3').addClass('active');
    }
}

function loadNavbar() {
    $.ajax({
        url: '/api/user', // Замените URL на реальный URL вашего API
        method: 'GET',
        beforeSend: function () {
            // Блокируем UI перед выполнением запроса
            $('#loadingIndicator').show();
        },
        success: function (data) {
            // Вставка email пользователя
            $('#userEmail').text(data.email);

            // Вставка ролей пользователя
            var roles = data.roles.map(function (role) {
                return role.name;
            }).join(', ');
            $('#userRoles').text(roles);
        },
        error: function (xhr, status, error) {
            console.error('Ошибка загрузки данных:', error);
        }
    });
}

function loadUsers2() {
    var deferred = $.Deferred();
    $.ajax({
        url: '/api/users1',
        method: 'PUT',
    }).done(function (data) {
        deferred.resolve(data);
        loadUsersRoles2(data, '#adminTableBody2');
    }).fail(function (error) {
        deferred.reject(error);
    });
    return deferred.promise();
}

function loadUsersRoles2(users, tableSelector) {
    var tbody = $(tableSelector);
// function loadUsersRolse2(users) {
//     var tbody = $('#userTableBody2');
    tbody.empty();

    // Создаем массив промисов для хранения всех AJAX-запросов
    var rolePromises = [];

    // Проходим по каждому пользователю
    users.forEach(function (user) {
        // Создаем промис для каждого AJAX-запроса
        var rolePromise = $.ajax({
            url: '/api/rolesId',
            method: 'PUT',
            contentType: 'application/json', // Устанавливаем тип контента
            data: JSON.stringify({id: user.id}),
            success: function (response) {
                return response;

            },
            error: function (error) {
                console.error("Ошибка:", error);
                return []; // Возвращаем пустой массив в случае ошибки
            }
        }).then(function (roles) {
            let rolesHtml = '';
            roles.forEach(function (role) {
                rolesHtml += '<span>' + role.name + ' ' + '</span>';
            });

            // Создаем строку таблицы с ролью
            var row = $('<tr></tr>');
            row.append('<td>' + user.id + '</td>');
            row.append('<td>' + user.username + '</td>');
            row.append('<td>' + user.lastName + '</td>');
            row.append('<td>' + user.age + '</td>');
            row.append('<td>' + user.email + '</td>');
            row.append('<td>' + rolesHtml + '</td>');
            var editButton = $('<button type="button" class="btn btn-sm btn-danger " data-toggle="modal" data-target="#editUser">Edit</button>');
            // Сохраняем данные пользователя в кнопке
            editButton.data('user', user);
            editButton.data('roles', roles);
            row.append($('<td></td>').append(editButton));
            // Создаем кнопку удаления
            var deleteButton = $('<button type="button" class="btn btn-sm btn-danger delete" data-toggle="modal" data-target="#deleteUserModal2">Delete</button>');
            // Сохраняем данные пользователя в кнопке
            deleteButton.data('user', user);
            deleteButton.data('roles', roles);
            row.append($('<td></td>').append(deleteButton));
            tbody.append(row);
        });
        rolePromises.push(rolePromise);

    });
}

function loadUsersUser() {
    $.ajax({
        url: 'api/user',
        method: 'GET',
        contentType: 'application/json',
        success: function (user) {

            console.log(user);
            var tbody = $('#userTableBody');
            tbody.empty();
// Создаем строку таблицы с ролью
            let rolesHtml = '';
            user.roles.forEach(function (role) {
                rolesHtml += '<span>' + role.name + ' ' + '</span>';
            });
            var row = $('<tr></tr>');
            row.append('<td>' + user.id + '</td>');
            row.append('<td>' + user.username + '</td>');
            row.append('<td>' + user.lastName + '</td>');
            row.append('<td>' + user.age + '</td>');
            row.append('<td>' + user.email + '</td>');
            row.append('<td>' + rolesHtml + '</td>');
            tbody.append(row);
        }
    });
}

function getAllRoles() {
    $.ajax({
        url: '/api/user/roles', // Указываем URL сервера, который возвращает роли
        method: 'GET',
        beforeSend: function () {
            // Блокируем UI перед выполнением запроса
            $('#loadingIndicator').show();
        },
        success: function (data) {
            // Обрабатываем успешный ответ
            console.log("все роли");
            console.log(data); // Для отладки выводим полученные данные в консоль

        },
        error: function (error) {
            // Обрабатываем ошибку ответа
            console.error('Ответ сети не в порядке', error);
        },
        complete: function () {
            // Разблокируем UI после завершения запроса
            $('#loadingIndicator').hide();
        }
    });
}