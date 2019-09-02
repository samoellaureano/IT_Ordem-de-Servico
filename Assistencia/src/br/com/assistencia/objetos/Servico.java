package br.com.assistencia.objetos;

import java.io.Serializable;

public class Servico implements Serializable{
	
	private static final long serialVersionUID = 1L;
	/*
	 * Declarar o nome dos atributos de maneira idêntica ao nome dos
	 * campos do formulario que enviarão os dados para serem armazenados
	 * nestes.
	 */
	private int id;
	private String desc;
	private double valor;
	private boolean status;
	
	public int getId(){
		return id;
	}
	
	public void setId(int id){
		this.id = id;
	}
	
	public String getDesc(){
		return desc;
	}
	
	public void setDesc(String desc){
		this.desc = desc;
	}
	
	public double getValor(){
		return valor;
	}
	
	public void setValor(double valor){
		this.valor = valor;
	}
	
	public boolean getStatus(){
		return status;
	}
	
	public void setStatus(boolean status){
		this.status = status;
	}
}
