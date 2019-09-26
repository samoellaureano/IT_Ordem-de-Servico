package br.com.assistencia.jdbc;

import java.sql.Connection;
import java.sql.ResultSet;

import br.com.assistencia.jdbcinterface.UsuarioDAO;
import br.com.assistencia.objetos.CPF;
import br.com.assistencia.objetos.Usuario;

public class JDBCUsuarioDAO implements UsuarioDAO {

	private Connection conexao;

	public JDBCUsuarioDAO(Connection conexao) {
		this.conexao = conexao;
	}

	public Usuario buscar(CPF cpf) {

		String comando = "SELECT * FROM usuarios ";
		String login = cpf.getNumero();
		
		if (!login.equals("null") && !login.equals("")) {
			comando += "WHERE cpf = '" + login + "'";
		}

		Usuario usuario = new Usuario();
		java.sql.Statement stmt = null;
		ResultSet rs = null;
		try {
			stmt = conexao.createStatement();
			rs = stmt.executeQuery(comando);

			while (rs.next()) {
				String cpfLogin = rs.getString("cpf");
				String senha = rs.getString("senha");
				boolean status = rs.getBoolean("status");
				int perfil = rs.getInt("perfil");
				boolean status_recuperacao = rs.getBoolean("status_recuperacao");
				int id_recuperacao = rs.getInt("id_recuperacao");

				usuario.setCpf(new CPF(cpfLogin));
				usuario.setSenha(senha);
				usuario.setStatus(status);
				usuario.setPerfil(perfil);
				usuario.setStatus_recuperacao(status_recuperacao);
				usuario.setId_recuperacao(id_recuperacao);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return usuario;
	}
}
