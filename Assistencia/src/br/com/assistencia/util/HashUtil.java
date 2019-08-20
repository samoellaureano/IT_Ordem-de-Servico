package br.com.assistencia.util;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class HashUtil {
	public String stringToMD5 (String string) throws NoSuchAlgorithmException, UnsupportedEncodingException {
		
		string = ("_!$@#" + string);
		
		MessageDigest md = MessageDigest.getInstance("MD5");
		
		md.update(string.getBytes());
		byte[] b = md.digest();
		StringBuffer sb = new StringBuffer();
		
		for(byte b1: b) {
			sb.append(Integer.toHexString(b1 & 0xff).toString());
		}
        return sb.toString();
		
	}

}
