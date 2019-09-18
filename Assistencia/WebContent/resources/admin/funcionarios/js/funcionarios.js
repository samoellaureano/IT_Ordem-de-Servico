funcionario = new Object();
usuario = new Object();

funcionario.dados = [];
funcionario.tamanhoPagina = 5;
funcionario.pagina = 0;
funcionario.html = "";

$(document).ready(function () {
    $("#modal-cadFunc").load("admin/funcionarios/modal-cad.html");
    $("#modal-editFunc").load("admin/funcionarios/modal-edit.html");

    //$('#cpfFunc').mask('000.000.000-00');

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
    cad= new Object();
    var retorno ="";

    cad.cpf = $("#cpfFunc").val();
    cad.perfil = $("#perfilFunc").val();
    if (cad.cpf == "") {
        retorno = ("O campo 'CPF' deve ser preenchido!\n");
    }
    usuario.cad = cad;

    cadF = new Object();
    cadF.nome = $("#nomeFunc").val();    
    cadF.email = $("#emailFunc").val();
    cadF.usuario = usuario.cad;
    if (cad.nome == "") {
        retorno = ("O campo 'Descrição' deve ser preenchido!\n");
    }
    if (cad.email == "") {
        retorno = ("O campo 'E-Mail' deve ser preenchido!\n");
    }
    funcionario.cad = cadF;

    if(retorno == ""){
        var cfg = {
            url: "../rest/classRest/addFuncionario",
            data: JSON.stringify(funcionario.cad),
            success: function (succJson) {
                if (succJson) {
                    resp = ("Funcionário cadastrado com sucesso!");
                    funcionario.exibirMessagem(resp, 1);

                    $("#mod-cadFunc").modal("hide");
                    $('.modal-backdrop').remove();
                } else {
                    resp = ("Erro ao cadastrar um novo funcionário!");
                    funcionario.exibirMessagem(resp, 2);
                }

                $("#nomeFunc").val("");
                $("#cpfFunc").val("");
                $("#emailFunc").val("");
                $("#perfilFunc").val(0);
                funcionario.buscar();
            },
            error: function (errJson) {
                resp = ("Erro ao cadastrar um novo funcionário!");
                funcionario.exibirMessagem(resp, 2);
            }
        };
        IT.ajax.post(cfg);
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

                switch(listaDeFuncionarios[i].usuario.perfil){
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
                funcionario.dados.push([listaDeFuncionarios[i].nome, listaDeFuncionarios[i].usuario.cpf, listaDeFuncionarios[i].email, perfil, status, "<td data-toggle='modal' style='text-align-last: center; border-top: none;' onclick='funcionario.buscarFuncionarioPorID(" + listaDeFuncionarios[i].idFuncionario + ")'><button class='btn btn-outline-light btnEdit' type='button'><i class='fas fa-pencil-alt tabelaEdit'></i></button></td>"]);
            }
        } else {
            funcionario.html += "<td colspan='5' style='text-align: center; padding-left: 14rem;'>Nenhum registro encontrado</td></tr>";
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
            $("#editCpfFunc").val(funcionario.usuario.cpf);
            console.log(funcionario.email);
            $("#editEmailFunc").val(funcionario.email);            
            $("#editIdFunc").val(funcionario.idFuncionario);
            $("#switch").html("<label class='switch'><input type='checkbox' name='editStatusFunc' id='editStatusFunc' value='true' onclick='funcionario.alteraAtivoEdit()'><span class='slider round'></span></label>");
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
    funcionario.editar = new Object();
    funcionario.editar.desc = $("#editDescFunc").val();
    funcionario.editar.valor = $("#editValorFunc").val();
    funcionario.editar.status = $("#editStatusFunc").val();
    funcionario.editar.id = $("#editId").val();
    funcionario.editar.valor = funcionario.editar.valor.replace(/\./g, "");
    funcionario.editar.valor = funcionario.editar.valor.replace(",", ".");
    var resp = "";

    var cfg = {
        url: "../rest/classRest/editarFuncionario",
        data: funcionario.editar,
        success: function (data) {
            if (data) {
                resp = ("Funcionário editado com sucesso!");
                funcionario.exibirMessagem(resp, 1);

                $('.modal-backdrop').remove();
                $("#mod-editFunc").modal("hide");
            } else {
                resp = ("Erro ao editar o funcionário!");
                funcionario.exibirMessagem(resp, 2);
            }
            funcionario.buscar();

        },
        error: function (err) {
            resp = ("Erro ao editar o funcionário!");
            funcionario.exibirMessagem(resp, 2);
        }
    };
    IT.ajax.post(cfg);
};

funcionario.alteraAtivoEdit = function () {
    valor = $("#switchFunc").val();
    if (valor == 'true') {
        $("#switchFunc").attr('value', 'false');
        $("#statusSWFunc").html("Funcionário Inativo")
    }
    if (valor == 'false') {
        $("#switchFunc").attr('value', 'true');
        $("#statusSWFunc").html("Funcionário Ativo")
    }
};

funcionario.ativarModalCad = function () {
    $("#mod-cadFunc").modal("show");
    $("#nomeFunc").val("");
    $("#cpfFunc").val("");
    $("#emailFunc").val("");
    $("perfilFunc").val("Selecione");

    //Colocar foco no input
    $('#mod-cadFunc').on('shown.bs.modal', function () {
        $('#nomeFunc').focus();
    })
};

funcionario.ativarModalEdit = function () {
    $("#mod-editFunc").addClass("in");
    $("#mod-editFunc").modal("show");
};

funcionario.exibirMessagem = function (msg, tipo) {
    var msgDiv = $("#msgFunc");

    switch (tipo) {
        case 1:
            $("#msgFunc").css("background-color", "#008040");
            tipo = "<span class='glyphicon glyphicon-ok msg-icon'></span>";
            break;
        case 2:
            $("#msgFunc").css("background-color", "#b4004e");
            tipo = "<span class='glyphicon glyphicon-remove msg-icon'></span>";
            break;
        default:
            tipo = "";
            break;
    }

    msgDiv.html(tipo + msg);

    $('#msgFunc').slideDown(300, function () {
    }).fadeIn({
        duration: 300,
        queue: true
    });
    // Após 3 segundos remover a classe
    setTimeout(function () {
        $('#msgFunc').slideUp(300, function () {
        }).fadeOut({
            duration: 300,
            queue: false
        });
    }, 1500);
}

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
                .append($('<td>').append(funcionario.dados[i][1]))
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


