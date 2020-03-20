assistencia = new Object();
usuario = new Object();

$(document).ready(function(){
    $('#inputCPF').mask('000.000.000-00');
});

assistencia.login = function(){
    document.getElementById("telaLogin").style.display = 'none';
    document.getElementById("loader").style.display = 'block';

    usuario.cpf = new Object();
    usuario.cpf = $("#inputCPF").val();
    usuario.cpf = usuario.cpf.replace(/\./g, "");
    usuario.cpf = usuario.cpf.replace(/\-/g, "");

    var inputSenha = $("#inputPassword").val();
    usuario.senha = btoa(inputSenha);
    
    $.ajax({
        type: "POST",
        url: "verificalogin",
        dataType: "JSON",
        data: JSON.stringify(usuario),
        success: function (msgSuc){
            if(msgSuc.url != undefined){
                window.location.href = (msgSuc.url);
            }           

            if(msgSuc.msg != undefined){
                exibirMessagem(msgSuc.msg, 2);
                document.getElementById("telaLogin").style.display = 'block';
                document.getElementById("loader").style.display = 'none'; 
            }
        },
        error: function (){
            resp = ("Usuario ou senha incorretos!")
            exibirMessagem(resp, 1);
        }
    });
};

assistencia.recuperaSenha = function(){ 
    $.ajax({
        type: "POST",
        url: "../rest/recuperacaoSenha/esqueciSenha",
        dataType: "JSON",
        data: JSON.stringify($("#emailRecuperacao").val()),
        success: function (msgSuc){
            if(msgSuc.url != undefined){
                window.location.href = ("..\\");
            }           

            if(msgSuc.msg != undefined){
                exibirMessagem(msgSuc.msg, 2);
            }
        },
        error: function (){
            resp = ("Usuario ou senha incorretos!")
            exibirMessagem(resp, 1);
        }
    });
};

function exibirMessagem(msg, tipo) {
    var msgDiv = $("#msgLogin");

    switch (tipo) {
        case 1:
            $("#msgLogin").css("background-color", "#008040");
            tipo = "<span class='glyphicon glyphicon-ok msg-icon'></span>";
            break;
        case 2:
            $("#msgLogin").css("background-color", "#b4004e");
            tipo = "<span class='glyphicon glyphicon-remove msg-icon'></span>";
            break;
        default:
            tipo = "";
            break;
    }

    msgDiv.html(tipo + msg);

    $('#msgLogin').slideDown(300, function(){
    }).fadeIn({
        duration: 300,
        queue: true
    });
    // Após 3 segundos remover a classe
    setTimeout(function () {
        $('#msgLogin').slideUp(300, function(){
        }).fadeOut({
            duration: 300,
            queue: false
        });       
    }, 1500);
}