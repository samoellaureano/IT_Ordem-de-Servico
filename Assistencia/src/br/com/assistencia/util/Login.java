package br.com.assistencia.util;

import br.com.assistencia.jdbc.JDBCUsuarioDAO;
import br.com.assistencia.objetos.Usuario;

public class Login {
	
	private JDBCUsuarioDAO jdbcUsuario;
	private Usuario usuarioAutenticado;
	public Login(JDBCUsuarioDAO jdbcUsuario) {
		this.jdbcUsuario = jdbcUsuario;
	}
	
	public boolean autenticaUsuario(Usuario login) {
		this.usuarioAutenticado = jdbcUsuario.buscar(login.getCpf());
		//System.out.println("Senha do banco - " +this.usuarioAutenticado.getSenha());
		return login.equals(this.usuarioAutenticado);
	}
	
	public Usuario usuarioAutenticado() {
		return usuarioAutenticado;
	}
	
	
}
