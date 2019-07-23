//Criando o objeto genérico SENAI
IT = new Object();
//Criando o sub-objeto ajax do objeto SENAI.
IT.ajax = new Object();

/*
 * Processa o pedido, solicitação HTTP Ajax a ser recebido pelo Rest.
 */

function ajaxRequestDefault(){
	var def = {
			url: null,
			dataType: 'json',
			contentType: 'application/json; charset=UTF-8',
			type:'POST',
			success: function(){},
			error: function(err){
				alert("error = " + err.responseText);
			}
	};
	return def;
}
/* Verifica o estado do objeto cfg recebido, ou seja, se o identificador cfg
 * trata-se realmente de uma variavel de objeto contendo suas respectivas
 * propriedades com valores, se isto se confirmar retorna o objeto cfg.
 * Notem a chamada ao método stringfy() que, por sua vez, converte o conteúdo
 * dos dados encontrados em cfg. data em JSON para que posteriormente possam
 * ser repassados pelo Ajax a partir de um pedido HTTP.
 * Notem tambem a chamada à função isObject(cfg.data) que repassa como
 * parâmetro cfg.data
 * para saber se os dados apontados por cfg tratam-se de um array de dados,
 * ou se é um objeto semples, criado como {} ou new Object e por ultimo
 * verifica se trata-se de uma função objeto Javascript.
 */
function verifyObjectData(cfg){
	if(cfg.data){
		if(isObject(cfg.data)){
			cfg.data = JSON.stringify(cfg.data);
		}
	}
	return cfg;
}

/*A função abaixo verifica os dados apontados por cfg tratam-se de um array
 * de dados, ou se é um objeto simples, criado como {} ou new Object e por
 * ultimo verifica se trata-se de uma função objeto Javascript. Retorna o tipo
 * estrutura passada pelo objeto cfg.
 */
function isObject(o){
	return $.isArray(o) | $.isPlainObject(o) | $.isFunction(o);
};

IT.ajax.post = function(cfg){
	/*
	 * Inicia o Ajax e processa um pedido de Ajax, a partir de
	 * ajaxRequestDefault().
	 * esta inicialização e pedido são repassadas para o objeto def que,
	 * por sua vez, passará a ser um Ajax solicitante de uso geral.
	 */
	var def = new ajaxRequestDefault();

	/*
	 * chama a função verifyObjectData() que, por sua vez, verifica o 
	 * estado do objeto cfg recebido, ou seja, se o identificador cfg
	 * trata-se ralmente de uma variavel de objeto contendo suas
	 * respectivas propriedades com valores, se isto se confirmar retorna o
	 * objeto cfg e o armazena tambem em outro 
	 * objeto cfg que será fundido no objeto config para que uma solicitação
	 * pedido HTTP, Ajax seja enviada para um recurso Rest
	 */
	cfg = verifyObjectData(cfg);
	/*
	 * Fundindo os objetos def e cfg e armazenando seus respectivos
	 * valores em config.
	 */
	var config = $.extend(def,cfg);

	/*
	 * Realizando um HTTP pedido ajax. Em o parâmetro config segue o pedido Ajax.
	 */
	$.ajax(config);
};

IT.ajax.get = function(cfg){
	var def = new ajaxRequestDefault();
	cfg.type = "GET";
	cfg = verifyObjectData(cfg);
	var config = $.extend(def, cfg);
	$.ajax(config);
};