configUsuario = new Object();
usuario = new Object();


$(document).ready(function () {
    $('#cpfFuncConfig').mask('000.000.000-00');
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

configUsuario.editar = function () {
    perfil = $("#perfil").text();
    id = $("#idLogado").val();

    switch (perfil) {
        case 'Cliente':
            configUsuario.editarCliente(id);
            break;
        case 'Administrador': case 'Técnico':
            if ($("#nomeLogin").text() != "") {
                configUsuario.editarFuncionario(id);
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
            $("#cpfConfig").val(cliente.usuario.cpf.numero);
            $("#telefoneConfig").val(cliente.telefone);
            $("#telefoneAuxConfig").val(cliente.telefoneAux);
            $("#emailConfig").val(cliente.email);
            $("#perfilConfig").val(cliente.usuario.perfil);


            $("#cepClienteEdit").val(cliente.endereco.cep);
            $("#estadoClienteEdit").html("<option value=`" + cliente.endereco.estado + "`>" + cliente.endereco.estado + "</option>");
            $("#cidadeClienteEdit").html("<option value=`" + cliente.endereco.cidade + "`>" + cliente.endereco.cidade + "</option>");
            $("#bairroClienteEdit").html("<option value=`" + cliente.endereco.bairro + "`>" + cliente.endereco.bairro + "</option>");
            $("#ruaClienteEdit").html("<option value=`" + cliente.endereco.rua + "`>" + cliente.endereco.rua + "</option>");
            $("#idRuaEdit").val(cliente.endereco.idRua);
            $("#idEnderecoEdit").val(cliente.endereco.idEndereco);
            $("#numeroClienteEdit").val(cliente.endereco.numero);
            $("#complementoClienteEdit").val(cliente.endereco.complemento);
            $("#switchCliente").html("<label class='switch'><input type='checkbox' name='editStatusCliente' id='editStatusCliente' value='true' onclick='cliente.alteraAtivoEditCliente()'><span class='slider round'></span></label>");
            if (cliente.status) {
                $("#editStatusCliente").attr('checked', 'true');
                $("#editStatusCliente").attr('value', 'true');
                $("#statusSWCliente").html("Cliente Ativo")
            } else {
                $("#editStatusCliente").removeAttr("checked");
                $("#editStatusCliente").attr('value', 'false');
                $("#statusSWCliente").html("Cliente Inativo")
            }
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
            $("#cpfConfig").val(funcionario.usuario.cpf.numero);
            $("#emailConfig").val(funcionario.email);
            $("#perfilConfig").val(funcionario.usuario.perfil);
        },
        error: function (err) {
            alert("Erro buscar o funcionario!" + err.responseText);
        }
    };
    IT.ajax.post(cfg);
}

configUsuario.editarCliente = function (id) {
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
    /*
        endereco = new Object();
        endereco.idRua = $("#idRuaEdit").val();
        endereco.idEndereco = $("#idEnderecoEdit").val();
        endereco.numero = $("#numeroClienteEdit").val();
        endereco.complemento = $("#complementoClienteEdit").val();
    */
    editC.idCliente = id;
    editC.usuario = usuario.editU;
    //editC.endereco = endereco;

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
                if (data) {
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

configUsuario.editarFuncionario = function (id) {
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
                if (data) {
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
            document.getElementById("telefoneConfigLabel").style.display = "block";
            document.getElementById("telefoneConfig").style.display = "block";
            document.getElementById("telefoneAuxConfigLabel").style.display = "block";
            document.getElementById("telefoneAuxConfig").style.display = "block";
            break;
        case 'Administrador': case 'Técnico':
            document.getElementById("telefoneConfigLabel").style.display = "none";
            document.getElementById("telefoneConfig").style.display = "none";
            document.getElementById("telefoneAuxConfigLabel").style.display = "none";
            document.getElementById("telefoneAuxConfig").style.display = "none";
            break;
    }
}
