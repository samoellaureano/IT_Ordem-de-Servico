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
import br.com.assistencia.jdbc.JDBCTipoDAO;
import br.com.assistencia.objetos.Tipo;

@Path("tipoRest")//Caminho URI da classe Rest utilizada.
public class RestTipo extends UtilRest{

	public RestTipo(){
	}
	
	@POST
	@Path("/buscarTipos/{nome}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})

	public Response buscarTipos(@PathParam("nome") String nome){
		Conexao conec = new Conexao();
		try{
			Connection conexao = conec.abrirConexao();

			List<Tipo> listaTipos = new ArrayList<Tipo>();
			JDBCTipoDAO jdbcTipo = new JDBCTipoDAO(conexao);
			listaTipos = jdbcTipo.buscar(nome);

			conec.fecharConexao();				
			return this.buildResponse(listaTipos);
		}catch (Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}finally {
			conec.fecharConexao();
		}
	}

}//Finalizar a classe
