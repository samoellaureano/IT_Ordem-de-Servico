package br.com.assistencia.objetos;

public class Usuario {
	
	private long cpf;
	private int id_recuperacao;
	private String senha;
	private boolean status, perfil, status_recuperacao;
	
	public long getCpf() {
		return cpf;
	}
	public void setCpf(long cpf) {
		this.cpf = cpf;
	}
	public int getId_recuperacao() {
		return id_recuperacao;
	}
	public void setId_recuperacao(int id_recuperacao) {
		this.id_recuperacao = id_recuperacao;
	}
	public String getSenha() {
		return senha;
	}
	public void setSenha(String senha) {
		this.senha = senha;
	}
	public boolean isStatus() {
		return status;
	}
	public void setStatus(boolean status) {
		this.status = status;
	}
	public boolean isPerfil() {
		return perfil;
	}
	public void setPerfil(boolean perfil) {
		this.perfil = perfil;
	}
	public boolean isStatus_recuperacao() {
		return status_recuperacao;
	}
	public void setStatus_recuperacao(boolean status_recuperacao) {
		this.status_recuperacao = status_recuperacao;
	}
	
}
