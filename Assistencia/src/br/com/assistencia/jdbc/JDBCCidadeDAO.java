package br.com.assistencia.jdbc;

import java.sql.Connection;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import br.com.assistencia.jdbcinterface.CidadeDAO;
import br.com.assistencia.objetos.Cidade;

public class JDBCCidadeDAO implements CidadeDAO{
	
	private Connection conexao;

	public JDBCCidadeDAO (Connection conexao){
		this.conexao = conexao;
	}

	@Override
	public List<Cidade> buscar(int id) {
		String comando = "SELECT c.idCidade, c.nome FROM cidades as c " + 
				"inner join estados as e " + 
				"on c.estados_idEstado = e.idEstado " + 
				"where c.estados_idEstado = " + id;

		List<Cidade> listCidades = new ArrayList<Cidade>();
		Cidade cidade = null;
		try{
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while(rs.next()){
				cidade = new Cidade();
				String nome = rs.getString("nome");
				int idCidade = rs.getInt("idCidade");
				
				cidade.setNome(nome);
				cidade.setIdCidade(idCidade);
				
				listCidades.add(cidade);
			}
		}catch(Exception e){
			e.printStackTrace();
		}

		return listCidades;
	}

}
