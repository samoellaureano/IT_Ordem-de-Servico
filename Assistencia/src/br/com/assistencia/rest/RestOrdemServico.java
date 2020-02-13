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
import br.com.assistencia.jdbc.JDBCEquipamentoDAO;
import br.com.assistencia.jdbc.JDBCOrdemServicoDAO;
import br.com.assistencia.objetos.OrdemServico;

@Path("ordemServicoRest")//Caminho URI da classe Rest utilizada.
public class RestOrdemServico extends UtilRest{

	public RestOrdemServico(){
	}
	
	@POST
	@Path("/addordemServico")
	@Consumes("application/*")
	public Response addordemServico(String ordemServicoParam){
		Conexao conec = new Conexao();
		try{
			Connection conexao = conec.abrirConexao();
			OrdemServico ordemServico = new ObjectMapper().readValue(ordemServicoParam, OrdemServico.class);

			JDBCOrdemServicoDAO jdbcOrdemServico = new JDBCOrdemServicoDAO(conexao);
			JDBCEquipamentoDAO jdbcEquipamento = new JDBCEquipamentoDAO(conexao);		

			boolean cadEquipamento = jdbcEquipamento.inserir(ordemServico.getEquipamento());
			boolean cadOrdemServico = jdbcOrdemServico.inserir(ordemServico);

			if(cadEquipamento && cadOrdemServico) {
				return this.buildResponse(1);
			}else {
				return this.buildResponse(2);
			}			
		}catch(Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}finally {
			conec.fecharConexao();
		}
	}
	
	//Busca por numero da OS
		@POST
		@Path("buscarOrdensServicoPorNumero/{numeroOS}")
		@Produces({MediaType.APPLICATION_ATOM_XML,MediaType.APPLICATION_JSON})

		public Response buscarOrdensServicoPorNumero(@PathParam("numeroOS") String numeroOS){
			Conexao conec = new Conexao();
			try{
				Connection conexao = conec.abrirConexao();
				
				List<OrdemServico> listOrdemServico = new ArrayList<OrdemServico>();

				JDBCOrdemServicoDAO jdbcOrdemServico = new JDBCOrdemServicoDAO(conexao);
				listOrdemServico = jdbcOrdemServico.buscarPorNumeroOS(numeroOS);

				conec.fecharConexao();
				return this.buildResponse(listOrdemServico);
			}catch (Exception e){
				e.printStackTrace();
				return this.buildErrorResponse(e.getMessage());
			}finally {
				conec.fecharConexao();
			}
		}
	
}//Finalizar a classe
