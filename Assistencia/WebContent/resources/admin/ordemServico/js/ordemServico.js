ordemServico = new Object();

ordemServico.dados = [];
ordemServico.html = "";

$(document).ready(function () {
    $("#div-cadCliente").load("admin/cliente/modal-cadCliente.html");
    $("#div-editCliente").load("admin/cliente/modal-editCliente.html");
});

ordemServico.cadastrar = function () {
    equip = new Object();
    tip = new Object();
    marc = new Object();
    client = new Object();
    var retorno = "";

    
    ordemServicoCad = new Object();
    ordemServicoCad.problema = $("#problema").val();

    equip.modelo = $("#modeloEquip").val();
    equip.acessorio = $("#acessorioEquip").val();

    tip.idTipo = $("#idTipoEquip").val();

    marc.idMarca = $("#idMarcaEquip").val();

    client.idCliente = $("#idClienteOS").val();

  
    equip.tipo = tip;
    equip.marca = marc;
    equip.modelo = $("#modeloEquip").val();
    equip.acessorio = $("#acessorioEquip").val();

    ordemServicoCad.cliente = client;
    ordemServicoCad.equipamento = equip;

    if (ordemServicoCad.problema == "") {
        retorno += ("O campo 'Problema' deve ser preenchido!\n");
    }
    if (equip.modelo == "") {
        retorno += ("O campo 'Modelo' deve ser preenchido!\n");
    }
    if (tip.idTipo == "") {
        retorno += ("O campo 'Tipo' deve ser preenchido!\n");
    }
    if (marc.idMarca == "") {
        retorno += ("O campo 'Marca' deve ser preenchido!\n");
    }
    if (client.idCliente == "") {
        retorno += ("O campo 'Cliente' deve ser preenchido!\n");
    }

    if (retorno == "") {
        var cfg = {
            url: "../rest/ordemServicoRest/addordemServico",
            data: JSON.stringify(ordemServicoCad),
            success: function (succJson) {
                if (succJson == 1) {
                    resp = ("Ordem de Serviço cadastrado com sucesso!");
                    exibirMessagem(resp, 1);
                    document.getElementById("formNovaOS").reset();
                    document.getElementById("limparInputCliente").style.display = "none";

                    document.getElementById("divBtnEditCliente").style.display = "none";
                    document.getElementById("divBtnCadCliente").style.display = "block";

                    document.getElementById("divBtnEditTipo").style.display = "none";
                    document.getElementById("divBtnCadTipo").style.display = "block";

                    document.getElementById("divBtnEditMarcaEquip").style.display = "none";
                    document.getElementById("divBtnCadMarcaEquip").style.display = "block";
                }else{
                    resp = ("Erro ao cadastrar uma nova ordem de serviço!");
                    exibirMessagem(resp, 2);
                }
            },
            error: function (errJson) {
                resp = ("Erro ao cadastrar uma nova ordem de serviço!");
                exibirMessagem(resp, 2);
            }
        };
        IT.ajax.post(cfg);
    }else{
        alert(retorno);
    }
};

cliente.buscar = function () {
    var valorBusca = $("#cliente").val();
    if (valorBusca != "") {
        if (valorBusca.trim()) {
            var cfg = {
                type: "POST",
                url: "../rest/clienteRest/buscarClientes/" + valorBusca,
                success: function (listaDeClientes) {
                    cliente.exibirClientes(listaDeClientes);
                },
                error: function (err) {
                    alert("Erro ao buscar o Cliente: " + err.responseText);
                }
            };
            IT.ajax.post(cfg);
        }
    } else {
        $("#listaDeClientes").html("");
        document.getElementById("divBtnCadCliente").style.display = "block";
        document.getElementById("divBtnEditCliente").style.display = "none";
        document.getElementById("limparInputCliente").style.display = "none";
    }
};

cliente.ativarModalCad = function () {
    $('#formCadCliente').trigger("reset");
    $("#cidadeCliente").html("<option value=`0`>Selecione</option>");
    $("#bairroCliente").html("<option value=`0`>Selecione</option>");
    $("#ruaCliente").html("<option value=`0`>Selecione</option>");

    cliente.buscarEstadosCad();

    if ($('#nomeClienteLabel').css('display') == "none") {
        cliente.alterarCadCliente();
    }

    $('#cpfCliente').mask('000.000.000-00');

    $("#modal-cadCliente").modal("show");

    //Colocar foco no input
    $('#modal-cadCliente').on('shown.bs.modal', function () {
        $('#nomeCliente').focus();
    })
};

cliente.ativarModalEdit = function () {
    if ($('#nomeClienteLabelEdit').css('display') == "none") {
        cliente.alterarEditCliente();
    }

    //Colocar foco no input
    $('#modal-editCliente').on('shown.bs.modal', function () {
        $('#nomeClienteEdit').focus();
    })

    $("#modal-editCliente").addClass("in");
    $("#modal-editCliente").modal("show");
};

