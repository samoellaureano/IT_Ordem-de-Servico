package br.com.assistencia.objetos;

import java.io.Serializable;
import br.com.assistencia.objetos.Usuario;

public class Funcionario implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
	private String nome;
	private String email;
	private Usuario usuario;
	
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

}
