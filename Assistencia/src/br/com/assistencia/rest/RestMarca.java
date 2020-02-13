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
import br.com.assistencia.jdbc.JDBCMarcaDAO;
import br.com.assistencia.objetos.Marca;

@Path("marcaRest")//Caminho URI da classe Rest utilizada.
public class RestMarca extends UtilRest{

	public RestMarca(){
	}
	
	@POST
	@Path("/buscarMarcas/{marcas}")
	@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})

	public Response buscarMarcas(@PathParam("marcas") String nome){
		Conexao conec = new Conexao();
		try{
			Connection conexao = conec.abrirConexao();

			List<Marca> listaMarcas = new ArrayList<Marca>();
			JDBCMarcaDAO jdbcMarca = new JDBCMarcaDAO(conexao);
			listaMarcas = jdbcMarca.buscar(nome);

			conec.fecharConexao();				
			return this.buildResponse(listaMarcas);
		}catch (Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}finally {
			conec.fecharConexao();
		}
	}

}//Finalizar a classe
