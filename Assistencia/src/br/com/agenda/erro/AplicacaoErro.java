package br.com.agenda.erro;

@SuppressWarnings("serial")
public class AplicacaoErro extends RuntimeException {

	public AplicacaoErro(String message, Throwable cause) {
		super(message, cause);
		// TODO Auto-generated constructor stub
	}

	public AplicacaoErro(String message) {
		super(message);
		// TODO Auto-generated constructor stub
	}
	
	

}
