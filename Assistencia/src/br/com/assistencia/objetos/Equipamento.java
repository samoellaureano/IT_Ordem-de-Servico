package br.com.assistencia.objetos;

public class Equipamento {
	
	private int idEquipamentos;
	private String modelo;
	private String acessorio;
	private Tipo tipo;
	private Marca marca;
	
	public int getIdEquipamentos() {
		return idEquipamentos;
	}
	public void setIdEquipamentos(int idEquipamentos) {
		this.idEquipamentos = idEquipamentos;
	}
	public String getModelo() {
		return modelo;
	}
	public void setModelo(String modelo) {
		this.modelo = modelo;
	}
	public Tipo getTipo() {
		return tipo;
	}
	public void setTipo(Tipo tipo) {
		this.tipo = tipo;
	}
	public Marca getMarca() {
		return marca;
	}
	public void setMarca(Marca marca) {
		this.marca = marca;
	}
	public String getAcessorio() {
		return acessorio;
	}
	public void setAcessorio(String acessorio) {
		this.acessorio = acessorio;
	}
	
	

}
