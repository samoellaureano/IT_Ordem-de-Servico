package br.com.assistencia.jdbcinterface;

import java.util.List;

import br.com.assistencia.objetos.Produto;

public interface ProdutoDAO {
	
	public boolean inserir(Produto produto);
	public List<Produto> buscar(String desc);
	public Produto buscarPorId(int id);

}
