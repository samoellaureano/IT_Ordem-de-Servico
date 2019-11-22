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
import br.com.assistencia.jdbc.JDBCBairroDAO;
import br.com.assistencia.jdbc.JDBCCidadeDAO;
import br.com.assistencia.jdbc.JDBCClienteDAO;
import br.com.assistencia.jdbc.JDBCEnderecoDAO;
import br.com.assistencia.jdbc.JDBCEstadoDAO;
import br.com.assistencia.jdbc.JDBCFuncionarioDAO;
import br.com.assistencia.jdbc.JDBCRuaDAO;
import br.com.assistencia.jdbc.JDBCServicoDAO;
import br.com.assistencia.jdbc.JDBCUsuarioDAO;
import br.com.assistencia.objetos.Bairro;
import br.com.assistencia.objetos.Cidade;
import br.com.assistencia.objetos.Cliente;
import br.com.assistencia.objetos.Endereco;
import br.com.assistencia.objetos.Estado;
import br.com.assistencia.objetos.Funcionario;
import br.com.assistencia.objetos.Rua;
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
	
	@POST
	@Path("/buscarCep/{cep}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})

	public Response buscarCep(@PathParam("cep") String cep){
		Conexao conec = new Conexao();
		try{
			Connection conexao = conec.abrirConexao();
			
			Endereco endereco = new Endereco();
			
			JDBCEnderecoDAO jdbcEndereco = new JDBCEnderecoDAO(conexao);
			endereco = jdbcEndereco.buscar(cep);

			conec.fecharConexao();				
			return this.buildResponse(endereco);
		}catch (Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}finally {
			conec.fecharConexao();
		}
	}
	
	@POST
	@Path("/buscarEstados")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})

	public Response buscarEstados(){
		Conexao conec = new Conexao();
		try{
			Connection conexao = conec.abrirConexao();
			List<Estado> estados = new ArrayList<Estado>();			

			JDBCEstadoDAO jdbcEstados = new JDBCEstadoDAO(conexao);
			estados = jdbcEstados.buscar();			

			return this.buildResponse(estados);
		}catch (Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}finally {
			conec.fecharConexao();
		}
	}
	
	@POST
	@Path("/buscarCidades/{idEstado}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})

	public Response buscarCidades(@PathParam("idEstado") int idEstado){
		Conexao conec = new Conexao();
		try{
			Connection conexao = conec.abrirConexao();
			List<Cidade> cidades = new ArrayList<Cidade>();			

			JDBCCidadeDAO jdbcCidade = new JDBCCidadeDAO(conexao);
			cidades = jdbcCidade.buscar(idEstado);			

			return this.buildResponse(cidades);
		}catch (Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}finally {
			conec.fecharConexao();
		}
	}
	
	@POST
	@Path("/buscarBairros/{idCidade}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})

	public Response buscarBairros(@PathParam("idCidade") int idCidade){
		Conexao conec = new Conexao();
		try{
			Connection conexao = conec.abrirConexao();
			List<Bairro> bairros = new ArrayList<Bairro>();			

			JDBCBairroDAO jdbcBairro = new JDBCBairroDAO(conexao);
			bairros = jdbcBairro.buscar(idCidade);			

			return this.buildResponse(bairros);
		}catch (Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}finally {
			conec.fecharConexao();
		}
	}
	
	@POST
	@Path("/buscarRuas/{idBairro}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})

	public Response buscarRuas(@PathParam("idBairro") int idBairro){
		Conexao conec = new Conexao();
		try{
			Connection conexao = conec.abrirConexao();
			List<Rua> ruas = new ArrayList<Rua>();			

			JDBCRuaDAO jdbcRua = new JDBCRuaDAO(conexao);
			ruas = jdbcRua.buscar(idBairro);			

			return this.buildResponse(ruas);
		}catch (Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}finally {
			conec.fecharConexao();
		}
	}

}//Finalizar a classe
