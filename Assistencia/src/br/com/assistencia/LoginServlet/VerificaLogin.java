package br.com.assistencia.LoginServlet;

import java.io.IOException;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;

import br.com.assistencia.bd.conexao.Conexao;
import br.com.assistencia.jdbc.JDBCUsuarioDAO;
import br.com.assistencia.objetos.Usuario;

@WebServlet("/VerificaLogin")
public class VerificaLogin extends HttpServlet {
	private static final long serialVersionUID = 1L;

	public VerificaLogin() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	private void process(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		Conexao conec = new Conexao();
		Connection conexao = conec.abrirConexao();

		JDBCUsuarioDAO jdbcUsuario = new JDBCUsuarioDAO(conexao);
		
		Usuario usuario = new Usuario();
		usuario = jdbcUsuario.buscar(request.getParameter("inputCPF").toString());
		
		conec.fecharConexao();
		
		boolean retorno;
		if (Long.parseLong(request.getParameter("inputCPF")) == usuario.getCpf() &&
				request.getParameter("inputPassword").equals(usuario.getSenha())) {
			HttpSession sessao = request.getSession();
			sessao.setAttribute("login", request.getParameter("inputCPF"));
			sessao.setAttribute("login", request.getParameter("inputCPF"));
			
			retorno = true;
		} else{
			
			retorno = false;
		}
		//Criando a mensagem para o usuário
		Map<String, String> msg = new HashMap<String, String>();
		if(retorno){
			msg.put("url", "http://localhost:8080/Assistencia/resources/principal.html");
		}else{
			msg.put("msg", "Usuario ou senha incorretos!");
		}
		
		//Retorna a resposta para o usuário a partir do Json
		String json = new Gson().toJson(msg);
		
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(json);
	}

	protected void doGet (HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
		process(request, response);
	}

	protected void doPost (HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
		process(request, response);
	}

}
