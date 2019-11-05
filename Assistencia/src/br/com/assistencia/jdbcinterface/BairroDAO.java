package br.com.assistencia.jdbcinterface;

import java.util.List;

import br.com.assistencia.objetos.Bairro;

public interface BairroDAO {
	
	public List<Bairro> buscar (int idCidade);

}
