package br.com.assistencia.rest;

import java.sql.Connection;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.codehaus.jackson.map.ObjectMapper;

import br.com.assistencia.bd.conexao.Conexao;
import br.com.assistencia.jdbc.JDBCOrcamentoDAO;
import br.com.assistencia.objetos.Orcamento;

@Path("OrcamentoRest")

public class RestOrcamento extends UtilRest{

	public RestOrcamento(){
	}

	@POST
	@Path("/addOrcamento")
	@Consumes("application/*")
	public Response addOrcamento(String orcamentoParam){
		Conexao conec = new Conexao();
		try{				
			Connection conexao = conec.abrirConexao();
			
			Orcamento orcamento = new ObjectMapper().readValue(orcamentoParam, Orcamento.class);
			
			JDBCOrcamentoDAO jdbcOrcamento = new JDBCOrcamentoDAO(conexao);

			boolean retorno = false;
			retorno = jdbcOrcamento.inserir(orcamento);
			if(retorno) {
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

	@POST
	@Path("/aprovarOrcamento")
	@Consumes("application/*")
	public Response aprovarOrcamento(String orcamentoParam){
		Conexao conec = new Conexao();
		try{				
			Connection conexao = conec.abrirConexao();
			
			Orcamento orcamento = new ObjectMapper().readValue(orcamentoParam, Orcamento.class);
			
			JDBCOrcamentoDAO jdbcOrcamento = new JDBCOrcamentoDAO(conexao);

			boolean retorno = false;
			retorno = jdbcOrcamento.aprovar(orcamento);
			if(retorno) {
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
	
	@POST
	@Path("/recusarOrcamento")
	@Consumes("application/*")
	public Response recusarOrcamento(String orcamentoParam){
		Conexao conec = new Conexao();
		try{				
			Connection conexao = conec.abrirConexao();
			
			Orcamento orcamento = new ObjectMapper().readValue(orcamentoParam, Orcamento.class);
			
			JDBCOrcamentoDAO jdbcOrcamento = new JDBCOrcamentoDAO(conexao);

			boolean retorno = false;
			retorno = jdbcOrcamento.recusar(orcamento);
			if(retorno) {
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
	
	@POST
	@Path("/prontoRetirar")
	@Consumes("application/*")
	public Response prontoRetirar(String orcamentoParam){
		Conexao conec = new Conexao();
		try{				
			Connection conexao = conec.abrirConexao();
			
			Orcamento orcamento = new ObjectMapper().readValue(orcamentoParam, Orcamento.class);
			
			JDBCOrcamentoDAO jdbcOrcamento = new JDBCOrcamentoDAO(conexao);

			boolean retorno = false;
			retorno = jdbcOrcamento.prontoRetirar(orcamento);
			if(retorno) {
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
	
	@POST
	@Path("/retirar")
	@Consumes("application/*")
	public Response retirar(String orcamentoParam){
		Conexao conec = new Conexao();
		try{				
			Connection conexao = conec.abrirConexao();
			
			Orcamento orcamento = new ObjectMapper().readValue(orcamentoParam, Orcamento.class);
			
			JDBCOrcamentoDAO jdbcOrcamento = new JDBCOrcamentoDAO(conexao);

			boolean retorno = false;
			retorno = jdbcOrcamento.retirar(orcamento);
			if(retorno) {
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
	
	@POST
	@Path("/absorver")
	@Consumes("application/*")
	public Response absorver(String orcamentoParam){
		Conexao conec = new Conexao();
		try{				
			Connection conexao = conec.abrirConexao();
			
			Orcamento orcamento = new ObjectMapper().readValue(orcamentoParam, Orcamento.class);
			
			JDBCOrcamentoDAO jdbcOrcamento = new JDBCOrcamentoDAO(conexao);

			boolean retorno = false;
			retorno = jdbcOrcamento.absorver(orcamento);
			if(retorno) {
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
	
	@POST
	@Path("/buscarProdutoServico/{ProdutoServico}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})

	public Response buscarCategorias(@PathParam("ProdutoServico") String produtoServico){
		Conexao conec = new Conexao();
		try{
			Connection conexao = conec.abrirConexao();

			Orcamento orcamento = new Orcamento();
			JDBCOrcamentoDAO jdbcOrcamento = new JDBCOrcamentoDAO(conexao);
			orcamento = jdbcOrcamento.buscarProdutoServico(produtoServico);

			conec.fecharConexao();				
			return this.buildResponse(orcamento);
		}catch (Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}finally {
			conec.fecharConexao();
		}
	}

}
