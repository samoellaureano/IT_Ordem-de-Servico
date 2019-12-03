package br.com.assistencia.jdbcinterface;

import java.util.List;

import br.com.assistencia.objetos.Marca;

public interface MarcaDAO {
	
	public List<Marca> buscar(String nome);

}
