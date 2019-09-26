package br.com.assistencia.jdbcinterface;

import br.com.assistencia.objetos.CPF;
import br.com.assistencia.objetos.Usuario;

public interface UsuarioDAO {
	public Usuario buscar(CPF cpf);
}
