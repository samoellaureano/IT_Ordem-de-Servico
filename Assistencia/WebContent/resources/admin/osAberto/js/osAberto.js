osAberto = new Object();
ordemServicoSelecionada = new Object();
orcamento = new Object;
orcamento.produto = [];
orcamento.servico = [];
var somaServico = 0;
var somaProduto = 0;
temp = [];

$(document).ready(function () {
    $("#div-editOrdemServico").load("admin/osAberto/modal-editOrdemServico.html");
    $("#resultadoBuscaOsSelecionado").load("admin/osAberto/osSelecionada.html");

});

osAberto.buscar = function () {
    orcamento.produto = [];
    orcamento.servico = [];
    var cfg = {
        type: "POST",
        url: "../rest/osAbertoRest/buscarOsAberto/",
        success: function (listaDeOsAbertos) {
            osAberto.exibirOsAbertos(listaDeOsAbertos);
        },
        error: function (err) {
            alert("Erro ao buscar Ordens de Serviço em Aberto: " + err.responseText);
        }
    };
    IT.ajax.post(cfg);
};

osAberto.buscarProdutoServico = function () {
    valorBusca = $("#consultaProdutoServico").val();

    if ((valorBusca != "") && ($("#osStatus").html() != "Retirado - (Aprovado)") && ($("#osStatus").html() != "Retirado - (Recusado)") && (document.getElementById("assumirOS").style.display == "none")) {
        if (valorBusca.trim()) {
            var cfg = {
                type: "POST",
                url: "../rest/OrcamentoRest/buscarProdutoServico/" + valorBusca,
                success: function (listaDeProdutoServico) {
                    osAberto.exibirProdutoServico(listaDeProdutoServico);
                },
                error: function (err) {
                    alert("Erro ao buscar Produtos Serviços : " + err.responseText);
                }
            };
            IT.ajax.post(cfg);
        }
    } else {
        $("#listaDeProdutoServico").html("");
        document.getElementById("limparInputProdutoServico").style.display = "none";
    }
};

osAberto.exibirProdutoServico = function (listaDeProdutoServico) {
    osAberto.html = "<ul class='listaDeProdutoServico'>\n";

    if (listaDeProdutoServico.produto[0] != null || listaDeProdutoServico.servico[0] != null) {
        for (var i = 0; i < listaDeProdutoServico.produto.length; i++) {
            if (listaDeProdutoServico.produto[i] != null) {
                osAberto.html += ("<li onclick='osAberto.selectProduto(`" + listaDeProdutoServico.produto[i].nome + "`,`" + listaDeProdutoServico.produto[i].idProduto + "`,`" + listaDeProdutoServico.produto[i].valor + "`)'>" + listaDeProdutoServico.produto[i].nome + "</li>");
            }
        }
        for (var i = 0; i < listaDeProdutoServico.servico.length; i++) {
            if (listaDeProdutoServico.servico[i] != null) {
                osAberto.html += ("<li onclick='osAberto.selectServico(`" + listaDeProdutoServico.servico[i].desc + "`,`" + listaDeProdutoServico.servico[i].id + "`,`" + listaDeProdutoServico.servico[i].valor + "`)'>" + listaDeProdutoServico.servico[i].desc + "</li>");
            }
        }
        document.getElementById("limparInputProdutoServico").style.display = "block";
    } else {
        osAberto.html += "<li style='text-align: center'>Nenhum registro encontrado</li>";
        document.getElementById("limparInputProdutoServico").style.display = "block";
    }
    $("#listaDeProdutoServico").html(osAberto.html + "\n</ul>");
};

osAberto.selectProduto = function (descProduto, idProduto, valorProduto) {
    $("#btnIncluirOrcamento").val(true);
    temp = [];
    temp.push([descProduto, valorProduto, idProduto]);
    $("#consultaProdutoServico").val(descProduto);
    $("#listaDeProdutoServico").html("");
    $('#consultaProdutoServico').focus();
}

osAberto.selectServico = function (descServico, idServico, valorServico) {
    $("#btnIncluirOrcamento").val(false);
    temp = [];
    temp.push([descServico, valorServico, idServico]);
    $("#consultaProdutoServico").val(descServico);
    $("#listaDeProdutoServico").html("");
    $('#consultaProdutoServico').focus();
}

osAberto.excluirProdutoNoOrcamento = function (idProduto) {
    for (var i = 0; i < orcamento.produto.length; i++) {
        if (orcamento.produto[i]["idProduto"] == idProduto) {
            orcamento.produto.splice(i, 1);
            $("#btnIncluirOrcamento").val(true);
        }
    }
    document.getElementById("btnEncaminharOrcamento").style.display = "flex";
    osAberto.colocarNoOrcamento();
}

osAberto.excluirServicoNoOrcamento = function (idServico) {

    for (var i = 0; i < orcamento.servico.length; i++) {

        if (orcamento.servico[i]["id"] == idServico) {
            orcamento.servico.splice(i, 1);
            $("#btnIncluirOrcamento").val(false);
        }
    }
    document.getElementById("btnEncaminharOrcamento").style.display = "flex";
    osAberto.colocarNoOrcamento();
}
//Coloca os itens de Produto e Serviço nas suas respectivas listas
osAberto.colocarNoOrcamento = function () {
    if($("#consultaProdutoServico").val() != ""){
        document.getElementById("btnEncaminharOrcamento").style.display = "flex";
    }
    if (temp) {
        var quantidade = $("#quantidadeProdutoServico").val();
        if ($("#btnIncluirOrcamento").val() == "true") {

            if (temp.length != 0) {
                if (orcamento.produto.length != 0) {
                    for (i = 0; i < orcamento.produto.length; i++) {
                        if (temp[0][2] == orcamento.produto[i]["idProduto"]) {

                            orcamento.produto[i]["quantidade"] = parseInt(quantidade) + parseInt(orcamento.produto[i]["quantidade"]);

                        } else {
                            orcamento.produto.push({ nome: temp[0][0], valor: temp[0][1], quantidade: quantidade, idProduto: temp[0][2] });
                        }
                    }
                } else {
                    orcamento.produto.push({ nome: temp[0][0], valor: temp[0][1], quantidade: quantidade, idProduto: temp[0][2] });
                }
            }

            $('#tableProduto > tbody > tr').remove();
            var tbody = $('#tableProduto > tbody');
            somaProduto = 0;
            for (var i = 0; i < orcamento.produto.length; i++) {
                somaProduto += orcamento.produto[i]["valor"] * orcamento.produto[i]["quantidade"];
                tbody.append(
                    $('<tr>')
                        .append($('<td style="text-align: center;">').append(orcamento.produto[i]["nome"]))
                        .append($('<td style="text-align: center;">').append("R$ " + orcamento.produto[i]["valor"]))
                        .append($('<td style="text-align: center;">').append(orcamento.produto[i]["quantidade"]))
                        .append($('<td style="text-align: -webkit-center;">').append("<td data-toggle='modal' style='text-align: center; border: none;' onclick='osAberto.excluirProdutoNoOrcamento(" + orcamento.produto[i]["idProduto"] + ")'><button class='btn btn-outline-light btnEdit' type='button'><i class='fas fa-trash-alt tabelaEdit'></i></button></td>"))
                )
            }
            tbody = $('#tableProduto > tbody');
            tbody.append(
                $('<tr>')
                    .append($('<td><b>Sub-Total Produto: </b></td>'))
                    .append($('<td><b id="subTotalProduto" style="margin-left: 0.5rem;">R$ ' + somaProduto + '</b></td>'))
            )

        } else {
            if (temp.length != 0) {
                if (orcamento.servico.length != 0) {
                    for (i = 0; i < orcamento.servico.length; i++) {
                        if (temp[0][2] == orcamento.servico[i]["id"]) {

                            orcamento.servico[i]["quantidade"] = parseInt(quantidade) + parseInt(orcamento.servico[i]["quantidade"]);

                        } else {
                            orcamento.servico.push({ desc: temp[0][0], valor: temp[0][1], quantidade: quantidade, id: temp[0][2] });
                        }
                    }
                } else {
                    orcamento.servico.push({ desc: temp[0][0], valor: temp[0][1], quantidade: quantidade, id: temp[0][2] });
                }
            }

            $('#tableServico > tbody > tr').remove();
            var tbody = $('#tableServico > tbody');
            somaServico = 0;
            for (var i = 0; i < orcamento.servico.length; i++) {
                somaServico += orcamento.servico[i]["valor"] * orcamento.servico[i]["quantidade"];
                tbody.append(
                    $('<tr>')
                        .append($('<td style="text-align: center;">').append(orcamento.servico[i]["desc"]))
                        .append($('<td style="text-align: center;">').append("R$ " + orcamento.servico[i]["valor"]))
                        .append($('<td style="text-align: center;">').append(orcamento.servico[i]["quantidade"]))
                        .append($('<td style="text-align: -webkit-center;">').append("<td data-toggle='modal' style='text-align: center; border: none;' onclick='osAberto.excluirServicoNoOrcamento(" + orcamento.servico[i]["id"] + ")'><button class='btn btn-outline-light btnEdit' type='button'><i class='fas fa-trash-alt tabelaEdit'></i></button></td>"))
                )
            }
            tbody = $('#tableServico > tbody');
            tbody.append(
                $('<tr>')
                    .append($('<td><b>Sub-Total Servico: </b></td>'))
                    .append($('<td><b id="subTotalServico" style="margin-left: 0.5rem;">R$ ' + somaServico + '</b></td>'))
            )

        }

        $("#totalOrcamentoTabela").html(somaProduto + somaServico);

        $("#consultaProdutoServico").val("");
        document.getElementById("limparInputProdutoServico").style.display = "none";
        $('#consultaProdutoServico').focus();
        temp = [];
        $("#quantidadeProdutoServico").val(1);
    }
}

osAberto.removeProdutoServico = function () {
    $("#consultaProdutoServico").val("");
    document.getElementById("limparInputProdutoServico").style.display = "none";
    $("#listaDeProdutoServico").html("");

    $('#consultaProdutoServico').focus();
};

orcamento.cadastrar = function () {
    ordemServicoCad = new Object();
    ordemServicoCad.idOrdem_servico = $("#numeroOSTitulo").html();
    orcamento.ordemServico = ordemServicoCad;

    if (orcamento.produto.length > 0 || orcamento.servico.length > 0) {
        var cfg = {
            url: "../rest/OrcamentoRest/addOrcamento",
            data: JSON.stringify(orcamento),
            success: function (succJson) {
                if (succJson == 1) {
                    resp = ("Orçamento cadastrado com sucesso!");
                    exibirMessagem(resp, 1);
                } else {
                    resp = ("Erro ao cadastrar o orçamento!");
                    exibirMessagem(resp, 2);
                }
                $("#osStatus").html("Aguardando Aprovação");
                osAberto.carregaItensNaOsSelecionada();
                document.getElementById("btnEncaminharOrcamento").style.display = "none";
            },
            error: function (errJson) {
                resp = ("Erro ao cadastrar o orçamento!");
                exibirMessagem(resp, 2);
            }
        };
        IT.ajax.post(cfg);
    } else {
        resp = ("Nenhum Produto ou Serviço incluído!");
        exibirMessagem(resp, 2);
    }


}

orcamento.aprovaOrcamento = function (){
    ordemServicoCad = new Object();
    ordemServicoCad.idOrdem_servico = $("#numeroOSTitulo").html();
    orcamento.ordemServico = ordemServicoCad;

    if (orcamento.produto.length > 0 || orcamento.servico.length > 0) {
        var cfg = {
            url: "../rest/OrcamentoRest/aprovarOrcamento",
            data: JSON.stringify(orcamento),
            success: function (succJson) {
                if (succJson == 1) {
                    resp = ("Orçamento Aprovado");
                    exibirMessagem(resp, 1);
                } else {
                    resp = ("Erro ao aprovar o orçamento!");
                    exibirMessagem(resp, 2);
                }
                $("#osStatus").html("Aprovado");
                osAberto.carregaItensNaOsSelecionada();
            },
            error: function (errJson) {
                resp = ("Erro ao aprovar o orçamento!");
                exibirMessagem(resp, 2);
            }
        };
        IT.ajax.post(cfg);
    } else {
        resp = ("Nenhum Produto ou Serviço incluído!");
        exibirMessagem(resp, 2);
    }
}

orcamento.recusaOrcamento = function (){
    ordemServicoCad = new Object();
    ordemServicoCad.idOrdem_servico = $("#numeroOSTitulo").html();
    orcamento.ordemServico = ordemServicoCad;

    if (orcamento.produto.length > 0 || orcamento.servico.length > 0) {
        var cfg = {
            url: "../rest/OrcamentoRest/recusarOrcamento",
            data: JSON.stringify(orcamento),
            success: function (succJson) {
                if (succJson == 1) {
                    resp = ("Orçamento Recusado");
                    exibirMessagem(resp, 1);
                } else {
                    resp = ("Erro ao recusar o orçamento!");
                    exibirMessagem(resp, 2);
                }
                $("#osStatus").html("Recusado");
                osAberto.carregaItensNaOsSelecionada();
            },
            error: function (errJson) {
                resp = ("Erro ao recusar o orçamento!");
                exibirMessagem(resp, 2);
            }
        };
        IT.ajax.post(cfg);
    } else {
        resp = ("Nenhum Produto ou Serviço incluído!");
        exibirMessagem(resp, 2);
    }
}

orcamento.prontoRetirar = function (){
    ordemServicoCad = new Object();
    statuss = new Object();
    ordemServicoCad.idOrdem_servico = $("#numeroOSTitulo").html();
    statuss.descricao = $("#osStatus").html();

    ordemServicoCad.status = statuss;
    orcamento.ordemServico = ordemServicoCad;

    if (orcamento.produto.length > 0 || orcamento.servico.length > 0) {
        var cfg = {
            url: "../rest/OrcamentoRest/prontoRetirar",
            data: JSON.stringify(orcamento),
            success: function (succJson) {
                if (succJson == 1) {
                    resp = ("Pronto para Retirar");
                    exibirMessagem(resp, 1);
                } else {
                    resp = ("Erro ao encaminhar para retirada!");
                    exibirMessagem(resp, 2);
                }
                if(statuss.descricao == "Aprovado"){
                    $("#osStatus").html("Aguardando Retirada - (Aprovado)");
                }else{
                    $("#osStatus").html("Aguardando Retirada - (Recusado)");
                }
                
                osAberto.carregaItensNaOsSelecionada();
            },
            error: function (errJson) {
                resp = ("Erro ao encaminhar para retirada!");
                exibirMessagem(resp, 2);
            }
        };
        IT.ajax.post(cfg);
    } else {
        resp = ("Nenhum Produto ou Serviço incluído!");
        exibirMessagem(resp, 2);
    }
}

orcamento.retirar = function (){
    ordemServicoCad = new Object();

    statuss = new Object();
    statuss.descricao = $("#osStatus").html();

    ordemServicoCad.status = statuss;

    ordemServicoCad.idOrdem_servico = $("#numeroOSTitulo").html();
    orcamento.ordemServico = ordemServicoCad;

    if (orcamento.produto.length > 0 || orcamento.servico.length > 0) {
        var cfg = {
            url: "../rest/OrcamentoRest/retirar",
            data: JSON.stringify(orcamento),
            success: function (succJson) {
                if (succJson == 1) {
                    resp = ("Retirado");
                    exibirMessagem(resp, 1);
                } else {
                    resp = ("Erro ao retirar!");
                    exibirMessagem(resp, 2);
                }
                if(statuss.descricao == "Aguardando Retirada - (Aprovado)"){
                    $("#osStatus").html("Retirado - (Aprovado)");
                }else{
                    $("#osStatus").html("Retirado - (Recusado)");
                }
                
                osAberto.carregaItensNaOsSelecionada();
            },
            error: function (errJson) {
                resp = ("Erro ao retirar!");
                exibirMessagem(resp, 2);
            }
        };
        IT.ajax.post(cfg);
    } else {
        resp = ("Nenhum Produto ou Serviço incluído!");
        exibirMessagem(resp, 2);
    }
}

orcamento.absorver = function (){
    ordemServicoCad = new Object();
    ordemServicoCad.idOrdem_servico = $("#numeroOSTitulo").html();
    orcamento.ordemServico = ordemServicoCad;

    if (orcamento.produto.length > 0 || orcamento.servico.length > 0) {
        var cfg = {
            url: "../rest/OrcamentoRest/absorver",
            data: JSON.stringify(orcamento),
            success: function (succJson) {
                if (succJson == 1) {
                    resp = ("Absorvido");
                    exibirMessagem(resp, 1);
                } else {
                    resp = ("Erro ao absorver!");
                    exibirMessagem(resp, 2);
                }
                $("#osStatus").html("Absorvido");                
                osAberto.carregaItensNaOsSelecionada();
            },
            error: function (errJson) {
                resp = ("Erro ao absorver!");
                exibirMessagem(resp, 2);
            }
        };
        IT.ajax.post(cfg);
    } else {
        resp = ("Nenhum Produto ou Serviço incluído!");
        exibirMessagem(resp, 2);
    }
}



osAberto.exibirOsAbertos = function (listaDeOsAbertos) {
    osAberto.html = "";

    if (listaDeOsAbertos != undefined) {
        if (listaDeOsAbertos.length > 0) {
            for (var i = 0; i < listaDeOsAbertos.length; i++) {

                if (listaDeOsAbertos[i].funcionario.nome == null) {
                    listaDeOsAbertos[i].funcionario.nome = "<i style='color: #860c0c;font-variant: all-petite-caps;'>Não Assumido</i>";
                }

                osAberto.html += "<div class='card mt-2' style='border: none; margin-block-end: 1rem;' onclick='osAberto.carregaOs(" + listaDeOsAbertos[i].idOrdem_servico + ")'>";
                osAberto.html += "<div class='card-body row' style='background-color: #28a745; border-radius: 10px;'>";
                osAberto.html += "<div class='col-3'>";
                osAberto.html += "<h6 class='card-title'><i id='numeroOs'>Ordem de Serviço</i></h6>";
                osAberto.html += "<h4 style='font-size: 2.5rem;'>" + listaDeOsAbertos[i].idOrdem_servico + "</h4>";
                osAberto.html += "<div>";
                osAberto.html += "<a href='#' class='btn btn-primary mt-4' style='border-radius: 0.9rem;'>" + listaDeOsAbertos[i].status.descricao + "</a>";
                osAberto.html += "</div>";
                osAberto.html += "</div>";
                osAberto.html += "<div class='col-5'>";
                osAberto.html += "<h5 style='margin-bottom: 0.0rem;'>" + listaDeOsAbertos[i].cliente.nome + "</h5>";
                osAberto.html += "<label style='font-size: small;'>Cliente</label>";
                osAberto.html += "<h5 style='margin-top: 1rem;'>Data Abertura</h5>";
                osAberto.html += "<label>" + assistencia.inverteData(listaDeOsAbertos[i].data_abertura) + "</label>";
                osAberto.html += "</div>";
                osAberto.html += "<div class='col-4 mt-5' style='display: flex; line-height: 82px;justify-content: flex-end;'>";
                osAberto.html += "<h5 class='card-text' style='position: absolute;'>" + listaDeOsAbertos[i].funcionario.nome + "</h5>";
                osAberto.html += "Responsável Técnico";
                osAberto.html += "</div>";
                osAberto.html += "</div>";
                osAberto.html += "</div>";

            }
        } else {
            osAberto.html += "<td style='text-align: center;padding-left: none !important;width: 80%;margin-left: auto;margin-right: auto;position: absolute;border: none !important;'>Nenhum registro encontrado</td></tr>";
        }
        $("#resultadoBuscaOsAberto").html(osAberto.html);
    }
};

osAberto.carregaOs = function (os) {
    document.getElementById("containerSecOsAberto").style.display = "none";
    document.getElementById("containerSecOsSelecionada").style.display = "block";

    ordemServicoSelecionada.idOrdem_servico = os;

    osAberto.buscarOsSelecionada(os);
    $("#numeroOSTitulo").html(os);
}

osAberto.buscarOsSelecionada = function (os) {
    var cfg = {
        type: "POST",
        url: "../rest/osSelecionadaRest/buscarOsSelecionada/" + os,
        success: function (osSelecionada) {
            osAberto.exibirOsSelecionada(osSelecionada);
        },
        error: function (err) {
            alert("Erro ao carregar Ordem de Serviço: " + err.responseText);
        }
    };
    IT.ajax.post(cfg);
};

osAberto.exibirOsSelecionada = function (osSelecionada) {
    if (osSelecionada.funcionario.nome == null) {
        osSelecionada.funcionario.nome = "<i style='color: #860c0c;font-variant: all-petite-caps;'>Não Assumido</i>";
        document.getElementById("assumirOS").style.display = "block";
    } else {
        document.getElementById("assumirOS").style.display = "none";
    }

    $("#nomeTecnico").html(osSelecionada.funcionario.nome);
    $("#osCliente").html(osSelecionada.cliente.nome);
    $("#osEndereco").html(osSelecionada.cliente.endereco.rua + ", " + osSelecionada.cliente.endereco.numero);
    $("#osMail").html(osSelecionada.cliente.email);
    $("#osTelefone").html(osSelecionada.cliente.telefone);
    $("#osTelefoneAux").html(osSelecionada.cliente.telefoneAux);
    $("#osTipo").html(osSelecionada.equipamento.tipo.nome);
    $("#osMarca").html(osSelecionada.equipamento.marca.nome);
    $("#osModelo").html(osSelecionada.equipamento.modelo);
    $("#osAcessorios").html(osSelecionada.equipamento.acessorio);
    $("#descProblema").html(osSelecionada.problema);
    $("#osDataAbertura").html(assistencia.inverteData(osSelecionada.data_abertura));
    $("#osStatus").html(osSelecionada.status.descricao);
    $('#tableProduto > tbody > tr').remove();
    $('#tableServico > tbody > tr').remove();
    $("#totalOrcamentoTabela").html("");

    osAberto.buscarOrcamento();
    osAberto.carregaItensNaOsSelecionada();
    
}

osAberto.carregaItensNaOsSelecionada = function () {
    switch($("#osStatus").html()){
        case "Aguardando Aprovação":
            document.getElementById("btnAprovacaoOrcamento").style.display = "flex";
            document.getElementById("btnProntoRetirar").style.display = "none";
            document.getElementById("btnRetirar").style.display = "none";
            document.getElementById("btnAbsorver").style.display = "none";
            break;
        case "Aprovado": case "Recusado":
            document.getElementById("btnProntoRetirar").style.display = "flex";
            document.getElementById("btnAprovacaoOrcamento").style.display = "none";
            document.getElementById("btnRetirar").style.display = "none";
            document.getElementById("btnAbsorver").style.display = "none";
            break;
        case "Aguardando Retirada - (Aprovado)": case "Aguardando Retirada - (Recusado)":
            document.getElementById("btnRetirar").style.display = "flex";
            document.getElementById("btnAbsorver").style.display = "flex";
            document.getElementById("btnProntoRetirar").style.display = "none";
            document.getElementById("btnAprovacaoOrcamento").style.display = "none";
            break;
        default:
            document.getElementById("btnAprovacaoOrcamento").style.display = "none";
            document.getElementById("btnRetirar").style.display = "none";
            document.getElementById("btnProntoRetirar").style.display = "none";
            document.getElementById("btnAbsorver").style.display = "none";
    }

    $("#listaDeProdutoServico").html("");
    $("#consultaProdutoServico").val("");
    document.getElementById("limparInputProdutoServico").style.display = "none";
    
}

osAberto.assumirOs = function () {

    funcionario = new Object();
    funcionario.idFuncionario = $("#idLogado").val();
    ordemServicoSelecionada.funcionario = funcionario;

    var cfg = {
        url: "../rest/osSelecionadaRest/assumirOs",
        data: JSON.stringify(ordemServicoSelecionada),
        success: function (succJson) {
            if (succJson == 1) {
                resp = ("Ordem de Serviço assumido com sucesso!");
                exibirMessagem(resp, 1);
            } else {
                resp = ("Erro ao assumir a ordem de serviço!");
                exibirMessagem(resp, 2);
            }
            osAberto.buscarOsSelecionada(ordemServicoSelecionada.idOrdem_servico);
        },
        error: function (errJson) {
            resp = ("Erro ao assumir a ordem de serviço!");
            exibirMessagem(resp, 2);
        }
    };
    IT.ajax.post(cfg);
}

osAberto.buscarOrcamento = function () {
    var cfg = {
        type: "POST",
        url: "../rest/osSelecionadaRest/buscarOrcamento/" + ordemServicoSelecionada.idOrdem_servico,
        success: function (orcamentoOsSelecionada) {
            for (var i = 0; i < orcamentoOsSelecionada.produto.length; i++) {
                temp.push([orcamentoOsSelecionada.produto[i]["nome"], orcamentoOsSelecionada.produto[i]["valor"], orcamentoOsSelecionada.produto[i]["idProduto"]]);
                $("#btnIncluirOrcamento").val(true);
                $("#quantidadeProdutoServico").val(orcamentoOsSelecionada.produto[i]["quantidade"]);
                osAberto.colocarNoOrcamento();
            }
            for (var i = 0; i < orcamentoOsSelecionada.servico.length; i++) {
                temp.push([orcamentoOsSelecionada.servico[i]["desc"], orcamentoOsSelecionada.servico[i]["valor"], orcamentoOsSelecionada.servico[i]["id"]]);
                $("#btnIncluirOrcamento").val(false);
                $("#quantidadeProdutoServico").val(orcamentoOsSelecionada.servico[i]["quantidade"]);
                osAberto.colocarNoOrcamento();
            }
        },
        error: function (err) {
            alert("Erro ao buscar orçamento: " + err.responseText);
        }
    };
    IT.ajax.post(cfg);

}


