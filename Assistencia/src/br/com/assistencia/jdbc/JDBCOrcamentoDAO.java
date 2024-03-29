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

import br.com.assistencia.jdbcinterface.OrcamentoDAO;
import br.com.assistencia.objetos.Orcamento;
import br.com.assistencia.objetos.OrdemServico;
import br.com.assistencia.objetos.Produto;
import br.com.assistencia.objetos.Servico;


public class JDBCOrcamentoDAO implements OrcamentoDAO{
	private Connection conexao;
	

	public JDBCOrcamentoDAO(Connection conexao) {
		this.conexao = conexao;
	}
	
	private Date data = new Date();
	private SimpleDateFormat formatador = new SimpleDateFormat("yyyy-MM-dd");

	private DateFormat formatadorComHora = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	
	private boolean InserirServico(Orcamento orcamento, OrdemServico ordemServico) {
		for(Servico servico : orcamento.getServico()) {
			String comando = "INSERT INTO pedido_servico (servicos_idServico, "
					+ "ordens_servico_idOrden_servico, "
					+ "quantidade, "
					+ "valorVenda) VALUES (?,?,?,?)";
			PreparedStatement p;
			
			try{
				p = this.conexao.prepareStatement(comando);
				p.setInt(1, servico.getId());
				p.setInt(2, ordemServico.getIdOrdem_servico());
				p.setInt(3, servico.getQuantidade());
				p.setDouble(4, servico.getValor());
				
				p.execute();
			}catch (SQLException e){
				System.out.println(e);
				return false;
			}
		}
		return true;
	}
	
	private boolean InserirProduto (Orcamento orcamento, OrdemServico ordemServico) {
		for(Produto produto : orcamento.getProduto()) {
			String comando = "INSERT INTO pedido_produto (produtos_idProduto, "
					+ "ordens_servico_idOrden_servico, "
					+ "quantidade, "
					+ "valorVenda) VALUES (?,?,?,?)";
			PreparedStatement p;
			
			try{
				p = this.conexao.prepareStatement(comando);
				p.setInt(1, produto.getIdProduto());
				p.setInt(2, ordemServico.getIdOrdem_servico());
				p.setInt(3, produto.getQuantidade());
				p.setDouble(4, produto.getValor());
				p.execute();
			}catch (SQLException e){
				System.out.println(e);
				return false;
			}
		}
		return true;
	}

	@Override
	public Orcamento buscarProdutoServico(String produtoServico) {
		Orcamento orcamento = new Orcamento();

		String comando = "select p.idproduto as idproduto, "
				+ "p.nome as descProduto, "
				+ "p.valor as valorProduto "
				+ "from produtos as p ";

		if(!produtoServico.equals("null") && !produtoServico.equals("") && !produtoServico.equals("*")){
			comando += "WHERE p.nome LIKE '%" + produtoServico + "%' ";
		}

		comando += "order by p.nome asc";

		String comando2 = "select s.idServico as idServico, " + 
				"s.descricao as descServico, " + 
				"s.valor as valorServico " +
				"from servicos as s ";

		if(!produtoServico.equals("null") && !produtoServico.equals("") && !produtoServico.equals("*")){
			comando2 += "WHERE s.descricao LIKE '%" + produtoServico + "%' ";
		}

		comando2 += "order by s.descricao asc";

		List<Servico> listServico = new ArrayList<Servico>();
		List<Produto> listProduto = new ArrayList<Produto>();
		Produto produto = null;
		Servico servico = null;
		try{
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);			
			while(rs.next()){
				produto = new Produto();
				int idProduto = rs.getInt("idProduto");
				String descProduto = rs.getString("descProduto");
				double valorProduto = rs.getDouble("valorProduto");

				produto.setIdProduto(idProduto);
				produto.setNome(descProduto);
				produto.setValor(valorProduto);
				
				listProduto.add(produto);
			}

			java.sql.Statement stmt2 = conexao.createStatement();
			ResultSet rs2 = stmt2.executeQuery(comando2);
			
			while(rs2.next()){
				servico = new Servico();
				int idServico = rs2.getInt("idServico");
				String descServico = rs2.getString("descServico");
				double valorServico = rs2.getDouble("valorServico");

				servico.setId(idServico);
				servico.setDesc(descServico);
				servico.setValor(valorServico);

				listServico.add(servico);
			}
			
			orcamento.setProduto(listProduto);
			orcamento.setServico(listServico);
		}catch(Exception e){
			e.printStackTrace();
		}

		return orcamento;
	}

	@Override
	public boolean inserir(Orcamento orcamento) {
		
		String comando = "delete from pedido_produto\r\n" + 
				"where ordens_servico_idOrden_servico = " + orcamento.getOrdemServico().getIdOrdem_servico();
		
		try{
			java.sql.Statement stmt = conexao.createStatement();
			stmt.executeUpdate(comando);
		}catch(Exception e){
			e.printStackTrace();
		}
		comando = "delete from pedido_servico\r\n" + 
				"where ordens_servico_idOrden_servico = " + orcamento.getOrdemServico().getIdOrdem_servico();
		
		try{
			java.sql.Statement stmt = conexao.createStatement();
			stmt.executeUpdate(comando);
		}catch(Exception e){
			e.printStackTrace();
		}
		
		
		OrdemServico ordemServico = orcamento.getOrdemServico();
		boolean retorno = true;
		if(orcamento.getServico().size() > 0) {
			retorno = InserirServico(orcamento, ordemServico);
		}
		
		if(orcamento.getProduto().size() > 0) {
			retorno = InserirProduto(orcamento, ordemServico);
		}
		
		comando = "UPDATE ordens_servico SET status_idStatus=?, data_status=? WHERE idOrden_servico=" + orcamento.getOrdemServico().getIdOrdem_servico();

		PreparedStatement p;
		try{
			p = this.conexao.prepareStatement(comando);
			p.setInt(1, 3);
			p.setString(2, formatadorComHora.format(data));

			p.executeUpdate();
		}catch (SQLException e){
			e.printStackTrace();
		}
				
		return retorno;
	}

	@Override
	public Orcamento buscarOrcamento(String os) {
		Orcamento orcamento = new Orcamento();
		
		String comando = "select p.idProduto as idProduto, "
				+ "p.nome as nome, "
				+ "pp.quantidade as quantidade, "
				+ "pp.valorVenda as valorVenda "
				+ "from produtos as p\r\n" + 
				"inner join pedido_produto as pp\r\n" + 
				"on pp.produtos_idProduto = p.idProduto\r\n" + 
				"where pp.ordens_servico_idOrden_servico = " + os;

		List<Produto> listProduto = new ArrayList<Produto>();
		Produto produto = null;
		try{
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);			
			while(rs.next()){
				produto = new Produto();
				int idProduto = rs.getInt("idProduto");
				int quantidade = rs.getInt("quantidade");
				double valor = rs.getDouble("valorVenda");
				String nome = rs.getString("nome");

				produto.setIdProduto(idProduto);
				produto.setQuantidade(quantidade);
				produto.setValor(valor);
				produto.setNome(nome);
				
				listProduto.add(produto);
			}
			
			orcamento.setProduto(listProduto);
		}catch(Exception e){
			e.printStackTrace();
		}
		
		comando = "select s.idServico as idServico, "
				+ "s.descricao as descricao, "
				+ "ps.quantidade as quantidade, "
				+ "ps.valorVenda as valorVenda "
				+ "from servicos as s\r\n" + 
				"inner join pedido_servico as ps\r\n" + 
				"on ps.servicos_idServico = s.idServico\r\n" + 
				"where ps.ordens_servico_idOrden_servico = " + os;

		List<Servico> listServico = new ArrayList<Servico>();
		Servico servico = null;
		try{
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);			
			while(rs.next()){
				servico = new Servico();
				int idServico = rs.getInt("idServico");
				int quantidade = rs.getInt("quantidade");
				double valor = rs.getDouble("valorVenda");
				String desc = rs.getString("descricao");

				servico.setId(idServico);
				servico.setQuantidade(quantidade);
				servico.setValor(valor);
				servico.setDesc(desc);
				
				listServico.add(servico);
			}
			
			orcamento.setServico(listServico);
		}catch(Exception e){
			e.printStackTrace();
		}

		return orcamento;
	}

	@Override
	public boolean aprovar(Orcamento orcamento) {
		String comando = "UPDATE ordens_servico SET status_idStatus=?, data_status=? WHERE idOrden_servico=" + orcamento.getOrdemServico().getIdOrdem_servico();
		
		List<Produto> listProduto = orcamento.getProduto();
		
		PreparedStatement p;
		try{
			p = this.conexao.prepareStatement(comando);
			p.setInt(1, 4);
			p.setString(2, formatadorComHora.format(data));

			p.executeUpdate();
			
			for(Produto produto : listProduto) {
				comando = "select quantidade from produtos where idProduto like "+produto.getIdProduto();
				java.sql.Statement stmt = conexao.createStatement();
				ResultSet rs = stmt.executeQuery(comando);			
				while(rs.next()){
					int qnt = rs.getInt("quantidade");
					comando = "UPDATE produtos set quantidade = ? where idProduto LIKE " + produto.getIdProduto();
					
					PreparedStatement pS;
					pS = this.conexao.prepareStatement(comando);
					pS.setInt(1,qnt-produto.getQuantidade());

					pS.executeUpdate();	
				}
				
			}
			
			return true;
		}catch (SQLException e){
			e.printStackTrace();
			return false;
		}		
	}
	
	@Override
	public boolean recusar(Orcamento orcamento) {
		String comando = "UPDATE ordens_servico SET status_idStatus=?, data_status=? WHERE idOrden_servico=" + orcamento.getOrdemServico().getIdOrdem_servico();

		PreparedStatement p;
		try{
			p = this.conexao.prepareStatement(comando);
			p.setInt(1, 5);
			p.setString(2, formatadorComHora.format(data));

			p.executeUpdate();
			return true;
		}catch (SQLException e){
			e.printStackTrace();
			return false;
		}		
	}
	
	@Override
	public boolean prontoRetirar(Orcamento orcamento) {
		String comando = "UPDATE ordens_servico SET status_idStatus=?, data_status=? WHERE idOrden_servico=" + orcamento.getOrdemServico().getIdOrdem_servico();
		
		PreparedStatement p;
		try{
			p = this.conexao.prepareStatement(comando);
			
			if(orcamento.getOrdemServico().getStatus().getDescricao().equals("Aprovado")) {
				p.setInt(1, 6);
				p.setString(2, formatadorComHora.format(data));
			}else {
				p.setInt(1, 7);
				p.setString(2, formatadorComHora.format(data));
			}

			p.executeUpdate();
			return true;
		}catch (SQLException e){
			e.printStackTrace();
			return false;
		}		
	}
	
	@Override
	public boolean retirar(Orcamento orcamento) {
			
		String comando = "UPDATE ordens_servico SET status_idStatus=?, data_conclusao=?, data_status=? WHERE idOrden_servico=" + orcamento.getOrdemServico().getIdOrdem_servico();

		PreparedStatement p;
		try{
			p = this.conexao.prepareStatement(comando);
			if(orcamento.getOrdemServico().getStatus().getDescricao().equals("Aguardando Retirada - (Aprovado)")) {
				p.setInt(1, 8);
				p.setString(2, formatador.format(data));
				p.setString(3, formatadorComHora.format(data));
			}else {
				p.setInt(1, 9);
				p.setString(2, formatador.format(data));
				p.setString(3, formatadorComHora.format(data));
			}

			p.executeUpdate();
			return true;
		}catch (SQLException e){
			e.printStackTrace();
			return false;
		}		
	}
	
	@Override
	public boolean absorver(Orcamento orcamento) {
		String comando = "UPDATE ordens_servico SET status_idStatus=?, data_conclusao=?, data_status=? WHERE idOrden_servico=" + orcamento.getOrdemServico().getIdOrdem_servico();

		PreparedStatement p;
		try{
			p = this.conexao.prepareStatement(comando);
			p.setInt(1, 10);
			p.setString(2, formatador.format(data));
			p.setString(3, formatadorComHora.format(data));

			p.executeUpdate();
			return true;
		}catch (SQLException e){
			e.printStackTrace();
			return false;
		}		
	}
	

}
