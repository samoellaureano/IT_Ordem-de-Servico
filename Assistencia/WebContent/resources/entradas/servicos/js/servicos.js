servico = new Object();

$(document).ready(function () {
    servico.buscar();
});
servico.cadastrar = function () {
    servico.cadastrar = new Object();
    servico.cadastrar.desc = $("#descServ").val();
    servico.cadastrar.valor = $("#valorServ").val();
    servico.cadastrar.status = $("#status").val();
    servico.cadastrar.valor = servico.cadastrar.valor.replace(/\./g, "");
    servico.cadastrar.valor = servico.cadastrar.valor.replace(",", ".");
    var resp = "";

    var cfg = {
        url: "../../../rest/servicoRest/addServico",
        data: JSON.stringify(servico.cadastrar),
        success: function (succJson) {
            var cfg = {
                title: "Mensagem",
                height: 150,
                width: 400,
                modal: true,
                buttons: {
                    "Ok": function () {
                        if (succJson) {
                            $("#mod-cad").modal("hide");
                            $('.modal-backdrop').remove();
                        }
                        $(this).dialog("close");
                    }
                }
            };
            if (succJson) {
                resp = ("Serviço cadastrado com sucesso!");
            } else {
                resp = ("Erro ao cadastrar um novo serviço!");
            }
            $("#msg").html(resp);
            $("#msg").dialog(cfg);
            servico.buscar();
        },
        error: function (errJson) {
            alert("Erro ao cadastrar um novo serviço");
        }
    };
    IT.ajax.post(cfg);
}

servico.buscar = function () {
    var valorBusca = $("#consultarServico").val();
		if(valorBusca == ""){
			valorBusca = null;
		}

    var cfg = {
        type: "POST",
        url: "../../../rest/servicoRest/buscarServicos/"+valorBusca,
        success: function (listaDeServicos) {
            servico.exibirServicos(listaDeServicos);
        },
        error: function (err) {
            alert("Erro ao buscar Servicos: " + err.responseText);
        }
    };
    IT.ajax.post(cfg);
};

servico.exibirServicos = function (listaDeServicos) {
    var html="";
    if (listaDeServicos != undefined) {
        if (listaDeServicos.length > 0) {
            for (var i = 0; i < listaDeServicos.length; i++) {
                html += "<tr><td>" + listaDeServicos[i].id + "</td>" +
                    "<td>" + listaDeServicos[i].desc + "</td>" +
                    "<td>" + "R$ "+ listaDeServicos[i].valor + "</td>" +
                    "<td data-toggle='modal' data-target='#mod-edit' style='text-align-last: center;'><button class='btn btn-outline-light btnEdit' type='button'><i class='fas fa-pencil-alt tabelaEdit'></i></button></td>";
            }
        } else {
            html += "<tr><td colspan='3' style='text-align: center; padding-left: 14rem;'>Nenhum registro encontrado</td></tr>";
        }
        $("#resultadoContatos").html(html);
    }
};


function editar() {
    servico.editar = new Object();
    servico.editar.desc = $("#editDescServ").val();
    servico.editar.valor = $("#editValorServ").val();

    console.log(servico.editar.desc);
    console.log(servico.editar.valor);
}

function alteraAtivo() {
    valor = $("#status").val();
    if (valor == 'true') {
        $("#status").attr('value', 'false');
    }
    if (valor == 'false') {
        $("#status").attr('value', 'true');
    }
}

function ativarModal() {
    $("#mod-cad").addClass("in");
}