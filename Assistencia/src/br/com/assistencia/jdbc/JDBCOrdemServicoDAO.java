package br.com.assistencia.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import br.com.assistencia.jdbcinterface.OrdemServicoDAO;
import br.com.assistencia.objetos.Cliente;
import br.com.assistencia.objetos.Endereco;
import br.com.assistencia.objetos.Equipamento;
import br.com.assistencia.objetos.Funcionario;
import br.com.assistencia.objetos.Marca;
import br.com.assistencia.objetos.OrdemServico;
import br.com.assistencia.objetos.Status;
import br.com.assistencia.objetos.Tipo;

public class JDBCOrdemServicoDAO implements OrdemServicoDAO{

	Connection conexao;

	public JDBCOrdemServicoDAO(Connection conexao) {
		this.conexao = conexao;
	}


	@Override
	public boolean inserir(OrdemServico ordemServico) {

		Date data = new Date();
		SimpleDateFormat formatador = new SimpleDateFormat("yyyy-MM-dd");

		DateFormat formatadorComHora = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");


		String comando = "insert into ordens_servico (problema, data_abertura, data_status, clientes_idCliente, status_idStatus, equipamentos_idEquipamento)\r\n" + 
				"values (?,?,?,?,?,last_insert_ID())";
		PreparedStatement p;

		try{
			p = this.conexao.prepareStatement(comando);
			p.setString(1, ordemServico.getProblema());
			p.setString(2, formatador.format(data));
			p.setString(3, formatadorComHora.format(data));
			p.setInt(4, ordemServico.getCliente().getIdCliente());
			p.setInt(5, 1);
			p.execute();

			return true;
		}catch (SQLException e){
			e.printStackTrace();
			return false;
		}		
	}

	@Override
	public List<OrdemServico> buscarPorNumeroOS(String numeroOS) {
		String comando = "select os.idOrden_servico as idOrden_servico, c.nome as cliente, os.data_abertura as data_abertura, os.data_conclusao as data_conclusao, s.descricao as status, m.nome as marca, t.nome as tipo, f.nome as funcionario\r\n" + 
				"from ordens_servico as os\r\n" + 
				"inner join clientes as c\r\n" + 
				"on os.clientes_idCliente = c.idCliente\r\n" + 
				"inner join status as s\r\n" + 
				"on os.status_idStatus = s.idStatus\r\n" + 
				"inner join equipamentos as e\r\n" + 
				"on os.equipamentos_idEquipamento = e.idEquipamento\r\n" + 
				"inner join tipos as t\r\n" + 
				"on e.tipos_idTipo = t.idTipo\r\n" + 
				"inner join marcas as m\r\n" + 
				"on e.marcas_idMarca = m.idMarca\r\n" + 
				"left join funcionarios as f\r\n" +
				"on os.funcionarios_idFuncionario = f.idFuncionario ";

		if(!numeroOS.equals("null") && !numeroOS.equals("") && !numeroOS.equals("*")  ){
			comando += "WHERE idOrden_servico = " + numeroOS + " ";
		}

		comando += "order by idOrden_servico asc";

		List<OrdemServico> listOrdemServico = new ArrayList<OrdemServico>();
		OrdemServico ordemServico = null;
		Status status = null;
		Cliente cliente = null;
		Funcionario funcionario = null;
		Equipamento equipamento = null;
		Marca marca = null;
		Tipo tipo = null;

		try{
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while(rs.next()){
				ordemServico = new OrdemServico();
				status = new Status();
				cliente = new Cliente();
				funcionario = new Funcionario();
				equipamento = new Equipamento();
				marca = new Marca();
				tipo = new Tipo();

				ordemServico.setIdOrdem_servico(rs.getInt("idOrden_servico"));
				ordemServico.setData_abertura(rs.getString("data_abertura"));
				ordemServico.setData_conclusao(rs.getString("data_conclusao"));

				status.setDescricao(rs.getString("status"));
				cliente.setNome(rs.getString("cliente"));
				funcionario.setNome(rs.getString("funcionario"));
				marca.setNome(rs.getString("marca"));
				tipo.setNome(rs.getString("tipo"));
				equipamento.setMarca(marca);
				equipamento.setTipo(tipo);

				ordemServico.setEquipamento(equipamento);
				ordemServico.setCliente(cliente);
				ordemServico.setFuncionario(funcionario);
				ordemServico.setStatus(status);

				listOrdemServico.add(ordemServico);
			}
		}catch(Exception e){
			e.printStackTrace();
		}

		return listOrdemServico;
	}


	@Override
	public OrdemServico buscarOsSelecionada(String numeroOS) {
		String comando = "select os.idOrden_servico as idOrden_servico,\r\n" + 
				" c.nome as cliente,\r\n" + 
				" c.email as email,\r\n" + 
				" c.telefone as telefone,\r\n" + 
				" c.telefoneAux as telefoneAux,\r\n" + 
				" os.problema as problema,\r\n" + 
				" os.data_abertura as data_abertura,\r\n" + 
				" os.data_conclusao as data_conclusao,\r\n" + 
				" s.descricao as status,\r\n" + 
				" m.nome as marca,\r\n" + 
				" t.nome as tipo,\r\n" + 
				" f.nome as funcionario,\r\n" + 
				" e.modelo as modelo,\r\n" + 
				" e.acessorio as acessorio,\r\n" + 
				" r.nome as rua,\r\n" + 
				" en.numero as numero\r\n" + 
				"from ordens_servico as os\r\n" + 
				"inner join clientes as c\r\n" + 
				"on os.clientes_idCliente = c.idCliente\r\n" + 
				"inner join status as s\r\n" + 
				"on os.status_idStatus = s.idStatus\r\n" + 
				"inner join equipamentos as e\r\n" + 
				"on os.equipamentos_idEquipamento = e.idEquipamento\r\n" + 
				"inner join tipos as t\r\n" + 
				"on e.tipos_idTipo = t.idTipo\r\n" + 
				"inner join marcas as m\r\n" + 
				"on e.marcas_idMarca = m.idMarca\r\n" + 
				"left join funcionarios as f\r\n" + 
				"on os.funcionarios_idFuncionario = f.idFuncionario\r\n" + 
				"inner join enderecos as en\r\n" + 
				"on c.enderecos_idEndereco = en.idEndereco\r\n" + 
				"inner join ruas as r\r\n" + 
				"on en.ruas_idRua = r.idRua ";

		if(!numeroOS.equals("null") && !numeroOS.equals("") && !numeroOS.equals("*")  ){
			comando += "WHERE idOrden_servico = " + numeroOS + " ";
		}
		OrdemServico ordemServico = null;
		Status status = null;
		Cliente cliente = null;
		Funcionario funcionario = null;
		Equipamento equipamento = null;
		Marca marca = null;
		Tipo tipo = null;
		Endereco endereco = null;

		try{
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while(rs.next()){
				ordemServico = new OrdemServico();
				status = new Status();
				cliente = new Cliente();
				funcionario = new Funcionario();
				equipamento = new Equipamento();
				marca = new Marca();
				tipo = new Tipo();
				endereco = new Endereco();

				ordemServico.setIdOrdem_servico(rs.getInt("idOrden_servico"));
				ordemServico.setProblema(rs.getString("problema"));
				ordemServico.setData_abertura(rs.getString("data_abertura"));
				ordemServico.setData_conclusao(rs.getString("data_conclusao"));

				status.setDescricao(rs.getString("status"));
				endereco.setNumero(rs.getInt("numero"));
				endereco.setRua(rs.getString("rua"));
				cliente.setNome(rs.getString("cliente"));
				cliente.setEmail(rs.getString("email"));
				cliente.setTelefone(rs.getString("telefone"));
				cliente.setTelefoneAux(rs.getString("telefoneAux"));
				cliente.setEndereco(endereco);

				funcionario.setNome(rs.getString("funcionario"));
				marca.setNome(rs.getString("marca"));
				tipo.setNome(rs.getString("tipo"));

				equipamento.setModelo(rs.getString("modelo"));
				equipamento.setAcessorio(rs.getString("acessorio"));
				equipamento.setMarca(marca);
				equipamento.setTipo(tipo);

				ordemServico.setEquipamento(equipamento);
				ordemServico.setCliente(cliente);
				ordemServico.setFuncionario(funcionario);
				ordemServico.setStatus(status);

			}
		}catch(Exception e){
			e.printStackTrace();
		}

		return ordemServico;
	}


	@Override
	public boolean alterar(OrdemServico ordemServico) {
		String comando = "UPDATE ordens_servico SET funcionarios_idFuncionario=?, status_idStatus=? WHERE idOrden_servico=" + ordemServico.getIdOrdem_servico();

		PreparedStatement p;
		try{
			p = this.conexao.prepareStatement(comando);
			p.setInt(1, ordemServico.getFuncionario().getIdFuncionario());
			p.setInt(2, 2);

			p.executeUpdate();
			return true;
		}catch (SQLException e){
			e.printStackTrace();
			return false;
		}		
	}
}

