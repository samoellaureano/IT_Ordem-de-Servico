package br.com.assistencia.util;

import br.com.assistencia.jdbc.JDBCFuncionarioDAO;
import br.com.assistencia.objetos.Funcionario;

public class ValidadorFuncionario implements IValidador<Funcionario> {

	private JDBCFuncionarioDAO dao;

	public ValidadorFuncionario(JDBCFuncionarioDAO dao) {
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
