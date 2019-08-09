assistencia = new Object();

$(document).ready(function(){
    $('#inputCPF').mask('000.000.000-00');
});

assistencia.login = function(){
    inputCPF = $("#inputCPF").val();
    inputCPF = inputCPF.replace(/\./g, "");
    inputCPF = inputCPF.replace(/\-/g, "");
    $("#inputCPF").val(inputCPF);
    
    $.ajax({
        type: "POST",
        url: "verificalogin",
        data: $("#login").serialize(),
        success: function (msgSuc){
            if(msgSuc.url != undefined){
                window.location.href = (msgSuc.url);
            }           

            if(msgSuc.msg != undefined){
                alert(msgSuc.msg); 
            }
        },
        error: function (rest){
            alert("Usuario ou senha incorretos!")
        }
    });
};