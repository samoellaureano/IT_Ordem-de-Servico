package br.com.assistencia.jdbc;

import java.sql.Connection;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import br.com.assistencia.jdbcinterface.BairroDAO;
import br.com.assistencia.objetos.Bairro;

public class JDBCBairroDAO implements BairroDAO{

	private Connection conexao;

	public JDBCBairroDAO (Connection conexao){
		this.conexao = conexao;
	}

	@Override
	public List<Bairro> buscar(int idCidade) {
		String comando = "SELECT b.idBairro, b.nome FROM bairros as b " + 
				"inner join cidades as c " + 
				"on b.cidades_idCidade = c.idCidade " + 
				"where b.cidades_idCidade = " + idCidade;

		List<Bairro> listBairros = new ArrayList<Bairro>();
		Bairro bairro = null;
		try{
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while(rs.next()){
				bairro = new Bairro();
				String nome = rs.getString("nome");
				int idBairro = rs.getInt("idBairro");

				bairro.setNome(nome);
				bairro.setIdBairro(idBairro);

				listBairros.add(bairro);
			}
		}catch(Exception e){
			e.printStackTrace();
		}

		return listBairros;
	}
}
