package br.com.assistencia.rest;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.POST;//A solicitação POST serve para atualizar um recurso existente ou para criar um novo recurso
import javax.ws.rs.Path;//Identifica o caminho do URI para o qual uma classe de recurso ou método de classe atenderá solicitações.
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.codehaus.jackson.map.ObjectMapper;

import br.com.assistencia.bd.conexao.Conexao;
import br.com.assistencia.jdbc.JDBCSubCategoriaDAO;
import br.com.assistencia.objetos.SubCategoria;

@Path("subCategoriaRest")//Caminho URI da classe Rest utilizada.
public class RestSubCategoria extends UtilRest{

	public RestSubCategoria(){
	}

	@POST
	@Path("/buscarSubCategorias/")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})

	public Response buscarSubCategorias(String subCategoriaParam){
		Conexao conec = new Conexao();
		try{				
			Connection conexao = conec.abrirConexao();
			SubCategoria subCategoria = new ObjectMapper().readValue(subCategoriaParam, SubCategoria.class);

			List<SubCategoria> listaSubCategorias = new ArrayList<SubCategoria>();
			JDBCSubCategoriaDAO jdbcSubCategoria = new JDBCSubCategoriaDAO(conexao);
			listaSubCategorias = jdbcSubCategoria.buscar(subCategoria);

			conec.fecharConexao();				
			return this.buildResponse(listaSubCategorias);
		}catch (Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}finally {
			conec.fecharConexao();
		}
	}
	
}//Finalizar a classe
