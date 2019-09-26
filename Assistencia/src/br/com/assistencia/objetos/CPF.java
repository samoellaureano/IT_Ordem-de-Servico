package br.com.assistencia.objetos;

public class CPF {
	private String numero;
	
	public CPF(String numero) {
		this.numero = numero;
	}
	
	public String getNumero() {
		return numero;
	}
	
	@Override
	public String toString() {
		return numero;
	}
	
	public boolean validaExisteCPF(CPF otherCpf) {
		return this.numero.equals(otherCpf.getNumero());
	}
}
