package br.com.assistencia.Servlet;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.codehaus.jackson.map.ObjectMapper;

import com.google.gson.Gson;

import br.com.assistencia.bd.conexao.Conexao;
import br.com.assistencia.jdbc.JDBCUsuarioDAO;
import br.com.assistencia.objetos.Usuario;
import br.com.assistencia.util.HashUtil;

@WebServlet("/VerificaLogin")
public class VerificaLogin extends HttpServlet {
	private static final long serialVersionUID = 1L;

	public VerificaLogin() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	private void process(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException, NoSuchAlgorithmException {

		Conexao conec = new Conexao();
		Connection conexao = conec.abrirConexao();
		
		//RECEBER OBJETO NA SERVLET
		
		HashUtil hash = new HashUtil();
				
		Usuario login = new ObjectMapper().readValue(request.getReader(), Usuario.class);
		
		String context = request.getServletContext().getContextPath();
				
		String senha = hash.stringToMD5(login.getSenha());
		
		JDBCUsuarioDAO jdbcUsuario = new JDBCUsuarioDAO(conexao);
		
		Usuario usuario = jdbcUsuario.buscar(login.getCpf());
		
		//System.out.println("Senha digitada   -> " + senha);
		//System.out.println("Senha armazenada -> " + usuario.getSenha());
		//System.out.println("CPF digitado   -> " + login.getCpf());
		//System.out.println("CPF digitado   -> " + usuario.getCpf());
		
		conec.fecharConexao();
		
		boolean retorno;
		if (login.getCpf().equals(usuario.getCpf()) && senha.equals(usuario.getSenha())) {
			HttpSession sessao = request.getSession();
			sessao.setAttribute("login", usuario.getCpf());
			sessao.setAttribute("perfil", usuario.getPerfil());
			sessao.setMaxInactiveInterval(30*60);			
			retorno = true;
		} else{
			
			retorno = false;
		}
		
		
		//Criando a mensagem para o usuário
		Map<String, String> msg = new HashMap<String, String>();
		if(retorno){
			msg.put("url", context + "/resources/principal.html");
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
		try {
			process(request, response);
		} catch (NoSuchAlgorithmException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	protected void doPost (HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
		try {
			process(request, response);
		} catch (NoSuchAlgorithmException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
