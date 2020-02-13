package br.com.assistencia.rest;

import java.sql.Connection;

import javax.ws.rs.Consumes;//Define os tipos de midia que os métodos podem aceitar.
import javax.ws.rs.POST;//A solicitação POST serve para atualizar um recurso existente ou para criar um novo recurso
import javax.ws.rs.Path;//Identifica o caminho do URI para o qual uma classe de recurso ou método de classe atenderá solicitações.
import javax.ws.rs.core.Response;

import org.codehaus.jackson.map.ObjectMapper;

import br.com.assistencia.bd.conexao.Conexao;
import br.com.assistencia.jdbc.JDBCUsuarioDAO;
import br.com.assistencia.objetos.Usuario;
import br.com.assistencia.util.Login;

@Path("configUsuarioLogadoRest")//Caminho URI da classe Rest utilizada.
public class RestConfigUsuarioLogado extends UtilRest{

	public RestConfigUsuarioLogado(){
	}


	@POST
	@Path("/validaSenhaAtual")
	@Consumes("application/*")
	public Response validaSenha(String user){
		Conexao conec = new Conexao();
		try{				
			Connection conexao = conec.abrirConexao();
			Usuario userSenha = new ObjectMapper().readValue(user, Usuario.class);

			userSenha.setSenhaCriptografada(userSenha.getSenha());
			Login login = new Login(new JDBCUsuarioDAO(conexao));


			//JDBCUsuarioDAO jdbcUsuario = new JDBCUsuarioDAO(conexao);

			//metodo JDBC para pegar a senha

			if (login.autenticaUsuario(userSenha)) {
				//jdbcUsuario.salvaNovaSenha(userSenha);
				conec.fecharConexao();
				return this.buildResponse(true);				
			}
			conec.fecharConexao();
			return this.buildResponse(false);			
		}catch (Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}finally {
			conec.fecharConexao();
		}
	}

	@POST
	@Path("/salvaSenha")
	@Consumes("application/*")
	public Response salvaSenha(String user){
		
		Conexao conec = new Conexao();
		try {
			Usuario userSenha = new ObjectMapper().readValue(user, Usuario.class);
			userSenha.setSenhaCriptografada(userSenha.getSenha());
			Connection conexao = conec.abrirConexao();
			JDBCUsuarioDAO jdbcUsuario = new JDBCUsuarioDAO(conexao);
			boolean retorno = jdbcUsuario.salvaNovaSenha(userSenha);
			conec.fecharConexao();

			if(retorno) {
				return this.buildResponse(true);
			}else {
				return this.buildResponse(false);
			}	
		}catch (Exception e){
			e.printStackTrace();
			return this.buildErrorResponse(e.getMessage());
		}finally {
			conec.fecharConexao();
		}
	}

}//Finalizar a classe
