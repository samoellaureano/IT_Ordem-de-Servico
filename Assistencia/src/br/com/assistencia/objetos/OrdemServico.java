package br.com.assistencia.objetos;

public class OrdemServico {
	
    private String problema;
    private String data_abertura;
    private String data_status;
    private String data_conclusao;
    private int idOrdem_servico;
    
    private Status status;
    private Cliente cliente;
    private Funcionario funcionario;
	private Equipamento equipamento;
	private Orcamento orcamento;
    
    public Status getStatus() {
		return status;
	}
	public void setStatus(Status status) {
		this.status = status;
	}
	public Cliente getCliente() {
		return cliente;
	}
	public void setCliente(Cliente cliente) {
		this.cliente = cliente;
	}
	public Equipamento getEquipamento() {
		return equipamento;
	}
	public void setEquipamento(Equipamento equipamento) {
		this.equipamento = equipamento;
	}
    
	public String getProblema() {
		return problema;
	}
	public void setProblema(String problema) {
		this.problema = problema;
	}
	public String getData_abertura() {
		return data_abertura;
	}
	public void setData_abertura(String data_abertura) {
		this.data_abertura = data_abertura;
	}
	public String getData_status() {
		return data_status;
	}
	public void setData_status(String data_status) {
		this.data_status = data_status;
	}
	public int getIdOrdem_servico() {
		return idOrdem_servico;
	}
	public void setIdOrdem_servico(int idOrdem_servico) {
		this.idOrdem_servico = idOrdem_servico;
	}
	public String getData_conclusao() {
		return data_conclusao;
	}
	public void setData_conclusao(String data_conclusao) {
		this.data_conclusao = data_conclusao;
	}	
	public Funcionario getFuncionario() {
		return funcionario;
	}
	public void setFuncionario(Funcionario funcionario) {
		this.funcionario = funcionario;
	}
	public Orcamento getOrcamento() {
		return orcamento;
	}
	public void setOrcamento(Orcamento orcamento) {
		this.orcamento = orcamento;
	}
	
	
}
