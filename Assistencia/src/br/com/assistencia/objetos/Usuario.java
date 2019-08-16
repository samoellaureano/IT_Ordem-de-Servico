package br.com.assistencia.objetos;

public class Usuario {
	
	private String cpf;
	private int id_recuperacao;
	private String senha;
	private boolean status;
	private boolean perfil;
	private boolean status_recuperacao;
	
	public String getCpf() {
		return cpf;
	}
	public void setCpf(String cpf) {
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
	
	public boolean getStatus() {
		return status;
	}
	public void setStatus(boolean status) {
		this.status = status;
	}
	
	public boolean getPerfil() {
		return perfil;
	}
	public void setPerfil(boolean perfil) {
		this.perfil = perfil;
	}
	
	public boolean getStatus_recuperacao() {
		return status_recuperacao;
	}
	public void setStatus_recuperacao(boolean status_recuperacao) {
		this.status_recuperacao = status_recuperacao;
	}
	
	
	
}
