package br.com.assistencia.jdbc;

import java.sql.Connection;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import br.com.assistencia.jdbcinterface.RuaDAO;
import br.com.assistencia.objetos.Rua;

public class JDBCRuaDAO implements RuaDAO{

	private Connection conexao;

	public JDBCRuaDAO (Connection conexao){
		this.conexao = conexao;
	}

	@Override
	public List<Rua> buscar(int idBairro) {
		String comando = "SELECT r.idRua, r.nome, r.cep FROM ruas as r " + 
				"inner join bairros as b " + 
				"on r.bairros_idBairro = b.idBairro " + 
				"where r.bairros_idBairro = " + idBairro;

		List<Rua> listRuas = new ArrayList<Rua>();
		Rua rua = null;
		try{
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while(rs.next()){
				rua = new Rua();
				String nome = rs.getString("nome");
				int idRua = rs.getInt("idRua");
				String cep = rs.getString("cep");

				rua.setNome(nome);
				rua.setIdRua(idRua);
				rua.setCep(cep);

				listRuas.add(rua);
			}
		}catch(Exception e){
			e.printStackTrace();
		}

		return listRuas;
	}

}
