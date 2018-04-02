package com.cjszyun.myreader.reader.utils;

import android.content.Context;
import android.os.Environment;
import android.telephony.TelephonyManager;

import com.cjszyun.myreader.reader.AppData;

/**
 * Created by zhuzd on 16/5/4.
 */
public class DeviceUtil {

	public static boolean availableSDCard() {
		return Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED);
	}

	// 获得android手机的IMSI码 (15位的字符串)
	public static String getImsi() {
		TelephonyManager tm = (TelephonyManager) AppData.getInstance().getSystemService(Context.TELEPHONY_SERVICE);
		return tm.getSubscriberId();
	}

	// 获得android手机的IMEI码，如果是电信手机，在此码后面加上“c”,以补充位数为15位
	public static String getImei() {
		TelephonyManager tm = (TelephonyManager) AppData.getInstance().getSystemService(Context.TELEPHONY_SERVICE);
		String imei = tm.getDeviceId();
		if (imei.length() == 14) {
			imei = imei + "c";
		}
		if (imei.length() == 15) {
			return imei;
		}
		return null;
	}

}
