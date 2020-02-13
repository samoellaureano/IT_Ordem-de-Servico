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
import br.com.assistencia.objetos.Equipamento;
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
			p.setInt(5, 2);
			p.execute();
			
			return true;
		}catch (SQLException e){
			e.printStackTrace();
			return false;
		}		
	}

	@Override
	public List<OrdemServico> buscarPorNumeroOS(String numeroOS) {
		String comando = "select os.idOrden_servico as idOrden_servico, c.nome as cliente, os.data_abertura as data_abertura, os.data_conclusao as data_conclusao, s.descricao as status, m.nome as marca, t.nome as tipo\r\n" + 
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
				"on e.marcas_idMarca = m.idMarca ";

		if(!numeroOS.equals("null") && !numeroOS.equals("") && !numeroOS.equals("*")  ){
			comando += "WHERE idOrden_servico = " + numeroOS + " ";
		}

		comando += "order by idOrden_servico asc";

		List<OrdemServico> listOrdemServico = new ArrayList<OrdemServico>();
		OrdemServico ordemServico = null;
		Status status = null;
		Cliente cliente = null;
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
				equipamento = new Equipamento();
				marca = new Marca();
				tipo = new Tipo();

				ordemServico.setIdOrdem_servico(rs.getInt("idOrden_servico"));
				ordemServico.setData_abertura(rs.getString("data_abertura"));
				ordemServico.setData_conclusao(rs.getString("data_conclusao"));
				
				status.setDescricao(rs.getString("status"));
				cliente.setNome(rs.getString("cliente"));
				marca.setNome(rs.getString("marca"));
				tipo.setNome(rs.getString("tipo"));
				equipamento.setMarca(marca);
				equipamento.setTipo(tipo);

				ordemServico.setEquipamento(equipamento);
				ordemServico.setCliente(cliente);
				ordemServico.setStatus(status);

				listOrdemServico.add(ordemServico);
			}
		}catch(Exception e){
			e.printStackTrace();
		}

		return listOrdemServico;
	}

}
