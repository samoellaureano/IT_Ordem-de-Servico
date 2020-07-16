package br.com.assistencia.objetos;

import java.util.List;

public class Dashboard {
	
	private int osEmAberto;
	private int osEmAbertoAprovado;
	private List<String> listMesQnt;
	private List<String> qntOs;
	private List<String> listMesValor;
	private List<String> valorOs;
	
	public int getOsEmAberto() {
		return osEmAberto;
	}
	public void setOsEmAberto(int osEmAberto) {
		this.osEmAberto = osEmAberto;
	}
	public int getOsEmAbertoAprovado() {
		return osEmAbertoAprovado;
	}
	public void setOsEmAbertoAprovado(int osEmAbertoAprovado) {
		this.osEmAbertoAprovado = osEmAbertoAprovado;
	}
	public List<String> getListMesQnt() {
		return listMesQnt;
	}
	public void setListMesQnt(List<String> listMes) {
		this.listMesQnt = listMes;
	}
	public List<String> getQntOs() {
		return qntOs;
	}
	public void setQntOs(List<String> qntOs) {
		this.qntOs = qntOs;
	}
	public List<String> getListMesValor() {
		return listMesValor;
	}
	public void setListMesValor(List<String> listMesValor) {
		this.listMesValor = listMesValor;
	}
	public List<String> getValorOs() {
		return valorOs;
	}
	public void setValorOs(List<String> valorOs) {
		this.valorOs = valorOs;
	}
	
	
}
