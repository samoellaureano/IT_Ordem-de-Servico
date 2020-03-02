package br.com.assistencia.objetos;

import java.util.List;

public class Orcamento {
	
	private List<Produto> produto;
	private List<Servico> servico;
	
	public List<Produto> getProduto() {
		return produto;
	}
	public void setProduto(List<Produto> produto) {
		this.produto = produto;
	}
	public List<Servico> getServico() {
		return servico;
	}
	public void setServico(List<Servico> servico) {
		this.servico = servico;
	}
	
	
	

}
