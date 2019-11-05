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
		String comando = "SELECT e.nome as estado, c.nome as cidade, b.nome as bairro , r.nome as rua FROM ruas as r\r\n" + 
				"inner join bairros as b\r\n" + 
				"on r.bairros_idBairro = b.idBairro\r\n" + 
				"inner join cidades as c\r\n" + 
				"on b.cidades_idCidade = c.idCidade\r\n" + 
				"inner join estados as e\r\n" + 
				"on c.estados_idEstado = e.idEstado\r\n" + 
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
				
				endereco.setRua(rua);
				endereco.setBairro(bairro);
				endereco.setCidade(cidade);
				endereco.setEstado(estado);
				
			}
		}catch (Exception e){
			e.printStackTrace();
		}
		return endereco;
	}

}
