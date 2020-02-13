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
import br.com.assistencia.jdbc.JDBCUsuarioDAO;
import br.com.assistencia.objetos.Funcionario;
import br.com.assistencia.util.Validador;

@Path("funcionarioRest")//Caminho URI da classe Rest utilizada.
public class RestFuncionario extends UtilRest{

	public RestFuncionario(){
	}

	@POST
	@Path("/addFuncionario")
	@Consumes("application/*")
	public Response addFuncionario(String funcionarioParam){
		Conexao conec = new Conexao();
		try{
			Connection conexao = conec.abrirConexao();
			Funcionario funcionario = new ObjectMapper().readValue(funcionarioParam, Funcionario.class);

			JDBCFuncionarioDAO jdbcFuncionario = new JDBCFuncionarioDAO(conexao);
			JDBCUsuarioDAO jdbcUsuario = new JDBCUsuarioDAO(conexao);

			Validador.VFuncionario validadorFuncionario = new Validador.VFuncionario(jdbcFuncionario);
			Validador.VUsuario validadorUsuario = new Validador.VUsuario(jdbcUsuario);			

			boolean valFuncionario = validadorFuncionario.verificaExistenciaBanco(funcionario);
			boolean valUsuario = validadorUsuario.verificaExistenciaBanco(funcionario.getUsuario());

			if(valFuncionario) {
				return this.buildResponse(2);
			}else {
				boolean retorno = false;
				if(!valUsuario) {
					retorno = jdbcUsuario.inserir(funcionario.getUsuario());
				}
				retorno = jdbcUsuario.atualizarPerfil(funcionario.getUsuario());
				retorno = jdbcFuncionario.inserir(funcionario);				
				if(retorno) {
					return this.buildResponse(1);
				}else {
					return this.buildResponse(2);
				}
			}			
		}catch(Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}finally {
			conec.fecharConexao();
		}
	}

	@POST
	@Path("/buscarFuncionarios/{nome}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})

	public Response buscarFuncionarios(@PathParam("nome") String nome){
		Conexao conec = new Conexao();
		try{
			Connection conexao = conec.abrirConexao();

			List<Funcionario> funcionario = new ArrayList<Funcionario>();
			JDBCFuncionarioDAO jdbcFuncionario = new JDBCFuncionarioDAO(conexao);
			funcionario = jdbcFuncionario.buscar(nome);

			conec.fecharConexao();				
			return this.buildResponse(funcionario);
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
