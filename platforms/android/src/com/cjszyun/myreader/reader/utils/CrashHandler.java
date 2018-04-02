package com.cjszyun.myreader.reader.utils;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Build;
import android.text.TextUtils;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by zhuzd on 16/5/4.
 */
public class CrashHandler implements Thread.UncaughtExceptionHandler {

	public static String TMP_LOG;

	private static CrashHandler mCrashHandler = new CrashHandler();

	private CrashHandler() {}

	public static CrashHandler getInstance() {
		return mCrashHandler;
	}

	private Context mContext;

	public void init(Context context) {
		mContext = context;
		Thread.setDefaultUncaughtExceptionHandler(this);
	}

	public void uncaughtException(Thread thread, Throwable ex) {
		DebugLog.e("Thread newId:" + thread.getId() + " name:" + thread.getName() + " message:" + ex.getMessage());
		ex.printStackTrace();
		if (handleException(ex)) {
		}
		android.os.Process.killProcess(android.os.Process.myPid());
	}

	private boolean handleException(Throwable ex) {
		PackageManager pm = mContext.getPackageManager();
		StringBuilder sb = new StringBuilder();
		try {
			PackageInfo pi = pm.getPackageInfo(mContext.getPackageName(), PackageManager.GET_ACTIVITIES);
			sb.append("versionCode=").append(pi.versionCode);
			sb.append(",versionName=").append(pi.versionName);
			sb.append(",model=").append(Build.MODEL);
			DebugLog.e("CrashHandler error data:" + sb.toString());

			String errorMessage = extractErrorMessage(ex);
			DebugLog.e("CrashHandler error message:" + errorMessage);
			save2LocalFile(errorMessage);
		} catch (PackageManager.NameNotFoundException e) {
			e.printStackTrace();
		}
		return true;
	}

	private String extractErrorMessage(Throwable ex) {
		StringBuilder sb = new StringBuilder("\r\n\r\n");
		sb.append("Exception occur at ");
		sb.append(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
		sb.append("\r\n");
		if (ex != null) {
			StringWriter info = new StringWriter();
			PrintWriter printWriter = new PrintWriter(info);
			try {
				ex.printStackTrace(printWriter);
				Throwable cause = ex.getCause();
				while (cause != null) {
					cause.printStackTrace(printWriter);
					cause = cause.getCause();
				}
				sb.append(info.toString());
			} finally {
				try {
					info.close();
					printWriter.close();
				} catch(Exception e) {
					DebugLog.e(e.getMessage());
				}
			}
		}
		return sb.toString();
	}

	private void save2LocalFile(String result) {
		FileWriter fw = null;
		BufferedWriter out = null;
		try {
			if (! DeviceUtil.availableSDCard()) {
				DebugLog.w("SD Card unavailable!");
				return;
			}

			FileUtil.createFolderIfNotExist(getLogPath());
			//每个月一个LOG文件
			String fileName = "crash-" + new SimpleDateFormat("yyyyMM").format(new Date()) + ".log";
			File file = new File(getLogPath() + fileName);
			if (! FileUtil.createFileIfNotExist(file)){
				return ;
			}
			fw = new FileWriter(file, true);
			out = new BufferedWriter(fw);
			out.write(result, 0, result.length()-1);
			out.flush();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (fw != null) fw.close();
				if (out != null) out.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	private String getLogPath() {
		if (TextUtils.isEmpty(TMP_LOG)) {
			TMP_LOG = mContext.getExternalCacheDir() + "/logs/"; // 涉及到目录的问题应该统一管理
		}
		return TMP_LOG;
	}

}
