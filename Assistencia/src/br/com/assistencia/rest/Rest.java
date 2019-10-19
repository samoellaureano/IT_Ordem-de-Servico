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
import br.com.assistencia.jdbc.JDBCFuncionarioDAO;
import br.com.assistencia.jdbc.JDBCServicoDAO;
import br.com.assistencia.objetos.Cliente;
import br.com.assistencia.objetos.Funcionario;
import br.com.assistencia.objetos.Servico;
import br.com.assistencia.util.Validador;

@Path("classRest")//Caminho URI da classe Rest utilizada.
public class Rest extends UtilRest{

	public Rest(){
	}

	@POST
	@Path("/addServico")
	@Consumes("application/*")
	public Response addServico(String servicoParam){
		Conexao conec = new Conexao();
		try{
			Connection conexao = conec.abrirConexao();
			Servico servico = new ObjectMapper().readValue(servicoParam, Servico.class);
			
			JDBCServicoDAO jdbcServico = new JDBCServicoDAO(conexao);
			boolean resp = jdbcServico.inserir(servico);
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
	@Path("/buscarServicos/{desc}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
	
	public Response buscarServicos(@PathParam("desc") String desc){
		Conexao conec = new Conexao();
		try{
			Connection conexao = conec.abrirConexao();
			List<Servico> servicos = new ArrayList<Servico>();			
			
			JDBCServicoDAO jdbcServico = new JDBCServicoDAO(conexao);
			servicos = jdbcServico.buscar(desc);			
			
			return this.buildResponse(servicos);
		}catch (Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}finally {
			conec.fecharConexao();
		}
	}
	
	//Busca por ID
	@POST
	@Path("buscarServicoPeloId/{id}")
	@Produces({MediaType.APPLICATION_ATOM_XML,MediaType.APPLICATION_JSON})
	
	public Response buscarServicoPeloId(@PathParam("id") int id){
		Conexao conec = new Conexao();
		try{
			Connection conexao = conec.abrirConexao();
			
			JDBCServicoDAO jdbcServico = new JDBCServicoDAO(conexao);
			Servico servico = jdbcServico.buscarPorId(id);
			
			return this.buildResponse(servico);
		}catch (Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}finally {
			conec.fecharConexao();
		}
	}
	
	//Edita servico
		@POST
		@Path("/editarServico")
		@Consumes("application/*")
		public Response editarServico (String servicoParam){
			Conexao conec = new Conexao();
			try{
				Connection conexao = conec.abrirConexao();
				
				Servico servico = new ObjectMapper().readValue(servicoParam, Servico.class);
				JDBCServicoDAO jdbcServico = new JDBCServicoDAO(conexao);
				
				return this.buildResponse(jdbcServico.atualizar(servico));
			}catch (Exception e){
				e.printStackTrace();
				return this.buildErrorResponse(e.getMessage());
			}finally {
				conec.fecharConexao();
			}
		}
		//FINALIZA SERVICO
		
		@POST
		@Path("/addFuncionario")
		@Consumes("application/*")
		public Response addFuncionario(String funcionarioParam){
			Conexao conec = new Conexao();
			try{
				Connection conexao = conec.abrirConexao();
				Funcionario funcionario = new ObjectMapper().readValue(funcionarioParam, Funcionario.class);

				JDBCFuncionarioDAO jdbcFuncionario = new JDBCFuncionarioDAO(conexao);
				
				Validador.VFuncionario validadorFuncionario = new Validador.VFuncionario(jdbcFuncionario);
				
				boolean valFuncionario = validadorFuncionario.verificaExistenciaBanco(funcionario);
				
				if(valFuncionario) {
					return this.buildResponse(2);
				}else {
					jdbcFuncionario.inserir(funcionario);
					return this.buildResponse(1);
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
		
		//FINALIZA FUNCIONARIO
		
		@POST
		@Path("/addCliente")
		@Consumes("application/*")
		public Response addCliente(String clienteParam){
			Conexao conec = new Conexao();
			try{				
				Connection conexao = conec.abrirConexao();
				Cliente cliente = new ObjectMapper().readValue(clienteParam, Cliente.class);

				JDBCClienteDAO jdbcCliente = new JDBCClienteDAO(conexao);
				
				Validador.VCliente validadorCliente = new Validador.VCliente(jdbcCliente);
				
				boolean valCliente = validadorCliente.verificaExistenciaBanco(cliente);
				
				if(valCliente) {
					return this.buildResponse(2);
				}else {
					jdbcCliente.inserir(cliente);
					return this.buildResponse(1);
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
		
}//Finalizar a classe
