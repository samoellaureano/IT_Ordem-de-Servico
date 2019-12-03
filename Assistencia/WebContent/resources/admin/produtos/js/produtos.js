produto = new Object();

produto.dados = [];
produto.tamanhoPagina = 5;
produto.pagina = 0;
produto.html = "";

$(document).ready(function () {
    $("#div-cadProd").load("admin/produtos/modal-cad.html");
    $("#div-editProd").load("admin/produtos/modal-edit.html");

    $('#proximoProd').click(function () {
        if (produto.pagina < produto.dados.length / produto.tamanhoPagina - 1) {
            produto.pagina++;
            produto.paginar();
            produto.ajustarBotoes();
        }
    });
    $('#anteriorProd').click(function () {
        if (produto.pagina > 0) {
            produto.pagina--;
            produto.paginar();
            produto.ajustarBotoes();
        }
    });

});

produto.cadastrar = function () {
    produtoCad = new Object();
    categoria = new Object();
    subCategoria = new Object();
    marca = new Object();
    var retorno = "";

    produtoCad.nome = $("#descProd").val();
    produtoCad.valor = $("#valorProd").val();
    produtoCad.valor = produtoCad.valor.replace(/\./g, "");
    produtoCad.valor = produtoCad.valor.replace(",", ".");
    produtoCad.quantidade = $("#quantidadeProd").val();
    categoria.idCategoria = $("#idCategoriaProd").val();
    subCategoria.idSubcategoria = $("#idSubCategoriaProd").val();
    marca.idMarca = $("#idMarcaProd").val();

    if (produtoCad.nome == "") {
        retorno += ("O campo 'Descrição' deve ser preenchido!\n");
    }
    if (produtoCad.valor == "") {
        retorno += ("O campo 'Valor' deve ser preenchido!\n");
    }
    if (produtoCad.quantidade == "") {
        retorno += ("O campo 'Quantidade' deve ser preenchido!\n");
    }
    if (categoria.idCategoria == "") {
        retorno += ("O campo 'Categoria' deve ser preenchido!\n");
    }
    if (subCategoria.idSubcategoria == "") {
        retorno += ("O campo 'Sub-Categoria' deve ser preenchido!\n");
    }
    if (marca.idMarca == "") {
        retorno += ("O campo 'Marca' deve ser preenchido!\n");
    }

    produtoCad.categoria = categoria;
    produtoCad.subCategoria = subCategoria;
    produtoCad.marca = marca;

    if (retorno == "") {
        var cfg = {
            url: "../rest/classRest/addProduto",
            data: JSON.stringify(produtoCad),
            success: function (succJson) {
                if (succJson == 1) {
                    resp = ("Produto cadastrado com sucesso!");
                    produto.buscar();
                    exibirMessagem(resp, 1);
                } else if(succJson == 2){
                    resp = ("O Produto ja existe!");
                    exibirMessagem(resp, 2);
                }else{
                    resp = ("Erro ao cadastrar um novo produto!");
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

produto.buscar = function () {
    produto.pagina = 0;
    var valorBusca = $("#consultarProdutos").val();
    if (valorBusca == "") {
        valorBusca = null;
    }

    var cfg = {
        type: "POST",
        url: "../rest/classRest/buscarProdutos/" + valorBusca,
        success: function (listaDeProdutos) {
            produto.exibirProdutos(listaDeProdutos);
        },
        error: function (err) {
            alert("Erro ao buscar Produtos: " + err.responseText);
        }
    };
    IT.ajax.post(cfg);
};

produto.buscarCategorias = function () {
    var valorBusca = $("#categoriaProd").val();
    if (valorBusca != "") {
        if (valorBusca.trim()) {
            var cfg = {
                type: "POST",
                url: "../rest/classRest/buscarCategorias/" + valorBusca,
                success: function (listaDeCategorias) {
                    produto.exibirCategorias(listaDeCategorias);
                },
                error: function (err) {
                    alert("Erro ao buscar as categorias: " + err.responseText);
                }
            };
            IT.ajax.post(cfg);
        }
    } else {
        $("#listaDeCategorias").html("");
        document.getElementById("divBtnCadCategoria").style.display = "block";
        document.getElementById("divBtnEditCategoria").style.display = "none";
        document.getElementById("limparInputCategoria").style.display = "none";
    }
};

produto.buscarSubCategorias = function () {
    var idCategoria = $("#idCategoriaProd").val();
    var valorBusca = $("#subCategoriaProd").val();

    if (valorBusca != "") {
        if (valorBusca.trim()) {
            SubCategoria = new Object();
            SubCategoria.nome = valorBusca;
            SubCategoria.categorias_idCategoria = idCategoria;   
        
            var cfg = {
                url: "../rest/classRest/buscarSubCategorias/",
                data: JSON.stringify(SubCategoria),                
                success: function (listaDeSubCategorias) {
                    produto.exibirSubCategorias(listaDeSubCategorias);
                },
                error: function (err) {
                    alert("Erro ao buscar as sub-categorias: " + err.responseText);
                }
            };
            IT.ajax.post(cfg);
        }
    } else {
        $("#listaDeSubCategorias").html("");
        document.getElementById("divBtnCadSubCategoria").style.display = "block";
        document.getElementById("divBtnEditSubCategoria").style.display = "none";
        document.getElementById("limparInputSubCategoria").style.display = "none";
    }
};

produto.buscarMarcas = function () {
    var valorBusca = $("#marcaProd").val();
    if (valorBusca != "") {
        if (valorBusca.trim()) {
            var cfg = {
                type: "POST",
                url: "../rest/classRest/buscarMarcas/" + valorBusca,
                success: function (listaDeMarcas) {
                    produto.exibirMarcas(listaDeMarcas);
                },
                error: function (err) {
                    alert("Erro ao buscar as marcas: " + err.responseText);
                }
            };
            IT.ajax.post(cfg);
        }
    } else {
        $("#listaDeMarcas").html("");
        document.getElementById("divBtnCadMarca").style.display = "block";
        document.getElementById("divBtnEditMarca").style.display = "none";
        document.getElementById("limparInputMarca").style.display = "none";
    }
};

produto.exibirCategorias = function (listaDeCategorias) {
    produto.html = "<ul class='listaDeCategorias'>\n";

    if (listaDeCategorias != undefined) {
        if (listaDeCategorias.length > 0) {
            for (var i = 0; i < listaDeCategorias.length; i++) {
                produto.html += ("<li onclick='produto.selectCategoria(`" + listaDeCategorias[i].nome + "`,`" + listaDeCategorias[i].idCategoria + "`)'>" + listaDeCategorias[i].nome + "</li>");
            }
        } else {
            produto.html += "<li style='text-align: center'>Nenhum registro encontrado</li>";
            document.getElementById("limparInputCategoria").style.display = "block";
        }
        $("#listaDeCategorias").html(produto.html + "\n</ul>");
    }
};

produto.exibirSubCategorias = function (listaDeSubCategorias) {
    produto.html = "<ul class='listaDeSubCategorias'>\n";

    if (listaDeSubCategorias != undefined) {
        if (listaDeSubCategorias.length > 0) {
            for (var i = 0; i < listaDeSubCategorias.length; i++) {
                produto.html += ("<li onclick='produto.selectSubCategoria(`" + listaDeSubCategorias[i].nome + "`,`" + listaDeSubCategorias[i].idSubcategoria + "`)'>" + listaDeSubCategorias[i].nome + "</li>");
            }
        } else {
            produto.html += "<li style='text-align: center'>Nenhum registro encontrado</li>";
            document.getElementById("limparInputSubCategoria").style.display = "block";
        }
        $("#listaDeSubCategorias").html(produto.html + "\n</ul>");
    }
};

produto.exibirMarcas = function (listaDeMarcas) {
    produto.html = "<ul class='listaDeMarcas'>\n";

    if (listaDeMarcas != undefined) {
        if (listaDeMarcas.length > 0) {
            for (var i = 0; i < listaDeMarcas.length; i++) {
                produto.html += ("<li onclick='produto.selectMarca(`" + listaDeMarcas[i].nome + "`,`" + listaDeMarcas[i].idMarca + "`)'>" + listaDeMarcas[i].nome + "</li>");
            }
        } else {
            produto.html += "<li style='text-align: center'>Nenhum registro encontrado</li>";
            document.getElementById("limparInputMarca").style.display = "block";
        }
        $("#listaDeMarcas").html(produto.html + "\n</ul>");
    }
};

produto.removeCategoria = function () {
    $("#listaDeCategorias").html("");
    document.getElementById("divBtnCadCategoria").style.display = "block";
    document.getElementById("divBtnEditCategoria").style.display = "none";
    document.getElementById("limparInputCategoria").style.display = "none";
    $("#categoriaProd").val("");
    $('#categoriaProd').focus();
}

produto.removeSubCategoria = function () {
    $("#listaDeSubCategorias").html("");
    document.getElementById("divBtnCadSubCategoria").style.display = "block";
    document.getElementById("divBtnEditSubCategoria").style.display = "none";
    document.getElementById("limparInputSubCategoria").style.display = "none";
    $("#subCategoriaProd").val("");
    $('#subCategoriaProd').focus();
}

produto.removeMarca = function () {
    $("#listaDeMarcas").html("");
    document.getElementById("divBtnCadMarca").style.display = "block";
    document.getElementById("divBtnEditMarca").style.display = "none";
    document.getElementById("limparInputMarca").style.display = "none";
    $("#marcaProd").val("");
    $('#marcaProd').focus();
}

produto.selectCategoria = function (selectCat, selectIdCat) {
    $("#idCategoriaProd").val(selectIdCat);
    $("#categoriaProd").val(selectCat);
    $("#listaDeCategorias").html("");
    document.getElementById("divBtnCadCategoria").style.display = "none";
    document.getElementById("divBtnEditCategoria").style.display = "block";
    document.getElementById("limparInputCategoria").style.display = "block";
}

produto.selectSubCategoria = function (selectSubCat, selectIdSubCat) {
    $("#idSubCategoriaProd").val(selectIdSubCat);
    $("#subCategoriaProd").val(selectSubCat);
    $("#listaDeSubCategorias").html("");
    document.getElementById("divBtnCadSubCategoria").style.display = "none";
    document.getElementById("divBtnEditSubCategoria").style.display = "block";
    document.getElementById("limparInputSubCategoria").style.display = "block";
}

produto.selectMarca = function (selectMarca, selectIdMarca) {
    $("#idMarcaProd").val(selectIdMarca);
    $("#marcaProd").val(selectMarca);
    $("#listaDeMarcas").html("");
    document.getElementById("divBtnCadMarca").style.display = "none";
    document.getElementById("divBtnEditMarca").style.display = "block";
    document.getElementById("limparInputMarca").style.display = "block";
}

produto.exibirProdutos = function (listaDeProdutos) {
    var status = "";
    produto.dados = [];
    produto.html = "";

    if (listaDeProdutos != undefined) {
        if (listaDeProdutos.length > 0) {
            for (var i = 0; i < listaDeProdutos.length; i++) {
                if (listaDeProdutos[i].status) {
                    status = "<i style='color: #008400; font-weight: 600;'>Ativo</i>";
                } else {
                    status = "<i style='color: #f12c2c; font-weight: 600;'>Inativo</i>";
                }
                listaDeProdutos[i].valor = String(listaDeProdutos[i].valor).replace(".",",");
                produto.dados.push([listaDeProdutos[i].nome, "R$ " + listaDeProdutos[i].valor, listaDeProdutos[i].categoria.nome, listaDeProdutos[i].subCategoria.nome, listaDeProdutos[i].marca.nome, status,listaDeProdutos[i].quantidade, "<td data-toggle='modal' style='text-align-last: center; border: none;' onclick='produto.buscarProdutoPorID(" + listaDeProdutos[i].idProduto + ")'><button class='btn btn-outline-light btnEdit' type='button'><i class='fas fa-pencil-alt tabelaEdit'></i></button></td>"]);
            }
        } else {
            produto.html += "<td colspan='8' style='text-align: center; padding-left: 14rem;'>Nenhum registro encontrado</td></tr>";
        }
        $("#resultadoProdutos").html(produto.html);
    }
    produto.paginar();
    produto.ajustarBotoes();
};


produto.buscarProdutoPorID = function (id) {
    var cfg = {
        type: "POST",
        url: "../rest/classRest/buscarProdutoPeloId/" + id,
        success: function (produto) {
            $("#descProdEdit").val(produto.nome);
            $("#valorProdEdit").val(produto.valor);            
            $("#categoriaProdEdit").val(produto.categoria.nome);
            $("#subCategoriaProdEdit").val(produto.subCategoria.nome);
            $("#marcaProdEdit").val(produto.marca.nome);
            $("#quantidadeProdEdit").val(produto.quantidade);
            $("#switchProd").html("<label class='switch'><input type='checkbox' name='editStatusProd' id='editStatusProd' value='true' onclick='produto.alteraAtivoEditProd()'><span class='slider round'></span></label>");
            if (produto.status) {
                $("#editStatusProd").attr('checked', 'true');
                $("#editStatusProd").attr('value', 'true');
                $("#statusSWProd").html("Produto Ativo")
            } else {
                $("#editStatusProd").removeAttr("checked");
                $("#editStatusProd").attr('value', 'false');
                $("#statusSWProd").html("Produto Inativo")
            }
        },
        error: function (err) {
            alert("Erro ao editar o produto!" + err.responseText);
        }
    };
    IT.ajax.post(cfg);
    produto.ativarModalEdit();
};

produto.editarFuncionario = function () {
    editU = new Object();
    var retorno = "";

    editU.cpf = $("#editCpfFunc").val();
    editU.perfil = $("#editPerfilFunc").val();
    usuario.editU = editU;

    editF = new Object();
    editF.nome = $("#editNomeFunc").val();
    editF.email = $("#editEmailFunc").val();    
    editF.status = $("#editStatusFunc").val();

    
    editF.idFuncionario = $("#editIdFunc").val();
    editF.usuario = usuario.editU;

    if (editF.nome == "") {
        retorno += ("O campo 'Nome Completo' deve ser preenchido!\n");
    }
    var masc = new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi);
	var res = masc.test(editF.email);
	if (res == false){
		retorno += ("O campo E-mail foi preenchido incorretamente!\n");
	}
    funcionario.editF = editF;

    if (retorno == "") {
        var resp = "";

        var cfg = {
            url: "../rest/classRest/editarFuncionario",
            data: JSON.stringify(funcionario.editF),
            success: function (data) {
                if (data) {
                    resp = ("Funcionário editado com sucesso!");
                    exibirMessagem(resp, 1);

                    $('.modal-backdrop').remove();
                    $("#modal-editFunc").modal("hide");
                } else {
                    resp = ("Erro ao editar o funcionário!");
                    exibirMessagem(resp, 2);
                }
                funcionario.buscar();

            },
            error: function (err) {
                resp = ("Erro ao editar o funcionário!");
                exibirMessagem(resp, 2);
            }
        };
        IT.ajax.post(cfg);
    }else{
        alert(retorno);
        return false;
    }
};

produto.alteraAtivoEditProd = function () {
    valor = $("#editStatusProd").val();
    if (valor == 'true') {
        $("#editStatusProd").attr('value', 'false');
        $("#statusSWProd").html("Produto Inativo")
    } else if (valor == 'false') {
        $("#editStatusProd").attr('value', 'true');
        $("#statusSWProd").html("Produto Ativo")
    }
};

produto.ativarModalCad = function () {
    $("#modal-cadProd").modal("show");
    $("#descProd").val("");
    $("#valorProd").val("");
    $("#quantidadeProd").val(1);

    produto.removeCategoria();
    produto.removeSubCategoria();
    produto.removeMarca();

    //Colocar foco no input
    $('#modal-cadProd').on('shown.bs.modal', function () {
        $('#descProd').focus();
    })
};

produto.ativarModalEdit = function () {
    $("#modal-editProd").addClass("in");
    $("#modal-editProd").modal("show");
};

produto.paginar = function () {
    document.getElementById("btnPaginacaoProd").style.display = "block";
    $('table > tbody > tr').remove();
    var tbody = $('table > tbody');
    var cont = 0;
    for (var i = produto.pagina * produto.tamanhoPagina; i < produto.dados.length && i < (produto.pagina + 1) * produto.tamanhoPagina; i++) {
        cont++;
        tbody.append(
            $('<tr>')
                .append($('<td>').append(produto.dados[i][0]))
                .append($('<td>').append(produto.dados[i][1]))
                .append($('<td>').append(produto.dados[i][2]))
                .append($('<td>').append(produto.dados[i][3]))
                .append($('<td style="text-align: center;">').append(produto.dados[i][4]))
                .append($('<td style="text-align: -webkit-center;">').append(produto.dados[i][5]))
                .append($('<td style="text-align: -webkit-center;">').append(produto.dados[i][6]))
                .append($('<td style="text-align: -webkit-center;">').append(produto.dados[i][7]))
        )
    }

    if ((cont < produto.tamanhoPagina) && (produto.html == "")) {
        for (var i = cont; i < produto.tamanhoPagina; i++) {
            tbody.append(
                $('<tr>')
                    .append($('<td>').append(""))
                    .append($('<td>').append(""))
                    .append($('<td>').append(""))
                    .append($('<td>').append(""))
                    .append($('<td>').append(""))
                    .append($('<td style="text-align: -webkit-center; padding: 0.81rem !important">').append("&nbsp;"))
                    .append($('<td>').append(""))
                    .append($('<td>').append(""))
            )
        }
    }

    if (produto.html != "") {
        document.getElementById("btnPaginacaoProd").style.display = "none";
    }

    $('#numeracaoProd').text('Página ' + (produto.pagina + 1) + ' de ' + Math.ceil(produto.dados.length / produto.tamanhoPagina));
}

produto.ajustarBotoes = function () {
    $('#proximoProd').prop('disabled', produto.dados.length <= produto.tamanhoPagina || produto.pagina >= Math.ceil(produto.dados.length / produto.tamanhoPagina) - 1);
    $('#anteriorProd').prop('disabled', produto.dados.length <= produto.tamanhoPagina || produto.pagina == 0);
}


