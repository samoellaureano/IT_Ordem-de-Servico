
public class Query implements IQuery {

	private String query;
	
	public Query(String query) {
		this.query = query;
	}
	
	@Override
	public String query() {
		return this.query;
	}

}
