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

configUsuario.buscarClientePorID = function (id) {
    var cfg = {
        type: "POST",
        url: "../rest/classRest/buscarClientePeloId/" + id,
        success: function (cliente) {
            cliente.usuario.perfil = "Cliente";

            $("#idConfig").val(cliente.idCliente);
            $("#nomeConfig").val(cliente.nome);
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

configUsuario.alterarSenha = function () {
    document.getElementById("senhaNovaFuncConfigLabel").style.display = "block";
    document.getElementById("senhaConfirmaFuncConfigLabel").style.display = "block";
}


configUsuario.alterarFormConfigUser = function () {
    var statusAlterSenha = $('#alterarSenha').val();

    if (statusAlterSenha == "false") {
        $('#alterarSenha').val("true");

        document.getElementById("senhaNovaFuncConfigLabel").style.display = "block";
        document.getElementById("senhaNovaFuncConfig").style.display = "block";

        document.getElementById("senhaConfirmaFuncConfigLabel").style.display = "block";
        document.getElementById("senhaConfirmaFuncConfig").style.display = "block";

        $('#senhaNovaFuncConfigLabel').focus();

    } else {
        $('#alterarSenha').val("false");

        document.getElementById("senhaNovaFuncConfigLabel").style.display = "none";
        document.getElementById("senhaNovaFuncConfig").style.display = "none";

        document.getElementById("senhaConfirmaFuncConfigLabel").style.display = "none";
        document.getElementById("senhaConfirmaFuncConfig").style.display = "none";
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
