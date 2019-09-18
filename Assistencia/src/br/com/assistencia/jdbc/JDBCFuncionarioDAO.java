package br.com.assistencia.jdbc;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Calendar;
import java.util.List;

import br.com.assistencia.jdbcinterface.FuncionarioDAO;
import br.com.assistencia.objetos.Funcionario;
import br.com.assistencia.objetos.Usuario;
import br.com.assistencia.util.HashUtil;
public class JDBCFuncionarioDAO implements FuncionarioDAO{

	private Connection conexao;

	public JDBCFuncionarioDAO (Connection conexao){
		this.conexao = conexao;
	}
	
	public boolean inserir(Funcionario funcionario) throws NoSuchAlgorithmException, UnsupportedEncodingException {	
		Usuario usuario = funcionario.getUsuario();
		
		HashUtil hash = new HashUtil();
		String senha = (usuario.getCpf() + "@" +Calendar.getInstance().get(Calendar.YEAR));
		senha = Base64.getEncoder().encodeToString(senha.getBytes());
		senha = hash.stringToMD5(senha);
		
		String comando = "INSERT INTO usuarios (cpf, senha, status, perfil, status_recuperacao, id_recuperacao) VALUES (?,?,?,?,?,?)";
		PreparedStatement p;
		
		try{
			p = this.conexao.prepareStatement(comando);
			p.setString(1, usuario.getCpf());
			p.setString(2, senha);
			p.setBoolean(3, true);
			p.setInt(4, usuario.getPerfil());
			p.setBoolean(5, usuario.getStatus_recuperacao());
			p.setInt(6, usuario.getId_recuperacao());
			p.execute();
			
		}catch (SQLException e){
			System.out.println(e);
			return false;
		}
		
		comando = "INSERT INTO funcionarios (nome, email, usuarios_cpf) VALUES (?,?,?)";
		try{
			p = this.conexao.prepareStatement(comando);
			p.setString(1, funcionario.getNome());
			p.setString(2, funcionario.getEmail());
			p.setString(3, usuario.getCpf());
			p.execute();
		}catch (SQLException e){
			System.out.println(e);
			return false;
		}
		return true;
	}

	@Override
	public List<Funcionario> buscar(String nomeFuncionario) {
		String comando = "SELECT f.idfuncionario, f.nome, f.email, u.cpf, u.senha, u.status, u.perfil FROM funcionarios as f\r\n" + 
				"inner join usuarios as u\r\n" + 
				"ON f.usuarios_cpf = u.cpf ";
		
		if(!nomeFuncionario.equals("null") && !nomeFuncionario.equals("")){
			comando += "WHERE f.nome LIKE '%" + nomeFuncionario + "%' ";
		}
		
		comando += "order by f.nome asc";

		List<Funcionario> listFuncionarios = new ArrayList<Funcionario>();
		Funcionario funcionario = null;
		Usuario usuario = null;
		try{
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while(rs.next()){
				funcionario = new Funcionario();
				int idFuncionario = rs.getInt("idFuncionario");
				String nome = rs.getString("nome");
				String email = rs.getString("email");
				
				funcionario.setIdFuncionario(idFuncionario);
				funcionario.setNome(nome);
				funcionario.setEmail(email);
				
				usuario = new Usuario();
				String cpf = rs.getString("cpf");
				boolean status = rs.getBoolean("status");
				int perfil = rs.getInt("perfil");
				
				usuario.setCpf(cpf);
				usuario.setStatus(status);
				usuario.setPerfil(perfil);
				
				funcionario.setUsuario(usuario);
				
				listFuncionarios.add(funcionario);
			}
		}catch(Exception e){
			e.printStackTrace();
		}

		return listFuncionarios;
	}

	@Override
	public Funcionario buscarPorId(int id) {
		String comando = "SELECT f.idfuncionario, f.nome, f.email, u.cpf, u.senha, u.status, u.perfil FROM funcionarios as f\r\n" + 
				"inner join usuarios as u\r\n" + 
				"ON f.usuarios_cpf = u.cpf WHERE idFuncionario=" + id;
		Funcionario funcionario = null;
		Usuario usuario = null;
		try{
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while(rs.next()){
				funcionario = new Funcionario();
				int idFuncionario = rs.getInt("idFuncionario");
				String nome = rs.getString("nome");
				String email = rs.getString("email");
				
				funcionario.setIdFuncionario(idFuncionario);
				funcionario.setNome(nome);
				funcionario.setEmail(email);
				
				usuario = new Usuario();
				String cpf = rs.getString("cpf");
				boolean status = rs.getBoolean("status");
				int perfil = rs.getInt("perfil");
				
				usuario.setCpf(cpf);
				usuario.setStatus(status);
				usuario.setPerfil(perfil);
				
				funcionario.setUsuario(usuario);
			}
		}catch (Exception e){
			e.printStackTrace();
		}
		return funcionario;
	}

	@Override
	public boolean atualizar(Funcionario funcionario) {
		// TODO Auto-generated method stub
		return false;
	}

}
