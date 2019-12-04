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
		String comando = "INSERT INTO servicos "
				+ "(descricao, valor, status) "
				+ "VALUES (?,?,?)";
		PreparedStatement p;

		try{
			p = this.conexao.prepareStatement(comando);
			p.setString(1, servico.getDesc());
			p.setDouble(2, servico.getValor());
			p.setBoolean(3, true);
			p.execute();
		}catch (SQLException e){
			return false;
		}
		return true;
	}
	
	public List<Servico> buscar(String nomeServ) {
			String comando = "SELECT * FROM servicos ";
			
			if(!nomeServ.equals("null") && !nomeServ.equals("")){
				comando += "WHERE descricao LIKE '%" + nomeServ + "%' ";
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
					servico.setStatus(status);

					listServicos.add(servico);
				}
			}catch(Exception e){
				e.printStackTrace();
			}

			return listServicos;
	}

	public Servico buscarPorId(int id){
		String comando = "SELECT * FROM servicos WHERE idServico=" + id;
		Servico servico = new Servico();
		try{
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while(rs.next()){
				String desc = rs.getString("descricao");
				double valor = rs.getDouble("valor");
				boolean status = rs.getBoolean("status");

				servico.setId(id);
				servico.setDesc(desc);
				servico.setValor(valor);
				servico.setStatus(status);
			}
		}catch (Exception e){
			e.printStackTrace();
		}
		return servico;		
	}//finaliza buscaPorId

	public boolean atualizar(Servico servico){
		String comando = "UPDATE servicos SET descricao=?, valor=?, status=? WHERE idServico=" + servico.getId();
		
		PreparedStatement p;
		try{
			p = this.conexao.prepareStatement(comando);
			p.setString(1, servico.getDesc());
			p.setDouble(2, servico.getValor());
			p.setBoolean(3, servico.getStatus());

			p.executeUpdate();
			return true;
		}catch (SQLException e){
			e.printStackTrace();
			return false;
		}		
	}
}
