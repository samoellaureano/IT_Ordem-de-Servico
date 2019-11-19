configUsuario = new Object();
usuario = new Object();


$(document).ready(function () {
    $('#cpfFuncConfig').mask('000.000.000-00');

    
});

configUsuario.alterarSenha = function(){
    document.getElementById("senhaNovaFuncConfigLabel").style.display = "block";
    document.getElementById("senhaConfirmaFuncConfigLabel").style.display = "block";
}


configUsuario.alterarFormConfigUser = function () {
    var statusAlterSenha = $('#alterarSenha').val();
    console.log(statusAlterSenha);

    if (statusAlterSenha == "false") {
        $('#alterarSenha').val("true");

        document.getElementById("senhaNovaFuncConfigLabel").style.display = "block";
        document.getElementById("senhaNovaFuncConfig").style.display = "block";

        document.getElementById("senhaConfirmaFuncConfigLabel").style.display = "block";
        document.getElementById("senhaConfirmaFuncConfig").style.display = "block";

        $('#senhaNovaFuncConfigLabel').focus();

    } else {
        $('#alterarSenha').val("false");

        document.getElementById("senhaNovaFuncConfigLabel").style.display = "none";
        document.getElementById("senhaNovaFuncConfig").style.display = "none";

        document.getElementById("senhaConfirmaFuncConfigLabel").style.display = "none";
        document.getElementById("senhaConfirmaFuncConfig").style.display = "none";
    }
};