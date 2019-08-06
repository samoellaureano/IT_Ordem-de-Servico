package br.com.assistencia.LoginServlet;

import java.io.IOException;
import java.sql.Connection;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

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
		usuario = jdbcUsuario.buscar(request.getParameter("login").toString());
		
		
		String context = "";
		if (Integer.parseInt(request.getParameter("inputCPF")) == usuario.getCpf() &&
				request.getParameter("inputPassword").equals(usuario.getSenha())) {
			HttpSession sessao = request.getSession();
			sessao.setAttribute("login", request.getParameter("inputCPF"));
			response.sendRedirect(context+"/resources/principal/principal.html");
		} else{
			response.sendRedirect(context+"/index.html");
		}
	}

	protected void doGet (HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
		process(request, response);
	}

	protected void doPost (HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
		process(request, response);
	}

}
