package br.com.assistencia.Servlet;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;


@WebServlet("/EncerraSessao")
public class EncerraSessao extends HttpServlet {
	private static final long serialVersionUID = 1L;
    public EncerraSessao() {
        super();
    }
    
    private void process(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException, NoSuchAlgorithmException {
    	
    	HttpSession sessao = request.getSession();
    	
    	sessao.invalidate();
    	
		String context = request.getServletContext().getContextPath();
		
		response.sendRedirect(context+"/index.html");
    }
    
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			process(request, response);
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		try {
			process(request, response);
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
	}

}
