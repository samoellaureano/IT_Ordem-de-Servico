package br.com.assistencia.jdbc;

import java.sql.Connection;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import br.com.assistencia.jdbcinterface.CategoriaDAO;
import br.com.assistencia.objetos.Categoria;

public class JDBCCategoriaDAO implements CategoriaDAO{
	
	private Connection conexao;
	
	public JDBCCategoriaDAO(Connection conexao) {
		this.conexao = conexao;
		
	}

	@Override
	public List<Categoria> buscar(String nomeCategoria) {
		String comando = "SELECT * FROM categorias ";

		if(!nomeCategoria.equals("null") && !nomeCategoria.equals("") && !nomeCategoria.equals("*")){
			comando += "WHERE nome LIKE '%" + nomeCategoria + "%' ";
		}

		comando += "order by nome asc";

		List<Categoria> listCategorias = new ArrayList<Categoria>();
		Categoria categoria = null;
		try{
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while(rs.next()){
				categoria = new Categoria();
				
				int idCategoria = rs.getInt("idCategoria");
				String nome = rs.getString("nome");
				
				categoria.setIdCategoria(idCategoria);
				categoria.setNome(nome);

				listCategorias.add(categoria);
			}
		}catch(Exception e){
			e.printStackTrace();
		}

		return listCategorias;
	}

}
