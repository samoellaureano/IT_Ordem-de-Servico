package br.com.assistencia.Servlet;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.google.gson.Gson;

@WebServlet("/buscarDadosSessao")
public class buscarDadosSessao extends HttpServlet {
	private static final long serialVersionUID = 1L;
	public buscarDadosSessao() {
		super();
	}

	private void process(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException, NoSuchAlgorithmException {
		HttpSession sessao = request.getSession();

		//Criando a mensagem para o usuário
		Map<String, String> msg = new HashMap<String, String>();
		msg.put("login", sessao.getAttribute("login").toString());
		msg.put("perfil", sessao.getAttribute("perfil").toString());
		if(sessao.getAttribute("nome") != null) {
			msg.put("nome", sessao.getAttribute("nome").toString());
		}
		
		//Retorna a resposta para o usuário a partir do Json
		String json = new Gson().toJson(msg);

		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(json);

	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			process(request, response);
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
	}
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			process(request, response);
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
	}

}
