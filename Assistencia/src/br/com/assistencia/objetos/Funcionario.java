package br.com.assistencia.objetos;

import java.io.Serializable;
import br.com.assistencia.objetos.Usuario;

public class Funcionario implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
	private int idFuncionario;
	private String nome;
	private String email;
	private Usuario usuario;
	boolean status;
	
	public int getIdFuncionario() {
		return idFuncionario;
	}
	public void setIdFuncionario(int idFuncionario) {
		this.idFuncionario = idFuncionario;
	}
	
	public Usuario getUsuario() {
		return usuario;
	}
	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public boolean getStatus() {
		return status;
	}
	public void setStatus(boolean status) {
		this.status = status;
	}
	
	
}
