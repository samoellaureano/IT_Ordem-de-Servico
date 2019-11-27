configUsuario = new Object();
usuario = new Object();


$(document).ready(function () {
    $('#cpfFuncConfig').mask('000.000.000-00');
    $("#senhaAtualConfig").val("");
    $("#senhaNovaConfig").val("");
    $("#senhaConfirmaConfig").val("");
    configUsuario.alterarInputsConfigUser();

    configUsuario.buscar();

});


configUsuario.buscar = function () {
    perfil = $("#perfil").text();
    id = $("#idLogado").val();

    switch (perfil) {
        case 'Cliente':
            configUsuario.buscarClientePorID(id);
            break;
        case 'Administrador': case 'Técnico':
            if ($("#nomeLogin").text() != "") {
                configUsuario.buscarFuncionarioPorID(id);

            }
            break;
    }

}

configUsuario.editar = function (retornoSenha) {
    console.log("retorno no editar"+retornoSenha);
    perfil = $("#perfil").text();
    id = $("#idLogado").val();

    switch (perfil) {
        case 'Cliente':
            configUsuario.editarCliente(id, retornoSenha);
            break;
        case 'Administrador': case 'Técnico':
            if ($("#nomeLogin").text() != "") {
                configUsuario.editarFuncionario(id, retornoSenha);
            }
            break;
    }

}

configUsuario.buscarClientePorID = function (id) {
    var cfg = {
        type: "POST",
        url: "../rest/classRest/buscarClientePeloId/" + id,
        success: function (cliente) {
            cliente.usuario.perfil = "Cliente";

            $("#idConfig").val(cliente.idCliente);
            $("#nomeConfig").val(cliente.nome);
            $("#nomeLogin").html(cliente.nome);
            $("#cpfConfig").val(cliente.usuario.cpf.numero).mask('000.000.000-00');
            $("#telefoneConfig").val(cliente.telefone);
            $("#telefoneAuxConfig").val(cliente.telefoneAux);
            $("#emailConfig").val(cliente.email);
            $("#perfilConfig").val(cliente.usuario.perfil);


            $("#cepConfig").val(cliente.endereco.cep);
            $("#estadoConfig").html("<option value=`" + cliente.endereco.estado + "`>" + cliente.endereco.estado + "</option>");
            $("#cidadeConfig").html("<option value=`" + cliente.endereco.cidade + "`>" + cliente.endereco.cidade + "</option>");
            $("#bairroConfig").html("<option value=`" + cliente.endereco.bairro + "`>" + cliente.endereco.bairro + "</option>");
            $("#ruaConfig").html("<option value=" + cliente.endereco.idRua + ">" + cliente.endereco.rua + "</option>");
            $("#idEnderecoConfig").val(cliente.endereco.idEndereco);
            $("#numeroConfig").val(cliente.endereco.numero);
            $("#complementoConfig").val(cliente.endereco.complemento);
        },
        error: function (err) {
            alert("Erro ao buscar o cliente!" + err.responseText);
        }
    };
    IT.ajax.post(cfg);
}

configUsuario.buscarFuncionarioPorID = function (id) {
    var cfg = {
        type: "POST",
        url: "../rest/classRest/buscarFuncionarioPeloId/" + id,
        success: function (funcionario) {
            switch (funcionario.usuario.perfil) {
                case 0:
                    funcionario.usuario.perfil = "Administrador";
                    break;
                case 1:
                    funcionario.usuario.perfil = "Técnico";
                    break;
            }

            $("#idConfig").val(funcionario.idFuncionario);
            $("#nomeConfig").val(funcionario.nome);
            $("#nomeLogin").html(funcionario.nome);
            $("#cpfConfig").val(funcionario.usuario.cpf.numero).mask('000.000.000-00');
            $("#emailConfig").val(funcionario.email);
            $("#perfilConfig").val(funcionario.usuario.perfil);
        },
        error: function (err) {
            alert("Erro buscar o funcionario!" + err.responseText);
        }
    };
    IT.ajax.post(cfg);
}

configUsuario.buscarCep = function () {
    var valorBusca = $("#cepConfig").val();
    document.getElementById("msgCepNaoEncontradoConfig").style.display = "none";
    if (valorBusca.length > 8) {
        document.getElementById("iconeCarregandoCepConfig").style.display = "block";
        valorBusca = valorBusca.replace(/\-/g, "");
        if (valorBusca.trim()) {
            var cfg = {
                type: "POST",
                url: "../rest/classRest/buscarCep/" + valorBusca,
                success: function (dadosDaRua) {
                    configUsuario.exibirCepConfig(dadosDaRua);
                },
                error: function (err) {
                    alert("Erro ao buscar o Rua: " + err.responseText);
                }
            };
            IT.ajax.post(cfg);
        }
    } else if (valorBusca.length < 1) {
        configUsuario.buscarEstadosConfig();
        $("#cidadeConfig").html("<option value='0'>Selecione</option>");
        $("#bairroConfig").html("<option value='0'>Selecione</option>");
        $("#ruaConfig").html("<option value='0'>Selecione</option>");
    }
};

configUsuario.exibirCepConfig = function (endereco) {

    if (endereco != undefined) {
        $("#estadoConfig").html("<option value=`" + endereco.estado + "`>" + endereco.estado + "</option>");
        $("#cidadeConfig").html("<option value=`" + endereco.cidade + "`>" + endereco.cidade + "</option>");
        $("#bairroConfig").html("<option value=`" + endereco.bairro + "`>" + endereco.bairro + "</option>");
        $("#ruaConfig").html("<option value=" + endereco.idRua + ">" + endereco.rua + "</option>");
        document.getElementById("iconeCarregandoCepConfig").style.display = "none";
    } else {
        $("#cepCliente").val("");
        document.getElementById("msgCepNaoEncontradoConfig").style.display = "block";
        document.getElementById("iconeCarregandoCepConfig").style.display = "none";

    }
};

configUsuario.buscarEstadosConfig = function () {

    var cfg = {
        type: "POST",
        url: "../rest/classRest/buscarEstados/",
        success: function (listaEstados) {
            configUsuario.exibirEstadosConfig(listaEstados);
        },
        error: function (err) {
            alert("Erro ao buscar os estados: " + err.responseText);
        }
    };
    IT.ajax.post(cfg);
};

configUsuario.exibirEstadosConfig = function (listaEstados) {
    var html = "<option value='0'>Selecione</option>";
    for (var i = 0; i < listaEstados.length; i++) {
        html += ("<option value=" + listaEstados[i].idEstado + ">" + listaEstados[i].nome + "</option>");
    }

    $("#estadoConfig").html(html);
}

configUsuario.buscarCidadesConfig = function (id) {
    id = removeMask(id);
    var cfg = {
        type: "POST",
        url: "../rest/classRest/buscarCidades/" + id,
        success: function (listaCidades) {
            configUsuario.exibirCidadesConfig(listaCidades);
        },
        error: function (err) {
            alert("Erro ao buscar as cidades: " + err.responseText);
        }
    };
    IT.ajax.post(cfg);
};

configUsuario.exibirCidadesConfig = function (listaCidades) {
    var html = "<option value='0'>Selecione</option>";
    for (var i = 0; i < listaCidades.length; i++) {
        html += ("<option value=" + listaCidades[i].idCidade + ">" + listaCidades[i].nome + "</option>");
    }

    $("#cidadeConfig").html(html);
}

configUsuario.buscarBairrosConfig = function (id) {
    id = removeMask(id);
    var cfg = {
        type: "POST",
        url: "../rest/classRest/buscarBairros/" + id,
        success: function (listaBairros) {
            configUsuario.exibirBairrosConfig(listaBairros);
        },
        error: function (err) {
            alert("Erro ao buscar os bairros: " + err.responseText);
        }
    };
    IT.ajax.post(cfg);
};

configUsuario.exibirBairrosConfig = function (listaBairros) {
    var html = "<option value='0'>Selecione</option>";
    for (var i = 0; i < listaBairros.length; i++) {
        html += ("<option value=" + listaBairros[i].idBairro + ">" + listaBairros[i].nome + "</option>");
    }

    $("#bairroConfig").html(html);
}

configUsuario.buscarRuasConfig = function (id) {
    id = removeMask(id);
    var cfg = {
        type: "POST",
        url: "../rest/classRest/buscarRuas/" + id,
        success: function (listaRuas) {
            configUsuario.exibirRuasConfig(listaRuas);
        },
        error: function (err) {
            alert("Erro ao buscar as ruas: " + err.responseText);
        }
    };
    IT.ajax.post(cfg);
};

configUsuario.exibirRuasConfig = function (listaRuas) {
    var html = "<option value='0'>Selecione</option>";
    for (var i = 0; i < listaRuas.length; i++) {
        html += ("<option value=" + listaRuas[i].idRua + ">" + listaRuas[i].nome + "</option>");
    }

    $("#ruaConfig").html(html);
}

configUsuario.editarCliente = function (id, retornoSenha) {
    editU = new Object();
    var retorno = "";

    editU.cpf = $("#cpfConfig").val();
    usuario.editU = editU;

    editC = new Object();
    editC.nome = $("#nomeConfig").val();
    editC.email = $("#emailConfig").val();
    editC.telefone = $("#telefoneConfig").val();
    editC.telefoneAux = $("#telefoneAuxConfig").val();
    editC.status = true;

    endereco = new Object();
    endereco.idRua = $("#ruaConfig").val();
    endereco.idEndereco = $("#idEnderecoConfig").val();
    endereco.numero = $("#numeroConfig").val();
    endereco.complemento = $("#complementoConfig").val();

    editC.idCliente = id;
    editC.usuario = usuario.editU;
    editC.endereco = endereco;

    if (editC.nome == "") {
        retorno += ("O campo 'Nome Completo' deve ser preenchido!\n");
    }
    var masc = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi);
    var res = masc.test(editC.email);
    if (res == false) {
        retorno += ("O campo E-mail foi preenchido incorretamente!\n");
    }

    cliente.editC = editC;

    if (retorno == "") {
        var resp = "";

        var cfg = {
            url: "../rest/classRest/editarClienteConfig",
            data: JSON.stringify(cliente.editC),
            success: function (data) {
                console.log("Altera Senha - " + retornoSenha);
                console.log("Data - " + data);

                if (data == true && retornoSenha == true) {
                    resp = ("Cliente editado com sucesso!");
                    exibirMessagem(resp, 1);
                } else {
                    resp = ("Erro ao editar o cliente!");
                    exibirMessagem(resp, 2);
                }
                configUsuario.buscar();
            },
            error: function (err) {
                resp = ("Erro ao editar o cliente!");
                exibirMessagem(resp, 2);
            }
        };
        IT.ajax.post(cfg);
    } else {
        alert(retorno);
        return false;
    }
};

configUsuario.editarFuncionario = function (id, retornoSenha) {
    var retorno = "";

    editF = new Object();
    editF.nome = $("#nomeConfig").val();
    editF.email = $("#emailConfig").val();
    editF.status = true;


    editF.idFuncionario = id;

    if (editF.nome == "") {
        retorno += ("O campo 'Nome Completo' deve ser preenchido!\n");
    }
    var masc = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi);
    var res = masc.test(editF.email);
    if (res == false) {
        retorno += ("O campo E-mail foi preenchido incorretamente!\n");
    }
    funcionario.editF = editF;

    if (retorno == "") {
        var resp = "";

        var cfg = {
            url: "../rest/classRest/editarFuncionarioConfig",
            data: JSON.stringify(funcionario.editF),
            success: function (data) {

                if (data == true && retornoSenha == true) {
                    resp = ("Funcionário editado com sucesso!");
                    exibirMessagem(resp, 1);
                } else {
                    resp = ("Erro ao editar o funcionário!");
                    exibirMessagem(resp, 2);
                }
                configUsuario.buscar();
            },
            error: function (err) {
                resp = ("Erro ao editar o funcionário!");
                exibirMessagem(resp, 2);
            }
        };
        IT.ajax.post(cfg);
    } else {
        alert(retorno);
        return false;
    }
};

configUsuario.verificaNovaSenha = function () {
    novaSenha = $("#senhaNovaConfig").val();
    if (novaSenha != "") {
        var masc = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z$*&@#]{8,}/gi);
        var r = masc.test(novaSenha);
        if (r == true) {
            document.getElementById("novaSenhaErro").style.display = "none";
            document.getElementById("novaSenhaOk").style.display = "block";
        } else {
            document.getElementById("novaSenhaOk").style.display = "none";
            document.getElementById("novaSenhaErro").style.display = "block";
        }
    } else {
        document.getElementById("novaSenhaOk").style.display = "none";
        document.getElementById("novaSenhaErro").style.display = "none";
    }
}

configUsuario.confirmaNovaSenha = function () {
    novaSenha = $("#senhaNovaConfig").val();
    confirmaSenha = $("#senhaConfirmaConfig").val();
    if (confirmaSenha != "") {
        if (novaSenha == confirmaSenha) {
            document.getElementById("confirmaSenhaErro").style.display = "none";
            document.getElementById("confirmaSenhaOk").style.display = "block";
        } else {
            document.getElementById("confirmaSenhaOk").style.display = "none";
            document.getElementById("confirmaSenhaErro").style.display = "block";
        }
    } else {
        document.getElementById("confirmaSenhaOk").style.display = "none";
        document.getElementById("confirmaSenhaErro").style.display = "none";
    }
}

configUsuario.validaSenhaAtual = function () {
    userConfig = new Object();
    var senhaAtual = $("#senhaAtualConfig").val();

    if (senhaAtual != "") {
        userConfig.cpf = $("#cpfConfig").val();
        userConfig.cpf = userConfig.cpf.replace(/\./g, "");
        userConfig.cpf = userConfig.cpf.replace(/\-/g, "");

        userConfig.senha = btoa(senhaAtual);
        var cfg = {
            url: "../rest/classRest/validaSenhaAtual",
            data: JSON.stringify(userConfig),
            success: function (data) {
                if (data) {
                    configUsuario.salvaSenha();
                } else {
                    resp = ("Erro ao editar o funcionário!");
                    exibirMessagem(resp, 2);
                }
            },
            error: function (err) {
                console.log(err);
            }
        };
        IT.ajax.post(cfg);
    } else {
        configUsuario.editar(true);
    }
}

configUsuario.salvaSenha = function () {
    userConfig = new Object();

    var novaSenha = $("#senhaNovaConfig").val();
    userConfig.cpf = $("#cpfConfig").val();
    userConfig.cpf = userConfig.cpf.replace(/\./g, "");
    userConfig.cpf = userConfig.cpf.replace(/\-/g, "");

    userConfig.senha = btoa(novaSenha);
    var cfg = {
        url: "../rest/classRest/salvaSenha",
        data: JSON.stringify(userConfig),
        success: function (data) {
            if (data) {
                $("#senhaAtualConfig").val("");
                $("#senhaNovaConfig").val("");
                $("#senhaConfirmaConfig").val("");
                document.getElementById("confirmaSenhaOk").style.display = "none";
                document.getElementById("novaSenhaOk").style.display = "none";
                configUsuario.editar(true);
            } else {
                resp = ("Erro ao editar o funcionário!");
                exibirMessagem(resp, 2);
            }
            
        },
        error: function (err) {
            console.log(err);
        }
    };
    IT.ajax.post(cfg);
}

configUsuario.alterarSenha = function () {
    document.getElementById("senhaNovaConfigLabel").style.display = "block";
    document.getElementById("senhaConfirmaConfigLabel").style.display = "block";
}


configUsuario.alterarFormConfigUser = function () {
    var statusAlterSenha = $('#alterarSenha').val();

    if (statusAlterSenha == "false") {
        $('#alterarSenha').val("true");

        document.getElementById("senhaNovaConfigLabel").style.display = "block";
        document.getElementById("senhaNovaConfig").style.display = "block";

        document.getElementById("senhaConfirmaConfigLabel").style.display = "block";
        document.getElementById("senhaConfirmaConfig").style.display = "block";

        $('#senhaNovaConfigLabel').focus();

    } else {
        $('#alterarSenha').val("false");

        document.getElementById("senhaNovaConfigLabel").style.display = "none";
        document.getElementById("senhaNovaConfig").style.display = "none";

        document.getElementById("senhaConfirmaConfigLabel").style.display = "none";
        document.getElementById("senhaConfirmaConfig").style.display = "none";
    }
};

configUsuario.alterarInputsConfigUser = function () {
    perfil = $("#perfil").text();

    switch (perfil) {
        case 'Cliente':
            document.getElementById("nav-endereco-tab").style.display = "block"
            document.getElementById("telefoneConfigLabel").style.display = "block";
            document.getElementById("telefoneConfig").style.display = "block";
            document.getElementById("telefoneAuxConfigLabel").style.display = "block";
            document.getElementById("telefoneAuxConfig").style.display = "block";
            break;
        case 'Administrador': case 'Técnico':
            document.getElementById("nav-endereco-tab").style.display = "none"
            document.getElementById("telefoneConfigLabel").style.display = "none";
            document.getElementById("telefoneConfig").style.display = "none";
            document.getElementById("telefoneAuxConfigLabel").style.display = "none";
            document.getElementById("telefoneAuxConfig").style.display = "none";
            break;
    }
}
