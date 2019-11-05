cliente = new Object();
usuario = new Object();


$(document).ready(function () {
    $("#div-cadCliente").load("admin/cliente/modal-cadCliente.html");
    $("#div-editCliente").load("admin/cliente/modal-editCliente.html");
});

cliente.cadastrar = function () {

    cadU = new Object();
    var retorno = "";

    cadU.cpf = $("#cpfCliente").val();

    if (cadU.cpf == "") {
        retorno += ("O campo 'CPF' deve ser preenchido!\n");
    } else if (cadU.cpf.length < 14) {
        retorno += ("O campo 'CPF' deve ser preenchido corretamente!\n");
    }
    cadU.cpf = cadU.cpf.replace(/\./g, "");
    cadU.cpf = cadU.cpf.replace(/\-/g, "");

    usuario.cadU = cadU;

    cadCliente = new Object();
    cadCliente.usuario = usuario.cadU;


    cadCliente.nome = $("#nomeCliente").val();
    cadCliente.email = $("#emailCliente").val();
    cadCliente.telefone = $("#telefoneCliente").val();
    cadCliente.telefone = removeMask(cadCliente.telefone);
    cadCliente.celular = $("#celularCliente").val();
    cadCliente.celular = removeMask(cadCliente.celular);

    var masc = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi);
    var res = masc.test(cadCliente.email);
    if (res == false) {
        retorno += ("O campo E-mail foi preenchido incorretamente!\n");
    }

    if (retorno == "") {
        var cfg = {
            url: "../rest/classRest/addCliente",
            data: JSON.stringify(cadCliente),
            success: function (succJson) {
                if (succJson == 1) {
                    resp = ("Cliente cadastrado com sucesso!");
                    exibirMessagem(resp, 1);
                } else if (succJson == 2) {
                    resp = ("O Cliente ja existe!");
                    exibirMessagem(resp, 2);
                } else {
                    resp = ("Erro ao cadastrar um novo cliente!");
                    exibirMessagem(resp, 2);
                }

                $("#modal-cadCliente").modal("hide");
                $('.modal-backdrop').remove();
            },
            error: function (errJson) {
                resp = ("Erro ao cadastrar um novo Cliente!");
                exibirMessagem(resp, 2);
            }
        };
        IT.ajax.post(cfg);
    } else {
        alert(retorno);
    }
};

cliente.exibirClientes = function (listaDeClientes) {
    var status = "";
    cliente.html = "<ul class='listaDeClientes'>\n";

    if (listaDeClientes != undefined) {
        if (listaDeClientes.length > 0) {
            for (var i = 0; i < listaDeClientes.length; i++) {
                cliente.html += ("<li onclick='cliente.selectCliente(`" + listaDeClientes[i].nome + "`,`" + listaDeClientes[i].idCliente + "`)'>" + listaDeClientes[i].nome + "</li>");
            }
        } else {
            cliente.html += "<li style='text-align: center'>Nenhum registro encontrado</li>";
            document.getElementById("limparInputCliente").style.display = "block";
        }
        $("#listaDeClientes").html(cliente.html + "\n</ul>");
    }
};

cliente.buscarClientePorID = function (id) {
    var cfg = {
        type: "POST",
        url: "../rest/classRest/buscarClientePeloId/" + id,
        success: function (cliente) {
            $("#nomeClienteEdit").val(cliente.nome);
            $("#editIdCliente").val(cliente.idCliente);
            $("#telefoneClienteEdit").val(cliente.telefone);
            $("#celularClienteEdit").val(cliente.celular);
            $("#emailClienteEdit").val(cliente.email);
            $("#editCpfCliente").val(cliente.usuario.cpf.numero);
            //$("#cepClienteEdit").val(cliente.idFuncionario);
            //$("#ruaClienteEdit").val(cliente.idFuncionario);
            //$("#numeroClienteEdit").val(cliente.idFuncionario);
            //$("#complementoClienteEdit").val(cliente.idFuncionario);
            $("#switchCliente").html("<label class='switch'><input type='checkbox' name='editStatusCliente' id='editStatusCliente' value='true' onclick='cliente.alteraAtivoEditCliente()'><span class='slider round'></span></label>");
            if (cliente.usuario.status) {
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
            alert("Erro ao editar o cliente!" + err.responseText);
        }
    };
    IT.ajax.post(cfg);
}

cliente.buscarCepCad = function () {
    var valorBusca = $("#cepCliente").val();
    document.getElementById("msgCepNaoEncontrado").style.display = "none";
    if (valorBusca.length > 8) {
        document.getElementById("iconeCarregandoCep").style.display = "block";
        valorBusca = valorBusca.replace(/\-/g, "");
        if (valorBusca.trim()) {
            var cfg = {
                type: "POST",
                url: "../rest/classRest/buscarCep/" + valorBusca,
                success: function (dadosDaRua) {
                    cliente.exibirCepCad(dadosDaRua);
                },
                error: function (err) {
                    alert("Erro ao buscar o Rua: " + err.responseText);
                }
            };
            IT.ajax.post(cfg);
        }
    }else if(valorBusca.length < 1){
        cliente.buscarEstadosCad();
        $("#cidadeCliente").html("<option value='0'>Selecione</option>");
        $("#bairroCliente").html("<option value='0'>Selecione</option>");
        $("#ruaCliente").html("<option value='0'>Selecione</option>");
    }
};

cliente.exibirCepCad = function (endereco) {

    if (endereco != undefined) {
        $("#estadoCliente").html("<option value=`" + endereco.estado + "`>" + endereco.estado + "</option>");
        $("#cidadeCliente").html("<option value=`" + endereco.cidade + "`>" + endereco.cidade + "</option>");
        $("#bairroCliente").html("<option value=`" + endereco.bairro + "`>" + endereco.bairro + "</option>");
        $("#ruaCliente").html("<option value=`" + endereco.rua + "`>" + endereco.rua + "</option>");
        document.getElementById("iconeCarregandoCep").style.display = "none";
    } else {
        $("#cepCliente").val("");
        document.getElementById("msgCepNaoEncontrado").style.display = "block";
        document.getElementById("iconeCarregandoCep").style.display = "none";
        
    }
};

cliente.buscarCepEdit = function () {
    var valorBusca = $("#cepClienteEdit").val();
    document.getElementById("msgCepNaoEncontradoEdit").style.display = "none";
    if (valorBusca.length > 8) {
        document.getElementById("iconeCarregandoCepEdit").style.display = "block";
        valorBusca = valorBusca.replace(/\-/g, "");
        if (valorBusca.trim()) {
            var cfg = {
                type: "POST",
                url: "../rest/classRest/buscarCep/" + valorBusca,
                success: function (dadosDaRua) {
                    cliente.exibirCepEdit(dadosDaRua);
                },
                error: function (err) {
                    alert("Erro ao buscar o Rua: " + err.responseText);
                }
            };
            IT.ajax.post(cfg);
        }
    }else if(valorBusca.length < 1){
        cliente.buscarEstadosEdit();
        $("#cidadeClienteEdit").html("<option value='0'>Selecione</option>");
        $("#bairroClienteEdit").html("<option value='0'>Selecione</option>");
        $("#ruaClienteEdit").html("<option value='0'>Selecione</option>");
    }
};

cliente.exibirCepEdit = function (endereco) {

    if (endereco != undefined) {
        $("#estadoClienteEdit").html("<option value=`" + endereco.estado + "`>" + endereco.estado + "</option>");
        $("#cidadeClienteEdit").html("<option value=`" + endereco.cidade + "`>" + endereco.cidade + "</option>");
        $("#bairroClienteEdit").html("<option value=`" + endereco.bairro + "`>" + endereco.bairro + "</option>");
        $("#ruaClienteEdit").html("<option value=`" + endereco.rua + "`>" + endereco.rua + "</option>");
        document.getElementById("iconeCarregandoCepEdit").style.display = "none";
    } else {
        $("#cepClienteEdit").val("");
        document.getElementById("msgCepNaoEncontradoEdit").style.display = "block";
        document.getElementById("iconeCarregandoCepEdit").style.display = "none";
        
    }
};

cliente.buscarEstadosCad = function () {

    var cfg = {
        type: "POST",
        url: "../rest/classRest/buscarEstados/",
        success: function (listaEstados) {
            cliente.exibirEstadosCad(listaEstados);
        },
        error: function (err) {
            alert("Erro ao buscar os estados: " + err.responseText);
        }
    };
    IT.ajax.post(cfg);
};

cliente.exibirEstadosCad = function (listaEstados) {
    var html="<option value='0'>Selecione</option>";
    for (var i = 0; i < listaEstados.length; i++) {
        html += ("<option value=`" + listaEstados[i].idEstado + "`>" + listaEstados[i].nome + "</option>");
    }

    $("#estadoCliente").html(html);
}

cliente.buscarCidadesCad = function (id) {
    id = removeMask(id);
    var cfg = {
        type: "POST",
        url: "../rest/classRest/buscarCidades/" + id,
        success: function (listaCidades) {
            cliente.exibirCidadesCad(listaCidades);
        },
        error: function (err) {
            alert("Erro ao buscar as cidades: " + err.responseText);
        }
    };
    IT.ajax.post(cfg);
};

cliente.exibirCidadesCad = function (listaCidades) {
    var html="<option value='0'>Selecione</option>";
    for (var i = 0; i < listaCidades.length; i++) {
        html += ("<option value=`" + listaCidades[i].idCidade + "`>" + listaCidades[i].nome + "</option>");
    }

    $("#cidadeCliente").html(html);
}

cliente.buscarBairrosCad = function (id) {
    id = removeMask(id);
    var cfg = {
        type: "POST",
        url: "../rest/classRest/buscarBairros/" + id,
        success: function (listaBairros) {
            cliente.exibirBairrosCad(listaBairros);
        },
        error: function (err) {
            alert("Erro ao buscar os bairros: " + err.responseText);
        }
    };
    IT.ajax.post(cfg);
};

cliente.exibirBairrosCad = function (listaBairros) {
    var html="<option value='0'>Selecione</option>";
    for (var i = 0; i < listaBairros.length; i++) {
        html += ("<option value=`" + listaBairros[i].idBairro + "`>" + listaBairros[i].nome + "</option>");
    }

    $("#bairroCliente").html(html);
}

cliente.buscarRuasCad = function (id) {
    id = removeMask(id);
    var cfg = {
        type: "POST",
        url: "../rest/classRest/buscarRuas/" + id,
        success: function (listaRuas) {
            cliente.exibirRuasCad(listaRuas);
        },
        error: function (err) {
            alert("Erro ao buscar as ruas: " + err.responseText);
        }
    };
    IT.ajax.post(cfg);
};

cliente.exibirRuasCad = function (listaRuas) {
    var html="<option value='0'>Selecione</option>";
    for (var i = 0; i < listaRuas.length; i++) {
        html += ("<option value=`" + listaRuas[i].idRua + "`>" + listaRuas[i].nome + "</option>");
    }

    $("#ruaCliente").html(html);
}

cliente.editarCliente = function () {
    editU = new Object();
    var retorno = "";

    editU.cpf = $("#editCpfCliente").val();
    editU.status = $("#editStatusCliente").val();
    usuario.editU = editU;

    editC = new Object();
    editC.nome = $("#nomeClienteEdit").val();
    editC.email = $("#emailClienteEdit").val();
    editC.telefone = $("#telefoneClienteEdit").val();
    editC.celular = $("#celularClienteEdit").val();

    //Endereço

    editC.idCliente = $("#editIdCliente").val();
    editC.usuario = usuario.editU;

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
            url: "../rest/classRest/editarCliente",
            data: JSON.stringify(cliente.editC),
            success: function (data) {
                if (data) {
                    resp = ("Cliente editado com sucesso!");
                    exibirMessagem(resp, 1);

                    $('.modal-backdrop').remove();
                    $("#modal-editCliente").modal("hide");

                    cliente.selectCliente(cliente.editC.nome, cliente.editC.idCliente);
                } else {
                    resp = ("Erro ao editar o cliente!");
                    exibirMessagem(resp, 2);
                }

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

cliente.alteraAtivoEditCliente = function () {
    valor = $("#editStatusCliente").val();
    if (valor == 'true') {
        $("#editStatusCliente").attr('value', 'false');
        $("#statusSWCliente").html("Cliente Inativo")
    } else if (valor == 'false') {
        $("#editStatusCliente").attr('value', 'true');
        $("#statusSWCliente").html("Cliente Ativo")
    }
};

cliente.selectCliente = function (selectCli, selectIdCli) {
    cliente.buscarClientePorID(selectIdCli);
    $("#cliente").val(selectCli);
    $("#listaDeClientes").html("");
    document.getElementById("divBtnCadCliente").style.display = "none";
    document.getElementById("divBtnEditCliente").style.display = "block";
    document.getElementById("limparInputCliente").style.display = "block";
}

cliente.removeCliente = function () {
    $("#listaDeClientes").html("");
    document.getElementById("divBtnCadCliente").style.display = "block";
    document.getElementById("divBtnEditCliente").style.display = "none";
    document.getElementById("limparInputCliente").style.display = "none";
    $("#cliente").val("");
    $('#cliente').focus();
}

cliente.alterarCadCliente = function () {
    var display = $('#nomeClienteLabel').css('display');

    if (display == "none") {
        document.getElementById("nomeClienteLabel").style.display = "block";
        document.getElementById("nomeCliente").style.display = "block";

        document.getElementById("cpfClienteLabel").style.display = "block";
        document.getElementById("cpfCliente").style.display = "block";

        document.getElementById("telefoneClienteLabel").style.display = "block";
        document.getElementById("telefoneCliente").style.display = "block";

        document.getElementById("celularClienteLabel").style.display = "block";
        document.getElementById("celularCliente").style.display = "block";

        document.getElementById("emailClienteLabel").style.display = "block";
        document.getElementById("emailCliente").style.display = "block";

        document.getElementById("btnProximo").style.display = "block";

        document.getElementById("cepClienteLabel").style.display = "none";
        document.getElementById("cepCliente").style.display = "none";

        document.getElementById("msgCepNaoEncontrado").style.display = "none";

        document.getElementById("ruaClienteLabel").style.display = "none";
        document.getElementById("ruaCliente").style.display = "none";

        document.getElementById("numeroClienteLabel").style.display = "none";
        document.getElementById("numeroCliente").style.display = "none";

        document.getElementById("complementoClienteLabel").style.display = "none";
        document.getElementById("complementoCliente").style.display = "none";

        document.getElementById("estadoClienteLabel").style.display = "none";
        document.getElementById("estadoCliente").style.display = "none";

        document.getElementById("cidadeClienteLabel").style.display = "none";
        document.getElementById("cidadeCliente").style.display = "none";

        document.getElementById("bairroClienteLabel").style.display = "none";
        document.getElementById("bairroCliente").style.display = "none";

        document.getElementById("btnVoltar").style.display = "none";
        document.getElementById("btnSalvar").style.display = "none";

    } else if ((display == "block") && ($('#nomeCliente').val() != "")) {
        document.getElementById("cepClienteLabel").style.display = "block";
        document.getElementById("cepCliente").style.display = "block";

        document.getElementById("ruaClienteLabel").style.display = "block";
        document.getElementById("ruaCliente").style.display = "block";

        document.getElementById("numeroClienteLabel").style.display = "block";
        document.getElementById("numeroCliente").style.display = "block";

        document.getElementById("complementoClienteLabel").style.display = "block";
        document.getElementById("complementoCliente").style.display = "block";

        document.getElementById("estadoClienteLabel").style.display = "block";
        document.getElementById("estadoCliente").style.display = "block";

        document.getElementById("cidadeClienteLabel").style.display = "block";
        document.getElementById("cidadeCliente").style.display = "block";

        document.getElementById("bairroClienteLabel").style.display = "block";
        document.getElementById("bairroCliente").style.display = "block";

        document.getElementById("btnVoltar").style.display = "block";
        document.getElementById("btnSalvar").style.display = "block";

        document.getElementById("nomeClienteLabel").style.display = "none";
        document.getElementById("nomeCliente").style.display = "none";

        document.getElementById("cpfClienteLabel").style.display = "none";
        document.getElementById("cpfCliente").style.display = "none";

        document.getElementById("telefoneClienteLabel").style.display = "none";
        document.getElementById("telefoneCliente").style.display = "none";

        document.getElementById("celularClienteLabel").style.display = "none";
        document.getElementById("celularCliente").style.display = "none";

        document.getElementById("emailClienteLabel").style.display = "none";
        document.getElementById("emailCliente").style.display = "none";

        document.getElementById("btnProximo").style.display = "none";

        $('#cepCliente').focus();
    }
};

cliente.alterarEditCliente = function () {
    var display = $('#nomeClienteLabelEdit').css('display');

    if (display == "none") {
        document.getElementById("nomeClienteLabelEdit").style.display = "block";
        document.getElementById("nomeClienteEdit").style.display = "block";

        document.getElementById("telefoneClienteLabelEdit").style.display = "block";
        document.getElementById("telefoneClienteEdit").style.display = "block";

        document.getElementById("celularClienteLabelEdit").style.display = "block";
        document.getElementById("celularClienteEdit").style.display = "block";

        document.getElementById("emailClienteLabelEdit").style.display = "block";
        document.getElementById("emailClienteEdit").style.display = "block";

        document.getElementById("statusSWCliente").style.display = "block";
        document.getElementById("switchCliente").style.display = "block";

        document.getElementById("btnProximoEdit").style.display = "block";

        document.getElementById("cepClienteLabelEdit").style.display = "none";
        document.getElementById("cepClienteEdit").style.display = "none";
        
        document.getElementById("msgCepNaoEncontradoEdit").style.display = "none";

        document.getElementById("estadoClienteLabelEdit").style.display = "none";
        document.getElementById("estadoClienteEdit").style.display = "none";

        document.getElementById("cidadeClienteLabelEdit").style.display = "none";
        document.getElementById("cidadeClienteEdit").style.display = "none";

        document.getElementById("bairroClienteLabelEdit").style.display = "none";
        document.getElementById("bairroClienteEdit").style.display = "none";

        document.getElementById("ruaClienteLabelEdit").style.display = "none";
        document.getElementById("ruaClienteEdit").style.display = "none";

        document.getElementById("numeroClienteLabelEdit").style.display = "none";
        document.getElementById("numeroClienteEdit").style.display = "none";

        document.getElementById("complementoClienteLabelEdit").style.display = "none";
        document.getElementById("complementoClienteEdit").style.display = "none";

        document.getElementById("btnVoltarEdit").style.display = "none";
        document.getElementById("btnSalvarEdit").style.display = "none";

    } else if ((display == "block") && ($('#nomeClienteEdit').val() != "")) {
        document.getElementById("cepClienteLabelEdit").style.display = "block";
        document.getElementById("cepClienteEdit").style.display = "block";        

        document.getElementById("estadoClienteLabelEdit").style.display = "block";
        document.getElementById("estadoClienteEdit").style.display = "block";

        document.getElementById("cidadeClienteLabelEdit").style.display = "block";
        document.getElementById("cidadeClienteEdit").style.display = "block";

        document.getElementById("bairroClienteLabelEdit").style.display = "block";
        document.getElementById("bairroClienteEdit").style.display = "block";

        document.getElementById("ruaClienteLabelEdit").style.display = "block";
        document.getElementById("ruaClienteEdit").style.display = "block";

        document.getElementById("numeroClienteLabelEdit").style.display = "block";
        document.getElementById("numeroClienteEdit").style.display = "block";

        document.getElementById("complementoClienteLabelEdit").style.display = "block";
        document.getElementById("complementoClienteEdit").style.display = "block";

        document.getElementById("btnVoltarEdit").style.display = "block";
        document.getElementById("btnSalvarEdit").style.display = "block";

        document.getElementById("nomeClienteLabelEdit").style.display = "none";
        document.getElementById("nomeClienteEdit").style.display = "none";

        document.getElementById("telefoneClienteLabelEdit").style.display = "none";
        document.getElementById("telefoneClienteEdit").style.display = "none";

        document.getElementById("celularClienteLabelEdit").style.display = "none";
        document.getElementById("celularClienteEdit").style.display = "none";

        document.getElementById("emailClienteLabelEdit").style.display = "none";
        document.getElementById("emailClienteEdit").style.display = "none";

        document.getElementById("statusSWCliente").style.display = "none";
        document.getElementById("switchCliente").style.display = "none";

        document.getElementById("btnProximoEdit").style.display = "none";
    }
};