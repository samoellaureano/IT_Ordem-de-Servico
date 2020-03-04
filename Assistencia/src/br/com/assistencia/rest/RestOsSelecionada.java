package br.com.assistencia.rest;

import java.sql.Connection;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;//A solicitação POST serve para atualizar um recurso existente ou para criar um novo recurso
import javax.ws.rs.Path;//Identifica o caminho do URI para o qual uma classe de recurso ou método de classe atenderá solicitações.
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.codehaus.jackson.map.ObjectMapper;

import br.com.assistencia.bd.conexao.Conexao;
import br.com.assistencia.jdbc.JDBCOrcamentoDAO;
import br.com.assistencia.jdbc.JDBCOrdemServicoDAO;
import br.com.assistencia.objetos.Orcamento;
import br.com.assistencia.objetos.OrdemServico;

@Path("osSelecionadaRest")//Caminho URI da classe Rest utilizada.
public class RestOsSelecionada extends UtilRest{

	public RestOsSelecionada(){
	}

	//Busca por ID
	@POST
	@Path("buscarOsSelecionada/{os}")
	@Produces({MediaType.APPLICATION_ATOM_XML,MediaType.APPLICATION_JSON})

	public Response buscarOsSelecionada(@PathParam("os") String os){
		Conexao conec = new Conexao();
		try{
			Connection conexao = conec.abrirConexao();
			
			OrdemServico ordemServico = new OrdemServico();

			JDBCOrdemServicoDAO jdbcOsAberto = new JDBCOrdemServicoDAO(conexao);
			ordemServico = jdbcOsAberto.buscarOsSelecionada(os);

			conec.fecharConexao();
			return this.buildResponse(ordemServico);
		}catch (Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}finally {
			conec.fecharConexao();
		}
	}
	
	@POST
	@Path("assumirOs")
	@Consumes("application/*")
	public Response assumirOs(String ordemServicoParam){
		Conexao conec = new Conexao();
		try{
			Connection conexao = conec.abrirConexao();
			OrdemServico ordemServico = new ObjectMapper().readValue(ordemServicoParam, OrdemServico.class);

			JDBCOrdemServicoDAO jdbcOrdemServico = new JDBCOrdemServicoDAO(conexao);
			
			System.out.println(ordemServico.getIdOrdem_servico() + " funcionario - "+ordemServico.getFuncionario().getIdFuncionario());

			boolean altOrdemServico = jdbcOrdemServico.alterar(ordemServico);

			if(altOrdemServico) {
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
	
	//Busca por ID
		@POST
		@Path("buscarOrcamento/{os}")
		@Produces({MediaType.APPLICATION_ATOM_XML,MediaType.APPLICATION_JSON})

		public Response buscarOrcamento(@PathParam("os") String os){
			Conexao conec = new Conexao();
			try{
				Connection conexao = conec.abrirConexao();
				
				Orcamento orcamento = new Orcamento();

				JDBCOrcamentoDAO jdbcOrcamento = new JDBCOrcamentoDAO(conexao);
				orcamento = jdbcOrcamento.buscarOrcamento(os);

				conec.fecharConexao();
				return this.buildResponse(orcamento);
			}catch (Exception e){
				e.printStackTrace();
				return this.buildErrorResponse(e.getMessage());
			}finally {
				conec.fecharConexao();
			}
		}


}//Finalizar a classe
