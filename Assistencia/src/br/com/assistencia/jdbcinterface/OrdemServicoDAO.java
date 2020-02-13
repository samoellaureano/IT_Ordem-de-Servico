package br.com.assistencia.jdbcinterface;

import java.util.List;

import br.com.assistencia.objetos.OrdemServico;

public interface OrdemServicoDAO {
	
	public boolean inserir(OrdemServico ordemServico);
	public List<OrdemServico> buscarPorNumeroOS(String numeroOS);

}
