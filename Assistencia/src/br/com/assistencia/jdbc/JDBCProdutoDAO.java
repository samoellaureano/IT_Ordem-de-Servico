package br.com.assistencia.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import br.com.assistencia.jdbcinterface.ProdutoDAO;
import br.com.assistencia.objetos.Categoria;
import br.com.assistencia.objetos.Marca;
import br.com.assistencia.objetos.Produto;
import br.com.assistencia.objetos.SubCategoria;

public class JDBCProdutoDAO implements ProdutoDAO{

	Connection conexao;
	public JDBCProdutoDAO(Connection conexao) {
		this.conexao = conexao;		
	}

	@Override
	public boolean inserir(Produto produto) {
		SubCategoria subCategoria = produto.getSubCategoria();
		Marca marca = produto.getMarca();

		String comando = "insert into produtos "
				+ "(nome, valor, quantidade, status, subcategorias_idSubcategoria, marcas_idMarca) "
				+ "VALUES (?,?,?,?,?,?)";
		PreparedStatement p;

		try{
			p = this.conexao.prepareStatement(comando);
			p.setString(1, produto.getNome());
			p.setDouble(2, produto.getValor());
			p.setInt(3, produto.getQuantidade());
			p.setBoolean(4, true);
			p.setInt(5, subCategoria.getIdSubcategoria());
			p.setInt(6, marca.getIdMarca());
			p.execute();
		}catch (SQLException e){
			return false;
		}
		return true;
	}

	@Override
	public List<Produto> buscar(String desc) {
		String comando = "SELECT p.idProduto as idProduto, p.nome as nomeProduto, p.valor as valor, p.quantidade as quantidade, p.status as status, c.idCategoria as idCategoria,\r\n" + 
				"c.nome as nomeCategoria, sc.idSubcategoria as idSubcategoria, sc.nome as nomeSubCategoria, m.idMarca as idMarca, m.nome as nomeMarca\r\n" + 
				"FROM produtos as p\r\n" + 
				"inner join subcategorias as sc\r\n" + 
				"on p.subcategorias_idSubcategoria = sc.idSubcategoria\r\n" + 
				"inner join categorias as c\r\n" + 
				"on sc.categorias_idCategoria = c.idCategoria\r\n" + 
				"inner join marcas as m\r\n" + 
				"on p.marcas_idMarca = m.idMarca ";

		if(!desc.equals("null") && !desc.equals("") && !desc.equals("*")){
			comando += "WHERE p.nome LIKE '%" + desc + "%' ";
		}

		comando += "order by p.nome asc";

		List<Produto> listProdutos = new ArrayList<Produto>();
		Produto produto = null;
		Categoria categoria = null;
		SubCategoria subCategoria = null;
		Marca marca = null;
		try{
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while(rs.next()){
				produto = new Produto();
				categoria = new Categoria();
				subCategoria = new SubCategoria();
				marca = new Marca();

				int idProduto = rs.getInt("idProduto");
				String nome = rs.getString("nomeProduto");
				double valor = rs.getDouble("valor");										
				int quantidade = rs.getInt("quantidade");
				boolean status = rs.getBoolean("status");

				produto.setIdProduto(idProduto);
				produto.setNome(nome);
				produto.setValor(valor);
				produto.setQuantidade(quantidade);
				produto.setStatus(status);

				int idCategoria = rs.getInt("idCategoria");
				String nomeCategoria = rs.getString("nomeCategoria");

				categoria.setIdCategoria(idCategoria);
				categoria.setNome(nomeCategoria);
				produto.setCategoria(categoria);

				int idSubcategoria = rs.getInt("idSubcategoria");
				String nomeSubCategoria = rs.getString("nomeSubCategoria");

				subCategoria.setIdSubcategoria(idSubcategoria);
				subCategoria.setNome(nomeSubCategoria);
				produto.setSubCategoria(subCategoria);

				int idMarca = rs.getInt("idMarca");
				String nomeMarca = rs.getString("nomeMarca");

				marca.setIdMarca(idMarca);
				marca.setNome(nomeMarca);
				produto.setMarca(marca);

				listProdutos.add(produto);
			}
		}catch(Exception e){
			e.printStackTrace();
		}

		return listProdutos;
	}

	@Override
	public Produto buscarPorId(int id) {
		String comando = "SELECT p.idProduto as idProduto, p.nome as nomeProduto, p.valor as valor, p.quantidade as quantidade, p.status as status, c.idCategoria as idCategoria,\r\n" + 
				"c.nome as nomeCategoria, sc.idSubcategoria as idSubcategoria, sc.nome as nomeSubCategoria, m.idMarca as idMarca, m.nome as nomeMarca\r\n" + 
				"FROM produtos as p\r\n" + 
				"inner join subcategorias as sc\r\n" + 
				"on p.subcategorias_idSubcategoria = sc.idSubcategoria\r\n" + 
				"inner join categorias as c\r\n" + 
				"on sc.categorias_idCategoria = c.idCategoria\r\n" + 
				"inner join marcas as m\r\n" + 
				"on p.marcas_idMarca = m.idMarca " + 
				"WHERE p.idProduto = " + id;

		Produto produto = null;
		Categoria categoria = null;
		SubCategoria subCategoria = null;
		Marca marca = null;
		try{
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while(rs.next()){
				produto = new Produto();
				categoria = new Categoria();
				subCategoria = new SubCategoria();
				marca = new Marca();

				int idProduto = rs.getInt("idProduto");
				String nome = rs.getString("nomeProduto");
				double valor = rs.getDouble("valor");										
				int quantidade = rs.getInt("quantidade");
				boolean status = rs.getBoolean("status");

				produto.setIdProduto(idProduto);
				produto.setNome(nome);
				produto.setValor(valor);
				produto.setQuantidade(quantidade);
				produto.setStatus(status);

				int idCategoria = rs.getInt("idCategoria");
				String nomeCategoria = rs.getString("nomeCategoria");

				categoria.setIdCategoria(idCategoria);
				categoria.setNome(nomeCategoria);
				produto.setCategoria(categoria);

				int idSubcategoria = rs.getInt("idSubcategoria");
				String nomeSubCategoria = rs.getString("nomeSubCategoria");

				subCategoria.setIdSubcategoria(idSubcategoria);
				subCategoria.setNome(nomeSubCategoria);
				produto.setSubCategoria(subCategoria);

				int idMarca = rs.getInt("idMarca");
				String nomeMarca = rs.getString("nomeMarca");

				marca.setIdMarca(idMarca);
				marca.setNome(nomeMarca);
				produto.setMarca(marca);
			}
		}catch(Exception e){
			e.printStackTrace();
		}

		return produto;
	}

	@Override
	public boolean atualizar(Produto produto) {
		String comando = "UPDATE produtos SET nome=?, valor=?, quantidade=?, status=?, subcategorias_idSubcategoria=?, marcas_idMarca=? WHERE idProduto=" + produto.getIdProduto();

		PreparedStatement p;
		try{
			p = this.conexao.prepareStatement(comando);
			p.setString(1, produto.getNome());
			p.setDouble(2, produto.getValor());
			p.setInt(3, produto.getQuantidade());
			p.setBoolean(4, produto.getStatus());
			p.setInt(5, produto.getSubCategoria().getIdSubcategoria());
			p.setInt(6, produto.getMarca().getIdMarca());

			p.executeUpdate();
			return true;
		}catch (SQLException e){
			e.printStackTrace();
			return false;
		}		
	}
}
