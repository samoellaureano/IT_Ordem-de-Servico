package br.com.assistencia.jdbcinterface;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.util.List;

import br.com.assistencia.objetos.Cliente;

public interface ClienteDAO {

	public boolean inserir(Cliente cliente) throws NoSuchAlgorithmException, UnsupportedEncodingException;
	public List<Cliente> buscar(String nome);
	public Cliente buscarPorId(int id);
	public boolean atualizar(Cliente cliente);
	public Cliente buscarPorCpf(String cpfLogado);
}
