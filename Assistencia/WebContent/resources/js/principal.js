assistencia = new Object();

$(document).ready(function () {
    alteraConteudo('novaOS');

    if ($(".label").html() == "Cliente") {
        document.getElementById("mNovaOS").innerHTML = "";
        document.getElementById("mOSAberto").innerHTML = "";
        document.getElementById("mProdutos").innerHTML = "";
        document.getElementById("mServicos").innerHTML = "";
        document.getElementById("mConsultaOS").innerHTML = "";
        document.getElementById("mUsuarios").innerHTML = "";
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
    if(c == "servicos"){
        servico.buscar()
    }
    all.children[c].style.display = "block";
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

function fundoMenu(origem) {
    //Recebe o atributo do elemento
    var display = $('#fundoMenu').css('display');
    if (display == "none" && origem == "") {
        $("#fundoMenu").fadeIn();
    } else {
        $("#fundoMenu").fadeOut();
    }
}