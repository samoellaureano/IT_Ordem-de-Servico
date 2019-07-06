servico = new Object();

function cadastrar(){
    servico.cadastrar = new Object();
    servico.cadastrar.desc = $("#descServ").val();
    servico.cadastrar.valor = $("#valorServ").val();

    $.ajax({
        type: "POST",
        url: "CadastraServico",
        data: JSON.stringify(servico.cadastrar),
        success: function (msg){
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
            $("#msg").html(msg.msg);
            $("#msg").dialog(cfg);
            
            SENAI.equipamento.exibir(undefined, "");
        },
        error: function (rest){
            alert("Erro ao cadastrar um novo serviço");
        }
    });

    console.log(servico.cadastrar.desc);
    console.log(servico.cadastrar.valor);
}

function editar(){
    servico.editar = new Object();
    servico.editar.desc = $("#editDescServ").val();
    servico.editar.valor = $("#editValorServ").val();

    console.log(servico.editar.desc);
    console.log(servico.editar.valor);
}