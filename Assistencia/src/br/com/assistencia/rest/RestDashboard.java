package br.com.assistencia.rest;

import java.sql.Connection;

import javax.ws.rs.POST;//A solicitação POST serve para atualizar um recurso existente ou para criar um novo recurso
import javax.ws.rs.Path;//Identifica o caminho do URI para o qual uma classe de recurso ou método de classe atenderá solicitações.
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import br.com.assistencia.bd.conexao.Conexao;
import br.com.assistencia.jdbc.JDBCDashboardDAO;
import br.com.assistencia.objetos.Dashboard;

@Path("dashRest")//Caminho URI da classe Rest utilizada.
public class RestDashboard extends UtilRest{

	public RestDashboard(){
	}
		
	//Busca dados
		@POST
		@Path("buscarDados")
		@Produces({MediaType.APPLICATION_ATOM_XML,MediaType.APPLICATION_JSON})

		public Response buscarDados(){
			
			Conexao conec = new Conexao();
			try{
				Connection conexao = conec.abrirConexao();
				
				Dashboard dash = new Dashboard();

				JDBCDashboardDAO jdbcDashboard = new JDBCDashboardDAO(conexao);
				dash = jdbcDashboard.busca();

				conec.fecharConexao();
				return this.buildResponse(dash);
			}catch (Exception e){
				e.printStackTrace();
				return this.buildErrorResponse(e.getMessage());
			}finally {
				conec.fecharConexao();
			}
		}
	
}//Finalizar a classe
