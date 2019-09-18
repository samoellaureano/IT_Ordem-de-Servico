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
import br.com.assistencia.jdbc.JDBCServicoDAO;
import br.com.assistencia.objetos.Funcionario;
import br.com.assistencia.objetos.Servico;

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
				jdbcServico.atualizar(servico);
				
				return this.buildResponse("Servico editado com sucesso");
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
				boolean resp = jdbcFuncionario.inserir(funcionario);
				
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
}//Finalizar a classe
