package br.com.assistencia.jdbc;

import java.sql.Connection;
import java.sql.ResultSet;

import br.com.assistencia.jdbcinterface.EnderecoDAO;
import br.com.assistencia.objetos.Endereco;

public class JDBCEnderecoDAO implements EnderecoDAO{
	
	private Connection conexao;

	public JDBCEnderecoDAO (Connection conexao){
		this.conexao = conexao;
	}

	@Override
	public Endereco buscar(String cep) {
		String comando = "SELECT e.nome as estado, c.nome as cidade, b.nome as bairro , r.nome as rua, r.idRua FROM ruas as r " + 
				"inner join bairros as b " + 
				"on r.bairros_idBairro = b.idBairro " + 
				"inner join cidades as c " + 
				"on b.cidades_idCidade = c.idCidade " + 
				"inner join estados as e " + 
				"on c.estados_idEstado = e.idEstado " + 
				"where r.cep = " + cep;
		
		Endereco endereco = null;
		try{
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while(rs.next()){
				endereco = new Endereco();
				
				String estado = rs.getString("estado");
				String cidade = rs.getString("cidade");
				String bairro = rs.getString("bairro");
				String rua = rs.getString("rua");
				int idRua = rs.getInt("idRua");
				
				endereco.setRua(rua);
				endereco.setBairro(bairro);
				endereco.setCidade(cidade);
				endereco.setEstado(estado);
				endereco.setIdRua(idRua);
				
			}
		}catch (Exception e){
			e.printStackTrace();
		}
		return endereco;
	}

}
