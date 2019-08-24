package br.com.assistencia.FiltroConexao;

import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Servlet Filter implementation class Filter
 */
@WebFilter("/Filter")
public class Filter implements javax.servlet.Filter {

    /**
     * Default constructor. 
     */
    public Filter() {
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see Filter#destroy()
	 */
	public void destroy() {
		// TODO Auto-generated method stub
	}

	/**
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException{
		/*
		 * O método  getContextPath é responsavel por retornar o contexto  da URL que realizou a requisição.
		 */
		String context = request.getServletContext().getContextPath();
		
		try {
			/*
			 * O método getSession é responsavel por pegar a sessão ativa.
			 * Aqui foi necessário fazer um casting pois o objeto request é do tipo ServletRequest e não
			 * HttpServletRequest como no servelet onde você utiliza o método sem o uso do casting.
			 */
			HttpSession session = ((HttpServletRequest) request).getSession();
			String usuario = null;
			if(session != null) {
				usuario = (String) session.getAttribute("login");
			}
			if(usuario == null) {
				/*
				 * Aqui esta sendo setado um atributo na sessão para que depois possamos
				 * exibir uma mensagem ao usuário.
				 */
				session.setAttribute("msg", "Você não está logado no sistema!");
				/*
				 * Utilizamos o método sendoRedirect que altera a URL do navegador para posicionar
				 * o usuário na tela de login, que neste caso é a pagina index.html
				 * Note que não precisamos utilizar o recurso "../../"  para informar
				 * o caminho da pagina index.html, a variavel do contexto ja posiciona no inicio da URL.
				 */
				((HttpServletResponse) response).sendRedirect(context+"/index.html");
			}else {
				/*
				 * Caso exista um usuario valido (diferente de nulo) envia a requicição para
				 * a pagina que se deseja acessar, ou seja, permite o acesso, deixar passar.
				 */
				chain.doFilter(request, response);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {
		// TODO Auto-generated method stub
	}

}
