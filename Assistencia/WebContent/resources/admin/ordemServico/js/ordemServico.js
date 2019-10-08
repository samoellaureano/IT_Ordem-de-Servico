ordemServico = new Object();

ordemServico.dados = [];
ordemServico.html = "";

$(document).ready(function () {
    $("#div-cadCliente").load("admin/cliente/modal-cadCliente.html");
    $("#div-editCliente").load("admin/cliente/modal-editCliente.html");
});

ordemServico.cadastrar = function () {
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

ordemServico.ativarModalCad = function () {
    $("#modal-cadCliente").modal("show");

    //Colocar foco no input
    $('#modal-cadCliente').on('shown.bs.modal', function () {
    })
};

cliente.ativarModalCad = function () {
    $('#formCadCliente').trigger("reset");
    if ($('#nomeClienteLabel').css('display') == "none"){
        cliente.alterarCadCliente();
    }

    $("#modal-cadCliente").modal("show");

    //Colocar foco no input
    $('#modal-cadCliente').on('shown.bs.modal', function () {
        $('#nomeCliente').focus();
    })
};

ordemServico.ativarModalEdit = function () {
    $("#modal-editCliente").addClass("in");
    $("#modal-editCliente").modal("show");
};

