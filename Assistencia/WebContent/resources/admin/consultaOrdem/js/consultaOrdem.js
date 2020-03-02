consultaOrdem = new Object();

consultaOrdem.dados = [];
consultaOrdem.tamanhoPagina = 5;
consultaOrdem.pagina = 0;
consultaOrdem.html = "";

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
        url: "../rest/consultaOrdemRest/buscarOrdensServicoPorNumero/" + valorBusca,
        success: function (listaDeOrdensServico) {
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
                
                if(listaDeOrdensServico[i].data_conclusao!=null){
                    a = listaDeOrdensServico[i].data_conclusao.split("-");
                    listaDeOrdensServico[i].data_conclusao = a[2] + "/" + a[1] + "/" + a[0];
                }
                consultaOrdem.dados.push([listaDeOrdensServico[i].idOrdem_servico, listaDeOrdensServico[i].cliente.nome, listaDeOrdensServico[i].data_abertura, listaDeOrdensServico[i].data_conclusao, listaDeOrdensServico[i].status.descricao, listaDeOrdensServico[i].equipamento.marca.nome, listaDeOrdensServico[i].equipamento.tipo.nome]);
            };
        } else {
            consultaOrdem.html += "<td colspan='6' style='text-align: center; padding-left: 14rem;'>Nenhum registro encontrado</td></tr>";
        }
        $("#resultadoConsultaOrdem").html(consultaOrdem.html);
    }
    consultaOrdem.paginar();
    consultaOrdem.ajustarBotoes();
};

/*
funcionario.buscarFuncionarioPorID = function (id) {
    var cfg = {
        type: "POST",
        url: "../rest/funcionarioRest/buscarFuncionarioPeloId/" + id,
        success: function (funcionario) {
            $("#editNomeFunc").val(funcionario.nome);
            $("#editIdFunc").val(funcionario.idFuncionario);            
            $("#editCpfFunc").val(funcionario.usuario.cpf.numero);
            $("#editEmailFunc").val(funcionario.email);
            $("#editPerfilFunc").val(funcionario.usuario.perfil);
            $("#editIdFunc").val(funcionario.idFuncionario);
            $("#switchFunc").html("<label class='switch'><input type='checkbox' name='editStatusFunc' id='editStatusFunc' value='true' onclick='funcionario.alteraAtivoEditFunc()'><span class='slider round'></span></label>");
            if (funcionario.status) {
                $("#editStatusFunc").attr('checked', 'true');
                $("#editStatusFunc").attr('value', 'true');
                $("#statusSWFunc").html("Funcionário Ativo")
            } else {
                $("#editStatusFunc").removeAttr("checked");
                $("#editStatusFunc").attr('value', 'false');
                $("#statusSWFunc").html("Funcionário Inativo")
            }
        },
        error: function (err) {
            alert("Erro ao editar o funcionario!" + err.responseText);
        }
    };
    IT.ajax.post(cfg);
    funcionario.ativarModalEdit();
};

funcionario.editarFuncionario = function () {
    editU = new Object();
    var retorno = "";

    editU.cpf = $("#editCpfFunc").val();
    editU.perfil = $("#editPerfilFunc").val();
    usuario.editU = editU;

    editF = new Object();
    editF.nome = $("#editNomeFunc").val();
    editF.email = $("#editEmailFunc").val();    
    editF.status = $("#editStatusFunc").val();

    
    editF.idFuncionario = $("#editIdFunc").val();
    editF.usuario = usuario.editU;

    if (editF.nome == "") {
        retorno += ("O campo 'Nome Completo' deve ser preenchido!\n");
    }
    var masc = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi);
	var res = masc.test(editF.email);
	if (res == false){
		retorno += ("O campo E-mail foi preenchido incorretamente!\n");
	}
    funcionario.editF = editF;

    if (retorno == "") {
        var resp = "";

        var cfg = {
            url: "../rest/funcionarioRest/editarFuncionario",
            data: JSON.stringify(funcionario.editF),
            success: function (data) {
                if (data) {
                    resp = ("Funcionário editado com sucesso!");
                    exibirMessagem(resp, 1);

                    $('.modal-backdrop').remove();
                    $("#modal-editFunc").modal("hide");
                } else {
                    resp = ("Erro ao editar o funcionário!");
                    exibirMessagem(resp, 2);
                }
                funcionario.buscar();

            },
            error: function (err) {
                resp = ("Erro ao editar o funcionário!");
                exibirMessagem(resp, 2);
            }
        };
        IT.ajax.post(cfg);
    }else{
        alert(retorno);
        return false;
    }
};

funcionario.alteraAtivoEditFunc = function () {
    valor = $("#editStatusFunc").val();
    if (valor == 'true') {
        $("#editStatusFunc").attr('value', 'false');
        $("#statusSWFunc").html("Funcionário Inativo")
    } else if (valor == 'false') {
        $("#editStatusFunc").attr('value', 'true');
        $("#statusSWFunc").html("Funcionário Ativo")
    }
};

funcionario.ativarModalCad = function () {
    $('#cpfFunc').mask('000.000.000-00');
    $("#modal-cadFunc").modal("show");
    $("#nomeFunc").val("");
    $("#cpfFunc").val("");
    $("#emailFunc").val("");
    $("#perfilFunc").val(0);

    //Colocar foco no input
    $('#modal-cadFunc').on('shown.bs.modal', function () {
        $('#nomeFunc').focus();
    })
};

funcionario.ativarModalEdit = function () {
    $("#modal-editFunc").addClass("in");
    $("#modal-editFunc").modal("show");
};

*/

consultaOrdem.paginar = function () {
    document.getElementById("btnPaginacaoConsultaOrdem").style.display = "block";
    $('#tableConsultaOrdem > tbody > tr').remove();
    var tbody = $('#tableConsultaOrdem > tbody');
    var cont = 0;
    for (var i = consultaOrdem.pagina * consultaOrdem.tamanhoPagina; i < consultaOrdem.dados.length && i < (consultaOrdem.pagina + 1) * consultaOrdem.tamanhoPagina; i++) {
        cont++;
        tbody.append(
            $('<tr>')
                .append($('<td>').append(consultaOrdem.dados[i][0]))
                .append($('<td>').append(consultaOrdem.dados[i][1]))
                .append($('<td>').append(consultaOrdem.dados[i][2]))
                .append($('<td>').append(consultaOrdem.dados[i][3]))
                .append($('<td>').append(consultaOrdem.dados[i][4]))
                .append($('<td>').append(consultaOrdem.dados[i][5]))                
                .append($('<td>').append(consultaOrdem.dados[i][6]))                
                .append($('<td>').append(consultaOrdem.dados[i][7]))
        )
    }

    if ((cont < consultaOrdem.tamanhoPagina) && (consultaOrdem.html == "")) {
        for (var i = cont; i < consultaOrdem.tamanhoPagina; i++) {
            tbody.append(
                $('<tr>')
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


