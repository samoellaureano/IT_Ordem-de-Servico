package br.com.assistencia.jdbc;


import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import br.com.assistencia.jdbcinterface.ServicoDAO;
import br.com.assistencia.objetos.Servico;


public class JDBCServicoDAO implements ServicoDAO{

	private Connection conexao;

	public JDBCServicoDAO (Connection conexao){
		this.conexao = conexao;
	}

	public boolean inserir(Servico servico){
		String comando = "INSERT INTO servico "
				+ "(descricao, valor, status) "
				+ "VALUES (?,?,?)";
		PreparedStatement p;

		try{
			p = this.conexao.prepareStatement(comando);
			p.setString(1, servico.getDesc());
			p.setFloat(2, servico.getValor());
			p.setBoolean(3, servico.getStatus());
			p.execute();
		}catch (SQLException e){
			System.out.println("Deu Erro");
			//throw new AplicacaoErro (e.getMessage(), e);
			//e.printStackTrace();
			return false;
		}
		return true;
	}

	@Override
	public List<Servico> buscar(String nomeServ) {
			String comando = "SELECT * FROM servico ";
			
			if(!nomeServ.equals("null") && !nomeServ.equals("")){
				comando += "WHERE descricao LIKE '" + nomeServ + "%'";
			}

			List<Servico> listServicos = new ArrayList<Servico>();
			Servico servico = null;
			try{
				java.sql.Statement stmt = conexao.createStatement();
				ResultSet rs = stmt.executeQuery(comando);
				while(rs.next()){
					servico = new Servico();
					String desc = rs.getString("descricao");
					float valor = rs.getFloat("valor");
					boolean status = rs.getBoolean("status");
					int id = rs.getInt("idServico");

					servico.setId(id);
					servico.setDesc(desc);
					servico.setValor(valor);
					servico.setStatus(status);

					listServicos.add(servico);
				}
			}catch(Exception e){
				e.printStackTrace();
			}

			return listServicos;
	}

	@Override
	public boolean deletarServico(int id) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public Servico buscarPorId(int id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean atualizar(Servico servico) {
		// TODO Auto-generated method stub
		return false;
	}

	/*

	public List<Servico> buscarPorNome(String nome){

		String comando = "SELECT * FROM contato ";
		if(!nome.equals("null") && !nome.equals("")){
			comando += "WHERE nome LIKE '" + nome + "%'";
		}

		List<Servico> listContato = new ArrayList<Contato>();
		Contato contato = null;
		try{
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while(rs.next()){
				contato = new Contato();
				String nomeContato = rs.getString("nome");
				String ende = rs.getString("endereco");
				int id = rs.getInt("idContato");
				String telefone = rs.getString("telefone");
				String email = rs.getString("email");
				String senha = rs.getString("senha");

				contato.setId(id);
				contato.setNome(nomeContato);
				contato.setEndereco(ende);
				contato.setTelefone(telefone);
				contato.setEmail(email);
				contato.setSenha(senha);

				listContato.add(contato);
			}
		}catch(Exception e){
			e.printStackTrace();
		}

		return listContato;
	}

	public boolean deletarContato(int id){
		String comando = "DELETE from contato WHERE idContato=" + id;
		Statement p;
		try{
			p = this.conexao.createStatement();
			p.execute(comando);
		}catch (SQLException e){
			throw new AplicacaoErro(e.getMessage(), e);
			//e.printStackTrace();
			//return false;
		}
		return true;
	}

	public Contato buscarPorId(int id){
		String comando = "SELECT * FROM contato WHERE idContato=" + id;
		Contato contato = new Contato();
		try{
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while(rs.next()){
				String nomeContato = rs.getString("nome");
				String endereco = rs.getString("endereco");
				int idContato = rs.getInt("idContato");
				String telefone = rs.getString("telefone");
				String email = rs.getString("email");

				contato.setId(idContato);
				contato.setNome(nomeContato);
				contato.setEndereco(endereco);
				contato.setTelefone(telefone);
				contato.setEmail(email);
			}

			return contato;
		}catch (Exception e){
			throw new AplicacaoErro(e.getMessage(), e);
		}		
	}//finaliza buscaPorId

	public boolean atualizar(Contato contato){
		boolean senhaEditada = false; //flag para indicar se o usuário editou a senha tambem
		String comando = "UPDATE contato SET nome=?, endereco=?, telefone=?, email=? ";
		if(contato.getSenha()==null || contato.getSenha() == ""){
			comando += "WHERE idContato=" + contato.getId();
		}else{
			senhaEditada=true;
			comando += ", senha=? WHERE idContato=" + contato.getId();
		}
		PreparedStatement p;
		try{
			p = this.conexao.prepareStatement(comando);
			p.setString(1, contato.getNome());
			p.setString(2, contato.getEndereco());
			p.setString(3, contato.getTelefone());
			p.setString(4, contato.getEmail());

			if(senhaEditada){
				p.setString(5, contato.getSenha());
			}
			p.executeUpdate();
		}catch (SQLException e){
			throw new AplicacaoErro(e.getMessage(), e);
		}
		return true;
	}
	 */
}
