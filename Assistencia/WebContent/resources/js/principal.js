assistencia = new Object();

$(document).ready(function () {
    alteraConteudo('home');

    if ($(".label").html() == "Cliente") {
        document.getElementById("mNovaOS").innerHTML = "";
        document.getElementById("mOSAberto").innerHTML = "";
        document.getElementById("mProdutos").innerHTML = "";
        document.getElementById("mServicos").innerHTML = "";
        document.getElementById("mConsultaOS").innerHTML = "";
        document.getElementById("mFuncionarios").innerHTML = "";
    }
});

function closeall() {
    for (i = 0; i < all.childElementCount; i++) {
        all.children[i].style.display = "none";
    }
}

function alteraConteudo(c) {
    len = menu.childElementCount;
    closeall();
    switch(c){
        case "servicos":
            servico.buscar();
            break;
        case "funcionarios":
            funcionario.buscar();
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
    } else if (display == "block"){
        $("#fundoMenu").fadeOut();
        fechaMenu();
    }
}
function abreMenu(){
    setTimeout(function () {
        console.log("entrou");
        $("#menu").removeClass("gn-open-part");
        $("#menu").addClass("gn-open-all");
    },1);
}

function fechaMenu(){
    setTimeout(function () {       
        document.getElementById("fundoMenu").style.display = "none";
        $("#menu").removeClass("gn-open-all");
        $("#menu").addClass("gn-open-part");
        $("#btnMenu").removeClass("gn-selected");
    },1);
}

