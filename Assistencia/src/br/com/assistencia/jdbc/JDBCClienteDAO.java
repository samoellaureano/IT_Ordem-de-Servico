package br.com.assistencia.jdbc;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import br.com.assistencia.jdbcinterface.ClienteDAO;
import br.com.assistencia.objetos.CPF;
import br.com.assistencia.objetos.Cliente;
import br.com.assistencia.objetos.Endereco;
import br.com.assistencia.objetos.Usuario;

public class JDBCClienteDAO implements ClienteDAO{

	private Connection conexao;

	public JDBCClienteDAO(Connection conexao) {
		this.conexao = conexao;
	}

	@Override
	public boolean inserir(Cliente cliente) throws NoSuchAlgorithmException, UnsupportedEncodingException {	

		Usuario usuario = cliente.getUsuario();
		Endereco endereco = cliente.getEndereco();
		
		String comando = "INSERT INTO enderecos (numero, complemento, ruas_idRua) VALUES (?,?,?)";
		PreparedStatement p;
		
		try{
			p = this.conexao.prepareStatement(comando);
			p.setInt(1, endereco.getNumero());
			p.setString(2, endereco.getComplemento());
			p.setInt(3, endereco.getIdRua());
			p.execute();
		}catch (SQLException e){
			System.out.println(e);
		}
		/*
		comando = "SELECT MAX(idEndereco) as idEndereco FROM enderecos";
		
		try {
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet ultimoIdEndereco = stmt.executeQuery(comando);
			while(ultimoIdEndereco.next()){
				endereco.setIdEndereco(ultimoIdEndereco.getInt("idEndereco"));
			}			
		}catch (SQLException e){
			System.out.println(e);
		}
		*/

		comando = "INSERT INTO clientes (nome, telefone, telefoneAux, email, status, enderecos_idEndereco, usuarios_cpf) " + 
				"VALUES (?,?,?,?,?,last_insert_ID(),?);";
		
		try{
			p = this.conexao.prepareStatement(comando);
			p.setString(1, cliente.getNome());
			p.setString(2, cliente.getTelefone());
			p.setString(3, cliente.getTelefoneAux());
			p.setString(4, cliente.getEmail());
			p.setBoolean(5, true);
			p.setString(6, usuario.getCpf().getNumero());
			p.execute();
		}catch (SQLException e){
			System.out.println(e);
		}

		return true;
	}

	@Override
	public List<Cliente> buscar(String nomeCliente) {
		String comando = "SELECT c.idCliente, c.nome, c.telefone, c.telefoneAux, c.email, c.status, u.cpf FROM clientes as c " + 
				"inner join usuarios as u " + 
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
				String telefoneAux = rs.getString("telefoneAux");
				String email = rs.getString("email");
				boolean status = rs.getBoolean("status");
				
				cliente.setIdCliente(idCliente);
				cliente.setNome(nome);
				cliente.setTelefone(telefone);
				cliente.setTelefoneAux(telefoneAux);
				cliente.setEmail(email);
				cliente.setStatus(status);
				
				usuario = new Usuario();
				String cpf = rs.getString("cpf");
				
				usuario.setCpf(new CPF(cpf));
				
				cliente.setUsuario(usuario);
				
				listCliente.add(cliente);
			}
		}catch(Exception e){
			e.printStackTrace();
		}

		return listCliente;
	}
	
	public Cliente consultarClienteExistente(Cliente cliente) {
		Usuario usuario = cliente.getUsuario();
		cliente.setIdCliente(0);
		
		String comando = "SELECT c.idCliente FROM clientes as c " + 
				"inner join usuarios as u " + 
				"ON c.usuarios_cpf = u.cpf " + 
				"where u.cpf = '"+usuario.getCpf().getNumero()+"';";
		try{
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while(rs.next()){
				int idCliente = rs.getInt("idCliente");
				cliente.setIdCliente(idCliente);
			}
		}catch (Exception e){
			e.printStackTrace();
		}
		return cliente;
	}

	public Cliente buscarPorId(int id) {
		String comando = "SELECT u.cpf, u.senha, u.perfil, e.nome as estado, c.nome as cidade, b.nome as bairro , r.idRua as idRua, r.nome as rua,  " + 
				"en.idEndereco as idEndereco, en.numero as numero, r.cep as cep,  en.complemento as complemento,  " + 
				"cl.idCliente as idCliente, cl.nome as nome, cl.telefone as telefone, cl.telefoneAux as telefoneAux, cl.email as email, cl.status as status FROM clientes as cl " + 
				"inner join usuarios as u " + 
				"on cl.usuarios_cpf = u.cpf " + 
				"inner join enderecos as en " + 
				"on cl.enderecos_idEndereco = en.idEndereco " + 
				"inner join ruas as r " + 
				"on en.ruas_idRua = r.idRua " + 
				"inner join bairros as b " + 
				"on r.bairros_idBairro = b.idBairro " + 
				"inner join cidades as c " + 
				"on b.cidades_idCidade = c.idCidade " + 
				"inner join estados as e " + 
				"on c.estados_idEstado = e.idEstado " + 
				"where cl.idCliente = " + id;
		Cliente cliente = null;
		Usuario usuario = null;
		Endereco endereco = null;
		try{
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while(rs.next()){
				cliente = new Cliente();
				
				int idCliente = rs.getInt("idCliente");
				String nome = rs.getString("nome");
				String email = rs.getString("email");
				boolean status = rs.getBoolean("status");
				String telefone = rs.getString("telefone");
				String telefoneAux = rs.getString("telefoneAux");
				
				cliente.setIdCliente(idCliente);
				cliente.setNome(nome);
				cliente.setEmail(email);
				cliente.setStatus(status);
				cliente.setTelefone(telefone);
				cliente.setTelefoneAux(telefoneAux);
				
				usuario = new Usuario();
				String cpf = rs.getString("cpf");
				int perfil = rs.getInt("perfil");
				
				usuario.setCpf(new CPF(cpf));
				usuario.setPerfil(perfil);
				
				endereco = new Endereco();
				String estado = rs.getString("estado");
				String cidade = rs.getString("cidade");
				String bairro = rs.getString("bairro");
				String rua = rs.getString("rua");
				int numero = rs.getInt("numero");
				int cep = rs.getInt("cep");
				int idRua = rs.getInt("idRua");
				String complemento = rs.getString("complemento");
				int idEndereco = rs.getInt("idEndereco");
				
				endereco.setEstado(estado);
				endereco.setCidade(cidade);
				endereco.setBairro(bairro);
				endereco.setRua(rua);
				endereco.setNumero(numero);
				endereco.setCep(cep);
				endereco.setIdRua(idRua);
				endereco.setComplemento(complemento);
				endereco.setIdEndereco(idEndereco);
				
				cliente.setUsuario(usuario);
				cliente.setEndereco(endereco);
			}
		}catch (Exception e){
			e.printStackTrace();
		}
		return cliente;
	}
	
	public boolean atualizar (Cliente cliente) {
		PreparedStatement p;
		Endereco endereco = cliente.getEndereco();
		
		String comando = "UPDATE clientes SET nome=?, telefone=?, telefoneAux=?, email=?, status=? WHERE idCliente=" + cliente.getIdCliente();
		
		try{
			p = this.conexao.prepareStatement(comando);
			p.setString(1, cliente.getNome());
			p.setString(2, cliente.getTelefone());
			p.setString(3, cliente.getTelefoneAux());
			p.setString(4, cliente.getEmail());
			p.setBoolean(5, cliente.getStatus());
			p.execute();
		}catch (SQLException e){
			System.out.println(e);
			return false;
		}
		
		comando = "UPDATE enderecos SET numero=?, complemento=?, ruas_idRua=? WHERE idEndereco=" + endereco.getIdEndereco();
		
		try{
			p = this.conexao.prepareStatement(comando);
			p.setInt(1, endereco.getNumero());
			p.setString(2, endereco.getComplemento());
			p.setInt(3, endereco.getIdRua());
			p.execute();
		}catch (SQLException e){
			System.out.println(e);
			return false;
		}
		return true;
	}
	
	public boolean atualizarConfig (Cliente cliente) {
		PreparedStatement p;
		Endereco endereco = cliente.getEndereco();
		
		String comando = "UPDATE clientes SET nome=?, telefone=?, telefoneAux=?, email=?, status=? WHERE idCliente=" + cliente.getIdCliente();
		
		try{
			p = this.conexao.prepareStatement(comando);
			p.setString(1, cliente.getNome());
			p.setString(2, cliente.getTelefone());
			p.setString(3, cliente.getTelefoneAux());
			p.setString(4, cliente.getEmail());
			p.setBoolean(5, cliente.getStatus());
			p.execute();
		}catch (SQLException e){
			System.out.println(e);
			return false;
		}
		
		comando = "UPDATE enderecos SET numero=?, complemento=?, ruas_idRua=? WHERE idEndereco=" + endereco.getIdEndereco();
		
		try{
			p = this.conexao.prepareStatement(comando);
			p.setInt(1, endereco.getNumero());
			p.setString(2, endereco.getComplemento());
			p.setInt(3, endereco.getIdRua());
			p.execute();
		}catch (SQLException e){
			System.out.println(e);
			return false;
		}
		return true;
	}

	public Cliente buscarPorCpf(String cpfLogado) {
		String comando = "select * from clientes " + 
				"where usuarios_cpf like '" + cpfLogado + "';";

		Cliente cliente = new Cliente();
		Endereco endereco = new Endereco();
		try{
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while(rs.next()){
				
				cliente.setNome(rs.getString("nome"));
				cliente.setStatus(rs.getBoolean("status"));
				cliente.setIdCliente(rs.getInt("idCliente"));
				cliente.setTelefone(rs.getString("telefone"));
				cliente.setTelefoneAux(rs.getString("telefoneAux"));
				cliente.setEmail(rs.getString("email"));
				
				endereco.setIdEndereco(rs.getInt("enderecos_idEndereco"));
				
				cliente.setEndereco(endereco);
				
			}
		}catch (Exception e){
			e.printStackTrace();
		}
		return cliente;
	}

}
