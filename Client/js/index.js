$("#btn-login").click(function () {
    var name = $("#in-name").val()
    var pwd = md5($("#in-name").val())

    if (!name || !pwd) {
        showAlert('alert-warning', 'The account password cannot be empty')
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
            console.log(data)
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            showAlert('alert-danger', errorThrown)
        }
    })
})

$("#btn-public").click(function () {
    showAlert('alert-success', 'show time')
})

function showAlert(alerttype, message) {
    $('#box-alert').append(`<div id="alertdiv" class="alert ${alerttype}"><a class="close" data-dismiss="alert">×</a><span>${message}</span></div>`)
    setTimeout(function () {
        $("#alertdiv").remove()
    }, 5000)
}