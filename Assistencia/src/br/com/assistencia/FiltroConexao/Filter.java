package br.com.assistencia.FiltroConexao;

import java.io.IOException;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebFilter("/Filter")
public class Filter implements javax.servlet.Filter {

    /**
     * Default constructor. 
     */
    public Filter() {
        // TODO Auto-generated constructor stub
    }
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException{
		/*
		 * O método  getContextPath é responsavel por retornar o contexto  da URL que realizou a requisição.
		 */
		String context = request.getServletContext().getContextPath();
		
		try {
			HttpSession session = ((HttpServletRequest) request).getSession();
			String usuario = null;
			
			
			
			if(session != null) {
				usuario = (String) session.getAttribute("login");
			}
			if(usuario == null) {
				((HttpServletResponse) response).sendRedirect(context+"/index.html");
			}else {
				chain.doFilter(request, response);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
