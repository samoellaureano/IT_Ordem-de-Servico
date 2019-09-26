
public class SelectBuilder implements ISelect, From, Where {

	private String table;
	private String columns;
	private String where;
	
	public SelectBuilder select() {
		return this;
	}
	
	@Override
	public From columns(String... columns) {
		for (String column : columns) {
			this.columns += " " + column + ",";
		}
		return this;
	}
	
	@Override
	public Where table(String table) {
		this.table = table;
		return this;
	}
	
	@Override
	public Where where(String where) {
		this.where = where;
		return this;
	}
	
	@Override
	public IQuery execute() {
		return new Query("Select " + this.columns + " from " + this.table + " where" + this.where);
	}

	



}
