package br.com.assistencia.jdbcinterface;

import java.util.List;

import br.com.assistencia.objetos.Rua;

public interface RuaDAO {
	public List<Rua> buscar(int idBairro);
}
