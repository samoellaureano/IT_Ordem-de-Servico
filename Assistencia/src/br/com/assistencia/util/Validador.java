package br.com.assistencia.util;

import br.com.assistencia.jdbc.JDBCClienteDAO;
import br.com.assistencia.jdbc.JDBCFuncionarioDAO;
import br.com.assistencia.objetos.Cliente;
import br.com.assistencia.objetos.Funcionario;

public class Validador {

	public static class VFuncionario implements IValidador<Funcionario> {

		private JDBCFuncionarioDAO dao;

		public VFuncionario(JDBCFuncionarioDAO dao) {
			this.dao = dao;
		}

		@Override
		public boolean verificaExistenciaBanco(Funcionario funcionario) {
			
			funcionario = dao.consultarFuncionarioExistente(funcionario);
			
			if(funcionario.getIdFuncionario() != 0) {
				return true;
			}
			return false;
		}
	}

	public static class VCliente implements IValidador<Cliente> {

		@SuppressWarnings("unused")
		private JDBCClienteDAO dao;

		public VCliente(JDBCClienteDAO jdbcCliente) {
			this.dao = jdbcCliente;
		}

		@Override
		public boolean verificaExistenciaBanco(Cliente cliente) {
			cliente = dao.consultarClienteExistente(cliente);
			
			if(cliente.getIdCliente() != 0) {
				return true;
			}
			return false;
		}

	}

}
