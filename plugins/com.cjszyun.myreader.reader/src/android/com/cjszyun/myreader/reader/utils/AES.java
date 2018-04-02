package com.cjszyun.myreader.reader.utils;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

/**
 * Created by zhuzd on 15/5/23.
 */
public class AES {

	private static final String CHARSET   = "UTF-8";
	private static final String ALGORITHMS = "AES/CBC/PKCS5Padding";
	private static final String ALGORITHM  = "AES";

	private static final byte[] KEYS = {0x32, 0x10, (byte)0xc2, (byte)0xda, 0x3f, (byte)0x13, (byte)0xc8, 0x3e,
			(byte)0xf8, 0x2a, (byte)0x43, (byte)0xa1, 0x32, (byte)0xc0,0x73,  0x21};

	public static byte[] encrypt(String source) {
		try {
			return encrypt(source.getBytes(CHARSET));
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	public static byte[] encrypt(byte[] data) {
		try {
			IvParameterSpec zeroIv = new IvParameterSpec(KEYS);
			SecretKeySpec key1 = new SecretKeySpec(KEYS, ALGORITHM);
			Cipher cipher = Cipher.getInstance(ALGORITHMS);
			cipher.init(Cipher.ENCRYPT_MODE, key1, zeroIv);
			return cipher.doFinal(data);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	public static String decrypt(byte[] data) {
		try {
			IvParameterSpec zeroIv = new IvParameterSpec(KEYS);
			SecretKeySpec key1 = new SecretKeySpec(KEYS, ALGORITHM);
			Cipher cipher = Cipher.getInstance(ALGORITHMS);
			cipher.init(Cipher.DECRYPT_MODE, key1, zeroIv);
			return new String(cipher.doFinal(data),CHARSET);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
}
