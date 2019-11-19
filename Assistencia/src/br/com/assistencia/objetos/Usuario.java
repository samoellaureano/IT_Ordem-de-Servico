package br.com.assistencia.objetos;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;

import br.com.assistencia.util.HashUtil;

public class Usuario {
	
	private CPF cpf;
	private int id_recuperacao;
	private String senha;
	private int perfil;
	private boolean status_recuperacao;
	
	public CPF getCpf() {
		return cpf;
	}
	public void setCpf(CPF cpf) {
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
	public void setSenhaCriptografada(String senha) {
		HashUtil hash = new HashUtil();
		try {
			//System.out.println("Senha do login - "+senha);
			senha = (senha + "321#cAsA");
			//System.out.println("Senha do login concatenada - "+senha);
			
			//System.out.println("Senha do login criptografada - "+hash.stringToMD5(senha));
			
			this.senha = hash.stringToMD5(senha);
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
	}
	
	public int getPerfil() {
		return perfil;
	}
	public void setPerfil(int perfil) {
		this.perfil = perfil;
	}
	
	public boolean getStatus_recuperacao() {
		return status_recuperacao;
	}
	public void setStatus_recuperacao(boolean status_recuperacao) {
		this.status_recuperacao = status_recuperacao;
	}
	public boolean existe(Usuario usuario) {
		return this.cpf.validaExisteCPF(usuario.getCpf());
	}
	@Override
	public boolean equals(Object obj) {
		Usuario other = (Usuario) obj;
		return this.senha.equals(other.getSenha());
	}

	
	
	
}
