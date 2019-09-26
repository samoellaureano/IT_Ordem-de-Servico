
public class App {

	public static void main(String[] args) {
		IQuery query = new SelectBuilder().select().columns("nome", "idade").table("usuario").execute();
		
		System.out.println(query.query());
	
	}

}
