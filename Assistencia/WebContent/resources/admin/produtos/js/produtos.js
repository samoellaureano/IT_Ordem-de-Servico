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
            url: "../rest/produtoRest/addProduto",
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
        url: "../rest/produtoRest/buscarProdutos/" + valorBusca,
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
    var display = $('#modal-editProd').css("display")
    if(display == "block"){
        var valorBusca = $("#categoriaProdEdit").val();
    }else{
        var valorBusca = $("#categoriaProd").val();
    }
    
    if (valorBusca != "") {
        if (valorBusca.trim()) {
            var cfg = {
                type: "POST",
                url: "../rest/categoriaRest/buscarCategorias/" + valorBusca,
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
        $("#listaDeCategoriasEdit").html("");
        document.getElementById("divBtnCadCategoria").style.display = "block";
        document.getElementById("divBtnEditCategoria").style.display = "none";
        document.getElementById("limparInputCategoria").style.display = "none";

        document.getElementById("divBtnCadCategoriaEdit").style.display = "block";
        document.getElementById("divBtnEditCategoriaEdit").style.display = "none";
        document.getElementById("limparInputCategoriaEdit").style.display = "none";
    }
};

produto.buscarSubCategorias = function () {
    var display = $('#modal-editProd').css("display")
    if(display == "block"){
        var idCategoria = $("#idCategoriaProdEdit").val();
        var valorBusca = $("#subCategoriaProdEdit").val();
    }else{
        var valorBusca = $("#subCategoriaProd").val();
    }

    if (valorBusca != "") {
        if (valorBusca.trim()) {
            SubCategoria = new Object();
            SubCategoria.nome = valorBusca;
            SubCategoria.categorias_idCategoria = idCategoria;   
        
            var cfg = {
                url: "../rest/subCategoriaRest/buscarSubCategorias/",
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

        $("#listaDeSubCategoriasEdit").html("");
        document.getElementById("divBtnCadSubCategoriaEdit").style.display = "block";
        document.getElementById("divBtnEditSubCategoriaEdit").style.display = "none";
        document.getElementById("limparInputSubCategoriaEdit").style.display = "none";
    }
};

produto.buscarMarcas = function () {
    var display = $('#modal-editProd').css("display")
    if(display == "block"){
        var valorBusca = $("#marcaProdEdit").val();
    }else{
        var valorBusca = $("#marcaProd").val();
    }
    if (valorBusca != "") {
        if (valorBusca.trim()) {
            var cfg = {
                type: "POST",
                url: "../rest/marcaRest/buscarMarcas/" + valorBusca,
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

        $("#listaDeMarcasEdit").html("");
        document.getElementById("divBtnCadMarcaEdit").style.display = "block";
        document.getElementById("divBtnEditMarcaEdit").style.display = "none";
        document.getElementById("limparInputMarcaEdit").style.display = "none";
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
        $("#listaDeCategoriasEdit").html(produto.html + "\n</ul>");
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
        $("#listaDeSubCategoriasEdit").html(produto.html + "\n</ul>");
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
        $("#listaDeMarcasEdit").html(produto.html + "\n</ul>");
    }
};

produto.removeCategoria = function () {
    produto.removeSubCategoria();
    $("#listaDeCategorias").html("");
    $("#listaDeCategoriasEdit").html("");

    document.getElementById("divBtnCadCategoria").style.display = "block";
    document.getElementById("divBtnEditCategoria").style.display = "none";
    document.getElementById("limparInputCategoria").style.display = "none";

    document.getElementById("divBtnCadCategoriaEdit").style.display = "block";
    document.getElementById("divBtnEditCategoriaEdit").style.display = "none";
    document.getElementById("limparInputCategoriaEdit").style.display = "none";

    $("#categoriaProd").val("");
    $('#categoriaProd').focus();

    $("#categoriaProdEdit").val("");
    $('#categoriaProdEdit').focus();
};

produto.removeSubCategoria = function () {
    $("#listaDeSubCategorias").html("");
    $("#listaDeSubCategoriasEdit").html("");

    document.getElementById("divBtnCadSubCategoria").style.display = "block";
    document.getElementById("divBtnEditSubCategoria").style.display = "none";
    document.getElementById("limparInputSubCategoria").style.display = "none";

    document.getElementById("divBtnCadSubCategoriaEdit").style.display = "block";
    document.getElementById("divBtnEditSubCategoriaEdit").style.display = "none";
    document.getElementById("limparInputSubCategoriaEdit").style.display = "none";

    $("#subCategoriaProd").val("");
    $('#subCategoriaProd').focus();

    $("#subCategoriaProdEdit").val("");
    $('#subCategoriaProdEdit').focus();
};

produto.removeMarca = function () {
    $("#listaDeMarcas").html("");
    $("#listaDeMarcasEdit").html("");

    document.getElementById("divBtnCadMarca").style.display = "block";
    document.getElementById("divBtnEditMarca").style.display = "none";
    document.getElementById("limparInputMarca").style.display = "none";

    document.getElementById("divBtnCadMarcaEdit").style.display = "block";
    document.getElementById("divBtnEditMarcaEdit").style.display = "none";
    document.getElementById("limparInputMarcaEdit").style.display = "none";

    $("#marcaProd").val("");
    $('#marcaProd').focus();

    $("#marcaProdEdit").val("");
    $('#marcaProdEdit').focus();
};

produto.selectCategoria = function (selectCat, selectIdCat) {
    $("#idCategoriaProd").val(selectIdCat);
    $("#idCategoriaProdEdit").val(selectIdCat);

    $("#categoriaProd").val(selectCat);
    $("#categoriaProdEdit").val(selectCat);

    $("#listaDeCategorias").html("");
    $("#listaDeCategoriasEdit").html("");

    document.getElementById("divBtnCadCategoria").style.display = "none";
    document.getElementById("divBtnEditCategoria").style.display = "block";
    document.getElementById("limparInputCategoria").style.display = "block";

    document.getElementById("divBtnCadCategoriaEdit").style.display = "none";
    document.getElementById("divBtnEditCategoriaEdit").style.display = "block";
    document.getElementById("limparInputCategoriaEdit").style.display = "block";
};

produto.selectSubCategoria = function (selectSubCat, selectIdSubCat) {
    $("#idSubCategoriaProd").val(selectIdSubCat);
    $("#idSubCategoriaProdEdit").val(selectIdSubCat);

    $("#subCategoriaProd").val(selectSubCat);
    $("#subCategoriaProdEdit").val(selectSubCat);

    $("#listaDeSubCategorias").html("");
    $("#listaDeSubCategoriasEdit").html("");

    document.getElementById("divBtnCadSubCategoria").style.display = "none";
    document.getElementById("divBtnEditSubCategoria").style.display = "block";
    document.getElementById("limparInputSubCategoria").style.display = "block";

    document.getElementById("divBtnCadSubCategoriaEdit").style.display = "none";
    document.getElementById("divBtnEditSubCategoriaEdit").style.display = "block";
    document.getElementById("limparInputSubCategoriaEdit").style.display = "block";
};

produto.selectMarca = function (selectMarca, selectIdMarca) {
    $("#idMarcaProd").val(selectIdMarca);
    $("#idMarcaProdEdit").val(selectIdMarca);
    
    $("#marcaProd").val(selectMarca);
    $("#marcaProdEdit").val(selectMarca);
        
    $("#listaDeMarcas").html("");
    $("#listaDeMarcasEdit").html("");

    document.getElementById("divBtnCadMarca").style.display = "none";
    document.getElementById("divBtnEditMarca").style.display = "block";
    document.getElementById("limparInputMarca").style.display = "block";

    document.getElementById("divBtnCadMarcaEdit").style.display = "none";
    document.getElementById("divBtnEditMarcaEdit").style.display = "block";
    document.getElementById("limparInputMarcaEdit").style.display = "block";
};

produto.exibirProdutos = function (listaDeProdutos) {
    var status = "";
    produto.dados = [];
    produto.html = "";

    document.getElementById("divBtnEditCategoria").style.display = "block";

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
        url: "../rest/produtoRest/buscarProdutoPeloId/" + id,
        success: function (produto) {
            $("#idProdutoEdit").val(produto.idProduto);
            $("#descProdEdit").val(produto.nome);
            $("#valorProdEdit").val(produto.valor);            
            $("#categoriaProdEdit").val(produto.categoria.nome);
            $("#idCategoriaProdEdit").val(produto.categoria.idCategoria);
            $("#subCategoriaProdEdit").val(produto.subCategoria.nome);
            $("#idSubCategoriaProdEdit").val(produto.subCategoria.idSubcategoria);
            $("#marcaProdEdit").val(produto.marca.nome);
            $("#idMarcaProdEdit").val(produto.marca.idMarca);
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

produto.editarProduto = function () {
    produtoEdit = new Object();
    categoria = new Object();
    subCategoria = new Object();
    marca = new Object();
    var retorno = "";

    produtoEdit.status = $("#editStatusProd").val();
    produtoEdit.idProduto = $("#idProdutoEdit").val();
    produtoEdit.nome = $("#descProdEdit").val();
    produtoEdit.valor = $("#valorProdEdit").val();
    produtoEdit.valor = produtoEdit.valor.replace(/\./g, "");
    produtoEdit.valor = produtoEdit.valor.replace(",", ".");
    produtoEdit.quantidade = $("#quantidadeProdEdit").val();
    categoria.idCategoria = $("#idCategoriaProdEdit").val();
    subCategoria.idSubcategoria = $("#idSubCategoriaProdEdit").val();
    marca.idMarca = $("#idMarcaProdEdit").val();

    if (produtoEdit.nome == "") {
        retorno += ("O campo 'Descrição' deve ser preenchido!\n");
    }
    if (produtoEdit.valor == "") {
        retorno += ("O campo 'Valor' deve ser preenchido!\n");
    }
    if (produtoEdit.quantidade == "") {
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

    produtoEdit.categoria = categoria;
    produtoEdit.subCategoria = subCategoria;
    produtoEdit.marca = marca;

    if (retorno == "") {
        var cfg = {
            url: "../rest/produtoRest/editarProduto",
            data: JSON.stringify(produtoEdit),
            success: function (succJson) {
                if (succJson) {
                    resp = ("Produto editado com sucesso!");
                    produto.buscar();
                    exibirMessagem(resp, 1);
                }else{
                    resp = ("Erro ao editado o produto!");
                    exibirMessagem(resp, 2);
                }

                $("#modal-editProd").modal("hide");
                $('.modal-backdrop').remove();
            },
            error: function (errJson) {
                resp = ("Erro ao editado o produto!");
                exibirMessagem(resp, 2);
            }
        };
        IT.ajax.post(cfg);
    }else{
        alert(retorno);
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
    $('#tableProd > tbody > tr').remove();
    var tbody = $('#tableProd > tbody');
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
};

produto.ajustarBotoes = function () {
    $('#proximoProd').prop('disabled', produto.dados.length <= produto.tamanhoPagina || produto.pagina >= Math.ceil(produto.dados.length / produto.tamanhoPagina) - 1);
    $('#anteriorProd').prop('disabled', produto.dados.length <= produto.tamanhoPagina || produto.pagina == 0);
};


