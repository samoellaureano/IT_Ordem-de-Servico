assistencia = new Object();

$(document).ready(function () {
    alteraConteudo('novaOS');
    if ($(".label").html() == "Cliente") {
        document.getElementById("novaOS").innerHTML = "";
        document.getElementById("OSAberto").innerHTML = "";
        document.getElementById("produtos").innerHTML = "";
        document.getElementById("servicos").innerHTML = "";
        document.getElementById("consulta").innerHTML = "";
        document.getElementById("users").innerHTML = "";
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