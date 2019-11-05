package br.com.assistencia.jdbc;

import java.sql.Connection;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import br.com.assistencia.jdbcinterface.EstadoDAO;
import br.com.assistencia.objetos.Estado;

public class JDBCEstadoDAO implements EstadoDAO{
	
	private Connection conexao;

	public JDBCEstadoDAO (Connection conexao){
		this.conexao = conexao;
	}

	@Override
	public List<Estado> buscar() {
		String comando = "select idEstado, nome from estados ";
		comando += "order by estados.nome asc";

		List<Estado> listEstados = new ArrayList<Estado>();
		Estado estado = null;
		try{
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while(rs.next()){
				estado = new Estado();
				String nome = rs.getString("nome");
				int idEstado = rs.getInt("idEstado");
				
				estado.setNome(nome);
				estado.setIdEstado(idEstado);
				
				listEstados.add(estado);
			}
		}catch(Exception e){
			e.printStackTrace();
		}

		return listEstados;
	}
	

}
