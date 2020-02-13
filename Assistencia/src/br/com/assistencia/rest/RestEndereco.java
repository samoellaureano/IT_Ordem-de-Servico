package br.com.assistencia.rest;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.POST;//A solicitação POST serve para atualizar um recurso existente ou para criar um novo recurso
import javax.ws.rs.Path;//Identifica o caminho do URI para o qual uma classe de recurso ou método de classe atenderá solicitações.
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import br.com.assistencia.bd.conexao.Conexao;
import br.com.assistencia.jdbc.JDBCBairroDAO;
import br.com.assistencia.jdbc.JDBCCidadeDAO;
import br.com.assistencia.jdbc.JDBCEnderecoDAO;
import br.com.assistencia.jdbc.JDBCEstadoDAO;
import br.com.assistencia.jdbc.JDBCRuaDAO;
import br.com.assistencia.objetos.Bairro;
import br.com.assistencia.objetos.Cidade;
import br.com.assistencia.objetos.Endereco;
import br.com.assistencia.objetos.Estado;
import br.com.assistencia.objetos.Rua;

@Path("enderecoRest")//Caminho URI da classe Rest utilizada.
public class RestEndereco extends UtilRest{

	public RestEndereco(){
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
