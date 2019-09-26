package br.com.assistencia.jdbcinterface;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.util.List;

import br.com.assistencia.objetos.Funcionario;

public interface FuncionarioDAO {
	
	public int inserir(Funcionario funcionario) throws NoSuchAlgorithmException, UnsupportedEncodingException;
	public List<Funcionario> buscar(String nome);
	public Funcionario buscarPorId(int id);
	public boolean atualizar(Funcionario funcionario);

}
