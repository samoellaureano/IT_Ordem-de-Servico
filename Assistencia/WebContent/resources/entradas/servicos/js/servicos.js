servico = new Object();

function cadastrar(){
    servico.cadastrar = new Object();
    servico.cadastrar.desc = $("#descServ").val();
    servico.cadastrar.valor = $("#valorServ").val();
    servico.cadastrar.status = $("#status").val();
    servico.cadastrar.valor = servico.cadastrar.valor.replace(",", ".");

    var cfg = {
        url: "../../../rest/servicoRest/addServico",
        data: JSON.stringify(servico.cadastrar),
        success: function (succJson){
            var cfg = {
                    title: "Mensagem",
                    height: 250,
                    width: 400,
                    modal: true,
                    buttons: {
                        "Ok": function(){
                            $(this).dialog("close");
                        }
                    }							
            };
            $("#msg").html(succJson.msg);
            $("#msg").dialog(cfg);
        },
        error: function (errJson){
            alert("Erro ao cadastrar um novo serviço");
        }
    };
    IT.ajax.post(cfg);

    console.log(servico.cadastrar.desc);
    console.log(servico.cadastrar.valor);
    console.log(servico.cadastrar.status);
}

function editar(){
    servico.editar = new Object();
    servico.editar.desc = $("#editDescServ").val();
    servico.editar.valor = $("#editValorServ").val();

    console.log(servico.editar.desc);
    console.log(servico.editar.valor);
}

function alteraAtivo(){
    valor = $("#status").val();
    if(valor == 'true'){
        $("#status").attr('value', 'false');
    }
    if(valor == 'false'){
        $("#status").attr('value', 'true');
    }
}