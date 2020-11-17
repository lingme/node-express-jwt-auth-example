$("#btn-login").click(function () {
    var name = $("#in-name").val()
    var pwd = md5($("#in-pwd").val())

    if (!name || !pwd) {
        showTimeoutAlert('alert-warning', 'The account or password cannot be empty')
        return
    }

    $.ajax({
        type: "post",
        url: "http://localhost:3000/api/login",
        dataType: 'json',
        contentType: "application/json",
        data: JSON.stringify({
            username: name,
            password: pwd
        }),
        success: function (data) {
            showAlert('alert-success', `Welcome ${name}`)
            setCookie('jwt_token', data.token, 1)
            $('#user-input').hide()
            $('#btn-login').hide()
            $('#btn-logout').show()
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            showTimeoutAlert('alert-danger', errorThrown)
        }
    })
})

$('#btn-logout').click(function () {
    $('#user-input').show()
    $('#btn-login').show()
    $('#btn-logout').hide()
    $('#box-alert').empty()
    showTimeoutAlert('alert-success', 'You logout with success')
    eraseCookie('jwt_token')
})

$("#btn-public").click(function () {
    $.ajax({
        type: "post",
        url: "http://localhost:3000/api/public",
        success: function (data) {
            showTimeoutAlert('alert-success', data.result, 6000)
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            showTimeoutAlert('alert-danger', errorThrown)
        }
    })
})

$("#btn-protect").click(function () {
    $.ajax({
        type: "post",
        url: "http://localhost:3000/api/protected",
        beforeSend: function (xhr) {
            if (getCookie('jwt_token')) {
                xhr.setRequestHeader("Authorization", getCookie('jwt_token'));
            }
        },
        success: function (data) {
            showTimeoutAlert('alert-success', data.result, 6000)
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            showTimeoutAlert('alert-danger', errorThrown)
        }
    })
})

function setCookie(key, value, expiry) {
    var expires = new Date()
    expires.setTime(expires.getTime() + (expiry * 24 * 60 * 60 * 1000))
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString()
}

function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)')
    return keyValue ? keyValue[2] : null
}

function eraseCookie(key) {
    var keyValue = getCookie(key)
    setCookie(key, keyValue, '-1')
}

function showTimeoutAlert(alerttype, message, showtime = 5000) {
    $('#box-alert').append(`<div id="alertdiv" class="alert ${alerttype}"><a class="close" data-dismiss="alert">×</a><span>${message}</span></div>`)
    setTimeout(function () {
        $("#alertdiv").remove()
    }, showtime)
}

function showAlert(alerttype, message) {
    $('#box-alert').append(`<div class="alert ${alerttype}"><span>${message}</span></div>`)
}