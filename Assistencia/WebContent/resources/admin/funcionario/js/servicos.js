servico = new Object();

var dados = [];
var tamanhoPagina = 5;
var pagina = 0;
var html = "";

$(document).ready(function () {
    $("#modal-cad").load("admin/servicos/modal-cad.html");
    $("#modal-edit").load("admin/servicos/modal-edit.html");

    $('#proximo').click(function () {
        if (pagina < dados.length / tamanhoPagina - 1) {
            pagina++;
            paginar();
            ajustarBotoes();
        }
    });
    $('#anterior').click(function () {
        if (pagina > 0) {
            pagina--;
            paginar();
            ajustarBotoes();
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

                    $("#mod-cad").modal("hide");
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
    pagina = 0;
    var valorBusca = $("#consultarServico").val();
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
    dados = [];
    html = "";

    if (listaDeServicos != undefined) {
        if (listaDeServicos.length > 0) {
            for (var i = 0; i < listaDeServicos.length; i++) {
                if (listaDeServicos[i].status) {
                    status = "<i style='color: #008400; font-weight: 600;'>Ativo</i>";
                } else {
                    status = "<i style='color: #f12c2c; font-weight: 600;'>Inativo</i>";
                }
                listaDeServicos[i].valor = String(listaDeServicos[i].valor).replace(".",",");
                dados.push([listaDeServicos[i].id, listaDeServicos[i].desc, "R$ " + listaDeServicos[i].valor, status, "<td data-toggle='modal' style='text-align-last: center; border-top: none;' onclick='servico.buscarServicoPorID(" + listaDeServicos[i].id + ")'><button class='btn btn-outline-light btnEdit' type='button'><i class='fas fa-pencil-alt tabelaEdit'></i></button></td>"]);
            }
        } else {
            html += "<td colspan='5' style='text-align: center; padding-left: 14rem;'>Nenhum registro encontrado</td></tr>";
        }
        $("#resultadoservicos").html(html);
    }
    paginar();
    ajustarBotoes();
};


servico.buscarServicoPorID = function (id) {
    var cfg = {
        type: "POST",
        url: "../rest/servicoRest/buscarServicoPeloId/" + id,
        success: function (servico) {
            $("#editDescServ").val(servico.desc);
            $("#editValorServ").val(String(servico.valor).replace(".",","));
            $("#editId").val(servico.id);
            $("#switch").html("<label class='switch'><input type='checkbox' name='editStatus' id='editStatus' value='true' onclick='alteraAtivoEdit()'><span class='slider round'></span></label>");
            if (servico.status) {
                $("#editStatus").attr('checked', 'true');
                $("#editStatus").attr('value', 'true');
                $("#statusSW").html("Serviço Ativo")
            } else {
                $("#editStatus").removeAttr("checked");
                $("#editStatus").attr('value', 'false');
                $("#statusSW").html("Serviço Inativo")
            }
        },
        error: function (err) {
            alert("Erro ao editar o servico!" + err.responseText);
        }
    };
    IT.ajax.post(cfg);
    ativarModalEdit();
};

servico.editarServico = function () {
    servico.editar = new Object();
    servico.editar.desc = $("#editDescServ").val();
    servico.editar.valor = $("#editValorServ").val();
    servico.editar.status = $("#editStatus").val();
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

function alteraAtivoEdit() {
    valor = $("#editStatus").val();
    if (valor == 'true') {
        $("#editStatus").attr('value', 'false');
        $("#statusSW").html("Serviço Inativo")
    }
    if (valor == 'false') {
        $("#editStatus").attr('value', 'true');
        $("#statusSW").html("Serviço Ativo")
    }
};

function ativarModalCad() {
    $("#mod-cad").modal("show");
    $("#descServ").val("");
    $("#valorServ").val("0,00");
};

function ativarModalEdit() {
    $("#mod-edit").addClass("in");
    $("#mod-edit").modal("show");
};

function exibirMessagem(msg, tipo) {
    var msgDiv = $("#msg");

    switch (tipo) {
        case 1:
            $("#msg").css("background-color", "#008040");
            tipo = "<span class='glyphicon glyphicon-ok msg-icon'></span>";
            break;
        case 2:
            $("#msg").css("background-color", "#b4004e");
            tipo = "<span class='glyphicon glyphicon-remove msg-icon'></span>";
            break;
        default:
            tipo = "";
            break;
    }

    msgDiv.html(tipo + msg);

    $('#msg').slideDown(300, function () {
    }).fadeIn({
        duration: 300,
        queue: true
    });
    // Após 3 segundos remover a classe
    setTimeout(function () {
        $('#msg').slideUp(300, function () {
        }).fadeOut({
            duration: 300,
            queue: false
        });
    }, 1500);
}

function paginar() {
    document.getElementById("btnPaginacao").style.display = "block";
    $('table > tbody > tr').remove();
    var tbody = $('table > tbody');
    var cont = 0;
    for (var i = pagina * tamanhoPagina; i < dados.length && i < (pagina + 1) * tamanhoPagina; i++) {
        cont++;
        tbody.append(
            $('<tr>')
                .append($('<td>').append(dados[i][0]))
                .append($('<td>').append(dados[i][1]))
                .append($('<td>').append(dados[i][2]))
                .append($('<td style="text-align: center;">').append(dados[i][3]))
                .append($('<td style="text-align: -webkit-center;">').append(dados[i][4]))
        )
    }

    if ((cont < tamanhoPagina) && (html == "")) {
        for (var i = cont; i < tamanhoPagina; i++) {
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

    if (html != "") {
        document.getElementById("btnPaginacao").style.display = "none";
    }

    $('#numeracao').text('Página ' + (pagina + 1) + ' de ' + Math.ceil(dados.length / tamanhoPagina));
}

function ajustarBotoes() {
    $('#proximo').prop('disabled', dados.length <= tamanhoPagina || pagina >= Math.ceil(dados.length / tamanhoPagina) - 1);
    $('#anterior').prop('disabled', dados.length <= tamanhoPagina || pagina == 0);
}


