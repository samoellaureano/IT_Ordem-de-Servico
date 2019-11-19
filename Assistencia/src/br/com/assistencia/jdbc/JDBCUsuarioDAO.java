package br.com.assistencia.jdbc;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Base64;

import br.com.assistencia.jdbcinterface.UsuarioDAO;
import br.com.assistencia.objetos.CPF;
import br.com.assistencia.objetos.Usuario;
import br.com.assistencia.util.HashUtil;

public class JDBCUsuarioDAO implements UsuarioDAO {

	private Connection conexao;

	public JDBCUsuarioDAO(Connection conexao) {
		this.conexao = conexao;
	}
	
	public String consultarUsuarioExistente(Usuario usuario) {
		String cpf = "";
		
		String comando = "SELECT u.cpf FROM usuarios as u " +
				"where u.cpf = '"+usuario.getCpf().getNumero()+"';";
		try{
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while(rs.next()){
				cpf = rs.getString("cpf");
			}
		}catch (Exception e){
			e.printStackTrace();
		}
		return cpf;
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
				int perfil = rs.getInt("perfil");
				boolean status_recuperacao = rs.getBoolean("status_recuperacao");
				int id_recuperacao = rs.getInt("id_recuperacao");

				usuario.setCpf(new CPF(cpfLogin));
				usuario.setSenha(senha);
				usuario.setPerfil(perfil);
				usuario.setStatus_recuperacao(status_recuperacao);
				usuario.setId_recuperacao(id_recuperacao);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return usuario;
	}

	@Override
	public boolean inserir(Usuario usuario) {
		HashUtil hash = new HashUtil();
		
		String senha = Base64.getEncoder().encodeToString(usuario.getCpf().getNumero().getBytes());		
		//System.out.println("Senha do cadastro - "+senha);
		
		senha = (senha+ "321#cAsA");
		//System.out.println("Senha do cadastro concatenada - "+senha);	
		
		try {
			senha = hash.stringToMD5(senha);
			//System.out.println("Senha do cadastro criptografada - "+senha);
		} catch (NoSuchAlgorithmException e1) {
			e1.printStackTrace();
		} catch (UnsupportedEncodingException e1) {
			e1.printStackTrace();
		}
		
		String comando = "INSERT INTO usuarios (cpf, senha, perfil, status_recuperacao, id_recuperacao) VALUES (?,?,?,?,?)";
		PreparedStatement p;

		try{
			p = this.conexao.prepareStatement(comando);
			p.setString(1, usuario.getCpf().getNumero());
			p.setString(2, senha);
			p.setInt(3, usuario.getPerfil());
			p.setBoolean(4, usuario.getStatus_recuperacao());
			p.setInt(5, usuario.getId_recuperacao());
			p.execute();
			return true;
		}catch (SQLException e){
			System.out.println(e);
		}
		return false;
	}

	public boolean atualizarPerfil(Usuario usuario) {
		String comando = "UPDATE usuarios SET perfil=?  WHERE cpf= '"+usuario.getCpf().getNumero()+"';";
		PreparedStatement p;
		
		try{
			p = this.conexao.prepareStatement(comando);
			p.setInt(1, usuario.getPerfil());
			p.execute();
		}catch (SQLException e){
			System.out.println(e);
			return false;
		}
		return true;
	}
}
