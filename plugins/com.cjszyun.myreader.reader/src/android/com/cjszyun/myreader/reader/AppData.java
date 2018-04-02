package com.cjszyun.myreader.reader;

import android.app.Application;
import android.content.Context;
import android.util.DisplayMetrics;
import android.view.WindowManager;

import com.cjszyun.myreader.reader.enginee.Config;
import com.cjszyun.myreader.reader.enginee.DownloadEpubPicTask;
import com.cjszyun.myreader.reader.utils.CrashHandler;
import com.cjszyun.myreader.reader.utils.DebugLog;

import java.util.HashMap;

/**
 * Created by zhuzd on 15/5/16.
 */
public class AppData extends Application {

	private static AppData INSTANCE;
	private static HashMap<String,DownloadEpubPicTask> downloadEpubPicMap = new HashMap<String,DownloadEpubPicTask>();
	private static Config config;
	private static ReadClient client;
	private int myScreenHeight;
	private int myScreenWidth;

	public static AppData getInstance() {
		return INSTANCE;
	}

	@Override
	public void onCreate() {
		super.onCreate();
		DebugLog.d("create application");
		INSTANCE = this;
		CrashHandler.getInstance().init(INSTANCE);
		initScreenWidth();

		config = new Config(getApplicationContext());
		client = new ReadClient();
	}

	@Override
	public void onTerminate() {
		super.onTerminate();
		DebugLog.d("terminate application");
	}

	public static Config getConfig() {
		return config;
	}

	public static ReadClient getClient() {
		return client;
	}
	public static HashMap<String,DownloadEpubPicTask> getDownloadEpubPicMap() {
		return downloadEpubPicMap;
	}
	/**
	 * 获取屏幕的参数，宽度和高度
	 */
	private void initScreenWidth() {
		DisplayMetrics metrics = new DisplayMetrics();
		WindowManager windowManager = (WindowManager)
				this.getSystemService(Context.WINDOW_SERVICE);
		windowManager.getDefaultDisplay().getMetrics(metrics);
		myScreenHeight = metrics.heightPixels;
		myScreenWidth = metrics.widthPixels;
	}

	public int getScreenWidth() {
		return myScreenWidth;
	}

	public int getScreenHeight() {
		return myScreenHeight;
	}

}
