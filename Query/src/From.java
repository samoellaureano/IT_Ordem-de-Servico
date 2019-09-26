public interface From {
	Where table(String table);

	From columns(String[] columns);
}
