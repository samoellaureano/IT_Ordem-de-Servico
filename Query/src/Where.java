
public interface Where {
	Where where(String where);
	IQuery execute();
}