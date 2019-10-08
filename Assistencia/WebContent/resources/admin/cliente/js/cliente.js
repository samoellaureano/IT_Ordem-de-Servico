cliente = new Object();
usuario = new Object();

cliente.dados = [];
cliente.html = "";

$(document).ready(function () {
    $("#div-cadCliente").load("admin/cliente/modal-cadCliente.html");
    $("#div-editCliente").load("admin/cliente/modal-editCliente.html");
});

cliente.cadastrar = function () {

    cadU = new Object();
    var retorno = "";

    cadU.cpf = $("#cpfFunc").val();
    cadU.perfil = $("#perfilFunc").val();

    if (cadU.cpf == "") {
        retorno += ("O campo 'CPF' deve ser preenchido!\n");
    }else if(cadU.cpf.length < 14){
        retorno += ("O campo 'CPF' deve ser preenchido corretamente!\n");
    }
    cadU.cpf = cadU.cpf.replace(/\./g, "");
    cadU.cpf = cadU.cpf.replace(/\-/g, "");

    usuario.cadU = cadU;

    //ABAIXO CRIAR O OBJETO CLIENTE

    if (retorno == "") {
        var cfg = {
            url: "../rest/classRest/addCliente",
            data: JSON.stringify(cliente),
            success: function (succJson) {
                if (succJson == 1) {
                    resp = ("Usuário cadastrado com sucesso!");
                    exibirMessagem(resp, 1);
                } else {
                    resp = ("Erro ao cadastrar um novo Usuário!");
                    exibirMessagem(resp, 2);
                }

                $("#modal-cadCliente").modal("hide");
                $('.modal-backdrop').remove();
                cliente.buscar();
            },
            error: function (errJson) {
                resp = ("Erro ao cadastrar um novo funcionário!");
                exibirMessagem(resp, 2);
            }
        };
        IT.ajax.post(cfg);
    } else {
        alert(retorno);
    }
};

cliente.alterarCadCliente = function () {
    var display = $('#nomeClienteLabel').css('display');

    if (display == "none") {
        document.getElementById("nomeClienteLabel").style.display = "block";
        document.getElementById("nomeCliente").style.display = "block";

        document.getElementById("telefoneClienteLabel").style.display = "block";
        document.getElementById("telefoneCliente").style.display = "block";

        document.getElementById("celularClienteLabel").style.display = "block";
        document.getElementById("celularCliente").style.display = "block";

        document.getElementById("emailClienteLabel").style.display = "block";
        document.getElementById("emailCliente").style.display = "block";

        document.getElementById("btnProximo").style.display = "block";

        document.getElementById("cepClienteLabel").style.display = "none";
        document.getElementById("cepCliente").style.display = "none";

        document.getElementById("ruaClienteLabel").style.display = "none";
        document.getElementById("ruaCliente").style.display = "none";

        document.getElementById("numeroClienteLabel").style.display = "none";
        document.getElementById("numeroCliente").style.display = "none";

        document.getElementById("complementoClienteLabel").style.display = "none";
        document.getElementById("complementoCliente").style.display = "none";

        document.getElementById("btnVoltar").style.display = "none";
        document.getElementById("btnSalvar").style.display = "none";
        
    } else if((display == "block") && ($('#nomeCliente').val() != "")){
        document.getElementById("cepClienteLabel").style.display = "block";
        document.getElementById("cepCliente").style.display = "block";

        document.getElementById("ruaClienteLabel").style.display = "block";
        document.getElementById("ruaCliente").style.display = "block";

        document.getElementById("numeroClienteLabel").style.display = "block";
        document.getElementById("numeroCliente").style.display = "block";

        document.getElementById("complementoClienteLabel").style.display = "block";
        document.getElementById("complementoCliente").style.display = "block";

        document.getElementById("btnVoltar").style.display = "block";
        document.getElementById("btnSalvar").style.display = "block";

        document.getElementById("nomeClienteLabel").style.display = "none";
        document.getElementById("nomeCliente").style.display = "none";

        document.getElementById("telefoneClienteLabel").style.display = "none";
        document.getElementById("telefoneCliente").style.display = "none";

        document.getElementById("celularClienteLabel").style.display = "none";
        document.getElementById("celularCliente").style.display = "none";

        document.getElementById("emailClienteLabel").style.display = "none";
        document.getElementById("emailCliente").style.display = "none";

        document.getElementById("btnProximo").style.display = "none";
    }
};