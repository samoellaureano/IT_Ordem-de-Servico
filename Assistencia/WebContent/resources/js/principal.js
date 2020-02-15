assistencia = new Object();
assistencia.dadosPerfil = new Object();

$(document).ready(function () {

    alteraConteudo('home');

    assistencia.buscarDadosSessao();
    setTimeout(function () {
        document.getElementById("loading").style.display = "none";
        document.getElementById("loader").style.display = 'none';
    }, 500);


});

function closeall() {
    for (i = 0; i < all.childElementCount; i++) {
        all.children[i].style.display = "none";
    }
}

function alteraConteudo(c) {
    len = menu.childElementCount;
    closeall();
    switch (c) {
        case "servicos":
            servico.buscar();
            break;
        case "funcionarios":
            funcionario.buscar();
            break;
        case "produtos":
            produto.buscar();
            break;
        case "consultaOS":
            consultaOrdem.buscar();
            break;
        case "osAberto":
            osAberto.buscar();
            document.getElementById("containerSecOsAberto").style.display = "block";
            document.getElementById("containerSecOsSelecionada").style.display = "none";
            break;
        default:
            break;
    }
    all.children[c].style.display = "block";
    fechaMenu();
}



assistencia.search = function () {
    if ($("#ordemServico").val() != "") {
        alert($("#ordemServico").val());
        document.getElementById("ordemServico").value = "";
    } else {
        return false;
    }

}

function alteraLabel() {//Altera a label do tipo de perfil que aparene abaixo do nome
    var cliente = "Cliente";
    //alteraLabel(Cliente);
    document.getElementById("perfil").innerHTML = cliente;
}

function fundoMenu() {
    //Recebe o atributo do elemento
    var display = $('#fundoMenu').css('display');
    if (display == "none") {
        $("#fundoMenu").fadeIn();
        abreMenu()
    } else if (display == "block") {
        $("#fundoMenu").fadeOut();
        fechaMenu();
    }
}
function abreMenu() {
    setTimeout(function () {
        $("#menu").removeClass("gn-open-part");
        $("#menu").addClass("gn-open-all");
    }, 1);
}

function fechaMenu() {
    setTimeout(function () {
        document.getElementById("fundoMenu").style.display = "none";
        $("#menu").removeClass("gn-open-all");
        $("#menu").addClass("gn-open-part");
        $("#btnMenu").removeClass("gn-selected");
    }, 1);
}

exibirMessagem = function (msg, tipo) {
    var msgDiv = $("#msg");

    switch (tipo) {
        case 1:
            $("#msg").css("background-color", "#008040");
            tipo = "<span class='glyphicon glyphicon-ok msg-icon'></span>";
            break;
        case 2:
            $("#msg").css("background-color", "#b4004e");
            tipo = "<span class='glyphicon glyphicon-remove msg-icon'></span>";
            break;
        default:
            tipo = "";
            break;
    }

    msgDiv.html(tipo + msg);

    $('#msg').slideDown(500, function () {
    }).fadeIn({
        duration: 500,
        queue: true
    });
    
    setTimeout(function () {
        $('#msg').slideUp(500, function () {
        }).fadeOut({
            duration: 500,
            queue: false
        });
    }, 2000);
    
}

function removeMask(string) {
    var numsStr = string.replace(/[^0-9]/g, '');
    return parseInt(numsStr);
}



assistencia.buscarDadosSessao = function () {
    $.ajax({
        type: "POST",
        url: "../buscarDadosSessao",
        dataType: "JSON",
        success: function (sessao) {
            switch (sessao.perfil) {
                case '0':
                    sessao.perfil = "Administrador";
                    break;
                case '1':
                    sessao.perfil = "Técnico";
                    break;
                default:
                    sessao.perfil = "Cliente";
            }
            if (sessao.perfil == "Cliente") {
                document.getElementById("mOrdemServico").innerHTML = "";
                document.getElementById("mOSAberto").innerHTML = "";
                document.getElementById("mProdutos").innerHTML = "";
                document.getElementById("mServicos").innerHTML = "";
                document.getElementById("mConsultaOS").innerHTML = "";
                document.getElementById("mFuncionarios").innerHTML = "";
            }
            $("#perfil").html("<label style='font-size: 13px;' class='label'>" + sessao.perfil + "</label>");

            $("#nomeLogin").html(sessao.nome);
            if (sessao.idFuncionario != undefined) {
                $("#idLogado").val(sessao.idFuncionario);
            } else {
                $("#idLogado").val(sessao.idCliente);
            }


            assistencia.dadosPerfil = sessao;
        },
        error: function () {
        }
    });
};
