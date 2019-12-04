package br.com.assistencia.jdbc;

import java.sql.Connection;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import br.com.assistencia.jdbcinterface.TipoDAO;
import br.com.assistencia.objetos.Tipo;

public class JDBCTipoDAO implements TipoDAO{
	
	Connection conexao;
	
	public JDBCTipoDAO(Connection conexao) {
		this.conexao = conexao;
	}

	@Override
	public List<Tipo> buscar(String nomeParam) {
		String comando = "SELECT * FROM tipos ";

		if(!nomeParam.equals("null") && !nomeParam.equals("") && !nomeParam.equals("*")){
			comando += "WHERE nome LIKE '%" + nomeParam + "%' ";
		}

		comando += "order by nome asc";

		List<Tipo> listTipos = new ArrayList<Tipo>();
		Tipo tipo = null;
		try{
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while(rs.next()){
				tipo = new Tipo();
				
				int idTipo = rs.getInt("idTipo");
				String nome = rs.getString("nome");
				boolean status = rs.getBoolean("status");
				
				tipo.setIdTipo(idTipo);
				tipo.setNome(nome);
				tipo.setStatus(status);

				listTipos.add(tipo);
			}
		}catch(Exception e){
			e.printStackTrace();
		}

		return listTipos;
	}

}
