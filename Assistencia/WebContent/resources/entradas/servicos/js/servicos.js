servico = new Object();

$(document).ready(function () {    
    $("#modal-cad").load("entradas/servicos/modal-cad.html");
    $("#modal-edit").load("entradas/servicos/modal-edit.html");
    servico.buscar();
});

servico.cadastrar = function () {
    servico.cad = new Object();
    servico.cad.desc = $("#descServ").val();
    servico.cad.valor = $("#valorServ").val();
    servico.cad.status = $("#status").val();
    servico.cad.valor = servico.cad.valor.replace(/\./g, "");
    servico.cad.valor = servico.cad.valor.replace(",", ".");
    var resp = "";

    var cfg = {
        url: "../rest/servicoRest/addServico",
        data: JSON.stringify(servico.cad),
        success: function (succJson) {
            var cfg = {
                title: "Mensagem",
                height: 200,
                width: 400,
                modal: true,
                buttons: {
                    "Ok": function () {
                        
                        $(this).dialog("close");
                    }
                }
            };
            if (succJson) {
                resp = ("Serviço cadastrado com sucesso!");
                $("#mod-cad").modal("hide");
                $('.modal-backdrop').remove();
            } else {
                resp = ("Erro ao cadastrar um novo serviço!");
            }
            $("#msg").html(resp);
            $("#msg").dialog(cfg);
            $("#descServ").val("");
            $("#valorServ").val("");
            servico.buscar();
        },
        error: function (errJson) {
            alert("Erro ao cadastrar um novo serviço!");
        }
    };
    IT.ajax.post(cfg);
};

servico.buscar = function () {
    var valorBusca = $("#consultarServico").val();
		if(valorBusca == ""){
			valorBusca = null;
		}

    var cfg = {
        type: "POST",
        url: "../rest/servicoRest/buscarServicos/"+valorBusca,
        success: function (listaDeServicos) {
            servico.exibirServicos(listaDeServicos);
        },
        error: function (err) {
            alert("Erro ao buscar Servicos: " + err.responseText);
        }
    };
    IT.ajax.post(cfg);
};

servico.exibirServicos = function (listaDeServicos) {
    var html="";
    var status = "";
    if (listaDeServicos != undefined) {
        if (listaDeServicos.length > 0) {
            for (var i = 0; i < listaDeServicos.length; i++) {
                if(listaDeServicos[i].status){
                    status = "Ativo";
                }else{
                    status = "Inativo";
                }
                html += "<tr><td>" + listaDeServicos[i].id + "</td>" +
                    "<td>" + listaDeServicos[i].desc + "</td>" +
                    "<td>" + "R$ "+ listaDeServicos[i].valor + "</td>" +
                    "<td>" + status + "</td>" +
                    "<td data-toggle='modal' style='text-align-last: center;' onclick='servico.buscarServicoPorID("+listaDeServicos[i].id+")'><button class='btn btn-outline-light btnEdit' type='button'><i class='fas fa-pencil-alt tabelaEdit'></i></button></td>";
            }
        } else {
            html += "<tr><td colspan='3' style='text-align: center; padding-left: 14rem;'>Nenhum registro encontrado</td></tr>";
        }
        $("#resultadoservicos").html(html);
    }
};


servico.buscarServicoPorID = function (id) {
    var cfg = {
        type:"POST",
        url: "../rest/servicoRest/buscarServicoPeloId/" + id,
        success: function(servico){
            $("#editDescServ").val(servico.desc);
            $("#editValorServ").val(servico.valor);
            $("#editId").val(servico.id);
            $("#switch").html("<label class='switch'><input type='checkbox' name='editStatus' id='editStatus' value='true' onclick='alteraAtivoEdit()'><span class='slider round'></span></label>");
            if(servico.status){
                $("#editStatus").attr('checked','true');
                $("#editStatus").attr('value', 'true');
            }else{
                $("#editStatus").removeAttr("checked");
                $("#editStatus").attr('value', 'false');
            }
        },
        error: function(err){
            alert("Erro ao editar o servico!" + err.responseText);
        }
    };
    IT.ajax.post(cfg);
    ativarModalEdit();
};

servico.editarServico = function (){
    servico.editar = new Object();
    servico.editar.desc = $("#editDescServ").val();
    servico.editar.valor = $("#editValorServ").val();
    servico.editar.status = $("#editStatus").val();
    servico.editar.id = $("#editId").val();
    servico.editar.valor = servico.editar.valor.replace(/\./g, "");
    servico.editar.valor = servico.editar.valor.replace(",", ".");
    var resp = "";

    var cfg={
        url:"../rest/servicoRest/editarServico",
        data:servico.editar,
        success:function(data){
            var cfg = {
                    title: "Mensagem",
                    height: 200,
                    width: 400,
                    modal: true,
                    buttons: {
                        "OK":function(){
                            
                            $(this).dialog("close");
                        }
                    }
            };            
            if (data) {
                resp = ("Serviço editado com sucesso!");
                $('.modal-backdrop').remove();
                $("#mod-edit").modal("hide");
            } else {
                resp = ("Erro ao editar o serviço!");
            }

            $("#msg").html(resp);
            $("#msg").dialog(cfg);
            servico.buscar();
            
        },
        error:function(err){
            alert("Erro ao editar o serviço!");
            
        }
    };
    IT.ajax.post(cfg);
};

function alteraAtivoEdit() {
    valor = $("#editStatus").val();
    if (valor == 'true') {
        $("#editStatus").attr('value', 'false');
    }
    if (valor == 'false') {
        $("#editStatus").attr('value', 'true');
    }
};

function ativarModalCad() {
    $("#mod-cad").modal("show");
};

function ativarModalEdit() {
    $("#mod-edit").addClass("in");
    $("#mod-edit").modal("show");
};