consultaOrdem = new Object();
consultaOrdem.listaDeOrdensServico = new Object();

consultaOrdem.dados = [];
consultaOrdem.tamanhoPagina = 5;
consultaOrdem.pagina = 0;
consultaOrdem.html = "";
var doc;
var pjRelat;


$(document).ready(function () {

    $('#proximoConsultaOrdem').click(function () {
        if (consultaOrdem.pagina < consultaOrdem.dados.length / consultaOrdem.tamanhoPagina - 1) {
            consultaOrdem.pagina++;
            consultaOrdem.paginar();
            consultaOrdem.ajustarBotoes();
        }
    });
    $('#anteriorConsultaOrdem').click(function () {
        if (consultaOrdem.pagina > 0) {
            consultaOrdem.pagina--;
            consultaOrdem.paginar();
            consultaOrdem.ajustarBotoes();
        }
    });



});

consultaOrdem.buscar = function () {
    consultaOrdem.pagina = 0;
    var valorBusca = $("#numeroOSConsultaOrdem").val();
    if (valorBusca == "") {
        valorBusca = null;
    }

    var cfg = {
        type: "POST",
        url: "../rest/consultaOrdemRest/buscarOrdensServico/" + valorBusca,
        success: function (listaDeOrdensServico) {
            consultaOrdem.listaDeOrdensServico = listaDeOrdensServico;
            consultaOrdem.exibirOrdensServico(listaDeOrdensServico);
        },
        error: function (err) {
            alert("Erro ao buscar Ordens de Serviço: " + err.responseText);
        }
    };
    IT.ajax.post(cfg);
};

consultaOrdem.exibirOrdensServico = function (listaDeOrdensServico) {
    consultaOrdem.dados = [];
    consultaOrdem.html = "";

    if (listaDeOrdensServico != undefined) {
        if (listaDeOrdensServico.length > 0) {
            for (var i = 0; i < listaDeOrdensServico.length; i++) {
                var a = listaDeOrdensServico[i].data_abertura.split("-");
                listaDeOrdensServico[i].data_abertura = a[2] + "/" + a[1] + "/" + a[0];

                if (listaDeOrdensServico[i].data_conclusao != null) {
                    a = listaDeOrdensServico[i].data_conclusao.split("-");
                    listaDeOrdensServico[i].data_conclusao = a[2] + "/" + a[1] + "/" + a[0];
                }

                var total = 0;
                for (var j = 0; j < listaDeOrdensServico[i].orcamento.servico.length; j++) {
                    total += listaDeOrdensServico[i].orcamento.servico[j]["valor"] * listaDeOrdensServico[i].orcamento.servico[j]["quantidade"];
                }
                for (var j = 0; j < listaDeOrdensServico[i].orcamento.produto.length; j++) {
                    total += listaDeOrdensServico[i].orcamento.produto[j]["valor"] * listaDeOrdensServico[i].orcamento.produto[j]["quantidade"];
                }

                consultaOrdem.dados.push([listaDeOrdensServico[i].idOrdem_servico, listaDeOrdensServico[i].cliente.nome, listaDeOrdensServico[i].data_abertura, listaDeOrdensServico[i].data_conclusao, listaDeOrdensServico[i].status.descricao, listaDeOrdensServico[i].equipamento.marca.nome, listaDeOrdensServico[i].equipamento.tipo.nome, total]);
            };
        } else {
            consultaOrdem.html += "<td colspan='8' style='text-align: center; padding-left: 14rem;'>Nenhum registro encontrado</td></tr>";
        }
        $("#resultadoConsultaOrdem").html(consultaOrdem.html);
    }
    consultaOrdem.paginar();
    consultaOrdem.ajustarBotoes();
    doc = new jsPDF('p', 'mm', 'a4');
    pjRelat = 0;
};

consultaOrdem.paginar = function () {
    document.getElementById("btnPaginacaoConsultaOrdem").style.display = "block";
    $('#tableConsultaOrdem > tbody > tr').remove();
    var tbody = $('#tableConsultaOrdem > tbody');
    var cont = 0;
    for (var i = consultaOrdem.pagina * consultaOrdem.tamanhoPagina; i < consultaOrdem.dados.length && i < (consultaOrdem.pagina + 1) * consultaOrdem.tamanhoPagina; i++) {
        cont++;
        tbody.append(
            $('<tr>')
                .append($('<td style="text-align: -webkit-center">').append(consultaOrdem.dados[i][0]))
                .append($('<td style="text-align: -webkit-center">').append(consultaOrdem.dados[i][1]))
                .append($('<td style="text-align: -webkit-center">').append(consultaOrdem.dados[i][2]))
                .append($('<td style="text-align: -webkit-center">').append(consultaOrdem.dados[i][3]))
                .append($('<td style="text-align: -webkit-center">').append(consultaOrdem.dados[i][4]))
                .append($('<td style="text-align: -webkit-center">').append(consultaOrdem.dados[i][5]))
                .append($('<td style="text-align: -webkit-center">').append(consultaOrdem.dados[i][6]))
                .append($('<td style="text-align: -webkit-center">').append("R$ " + consultaOrdem.dados[i][7]))
        )
    }

    if ((cont < consultaOrdem.tamanhoPagina) && (consultaOrdem.html == "")) {
        for (var i = cont; i < consultaOrdem.tamanhoPagina; i++) {
            tbody.append(
                $('<tr style="text-align: -webkit-center">')
                    .append($('<td>').append(""))
                    .append($('<td>').append(""))
                    .append($('<td>').append(""))
                    .append($('<td>').append(""))
                    .append($('<td>').append(""))
                    .append($('<td>').append(""))
                    .append($('<td>').append(""))
                    .append($('<td style="text-align: -webkit-center; padding: 0.81rem !important">').append("&nbsp;"))
            )
        }
    }

    if (consultaOrdem.html != "") {
        document.getElementById("btnPaginacaoConsultaOrdem").style.display = "none";
    }

    $('#numeracaoConsultaOrdem').text('Página ' + (consultaOrdem.pagina + 1) + ' de ' + Math.ceil(consultaOrdem.dados.length / consultaOrdem.tamanhoPagina));
}

consultaOrdem.ajustarBotoes = function () {
    $('#proximoConsultaOrdem').prop('disabled', consultaOrdem.dados.length <= consultaOrdem.tamanhoPagina || consultaOrdem.pagina >= Math.ceil(consultaOrdem.dados.length / consultaOrdem.tamanhoPagina) - 1);
    $('#anteriorConsultaOrdem').prop('disabled', consultaOrdem.dados.length <= consultaOrdem.tamanhoPagina || consultaOrdem.pagina == 0);
}

consultaOrdem.gerarRelat = function () {
    document.getElementById("relatorioOS").style.display = "block";

    for (var i = 0; i < consultaOrdem.listaDeOrdensServico.length; i++) {
        $("#relNumOS").text(consultaOrdem.listaDeOrdensServico[i].idOrdem_servico);
        $("#relDataEmissao").text(new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear());
        $("#relColab").text(consultaOrdem.listaDeOrdensServico[i].funcionario.nome);
        $("#relNomeCliente").text(consultaOrdem.listaDeOrdensServico[i].cliente.nome);
        $("#relEmail").text(consultaOrdem.listaDeOrdensServico[i].cliente.email);
        $("#relTel").text(consultaOrdem.listaDeOrdensServico[i].cliente.telefone);
        $("#relTipo").text(consultaOrdem.listaDeOrdensServico[i].equipamento.tipo.nome);
        $("#relMarca").text(consultaOrdem.listaDeOrdensServico[i].equipamento.marca.nome);
        $("#relModelo").text(consultaOrdem.listaDeOrdensServico[i].equipamento.modelo);
        $("#relAcessorio").text(consultaOrdem.listaDeOrdensServico[i].equipamento.acessorio);
        $("#relProblema").text(consultaOrdem.listaDeOrdensServico[i].problema);

        var total = 0;

        $('#tbServicos > tbody > tr').remove();
        var tbody = $('#tbServicos > tbody');

        for (var j = 0; j < consultaOrdem.listaDeOrdensServico[i].orcamento.servico.length; j++) {
            total += consultaOrdem.listaDeOrdensServico[i].orcamento.servico[j]["valor"] * consultaOrdem.listaDeOrdensServico[i].orcamento.servico[j]["quantidade"];
            tbody.append(
                $('<tr>')
                    .append($('<td style="text-align: center;">').append(consultaOrdem.listaDeOrdensServico[i].orcamento.servico[j]["desc"]))
                    .append($('<td style="text-align: center;">').append(consultaOrdem.listaDeOrdensServico[i].orcamento.servico[j]["quantidade"]))
                    .append($('<td style="text-align: center;">').append("R$ " + consultaOrdem.listaDeOrdensServico[i].orcamento.servico[j]["valor"]))
            )
        }

        $('#tbProdutos > tbody > tr').remove();
        tbody = $('#tbProdutos > tbody');
        
        for (var j = 0; j < consultaOrdem.listaDeOrdensServico[i].orcamento.produto.length; j++) {
            total += consultaOrdem.listaDeOrdensServico[i].orcamento.produto[j]["valor"] * consultaOrdem.listaDeOrdensServico[i].orcamento.produto[j]["quantidade"];
            tbody.append(
                $('<tr>')
                    .append($('<td style="text-align: center;">').append(consultaOrdem.listaDeOrdensServico[i].orcamento.produto[j]["nome"]))
                    .append($('<td style="text-align: center;">').append(consultaOrdem.listaDeOrdensServico[i].orcamento.produto[j]["quantidade"]))
                    .append($('<td style="text-align: center;">').append("R$ " + consultaOrdem.listaDeOrdensServico[i].orcamento.produto[j]["valor"]))
            )
        }
        $("#relTotal").text("R$ " + total);


        consultaOrdem.pdf(consultaOrdem.listaDeOrdensServico.length, i);
    }
    document.getElementById("relatorioOS").style.display = "none";
}

consultaOrdem.pdf = function (tamanhoListaOS, i) {
    html2canvas(document.getElementById("relatorioOS"), {
        onrendered: function (canvas) {

            var imgData = canvas.toDataURL('image/jpeg');

            doc.setFontSize(10);
            if (pjRelat > 0) {
                doc.addPage();
            }

            pjRelat++;
            doc.addImage(imgData, 'jpeg', 0, 0);

            if ((i + 1) == tamanhoListaOS) {
                doc.save("relatorio.pdf");
            }
        }

    })

}


