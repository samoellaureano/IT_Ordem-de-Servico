package br.com.assistencia.jdbc;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import br.com.assistencia.jdbcinterface.FuncionarioDAO;
import br.com.assistencia.objetos.CPF;
import br.com.assistencia.objetos.Cliente;
import br.com.assistencia.objetos.Funcionario;
import br.com.assistencia.objetos.Usuario;
public class JDBCFuncionarioDAO implements FuncionarioDAO{

	private Connection conexao;

	public JDBCFuncionarioDAO (Connection conexao){
		this.conexao = conexao;
	}

	public boolean inserir(Funcionario funcionario) throws NoSuchAlgorithmException, UnsupportedEncodingException {
		Usuario usuario = funcionario.getUsuario();

		String comando = "INSERT INTO funcionarios (nome, email, status, usuarios_cpf) VALUES (?,?,?,?)";
		PreparedStatement p;
		try{
			p = this.conexao.prepareStatement(comando);
			p.setString(1, funcionario.getNome());
			p.setString(2, funcionario.getEmail());
			p.setBoolean(3, true);
			p.setString(4, usuario.getCpf().getNumero());
			p.execute();
		}catch (SQLException e){
			System.out.println(e);
			return false;
		}
		return true;
	}

	@Override
	public List<Funcionario> buscar(String nomeFuncionario) {
		String comando = "SELECT f.idFuncionario, f.nome, f.email, f.status, u.cpf, u.senha, u.perfil FROM funcionarios as f " + 
				"inner join usuarios as u " + 
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
				boolean status = rs.getBoolean("status");

				funcionario.setIdFuncionario(idFuncionario);
				funcionario.setNome(nome);
				funcionario.setEmail(email);
				funcionario.setStatus(status);

				usuario = new Usuario();
				String cpf = rs.getString("cpf");
				int perfil = rs.getInt("perfil");

				usuario.setCpf(new CPF(cpf));
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
		String comando = "SELECT f.idFuncionario, f.nome, f.email, f.status, u.cpf, u.senha, u.perfil FROM funcionarios as f " + 
				"inner join usuarios as u " + 
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
				boolean status = rs.getBoolean("status");

				funcionario.setIdFuncionario(idFuncionario);
				funcionario.setNome(nome);
				funcionario.setEmail(email);
				funcionario.setStatus(status);

				usuario = new Usuario();
				String cpf = rs.getString("cpf");				
				int perfil = rs.getInt("perfil");

				usuario.setCpf(new CPF(cpf));
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

		PreparedStatement p;
		Usuario usuario = funcionario.getUsuario();

		String comando = "UPDATE usuarios SET perfil=?, status_recuperacao=?, id_recuperacao=? WHERE cpf=" + usuario.getCpf().getNumero();

		JDBCClienteDAO jdbcCliente = new JDBCClienteDAO(conexao);
		Cliente cliente = new Cliente();
		cliente = jdbcCliente.buscarPorCpf(usuario.getCpf().getNumero());
		
		
		if((!funcionario.getStatus()) && (cliente.getNome() != null)) {
			usuario.setPerfil(2);
		}
		try{
			p = this.conexao.prepareStatement(comando);
			p.setInt(1, usuario.getPerfil());
			p.setBoolean(2, usuario.getStatus_recuperacao());
			p.setInt(3, usuario.getId_recuperacao());
			p.execute();

		}catch (SQLException e){
			System.out.println(e);
			return false;
		}

		comando = "UPDATE funcionarios SET nome=?, email=?, status=? WHERE idFuncionario=" + funcionario.getIdFuncionario();

		try{
			p = this.conexao.prepareStatement(comando);
			p.setString(1, funcionario.getNome());
			p.setString(2, funcionario.getEmail());
			p.setBoolean(3, funcionario.getStatus());
			p.execute();
		}catch (SQLException e){
			System.out.println(e);
			return false;
		}
		return true;
	}

	public Funcionario consultarFuncionarioExistente(Funcionario funcionario) {
		Usuario usuario = funcionario.getUsuario();
		funcionario.setIdFuncionario(0);

		String comando = "SELECT f.idFuncionario FROM funcionarios as f " + 
				"inner join usuarios as u " + 
				"ON f.usuarios_cpf = u.cpf " + 
				"where u.cpf = '"+usuario.getCpf().getNumero()+"';";
		try{
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while(rs.next()){
				int idFuncionario = rs.getInt("idFuncionario");

				funcionario.setIdFuncionario(idFuncionario);
			}
		}catch (Exception e){
			e.printStackTrace();
		}
		return funcionario;
	}
	
	@Override
	public Funcionario buscarPorCpf(String cpf) {
		String comando = "select nome from funcionarios " + 
				"where usuarios_cpf like '" + cpf + "';";

		Funcionario funcionario = new Funcionario();
		try{
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while(rs.next()){
				funcionario.setNome(rs.getString("nome"));
			}
		}catch (Exception e){
			e.printStackTrace();
		}
		return funcionario;
	}

}
