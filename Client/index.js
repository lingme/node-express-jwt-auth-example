$("#btn-login").click(function(){
    var name = $("#in-name").val()
    var pwd = md5($("#in-name").val())
    
    $.ajax({
        url: "localhost:3000/api/login",
        type: "post",
        data: {
            username: name,
            password: pwd
        },
        dataType: "json",
        success:function(data){
            console.log(data)
        }
    })
})

$("#btn-public").click(function(){
    $(".alert").delay(4000).slideUp(200, function() {
        $(this).alert('close');
    });
})