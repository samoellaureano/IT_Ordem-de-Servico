package br.com.assistencia.jdbcinterface;

import java.util.List;

import br.com.assistencia.objetos.Categoria;

public interface CategoriaDAO {
	
	public List<Categoria> buscar(String nome);

}
