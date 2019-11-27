package br.com.assistencia.jdbcinterface;

import br.com.assistencia.objetos.CPF;
import br.com.assistencia.objetos.Usuario;

public interface UsuarioDAO {
	public Usuario buscar(CPF cpf);
	public boolean inserir(Usuario usuario);
	public boolean atualizarPerfil(Usuario usuario);
	public boolean salvaNovaSenha (Usuario userSenha);
}
