package br.com.assistencia.jdbcinterface;

import br.com.assistencia.objetos.Orcamento;

public interface OrcamentoDAO {
	
	public Orcamento buscarProdutoServico(String produtoServico);
	public boolean inserir(Orcamento orcamento);
	public boolean aprovar(Orcamento orcamento);
	public boolean recusar(Orcamento orcamento);
	public boolean prontoRetirar(Orcamento orcamento);
	public boolean retirar(Orcamento orcamento);
	public boolean absorver(Orcamento orcamento);
	public Orcamento buscarOrcamento(String os);

}
