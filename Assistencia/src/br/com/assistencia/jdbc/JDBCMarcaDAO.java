package br.com.assistencia.jdbc;

import java.sql.Connection;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import br.com.assistencia.jdbcinterface.MarcaDAO;
import br.com.assistencia.objetos.Marca;

public class JDBCMarcaDAO implements MarcaDAO{
	
	Connection conexao;
	
	public JDBCMarcaDAO (Connection conexao) {
		this.conexao = conexao;
	}

	@Override
	public List<Marca> buscar(String nomeMarcas) {
		String comando = "SELECT * FROM marcas ";

		if(!nomeMarcas.equals("null") && !nomeMarcas.equals("")){
			comando += "WHERE nome LIKE '%" + nomeMarcas + "%' ";
		}

		comando += "order by nome asc";

		List<Marca> listMarcas = new ArrayList<Marca>();
		Marca marca = null;
		try{
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while(rs.next()){
				marca = new Marca();
				
				int idMarca = rs.getInt("idMarca");
				String nome = rs.getString("nome");
				
				marca.setIdMarca(idMarca);
				marca.setNome(nome);

				listMarcas.add(marca);
			}
		}catch(Exception e){
			e.printStackTrace();
		}

		return listMarcas;
	}

}
