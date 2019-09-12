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
import br.com.assistencia.objetos.Servico;
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
			p.setInt(4, 0);
			p.setBoolean(5, true);
			p.setInt(6, 0);
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
	public List<Funcionario> buscar(String nome) {
		String comando = "SELECT * FROM servicos ";
		
		if(!nomeServ.equals("null") && !nomeServ.equals("")){
			comando += "WHERE descricao LIKE '" + nomeServ + "%' ";
		}
		
		comando += "order by descricao asc";

		List<Servico> listServicos = new ArrayList<Servico>();
		Servico servico = null;
		try{
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while(rs.next()){
				servico = new Servico();
				String desc = rs.getString("descricao");
				double valor = rs.getDouble("valor");										
				boolean status = rs.getBoolean("status");
				int id = rs.getInt("idServico");

				servico.setId(id);
				servico.setDesc(desc);
				servico.setValor(valor);
				//servico.setValor(valor);
				servico.setStatus(status);

				listServicos.add(servico);
			}
		}catch(Exception e){
			e.printStackTrace();
		}

		return listServicos;
	}

	@Override
	public Funcionario buscarPorId(int id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean atualizar(Funcionario funcionario) {
		// TODO Auto-generated method stub
		return false;
	}

}
