package br.com.assistencia.jdbcinterface;

import java.util.List;

import br.com.assistencia.objetos.Tipo;

public interface TipoDAO {
	
	public List<Tipo> buscar(String nome);

}
