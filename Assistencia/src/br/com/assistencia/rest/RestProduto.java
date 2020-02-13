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
import br.com.assistencia.jdbc.JDBCProdutoDAO;
import br.com.assistencia.objetos.Produto;

@Path("produtoRest")//Caminho URI da classe Rest utilizada.
public class RestProduto extends UtilRest{

	public RestProduto(){
	}
	
	@POST
	@Path("/addProduto")
	@Consumes("application/*")
	public Response addProduto(String produtoParam){
		Conexao conec = new Conexao();
		try{
			Connection conexao = conec.abrirConexao();
			Produto produto = new ObjectMapper().readValue(produtoParam, Produto.class);

			JDBCProdutoDAO jdbcProduto = new JDBCProdutoDAO(conexao);
			boolean resp = jdbcProduto.inserir(produto);
			conec.fecharConexao();

			if(resp){
				return this.buildResponse(true);
			}else{
				return this.buildResponse(false);
			}

		}catch(Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}finally {
			conec.fecharConexao();
		}
	}
	
	@POST
	@Path("/buscarProdutos/{desc}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})

	public Response buscarProdutos(@PathParam("desc") String desc){
		Conexao conec = new Conexao();
		try{
			Connection conexao = conec.abrirConexao();
			List<Produto> produtos = new ArrayList<Produto>();			

			JDBCProdutoDAO jdbcProduto = new JDBCProdutoDAO(conexao);
			produtos = jdbcProduto.buscar(desc);			

			return this.buildResponse(produtos);
		}catch (Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}finally {
			conec.fecharConexao();
		}
	}
	
	@POST
	@Path("buscarProdutoPeloId/{id}")
	@Produces({MediaType.APPLICATION_ATOM_XML,MediaType.APPLICATION_JSON})

	public Response buscarProdutoPeloId(@PathParam("id") int id){
		Conexao conec = new Conexao();
		try{
			Connection conexao = conec.abrirConexao();

			JDBCProdutoDAO jdbcProduto = new JDBCProdutoDAO(conexao);
			Produto produto = jdbcProduto.buscarPorId(id);

			return this.buildResponse(produto);
		}catch (Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}finally {
			conec.fecharConexao();
		}
	}
	
	@POST
	@Path("/editarProduto")
	@Consumes("application/*")
	public Response editarProduto (String produtoParam){
		Conexao conec = new Conexao();
		try{
			Connection conexao = conec.abrirConexao();

			Produto produto = new ObjectMapper().readValue(produtoParam, Produto.class);
			JDBCProdutoDAO jdbcProduto = new JDBCProdutoDAO(conexao);

			return this.buildResponse(jdbcProduto.atualizar(produto));
		}catch (Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}finally {
			conec.fecharConexao();
		}
	}
	
}//Finalizar a classe
