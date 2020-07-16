package br.com.assistencia.jdbc;

import java.sql.Connection;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import br.com.assistencia.jdbcinterface.SubCategoriaDAO;
import br.com.assistencia.objetos.SubCategoria;

public class JDBCSubCategoriaDAO implements SubCategoriaDAO{
	
	Connection conexao;
	
	public JDBCSubCategoriaDAO (Connection conexao) {
		this.conexao = conexao;
	}

	@Override
	public List<SubCategoria> buscar(SubCategoria subCategoria) {
		
		String comando = "SELECT s.idSubcategoria as idSubcategoria, s.nome as nome FROM subcategorias as s " + 
				"inner join categorias as c " + 
				"on s.categorias_idCategoria = c.idCategoria ";

		if(!subCategoria.getNome().equals("null") && !subCategoria.getNome().equals("") && !subCategoria.getNome().equals("*")){
			comando += "where c.idCategoria = "+subCategoria.getCategorias_idCategoria()+" and s.nome like '%"+subCategoria.getNome()+"%' ";
		}

		comando += "order by nome asc";

		List<SubCategoria> listSubCategorias = new ArrayList<SubCategoria>();
		try{
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while(rs.next()){
				subCategoria = new SubCategoria();
				
				int idSubCategoria = rs.getInt("idSubcategoria");
				String nome = rs.getString("nome");
				
				subCategoria.setIdSubcategoria(idSubCategoria);
				subCategoria.setNome(nome);

				listSubCategorias.add(subCategoria);
			}
		}catch(Exception e){
			e.printStackTrace();
		}

		return listSubCategorias;
	}

}
