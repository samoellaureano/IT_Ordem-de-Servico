package br.com.assistencia.rest;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.Consumes;//Define os tipos de midia que os métodos podem aceitar.
import javax.ws.rs.POST;//A solicitação POST serve para atualizar um recurso existente ou para criar um novo recurso
import javax.ws.rs.Path;//Identifica o caminho do URI para o qual uma classe de recurso ou método de classe atenderá solicitações.
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import org.codehaus.jackson.map.ObjectMapper;

import br.com.assistencia.bd.conexao.Conexao;
import br.com.assistencia.jdbc.JDBCServicoDAO;
import br.com.assistencia.objetos.Servico;

@Path("servicoRest")//Caminho URI da classe Rest utilizada.
public class Rest extends UtilRest{

	public Rest(){
	}

	@POST//Processará as requisições enviadas pelo método post.
	@Path("/addServico")/*Caminho URI do método da classe que
	 *receberá os dados do formulário que
	 *os armazenará em sua respectiva classe
	 *e os incluirá no banco de dados.
	 */

	@Consumes("application/*")/*Caminho URI que identifica o tipo de
	 *mídia enviado pelo lado cliente, no
	 *caso, informações do formulario no
	 *formato de aplicação.
	 */

	public Response addServico(String servicoParam){
		try{
			/*
			 * Instancia a classe ObjectMapper e chama o método readValue()
			 * leitura dos valores repassados pelo cliente no formato JSON,
			 * no caso os campos do formulário e atribui os valores destes
			 * campos aos atributos da classe Servico.
			 * Os valores obtidos do formulario são armazenados em atributos
			 * javascript, esses atributos por sua vez devem obrigatóriamente
			 * ter o mesmo nome dos atributos da classe Java correspondente
			 * Com isso é possivel a realização de um "de-para" dos valores
			 * contidos no objeto JSON (servicoParam) para um objeto da
			 * classe Servico.
			 * Aqui, importante observação de que o nome dos atributos
			 * declarados na classe, que irão receber os valores dos campos
			 * do formulário, sejam declarados de maneira identica ao nome
			 * dos campos do formulário que enviará seus valores.
			 */

			Servico servico = new ObjectMapper().readValue(servicoParam, Servico.class);

			//Chamar o método que grava o objeto contato no banco de dados

			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			JDBCServicoDAO jdbcServico = new JDBCServicoDAO(conexao);
			boolean resp = jdbcServico.inserir(servico);
			conec.fecharConexao();

			/*
			 * Envia como retorno para o método buildResponse() a mensagem
			 * "Contato cadastrado com sucesso", no caso de sucesso da inclusão.
			 * Também retorna para o método buildErrorResponse() uma mensagem
			 * interna de erro, no caso do erro ocorrido durante a inclusão.
			 */
			
			if(resp){
				return this.buildResponse(true);
			}else{
				return this.buildResponse(false);
			}

			
		}catch(Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}
	}
	
	@POST
	@Path("/buscarServicos/{desc}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	
	public Response buscarServicos(@PathParam("desc") String desc){
		try{
			List<Servico> servicos = new ArrayList<Servico>();
			
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			JDBCServicoDAO jdbcServico = new JDBCServicoDAO(conexao);
			servicos = jdbcServico.buscar(desc);
			conec.fecharConexao();
			
			return this.buildResponse(servicos);
		}catch (Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}
	}
	
	/*
	//Deletar contato
	@POST
	@Path("/deletarContato/{id}")
	@Consumes("application/*")
	public Response deletarContato(@PathParam("id") int id){
		try{
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			JDBCContatoDAO jdbcContato = new JDBCContatoDAO(conexao);
			boolean resp = jdbcContato.deletarContato(id);
			conec.fecharConexao();
			
			if(resp == true){
				return this.buildResponse("Contato deletado com sucesso.");
			}else{
				return this.buildResponse("Erro ao deletar o contato.");
			}
			
		}catch (Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}
		
		
	}
	*/
	
	//Busca por ID
	@POST
	@Path("buscarServicoPeloId/{id}")
	@Produces({MediaType.APPLICATION_ATOM_XML,MediaType.APPLICATION_JSON})
	
	public Response buscarServicoPeloId(@PathParam("id") int id){
		try{
			Conexao conec = new Conexao();
			Connection conexao = conec.abrirConexao();
			
			JDBCServicoDAO jdbcServico = new JDBCServicoDAO(conexao);
			Servico servico = jdbcServico.buscarPorId(id);
			
			return this.buildResponse(servico);
		}catch (Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}
	}
	
	//Edita servico
		@POST
		@Path("/editarServico")
		@Consumes("application/*")
		public Response editarServico (String servicoParam){
			Conexao conec = new Conexao();
			try{
				Servico servico = new ObjectMapper().readValue(servicoParam, Servico.class);
				Connection conexao = conec.abrirConexao();
				JDBCServicoDAO jdbcServico = new JDBCServicoDAO(conexao);
				jdbcServico.atualizar(servico);
				
				return this.buildResponse("Servico editado com sucesso");
			}catch (Exception e){
				e.printStackTrace();
				return this.buildErrorResponse(e.getMessage());
			}finally {
				conec.fecharConexao();
			}
		}
}//Finalizar a classe
