equipamento = new Object();

equipamento.cadastrar = function () {
    equipamentoCad = new Object();
    tipo = new Object();
    marca = new Object();
    var retorno = "";

    equipamentoCad.modelo = $("#modeloEquip").val();
    equipamentoCad.acessorio = $("#acessorioEquip").val();
    tipo.idTipo = $("#idTipoEquip").val();
    marca.idMarca = $("#idMarcaEquip").val();

    if (equipamentoCad.modelo == "") {
        retorno += ("O campo 'Modelo' deve ser preenchido!\n");
    }
    if (equipamentoCad.acessorio == "") {
        retorno += ("O campo 'Acessório' deve ser preenchido!\n");
    }
    if (tipo.idTipo == "") {
        retorno += ("O campo 'Tipo' deve ser preenchido!\n");
    }
    if (marca.idMarca == "") {
        retorno += ("O campo 'Marca' deve ser preenchido!\n");
    }

    equipamentoCad.tipo = tipo;
    equipamentoCad.marca = marca;

    if (retorno == "") {
        var cfg = {
            url: "../rest/classRest/addEquipamento",
            data: JSON.stringify(equipamentoCad),
            success: function (succJson) {
                if (succJson == 1) {
                    resp = ("Equipamento cadastrado com sucesso!");
                    exibirMessagem(resp, 1);
                }else{
                    resp = ("Erro ao cadastrar um novo equipamento!");
                    exibirMessagem(resp, 2);
                }

                $("#modal-cadProd").modal("hide");
                $('.modal-backdrop').remove();
            },
            error: function (errJson) {
                resp = ("Erro ao cadastrar um novo produto!");
                exibirMessagem(resp, 2);
            }
        };
        IT.ajax.post(cfg);
    }else{
        alert(retorno);
    }
};

equipamento.buscarMarcasEquip = function () {
    var valorBusca = $("#marcaEquip").val();

    if (valorBusca != "") {
        if (valorBusca.trim()) {
            var cfg = {
                type: "POST",
                url: "../rest/classRest/buscarMarcas/" + valorBusca,
                success: function (listaDeMarcas) {
                    equipamento.exibirMarcasEquip(listaDeMarcas);
                },
                error: function (err) {
                    alert("Erro ao buscar as marcas: " + err.responseText);
                }
            };
            IT.ajax.post(cfg);
        }
    } else {
        $("#listaDeMarcasEquip").html("");
        document.getElementById("divBtnCadMarcaEquip").style.display = "block";
        document.getElementById("divBtnEditMarcaEquip").style.display = "none";
        document.getElementById("limparInputMarcaEquip").style.display = "none";
    }
};

equipamento.buscarTipos = function () {
    var valorBusca = $("#tipoEquip").val();

    if (valorBusca != "") {
        if (valorBusca.trim()) {
            var cfg = {
                type: "POST",
                url: "../rest/classRest/buscarTipos/" + valorBusca,
                success: function (listaDeTipos) {
                    equipamento.exibirTipos(listaDeTipos);
                },
                error: function (err) {
                    alert("Erro ao buscar os tipos: " + err.responseText);
                }
            };
            IT.ajax.post(cfg);
        }
    } else {
        $("#listaDeTipos").html("");
        document.getElementById("divBtnCadTipo").style.display = "block";
        document.getElementById("divBtnEditTipo").style.display = "none";
        document.getElementById("limparInputTipo").style.display = "none";
    }
};

equipamento.exibirMarcasEquip = function (listaDeMarcas) {
    equipamento.html = "<ul class='listaDeMarcasEquip'>\n";

    if (listaDeMarcas != undefined) {
        if (listaDeMarcas.length > 0) {
            for (var i = 0; i < listaDeMarcas.length; i++) {
                equipamento.html += ("<li onclick='equipamento.selectMarcaEquip(`" + listaDeMarcas[i].nome + "`,`" + listaDeMarcas[i].idMarca + "`)'>" + listaDeMarcas[i].nome + "</li>");
            }
        } else {
            equipamento.html += "<li style='text-align: center'>Nenhum registro encontrado</li>";
            document.getElementById("limparInputMarcaEquip").style.display = "block";
        }
        $("#listaDeMarcasEquip").html(equipamento.html + "\n</ul>");
    }
};

equipamento.exibirTipos = function (listaDeTipos) {
    equipamento.html = "<ul class='listaDeTipos'>\n";

    if (listaDeTipos != undefined) {
        if (listaDeTipos.length > 0) {
            for (var i = 0; i < listaDeTipos.length; i++) {
                equipamento.html += ("<li onclick='equipamento.selectTipo(`" + listaDeTipos[i].nome + "`,`" + listaDeTipos[i].idTipo + "`)'>" + listaDeTipos[i].nome + "</li>");
            }
        } else {
            equipamento.html += "<li style='text-align: center'>Nenhum registro encontrado</li>";
            document.getElementById("limparInputTipo").style.display = "block";
        }
        $("#listaDeTipos").html(equipamento.html + "\n</ul>");
    }
};

equipamento.removeMarcaEquip = function () {
    $("#listaDeMarcasEquip").html("");

    document.getElementById("divBtnCadMarcaEquip").style.display = "block";
    document.getElementById("divBtnEditMarcaEquip").style.display = "none";
    document.getElementById("limparInputMarcaEquip").style.display = "none";

    $("#marcaEquip").val("");
    $('#marcaEquip').focus();
};

equipamento.removeTipo = function () {
    $("#listaDeTipos").html("");

    document.getElementById("divBtnCadTipo").style.display = "block";
    document.getElementById("divBtnEditTipo").style.display = "none";
    document.getElementById("limparInputTipo").style.display = "none";

    $("#tipoEquip").val("");
    $('#tipoEquip').focus();
};

equipamento.selectMarcaEquip = function (selectMarca, selectIdMarca) {
    $("#idMarcaEquip").val(selectIdMarca);

    $("#marcaEquip").val(selectMarca);

    $("#listaDeMarcasEquip").html("");

    document.getElementById("divBtnCadMarcaEquip").style.display = "none";
    document.getElementById("divBtnEditMarcaEquip").style.display = "block";
    document.getElementById("limparInputMarcaEquip").style.display = "block";
}

equipamento.selectTipo = function (selectTipo, selectIdTipo) {
    $("#idTipoEquip").val(selectIdTipo);

    $("#tipoEquip").val(selectTipo);

    $("#listaDeTipos").html("");

    document.getElementById("divBtnCadTipo").style.display = "none";
    document.getElementById("divBtnEditTipo").style.display = "block";
    document.getElementById("limparInputTipo").style.display = "block";
}
