package br.com.assistencia.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import br.com.assistencia.jdbcinterface.OrcamentoDAO;
import br.com.assistencia.objetos.Endereco;
import br.com.assistencia.objetos.Orcamento;
import br.com.assistencia.objetos.OrdemServico;
import br.com.assistencia.objetos.Produto;
import br.com.assistencia.objetos.Servico;
import br.com.assistencia.objetos.Usuario;


public class JDBCOrcamentoDAO implements OrcamentoDAO{
	private Connection conexao;

	public JDBCOrcamentoDAO(Connection conexao) {
		this.conexao = conexao;
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
		
		OrdemServico ordemServico = cliente.getUsuario();
		Endereco endereco = cliente.getEndereco();
		
		String comando = "INSERT INTO enderecos (numero, complemento, ruas_idRua) VALUES (?,?,?)";
		PreparedStatement p;
		
		try{
			p = this.conexao.prepareStatement(comando);
			p.setInt(1, endereco.getNumero());
			p.setString(2, endereco.getComplemento());
			p.setInt(3, endereco.getIdRua());
			p.execute();
		}catch (SQLException e){
			System.out.println(e);
		}
		/*
		comando = "SELECT MAX(idEndereco) as idEndereco FROM enderecos";
		
		try {
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet ultimoIdEndereco = stmt.executeQuery(comando);
			while(ultimoIdEndereco.next()){
				endereco.setIdEndereco(ultimoIdEndereco.getInt("idEndereco"));
			}			
		}catch (SQLException e){
			System.out.println(e);
		}
		*/

		comando = "INSERT INTO clientes (nome, telefone, telefoneAux, email, status, enderecos_idEndereco, usuarios_cpf) " + 
				"VALUES (?,?,?,?,?,last_insert_ID(),?);";
		
		try{
			p = this.conexao.prepareStatement(comando);
			p.setString(1, cliente.getNome());
			p.setString(2, cliente.getTelefone());
			p.setString(3, cliente.getTelefoneAux());
			p.setString(4, cliente.getEmail());
			p.setBoolean(5, true);
			p.setString(6, usuario.getCpf().getNumero());
			p.execute();
		}catch (SQLException e){
			System.out.println(e);
		}

		return true;
	}


}
