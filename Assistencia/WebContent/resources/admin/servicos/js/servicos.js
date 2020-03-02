servico = new Object();

servico.dados = [];
servico.tamanhoPagina = 5;
servico.pagina = 0;
servico.html = "";

$(document).ready(function () {
    $("#modal-cadServ").load("admin/servicos/modal-cad.html");
    $("#modal-editServ").load("admin/servicos/modal-edit.html");

    $('#proximoServ').click(function () {
        if (servico.pagina < servico.dados.length / servico.tamanhoPagina - 1) {
            servico.pagina++;
            servico.paginar();
            servico.ajustarBotoes();
        }
    });
    $('#anteriorServ').click(function () {
        if (servico.pagina > 0) {
            servico.pagina--;
            servico.paginar();
            servico.ajustarBotoes();
        }
    });
});

servico.cadastrar = function () {
    servico.cad = new Object();
    servico.cad.desc = $("#descServ").val();
    servico.cad.valor = $("#valorServ").val();
    servico.cad.valor = servico.cad.valor.replace(/\./g, "");
    servico.cad.valor = servico.cad.valor.replace(",", ".");
    var resp = "";

    if (servico.cad.desc != "") {

        var cfg = {
            url: "../rest/servicoRest/addServico",
            data: JSON.stringify(servico.cad),
            success: function (succJson) {
                if (succJson) {
                    resp = ("Serviço cadastrado com sucesso!");
                    exibirMessagem(resp, 1);

                    $("#mod-cadServ").modal("hide");
                    $('.modal-backdrop').remove();
                } else {
                    resp = ("Erro ao cadastrar um novo serviço!");
                    exibirMessagem(resp, 2);
                }

                $("#descServ").val("");
                $("#valorServ").val("");
                servico.buscar();
            },
            error: function (errJson) {
                resp = ("Erro ao cadastrar um novo serviço!");
                exibirMessagem(resp, 2);
            }
        };
        IT.ajax.post(cfg);

    } else {
        alert("O campo 'Descrição' deve ser preenchido!");
    }
};

servico.buscar = function () {
    servico.pagina = 0;
    var valorBusca = $("#consultarServicos").val();
    if (valorBusca == "") {
        valorBusca = null;
    }

    var cfg = {
        type: "POST",
        url: "../rest/servicoRest/buscarServicos/" + valorBusca,
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
    var status = "";
    servico.dados = [];
    servico.html = "";

    if (listaDeServicos != undefined) {
        if (listaDeServicos.length > 0) {
            for (var i = 0; i < listaDeServicos.length; i++) {
                if (listaDeServicos[i].status) {
                    status = "<i style='color: #008400; font-weight: 600;'>Ativo</i>";
                } else {
                    status = "<i style='color: #f12c2c; font-weight: 600;'>Inativo</i>";
                }
                listaDeServicos[i].valor = String(listaDeServicos[i].valor).replace(".",",");
                servico.dados.push([listaDeServicos[i].id, listaDeServicos[i].desc, "R$ " + listaDeServicos[i].valor, status, "<td data-toggle='modal' style='text-align-last: center; border: none;' onclick='servico.buscarServicoPorID(" + listaDeServicos[i].id + ")'><button class='btn btn-outline-light btnEdit' type='button'><i class='fas fa-pencil-alt tabelaEdit'></i></button></td>"]);
            }
        } else {
            servico.html += "<td colspan='5' style='text-align: center; padding-left: 14rem;'>Nenhum registro encontrado</td></tr>";
        }
        $("#resultadoServicos").html(servico.html);
    }
    servico.paginar();
    servico.ajustarBotoes();
};


servico.buscarServicoPorID = function (id) {
    var cfg = {
        type: "POST",
        url: "../rest/servicoRest/buscarServicoPeloId/" + id,
        success: function (servico) {
            $("#editDescServ").val(servico.desc);
            $("#editValorServ").val(String(servico.valor).replace(".",","));
            $("#editId").val(servico.id);
            $("#switch").html("<label class='switch'><input type='checkbox' name='editStatus' id='editStatusServ' value='true' onclick='servico.alteraAtivoEdit()'><span class='slider round'></span></label>");
            if (servico.status) {
                $("#editStatusServ").attr('checked', 'true');
                $("#editStatusServ").attr('value', 'true');
                $("#statusSW").html("Serviço Ativo")
            } else {
                $("#editStatusServ").removeAttr("checked");
                $("#editStatusServ").attr('value', 'false');
                $("#statusSW").html("Serviço Inativo")
            }
        },
        error: function (err) {
            alert("Erro ao editar o servico!" + err.responseText);
        }
    };
    IT.ajax.post(cfg);
    servico.ativarModalEdit();
};

servico.editarServico = function () {
    servico.editar = new Object();
    servico.editar.desc = $("#editDescServ").val();
    servico.editar.valor = $("#editValorServ").val();
    servico.editar.status = $("#editStatusServ").val();
    servico.editar.id = $("#editId").val();
    servico.editar.valor = servico.editar.valor.replace(/\./g, "");
    servico.editar.valor = servico.editar.valor.replace(",", ".");
    var resp = "";

    var cfg = {
        url: "../rest/servicoRest/editarServico",
        data: servico.editar,
        success: function (data) {
            if (data) {
                resp = ("Serviço editado com sucesso!");
                exibirMessagem(resp, 1);

                $('.modal-backdrop').remove();
                $("#mod-edit").modal("hide");
            } else {
                resp = ("Erro ao editar o serviço!");
                exibirMessagem(resp, 2);
            }
            servico.buscar();

        },
        error: function (err) {
            resp = ("Erro ao editar o serviço!");
            exibirMessagem(resp, 2);
        }
    };
    IT.ajax.post(cfg);
};

servico.alteraAtivoEdit = function () {
    valor = $("#editStatusServ").val();
    if (valor == 'true') {
        $("#editStatusServ").attr('value', 'false');
        $("#statusSW").html("Serviço Inativo")
    }else if (valor == 'false') {
        $("#editStatusServ").attr('value', 'true');
        $("#statusSW").html("Serviço Ativo")
    }
};

servico.ativarModalCad = function () {
    $("#mod-cadServ").modal("show");
    $("#descServ").val("");
    $("#valorServ").val("0,00");

    //colocar foco no input
    $('#mod-cadServ').on('shown.bs.modal', function () {
        $('#descServ').focus();
    })
};

servico.ativarModalEdit = function () {
    $("#mod-edit").addClass("in");
    $("#mod-edit").modal("show");
};
/*
servico.
*/

servico.paginar = function () {
    document.getElementById("btnPaginacaoServ").style.display = "block";
    $('#tableServ > tbody > tr').remove();
    var tbody = $('#tableServ > tbody');
    var cont = 0;
    for (var i = servico.pagina * servico.tamanhoPagina; i < servico.dados.length && i < (servico.pagina + 1) * servico.tamanhoPagina; i++) {
        cont++;
        tbody.append(
            $('<tr>')
                .append($('<td>').append(servico.dados[i][0]))
                .append($('<td>').append(servico.dados[i][1]))
                .append($('<td>').append(servico.dados[i][2]))
                .append($('<td style="text-align: center;">').append(servico.dados[i][3]))
                .append($('<td style="text-align: -webkit-center;">').append(servico.dados[i][4]))
        )
    }

    if ((cont < servico.tamanhoPagina) && (servico.html == "")) {
        for (var i = cont; i < servico.tamanhoPagina; i++) {
            tbody.append(
                $('<tr>')
                    .append($('<td>').append(""))
                    .append($('<td>').append(""))
                    .append($('<td>').append(""))
                    .append($('<td>').append(""))
                    .append($('<td style="text-align: -webkit-center; padding: 0.81rem !important">').append("&nbsp;"))
            )
        }
    }

    if (servico.html != "") {
        document.getElementById("btnPaginacaoServ").style.display = "none";
    }

    $('#numeracaoServ').text('Página ' + (servico.pagina + 1) + ' de ' + Math.ceil(servico.dados.length / servico.tamanhoPagina));
}

servico.ajustarBotoes = function () {
    $('#proximoServ').prop('disabled', servico.dados.length <= servico.tamanhoPagina || servico.pagina >= Math.ceil(servico.dados.length / servico.tamanhoPagina) - 1);
    $('#anteriorServ').prop('disabled', servico.dados.length <= servico.tamanhoPagina || servico.pagina == 0);
}


