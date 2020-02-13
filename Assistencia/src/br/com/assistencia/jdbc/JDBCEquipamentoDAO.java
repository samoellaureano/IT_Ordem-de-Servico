package br.com.assistencia.jdbc;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import br.com.assistencia.jdbcinterface.EquipamentoDAO;
import br.com.assistencia.objetos.Equipamento;

public class JDBCEquipamentoDAO implements EquipamentoDAO{
	
	Connection conexao;
	
	public JDBCEquipamentoDAO(Connection conexao) {
		this.conexao = conexao;
	}
	@Override
	public boolean inserir(Equipamento equipamento) {

		String comando = "insert into equipamentos "
				+ "(modelo, acessorio, tipos_idTipo, marcas_idMarca) "
				+ "VALUES (?,?,?,?)";
		PreparedStatement p;

		try{
			p = this.conexao.prepareStatement(comando);
			p.setString(1, equipamento.getModelo());
			p.setString(2, equipamento.getAcessorio());
			p.setInt(3, equipamento.getTipo().getIdTipo());
			p.setInt(4, equipamento.getMarca().getIdMarca());
			p.execute();
		}catch (SQLException e){
			return false;
		}
		return true;
	}

}
