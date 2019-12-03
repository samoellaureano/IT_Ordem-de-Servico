package br.com.assistencia.jdbcinterface;

import java.util.List;

import br.com.assistencia.objetos.SubCategoria;

public interface SubCategoriaDAO {
	
	public List<SubCategoria> buscar(SubCategoria subCategoria);

}
