package br.com.assistencia.rest;

import java.io.StringWriter;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import org.codehaus.jackson.map.ObjectMapper;

public class UtilRest {
	/*
	 * Abaixo o método responsável por enviar a resposta ao clientesobre
	 * a transação realizada, inclusão, consulta edição ou exclusão,
	 * realizadas com sucesso.
	 * repare que o método em questão aguarda que seja repassado um
	 * conteúdo que será referenciado por um objeto chamado result.
	 */

	public Response buildResponse(Object result){
		/*
		 * Cria a instância da Classe StringWriter para o objeto fw.
		 * isto que este objetos é quem estará referenciando o conteúdo
		 * repassado como resposta para o lado cliente.
		 */

		StringWriter fw = new StringWriter();
		try{
			/*
			 * Cria a instância da classe ObjectMapper para o objeto mapper.
			 */
			ObjectMapper mapper = new ObjectMapper();
			/*
			 * Acessa o método writeValue, por meio do objeto mapper,
			 * passando como parametro o objeto fw e o conteudo do 
			 * objeto result, na realizada está criando um mapeamento
			 * de dados onde o objeto fw é a chave do valor de um
			 * conteúdo referenciado pelo objeto result.
			 * 
			 * result pode conter a mensagem, "Cadastro efetuado com sucesso", ou "Exclusão efetuada com sucesso" ou outra
			 * qualquer dependendo da transação realizada.
			 */

			mapper.writeValue(fw, result);
			/*
			 * Monta o objeto de resposta com status 200(ok), junto
			 * com o objeto result convertido para JSON pelo objeto fw
			 * para o cliente no formato String.
			 */

			return Response.ok(fw.toString()).build();
		}catch(Exception ex){
			return this.buildErrorResponse(ex.getMessage());
		}
	}

	/*
	 * Abaixo o método responsável por enviar a resposta ao cliente sobre
	 * a transação realizada, inclusão, consulta, edição ou exclusão.ao
	 * cliente, não realizadas com sucesso, ou seja, que contenha algum erro.
	 * 
	 * Repare que o método em questão aguarda que seja repassado um
	 * conteúdo que será referenciado por um objeto chamado rb.
	 */
	public Response buildErrorResponse(String str){
		/*
		 * Abaixo o objeto rb recebe o status do erro.
		 */
		ResponseBuilder rb = Response.status(Response.Status.INTERNAL_SERVER_ERROR);
		/*
		 * Define a entidade (objeto), que nesse caso é uma
		 * mensagem que será retornado para o cliente.
		 */

		rb = rb.entity(str);
		/*
		 * Define o tipo de retorno desta entidade (objeto), no
		 * caso é definido como texto simples.
		 */

		rb = rb.type("text/plain");
		/*
		 * Retorna o objeto de resposta com status 500 (erro),
		 * junto com a String contendo a mensagem de erro.
		 */

		return rb.build();
	}

}
