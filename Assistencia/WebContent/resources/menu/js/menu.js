assistencia = new Object();

$(document).ready(function(){
    document.getElementById("fundoMenu").style.display = 'none';

    if($(".label").html() == "Cliente"){
        document.getElementById("novaOS").innerHTML = "";
        document.getElementById("OSAberto").innerHTML = "";
        document.getElementById("produtos").innerHTML = "";
        document.getElementById("servicos").innerHTML = "";
        document.getElementById("consulta").innerHTML = "";
        document.getElementById("users").innerHTML = "";
    }
});

assistencia.search = function(){
    if($("#ordemServico").val() != ""){
        alert($("#ordemServico").val());
        document.getElementById("ordemServico").value = "";
    }else{
        return false;
    }
    
}

function alteraLabel() {//Altera a label do tipo de perfil que aparene abaixo do nome
    var cliente = "Cliente";
    //alteraLabel(Cliente);
    document.getElementById("perfil").innerHTML = cliente;
}

function fundoMenu(origem){
    //Recebe o atributo do elemento
    var display = $('#fundoMenu').css('display');
    if (display == "none" && origem == ""){        
        document.getElementById("fundoMenu").style.display = 'block';
    }else{
        document.getElementById("fundoMenu").style.display = 'none';
    }    
}

function fundoMenuTopo(){
    //Recebe o atributo do elemento
    var display = $('#fundoMenu').css('display');
    if (display == "block"){
        document.getElementById("fundoMenu").style.display = 'none';
    }   
}
