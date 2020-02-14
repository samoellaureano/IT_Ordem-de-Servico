osAberto = new Object();

$(document).ready(function () {
    $("#div-editOrdemServico").load("admin/osAberto/modal-editOrdemServico.html");
});

osAberto.buscar = function () {
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

osAberto.exibirOsAbertos = function (listaDeOsAbertos) {
    osAberto.html = "";

    if (listaDeOsAbertos != undefined) {
        if (listaDeOsAbertos.length > 0) {
            for (var i = 0; i < listaDeOsAbertos.length; i++) {

                osAberto.html += "<div class='card mt-2' style='border: none;'>";
                osAberto.html += "<div class='card-body row' style='background-color: #28a745; border-radius: 10px;'>";
                osAberto.html += "<div class='col-3'>";
                osAberto.html += "<h6 class='card-title'><i id='numeroOs'>Ordem de Serviço</i></h6>";
                osAberto.html += "<h4 style='font-size: 2.5rem;'>"+listaDeOsAbertos[i].idOrdem_servico+"</h4>";
                osAberto.html += "<div>";
                osAberto.html += "<a href='#' class='btn btn-primary mt-4' style='border-radius: 0.9rem;'>"+listaDeOsAbertos[i].status.descricao+"</a>";
                osAberto.html += "</div>";
                osAberto.html += "</div>";
                osAberto.html += "<div class='col-5'>";
                osAberto.html += "<h5 style='margin-bottom: 0.0rem;'>"+listaDeOsAbertos[i].cliente.nome+"</h5>";
                osAberto.html += "<label style='font-size: small;'>Cliente</label>";
                osAberto.html += "<h5 style='margin-top: 1rem;'>Data Abertura</h5>";
                osAberto.html += "<label>"+listaDeOsAbertos[i].data_abertura+"</label>";
                osAberto.html += "</div>";
                osAberto.html += "<div class='col-4 mt-5' style='display: flex; line-height: 82px;justify-content: flex-end;'>";
                osAberto.html += "<h5 class='card-text' style='position: absolute;'>João Silva</h5>";
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


