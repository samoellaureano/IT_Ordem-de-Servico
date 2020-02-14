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
import br.com.assistencia.jdbc.JDBCFuncionarioDAO;
import br.com.assistencia.jdbc.JDBCOrdemServicoDAO;
import br.com.assistencia.objetos.Funcionario;
import br.com.assistencia.objetos.OrdemServico;

@Path("osAbertoRest")//Caminho URI da classe Rest utilizada.
public class RestOsAberto extends UtilRest{

	public RestOsAberto(){
	}

	@POST
	@Path("/buscarOsAberto")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})

	public Response buscarOsAberto(){
		Conexao conec = new Conexao();
		try{
			Connection conexao = conec.abrirConexao();

			List<OrdemServico> osAberto = new ArrayList<OrdemServico>();
			JDBCOrdemServicoDAO jdbcOsAberto = new JDBCOrdemServicoDAO(conexao);
			osAberto = jdbcOsAberto.buscarPorNumeroOS("null");

			conec.fecharConexao();				
			return this.buildResponse(osAberto);
		}catch (Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}finally {
			conec.fecharConexao();
		}
	}


	//Busca por ID
	@POST
	@Path("buscarFuncionarioPeloId/{id}")
	@Produces({MediaType.APPLICATION_ATOM_XML,MediaType.APPLICATION_JSON})

	public Response buscarFuncionarioPeloId(@PathParam("id") int id){
		Conexao conec = new Conexao();
		try{
			Connection conexao = conec.abrirConexao();

			JDBCFuncionarioDAO jdbcFuncionario = new JDBCFuncionarioDAO(conexao);
			Funcionario funcionario = jdbcFuncionario.buscarPorId(id);

			conec.fecharConexao();
			return this.buildResponse(funcionario);
		}catch (Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}finally {
			conec.fecharConexao();
		}
	}

	//Edita funcionario
	@POST
	@Path("/editarFuncionario")
	@Consumes("application/*")
	public Response editarFuncionario (String funcionarioParam){
		Conexao conec = new Conexao();
		try{
			Connection conexao = conec.abrirConexao();

			Funcionario funcionario = new ObjectMapper().readValue(funcionarioParam, Funcionario.class);
			JDBCFuncionarioDAO jdbcFuncionario = new JDBCFuncionarioDAO(conexao);

			return this.buildResponse(jdbcFuncionario.atualizar(funcionario));
		}catch (Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}finally {
			conec.fecharConexao();
		}
	}

	//Edita funcionario
	@POST
	@Path("/editarFuncionarioConfig")
	@Consumes("application/*")
	public Response editarFuncionarioConfig (String funcionarioParam){
		Conexao conec = new Conexao();
		try{
			Connection conexao = conec.abrirConexao();

			Funcionario funcionario = new ObjectMapper().readValue(funcionarioParam, Funcionario.class);
			JDBCFuncionarioDAO jdbcFuncionario = new JDBCFuncionarioDAO(conexao);

			return this.buildResponse(jdbcFuncionario.atualizarConfig(funcionario));
		}catch (Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}finally {
			conec.fecharConexao();
		}
	}

}//Finalizar a classe
