dashboard = new Object();

$(document).ready(function () {

});

dashboard.buscar = function () {
    var graficoQtdOs = [];
    var qntOsGrafico = [];

    var valorOsGrafico = [];
    var graficoValorOs = [];

    var cfg = {
        type: "POST",
        url: "../rest/dashRest/buscarDados/",
        success: function (dadosDash) {
            $("#totalEmAberto").html(dadosDash.osEmAberto);
            $("#totalEmAbertoAprovado").html(dadosDash.osEmAbertoAprovado);

            //Seta a quantidade de OS por mes
            for(var i=0; i<dadosDash.listMesQnt.length;i++){
                graficoQtdOs[dadosDash.listMesQnt[i]] = dadosDash.qntOs[i];
            }
            
            for(var i=1; i<13;i++){
                if (graficoQtdOs[i] != undefined){
                    qntOsGrafico.push(graficoQtdOs[i]);
                }else{
                    qntOsGrafico.push(0);
                }
            }

            //Seta o valor em cada OS por mes
            for(var i=0; i<dadosDash.listMesValor.length;i++){
                graficoValorOs[dadosDash.listMesValor[i]] = dadosDash.valorOs[i];
            }
            
            for(var i=1; i<13;i++){
                if (graficoValorOs[i] != undefined){
                    valorOsGrafico.push(graficoValorOs[i]);
                }else{
                    valorOsGrafico.push(0);
                }
            }
            
        },
        error: function (err) {
            alert("Erro ao buscar o Dados: " + err.responseText);
        }
    };
    IT.ajax.post(cfg);

    dashboard.graficos(qntOsGrafico, valorOsGrafico);
};

dashboard.graficos = function (qntOsGrafico, valorOsGrafico) {
    var ctx = document.getElementsByClassName("line-chart");

    //Type, Data e options
    var chartGraph = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Jan", "Fev", "Mar", "Abr", "Maio", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
            datasets: [{
                label: "",
                data: valorOsGrafico,
                borderWidth: 1,
                borderColor: "rga(77,166,253,0.85",
                backgroundColor: "#206609"
            }]
        },
        options: {
            title: {
                display: true,
                fontSize: 20,
                text: "Valor de OS"
            },
            layout: {
                padding: {
                    left: 25,
                    right: 50,
                    top: 0,
                    bottom: 0
                }
            },
            legend: {
                display: false
            }
        }
    });

    var ctx2 = document.getElementsByClassName("line-chart2");

    //Type, Data e options
    var chartGraph2 = new Chart(ctx2, {
        type: "bar",
        data: {
            labels: ["Jan", "Fev", "Mar", "Abr", "Maio", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
            datasets: [{
                label: "",
                data: qntOsGrafico,
                borderWidth: 1,
                borderColor: "rga(77,166,253,0.85",
                backgroundColor: "#8f7e07"
            }]
        },
        options: {
            title: {
                display: true,
                fontSize: 20,
                text: "Quantidade de OS"
            },
            layout: {
                padding: {
                    left: 25,
                    right: 50,
                    top: 0,
                    bottom: 0
                }
            }, legend: {
                display: false
            }
        }
    });
}