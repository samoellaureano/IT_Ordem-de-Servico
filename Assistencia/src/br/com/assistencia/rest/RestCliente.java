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
import br.com.assistencia.jdbc.JDBCClienteDAO;
import br.com.assistencia.jdbc.JDBCUsuarioDAO;
import br.com.assistencia.objetos.Cliente;
import br.com.assistencia.util.Validador;

@Path("clienteRest")//Caminho URI da classe Rest utilizada.
public class RestCliente extends UtilRest{

	public RestCliente(){
	}

	@POST
	@Path("/addCliente")
	@Consumes("application/*")
	public Response addCliente(String clienteParam){
		Conexao conec = new Conexao();
		try{				
			Connection conexao = conec.abrirConexao();
			Cliente cliente = new ObjectMapper().readValue(clienteParam, Cliente.class);

			JDBCClienteDAO jdbcCliente = new JDBCClienteDAO(conexao);
			JDBCUsuarioDAO jdbcUsuario = new JDBCUsuarioDAO(conexao);

			Validador.VCliente validadorCliente = new Validador.VCliente(jdbcCliente);
			Validador.VUsuario validadorUsuario = new Validador.VUsuario(jdbcUsuario);

			boolean valCliente = validadorCliente.verificaExistenciaBanco(cliente);
			boolean valUsuario = validadorUsuario.verificaExistenciaBanco(cliente.getUsuario());


			if(valCliente) {
				return this.buildResponse(2);
			}else {
				boolean retorno = false;
				if(!valUsuario) {
					retorno = jdbcUsuario.inserir(cliente.getUsuario());
				}
				retorno = jdbcCliente.inserir(cliente);
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
	@Path("/buscarClientes/{nome}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})

	public Response buscarClientes(@PathParam("nome") String nome){
		Conexao conec = new Conexao();
		try{
			Connection conexao = conec.abrirConexao();

			List<Cliente> listaCliente = new ArrayList<Cliente>();
			JDBCClienteDAO jdbcCliente = new JDBCClienteDAO(conexao);
			listaCliente = jdbcCliente.buscar(nome);

			conec.fecharConexao();				
			return this.buildResponse(listaCliente);
		}catch (Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}finally {
			conec.fecharConexao();
		}
	}

	//Busca por ID
	@POST
	@Path("buscarClientePeloId/{id}")
	@Produces({MediaType.APPLICATION_ATOM_XML,MediaType.APPLICATION_JSON})

	public Response buscarClientePeloId(@PathParam("id") int id){
		Conexao conec = new Conexao();
		try{
			Connection conexao = conec.abrirConexao();

			JDBCClienteDAO jdbcCliente = new JDBCClienteDAO(conexao);
			Cliente cliente = jdbcCliente.buscarPorId(id);

			conec.fecharConexao();
			return this.buildResponse(cliente);
		}catch (Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}finally {
			conec.fecharConexao();
		}
	}

	@POST
	@Path("/editarCliente")
	@Consumes("application/*")
	public Response editarCliente (String clienteParam){
		Conexao conec = new Conexao();
		try{
			Connection conexao = conec.abrirConexao();

			Cliente cliente = new ObjectMapper().readValue(clienteParam, Cliente.class);
			JDBCClienteDAO jdbcCliente = new JDBCClienteDAO(conexao);

			return this.buildResponse(jdbcCliente.atualizar(cliente));
		}catch (Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}finally {
			conec.fecharConexao();
		}
	}

	@POST
	@Path("/editarClienteConfig")
	@Consumes("application/*")
	public Response editarClienteConfig (String clienteParam){
		Conexao conec = new Conexao();
		try{
			Connection conexao = conec.abrirConexao();

			Cliente cliente = new ObjectMapper().readValue(clienteParam, Cliente.class);
			JDBCClienteDAO jdbcCliente = new JDBCClienteDAO(conexao);

			return this.buildResponse(jdbcCliente.atualizarConfig(cliente));
		}catch (Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}finally {
			conec.fecharConexao();
		}
	}

}//Finalizar a classe
