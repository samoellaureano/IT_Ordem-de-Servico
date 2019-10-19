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

			for (Funcionario funcionarioBanco : dao.buscar("")) {
				if (funcionario.existe(funcionarioBanco)) {
					return true;
				}
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
		public boolean verificaExistenciaBanco(Cliente funcionario) {
			/*
			for (Funcionario funcionarioBanco : dao.buscar("")) {
				if (funcionario.existe(funcionarioBanco)) {
					return true;
				}
			}
			*/
			return false;
		}

	}

}
