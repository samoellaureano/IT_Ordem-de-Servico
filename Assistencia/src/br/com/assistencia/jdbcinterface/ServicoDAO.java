package br.com.assistencia.jdbcinterface;

import java.util.List;

import br.com.assistencia.objetos.Servico;


public interface ServicoDAO {
	
	public boolean inserir(Servico servico);
	public List<Servico> buscar(String desc);
	public Servico buscarPorId(int id);
	public boolean atualizar(Servico servico);

}
