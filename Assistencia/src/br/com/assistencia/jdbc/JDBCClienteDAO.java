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

import br.com.assistencia.jdbcinterface.ClienteDAO;
import br.com.assistencia.objetos.CPF;
import br.com.assistencia.objetos.Cliente;
import br.com.assistencia.objetos.Usuario;
import br.com.assistencia.util.HashUtil;

public class JDBCClienteDAO implements ClienteDAO{

	private Connection conexao;

	public JDBCClienteDAO(Connection conexao) {
		this.conexao = conexao;
	}

	@Override
	public boolean inserir(Cliente cliente) throws NoSuchAlgorithmException, UnsupportedEncodingException {	

		Usuario usuario = cliente.getUsuario();

		HashUtil hash = new HashUtil();
		String senha = (usuario.getCpf() + "@" +Calendar.getInstance().get(Calendar.YEAR));
		senha = Base64.getEncoder().encodeToString(senha.getBytes());
		senha = hash.stringToMD5(senha);

		String comando = "INSERT INTO usuarios (cpf, senha, status, perfil, status_recuperacao, id_recuperacao) VALUES (?,?,?,?,?,?)";
		PreparedStatement p;

		try{
			p = this.conexao.prepareStatement(comando);
			p.setString(1, usuario.getCpf().getNumero());
			p.setString(2, senha);
			p.setBoolean(3, true);
			p.setInt(4, usuario.getPerfil());
			p.setBoolean(5, usuario.getStatus_recuperacao());
			p.setInt(6, usuario.getId_recuperacao());
			p.execute();

		}catch (SQLException e){
			System.out.println(e);
		}

		comando = "INSERT INTO clientes (nome, telefone, celular, email, usuarios_cpf) VALUES (?,?,?,?,?)";
		try{
			p = this.conexao.prepareStatement(comando);
			p.setString(1, cliente.getNome());
			p.setString(2, cliente.getTelefone());
			p.setString(3, cliente.getCelular());
			p.setString(4, cliente.getEmail());
			p.setString(5, usuario.getCpf().getNumero());
			p.execute();
		}catch (SQLException e){
			System.out.println(e);
		}

		return true;
	}

	@Override
	public List<Cliente> buscar(String nomeCliente) {
		String comando = "SELECT c.idCliente, c.nome, c.telefone, c.celular, c.email, u.cpf, u.senha, u.status FROM clientes as c\r\n" + 
				"inner join usuarios as u\r\n" + 
				"ON c.usuarios_cpf = u.cpf ";
		
		if(!nomeCliente.equals("null") && !nomeCliente.equals("")){
			comando += "WHERE c.nome LIKE '%" + nomeCliente + "%' ";
		}
		
		comando += "order by c.nome asc";

		List<Cliente> listCliente = new ArrayList<Cliente>();
		Cliente cliente = null;
		Usuario usuario = null;
		try{
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while(rs.next()){
				cliente = new Cliente();
				int idCliente = rs.getInt("idCliente");
				String nome = rs.getString("nome");
				String telefone = rs.getString("telefone");
				String celular = rs.getString("celular");
				String email = rs.getString("email");
				
				cliente.setIdCliente(idCliente);
				cliente.setNome(nome);
				cliente.setTelefone(telefone);
				cliente.setCelular(celular);
				cliente.setEmail(email);
				
				usuario = new Usuario();
				String cpf = rs.getString("cpf");
				boolean status = rs.getBoolean("status");
				
				usuario.setCpf(new CPF(cpf));
				usuario.setStatus(status);
				
				cliente.setUsuario(usuario);
				
				listCliente.add(cliente);
			}
		}catch(Exception e){
			e.printStackTrace();
		}

		return listCliente;
	}

}
