funcionario = new Object();
usuario = new Object();

funcionario.dados = [];
funcionario.tamanhoPagina = 5;
funcionario.pagina = 0;
funcionario.html = "";

$(document).ready(function () {
    $("#div-cadFunc").load("admin/funcionarios/modal-cad.html");
    $("#div-editFunc").load("admin/funcionarios/modal-edit.html");

    $('#proximoFunc').click(function () {
        if (funcionario.pagina < funcionario.dados.length / funcionario.tamanhoPagina - 1) {
            funcionario.pagina++;
            funcionario.paginar();
            funcionario.ajustarBotoes();
        }
    });
    $('#anteriorFunc').click(function () {
        if (funcionario.pagina > 0) {
            funcionario.pagina--;
            funcionario.paginar();
            funcionario.ajustarBotoes();
        }
    });

});

funcionario.cadastrar = function () {
    cadU = new Object();
    var retorno = "";

    cadU.cpf = $("#cpfFunc").val();
    cadU.perfil = $("#perfilFunc").val();

    if (cadU.cpf == "") {
        retorno += ("O campo 'CPF' deve ser preenchido!\n");
    }else if(cadU.cpf.length < 14){
        retorno += ("O campo 'CPF' deve ser preenchido corretamente!\n");
    }
    cadU.cpf = cadU.cpf.replace(/\./g, "");
    cadU.cpf = cadU.cpf.replace(/\-/g, "");

    usuario.cadU = cadU;

    cadF = new Object();

    cadF.nome = $("#nomeFunc").val();
    cadF.email = $("#emailFunc").val();
    cadF.usuario = usuario.cadU;

    if (cadF.nome == "") {
        retorno += ("O campo 'Nome Completo' deve ser preenchido!\n");
    }

    var masc = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi);
	var res = masc.test(cadF.email);
	if (res == false){
		retorno += ("O campo E-mail foi preenchido incorretamente!\n");
    }
    
    funcionario.cadF = cadF;

    if (retorno == "") {
        var cfg = {
            url: "../rest/classRest/addFuncionario",
            data: JSON.stringify(funcionario.cadF),
            success: function (succJson) {
                if (succJson == 1) {
                    resp = ("Funcionário cadastrado com sucesso!");
                    exibirMessagem(resp, 1);
                } else if(succJson == 2){
                    resp = ("O Funcionário ja existe!");
                    exibirMessagem(resp, 2);
                }else{
                    resp = ("Erro ao cadastrar um novo funcionário!");
                    exibirMessagem(resp, 2);
                }

                $("#modal-cadFunc").modal("hide");
                $('.modal-backdrop').remove();
                funcionario.buscar();
            },
            error: function (errJson) {
                resp = ("Erro ao cadastrar um novo funcionário!");
                exibirMessagem(resp, 2);
            }
        };
        IT.ajax.post(cfg);
    }else{
        alert(retorno);
    }
};

funcionario.buscar = function () {
    funcionario.pagina = 0;
    var valorBusca = $("#consultarFuncionarios").val();
    if (valorBusca == "") {
        valorBusca = null;
    }

    var cfg = {
        type: "POST",
        url: "../rest/classRest/buscarFuncionarios/" + valorBusca,
        success: function (listaDeFuncionarios) {
            funcionario.exibirFuncionarios(listaDeFuncionarios);
        },
        error: function (err) {
            alert("Erro ao buscar Funcionarios: " + err.responseText);
        }
    };
    IT.ajax.post(cfg);
};

funcionario.exibirFuncionarios = function (listaDeFuncionarios) {
    var status = "";
    funcionario.dados = [];
    funcionario.html = "";

    if (listaDeFuncionarios != undefined) {
        if (listaDeFuncionarios.length > 0) {
            for (var i = 0; i < listaDeFuncionarios.length; i++) {
                if (listaDeFuncionarios[i].usuario.status) {
                    status = "<i style='color: #008400; font-weight: 600;'>Ativo</i>";
                } else {
                    status = "<i style='color: #f12c2c; font-weight: 600;'>Inativo</i>";
                }

                switch (listaDeFuncionarios[i].usuario.perfil) {
                    case 0:
                        var perfil = "Administrador";
                        break;
                    case 1:
                        var perfil = "Técnico";
                        break;
                    case 2:
                        var perfil = "Cliente";
                        break;
                }
                funcionario.dados.push([listaDeFuncionarios[i].nome, listaDeFuncionarios[i].usuario.cpf.numero, listaDeFuncionarios[i].email, perfil, status, "<td data-toggle='modal' style='text-align-last: center; border: none;' onclick='funcionario.buscarFuncionarioPorID(" + listaDeFuncionarios[i].idFuncionario + ")'><button class='btn btn-outline-light btnEdit' type='button'><i class='fas fa-pencil-alt tabelaEdit'></i></button></td>"]);
            }
        } else {
            funcionario.html += "<td colspan='6' style='text-align: center; padding-left: 14rem;'>Nenhum registro encontrado</td></tr>";
        }
        $("#resultadoFuncionarios").html(funcionario.html);
    }
    funcionario.paginar();
    funcionario.ajustarBotoes();
};


funcionario.buscarFuncionarioPorID = function (id) {
    var cfg = {
        type: "POST",
        url: "../rest/classRest/buscarFuncionarioPeloId/" + id,
        success: function (funcionario) {
            $("#editNomeFunc").val(funcionario.nome);
            $("#editCpfFunc").val(funcionario.usuario.cpf.numero);
            $("#editEmailFunc").val(funcionario.email);
            $("#editPerfilFunc").val(funcionario.usuario.perfil);
            $("#editIdFunc").val(funcionario.idFuncionario);
            $("#switchFunc").html("<label class='switch'><input type='checkbox' name='editStatusFunc' id='editStatusFunc' value='true' onclick='funcionario.alteraAtivoEditFunc()'><span class='slider round'></span></label>");
            if (funcionario.usuario.status) {
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
    editU.status = $("#editStatusFunc").val();
    usuario.editU = editU;

    editF = new Object();
    editF.nome = $("#editNomeFunc").val();
    editF.email = $("#editEmailFunc").val();

    
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
            url: "../rest/classRest/editarFuncionario",
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

funcionario.paginar = function () {
    document.getElementById("btnPaginacaoFunc").style.display = "block";
    $('table > tbody > tr').remove();
    var tbody = $('table > tbody');
    var cont = 0;
    for (var i = funcionario.pagina * funcionario.tamanhoPagina; i < funcionario.dados.length && i < (funcionario.pagina + 1) * funcionario.tamanhoPagina; i++) {
        cont++;
        tbody.append(
            $('<tr>')
                .append($('<td>').append(funcionario.dados[i][0]))
                .append($('<td>').append(funcionario.dados[i][1]).mask('000.000.000-00'))
                .append($('<td>').append(funcionario.dados[i][2]))
                .append($('<td>').append(funcionario.dados[i][3]))
                .append($('<td style="text-align: center;">').append(funcionario.dados[i][4]))
                .append($('<td style="text-align: -webkit-center;">').append(funcionario.dados[i][5]))
        )
    }

    if ((cont < funcionario.tamanhoPagina) && (funcionario.html == "")) {
        for (var i = cont; i < funcionario.tamanhoPagina; i++) {
            tbody.append(
                $('<tr>')
                    .append($('<td>').append(""))
                    .append($('<td>').append(""))
                    .append($('<td>').append(""))
                    .append($('<td>').append(""))
                    .append($('<td>').append(""))
                    .append($('<td style="text-align: -webkit-center; padding: 0.81rem !important">').append("&nbsp;"))
            )
        }
    }

    if (funcionario.html != "") {
        document.getElementById("btnPaginacaoFunc").style.display = "none";
    }

    $('#numeracaoFunc').text('Página ' + (funcionario.pagina + 1) + ' de ' + Math.ceil(funcionario.dados.length / funcionario.tamanhoPagina));
}

funcionario.ajustarBotoes = function () {
    $('#proximoFunc').prop('disabled', funcionario.dados.length <= funcionario.tamanhoPagina || funcionario.pagina >= Math.ceil(funcionario.dados.length / funcionario.tamanhoPagina) - 1);
    $('#anteriorFunc').prop('disabled', funcionario.dados.length <= funcionario.tamanhoPagina || funcionario.pagina == 0);
}


