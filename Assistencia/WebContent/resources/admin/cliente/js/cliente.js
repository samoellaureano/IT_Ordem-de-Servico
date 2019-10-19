cliente = new Object();
usuario = new Object();


$(document).ready(function () {
    $("#div-cadCliente").load("admin/cliente/modal-cadCliente.html");
    $("#div-editCliente").load("admin/cliente/modal-editCliente.html");
});

cliente.cadastrar = function () {

    cadU = new Object();
    var retorno = "";

    cadU.cpf = $("#cpfCliente").val();

    if (cadU.cpf == "") {
        retorno += ("O campo 'CPF' deve ser preenchido!\n");
    }else if(cadU.cpf.length < 14){
        retorno += ("O campo 'CPF' deve ser preenchido corretamente!\n");
    }
    cadU.cpf = cadU.cpf.replace(/\./g, "");
    cadU.cpf = cadU.cpf.replace(/\-/g, "");

    usuario.cadU = cadU;
    

    //ABAIXO CRIAR O OBJETO CLIENTE

    cadCliente = new Object();
    cadCliente.usuario = usuario.cadU;


    cadCliente.nome = $("#nomeCliente").val();
    cadCliente.email = $("#emailCliente").val();    
    cadCliente.telefone = $("#telefoneCliente").val();
    cadCliente.celular = $("#celularCliente").val();  

    var masc = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi);
	var res = masc.test(cadCliente.email);
	if (res == false){
		retorno += ("O campo E-mail foi preenchido incorretamente!\n");
    }

    if (retorno == "") {
        var cfg = {
            url: "../rest/classRest/addCliente",
            data: JSON.stringify(cadCliente),
            success: function (succJson) {
                if (succJson == 1) {
                    resp = ("Cliente cadastrado com sucesso!");
                    exibirMessagem(resp, 1);
                } else {
                    resp = ("Erro ao cadastrar um novo Cliente!");
                    exibirMessagem(resp, 2);
                }

                $("#modal-cadCliente").modal("hide");
                $('.modal-backdrop').remove();
                cliente.buscar();
            },
            error: function (errJson) {
                resp = ("Erro ao cadastrar um novo Cliente!");
                exibirMessagem(resp, 2);
            }
        };
        IT.ajax.post(cfg);
    } else {
        alert(retorno);
    }
};

cliente.exibirClientes = function (listaDeClientes) {
    var status = "";
    cliente.html = "<ul class='listaDeClientes'>\n";

    if (listaDeClientes != undefined) {
        if (listaDeClientes.length > 0) {
            for (var i = 0; i < listaDeClientes.length; i++) {
                cliente.html += ("<li onclick='cliente.selectCliente(`"+ listaDeClientes[i].nome +"`)'>" + listaDeClientes[i].nome + "</li>");
            }
        } else {
            cliente.html += "<li style='text-align: center'>Nenhum registro encontrado</li>";
        }
        $("#listaDeClientes").html(cliente.html + "\n</ul>");
    }
};

cliente.selectCliente = function (selectCli) {
    $("#cliente").val(selectCli);
    $("#listaDeClientes").html("");
    document.getElementById("bntCadCliente").style.display = "none";
    document.getElementById("bntEditCliente").style.display = "block";
    document.getElementById("limparInputCliente").style.display = "block";
}

cliente.removeCliente = function(){
    document.getElementById("bntCadCliente").style.display = "block";
    document.getElementById("bntEditCliente").style.display = "none";
    document.getElementById("limparInputCliente").style.display = "none";
    $("#cliente").val("");
}

cliente.alterarCadCliente = function () {
    var display = $('#nomeClienteLabel').css('display');

    if (display == "none") {
        document.getElementById("nomeClienteLabel").style.display = "block";
        document.getElementById("nomeCliente").style.display = "block";
        
        document.getElementById("cpfClienteLabel").style.display = "block";
        document.getElementById("cpfCliente").style.display = "block";

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

        document.getElementById("cpfClienteLabel").style.display = "none";
        document.getElementById("cpfCliente").style.display = "none";

        document.getElementById("telefoneClienteLabel").style.display = "none";
        document.getElementById("telefoneCliente").style.display = "none";

        document.getElementById("celularClienteLabel").style.display = "none";
        document.getElementById("celularCliente").style.display = "none";

        document.getElementById("emailClienteLabel").style.display = "none";
        document.getElementById("emailCliente").style.display = "none";

        document.getElementById("btnProximo").style.display = "none";
    }
};