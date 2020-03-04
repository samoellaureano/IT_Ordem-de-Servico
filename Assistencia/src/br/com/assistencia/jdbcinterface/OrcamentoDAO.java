package br.com.assistencia.jdbcinterface;

import br.com.assistencia.objetos.Orcamento;

public interface OrcamentoDAO {
	
	public Orcamento buscarProdutoServico(String produtoServico);
	public boolean inserir(Orcamento orcamento);
	public Orcamento buscarOrcamento(String os);

}
