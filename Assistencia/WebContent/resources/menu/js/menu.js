assistencia = new Object();

assistencia.search = function(){
    var ordemServico = $("#ordemServico").val();
    if(ordemServico != ""){
        alert(ordemServico);
        var Cliente = "Cliente";
        alteraLabel(Cliente);
    }else{
        return false;
    }
    
}

function alteraLabel(texto) {
    document.getElementById("perfil").innerHTML =texto;
  }