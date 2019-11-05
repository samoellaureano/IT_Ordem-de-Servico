package br.com.assistencia.jdbcinterface;

import br.com.assistencia.objetos.Endereco;

public interface EnderecoDAO {
	
	public Endereco buscar (String cep);

}
