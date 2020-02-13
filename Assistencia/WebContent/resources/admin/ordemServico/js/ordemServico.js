ordemServico = new Object();

ordemServico.dados = [];
ordemServico.html = "";

$(document).ready(function () {
    $("#div-cadCliente").load("admin/cliente/modal-cadCliente.html");
    $("#div-editCliente").load("admin/cliente/modal-editCliente.html");
});

ordemServico.cadastrar = function () {
    equipamento = new Object();
    tipo = new Object();
    marca = new Object();
    cliente = new Object();
    var retorno = "";

    
    ordemServicoCad = new Object();
    ordemServicoCad.problema = $("#problema").val();

    equipamento.modelo = $("#modeloEquip").val();
    equipamento.acessorio = $("#acessorioEquip").val();

    tipo.idTipo = $("#idTipoEquip").val();

    marca.idMarca = $("#idMarcaEquip").val();

    cliente.idCliente = $("#idClienteOS").val();

  
    equipamento.tipo = tipo;
    equipamento.marca = marca;
    equipamento.modelo = $("#modeloEquip").val();
    equipamento.acessorio = $("#acessorioEquip").val();

    ordemServicoCad.cliente = cliente;
    ordemServicoCad.equipamento = equipamento;

    if (ordemServicoCad.problema == "") {
        retorno += ("O campo 'Problema' deve ser preenchido!\n");
    }
    if (equipamento.modelo == "") {
        retorno += ("O campo 'Modelo' deve ser preenchido!\n");
    }
    if (equipamento.acessorio == "") {
        retorno += ("O campo 'Acessório' deve ser preenchido!\n");
    }
    if (tipo.idTipo == "") {
        retorno += ("O campo 'Tipo' deve ser preenchido!\n");
    }
    if (marca.idMarca == "") {
        retorno += ("O campo 'Marca' deve ser preenchido!\n");
    }
    if (cliente.idCliente == "") {
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

