package br.com.assistencia.jdbc;

import java.sql.Connection;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

import br.com.assistencia.jdbcinterface.DashboardDAO;
import br.com.assistencia.objetos.Dashboard;

public class JDBCDashboardDAO implements DashboardDAO{

	Connection conexao;

	public JDBCDashboardDAO (Connection conexao) {
		this.conexao = conexao;
	}

	@Override
	public Dashboard busca() {
		Dashboard dash = null;
		List<String> listMesQnt = null;
		List<String> listQntOs = null;
		List<String> listMesValor = null;
		List<String> valorOs = null;
		
		
		String comando ="SELECT COUNT(status_idStatus) AS osEmAberto FROM ordens_servico " + 
				"where status_idStatus = 2;";

		try{
			dash = new Dashboard();
			listMesQnt = new ArrayList<String>();
			listQntOs = new ArrayList<String>();
			listMesValor = new ArrayList<String>();
			valorOs = new ArrayList<String>();
			
			
			java.sql.Statement stmt = conexao.createStatement();
			ResultSet rs = stmt.executeQuery(comando);
			while(rs.next()){
				dash.setOsEmAberto(rs.getInt("osEmAberto"));
			}
			
			comando = "SELECT COUNT(status_idStatus) AS osEmAbertoAprovado FROM ordens_servico " + 
					"where status_idStatus = 4;";
			rs = stmt.executeQuery(comando);
			while(rs.next()){
				dash.setOsEmAbertoAprovado(rs.getInt("osEmAbertoAprovado"));
			}
			//Tras a quantidade de OS por Mes
			comando = "SELECT month(data_abertura) as mes, count(idOrden_servico) AS quantidade FROM ordens_servico\r\n" + 
					"where status_idStatus = 8 or status_idStatus = 9\r\n" + 
					"group by MONTH(data_abertura); ";
			rs = stmt.executeQuery(comando);
			while(rs.next()){
				
				listMesQnt.add(rs.getString("mes"));
				listQntOs.add(rs.getString("quantidade"));
			}
			
			dash.setListMesQnt(listMesQnt);
			dash.setQntOs(listQntOs);
			//final
			//Tras a valor de OS por Mes
			comando = "SELECT month(os.data_conclusao) as Mes, ((SELECT SUM(p.quantidade * p.valorVenda)) + (SELECT SUM(s.quantidade * s.valorVenda))) AS Valor FROM ordens_servico as os\r\n" + 
					"left join pedido_produto as p\r\n" + 
					"on p.ordens_servico_idOrden_servico = os.idOrden_servico\r\n" + 
					"left join pedido_servico as s\r\n" + 
					"on s.ordens_servico_idOrden_servico = os.idOrden_servico\r\n" + 
					"where os.status_idStatus = 8 or os.status_idStatus = 9\r\n" + 
					"group by MONTH(os.data_conclusao); ";
			rs = stmt.executeQuery(comando);
			while(rs.next()){
				
				listMesValor.add(rs.getString("mes"));
				valorOs.add(rs.getString("valor"));
			}
			
			dash.setListMesValor(listMesValor);
			dash.setValorOs(valorOs);
		}catch(Exception e){
			e.printStackTrace();
		}

		return dash;

	}

}
