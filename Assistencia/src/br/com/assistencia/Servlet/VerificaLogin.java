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
import br.com.assistencia.jdbc.JDBCClienteDAO;
import br.com.assistencia.jdbc.JDBCFuncionarioDAO;
import br.com.assistencia.jdbc.JDBCUsuarioDAO;
import br.com.assistencia.objetos.Cliente;
import br.com.assistencia.objetos.Funcionario;
import br.com.assistencia.objetos.Usuario;
import br.com.assistencia.util.Login;

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

		Usuario loginFront = new ObjectMapper().readValue(request.getReader(), Usuario.class);

		String context = request.getServletContext().getContextPath();
		loginFront.setSenhaCriptografada(loginFront.getSenha());

		Login login = new Login(new JDBCUsuarioDAO(conexao));

		boolean retorno = false;
		HttpSession sessao = request.getSession();

		if(conexao != null) {
			if (login.autenticaUsuario(loginFront)) {
				sessao.setAttribute("login", login.usuarioAutenticado().getCpf().getNumero());				
				sessao.setAttribute("perfil", login.usuarioAutenticado().getPerfil());
				
				String cpfLogado = (login.usuarioAutenticado().getCpf().getNumero());
				
				JDBCFuncionarioDAO jdbcFuncionario = new JDBCFuncionarioDAO(conexao);
				Funcionario funcionario = new Funcionario();
				funcionario = jdbcFuncionario.buscarPorCpf(cpfLogado);
				
				JDBCClienteDAO jdbcCliente = new JDBCClienteDAO(conexao);
				Cliente cliente = new Cliente();
				cliente = jdbcCliente.buscarPorCpf(cpfLogado);
				
				if((funcionario.getNome() != null)&&(funcionario.getStatus() == true)) {//Adicionar a verificação do Status do funcionario == true
					sessao.setAttribute("nome", funcionario.getNome().toString());
					retorno = true;
				}
				if(cliente.getNome() != null) {//Adicionar a verificação do Status do cliente == true
					sessao.setAttribute("nome", cliente.getNome().toString());
					retorno = true;
				}
				if(loginFront.getCpf().toString().equals("00000000000")) {
					retorno = true;
				}
				
				sessao.setMaxInactiveInterval(30*60);
			} else{			
				retorno = false;
			}
		}

		conec.fecharConexao();		

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
