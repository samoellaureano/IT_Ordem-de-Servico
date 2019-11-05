package br.com.assistencia.jdbcinterface;

import java.util.List;

import br.com.assistencia.objetos.Cidade;

public interface CidadeDAO {
	
	public List<Cidade> buscar(int idEstado);

}
