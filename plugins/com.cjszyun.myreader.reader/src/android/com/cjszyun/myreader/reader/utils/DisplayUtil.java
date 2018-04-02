package com.cjszyun.myreader.reader.utils;

import android.content.Context;
import android.view.Display;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;

import static com.cjszyun.myreader.reader.enginee.Config.ShelfScale;

/**
 * Created by zhuzd on 15/5/16.
 */
public class DisplayUtil {

	/*
	 * 将px值转换为dip或dp
	 */
	public static int px2dip(Context context, float pxValue) {
		final float scale = context.getResources().getDisplayMetrics().density;
		return (int)(pxValue / scale + 0.5f);
	}

	/*
	 * 将dip转换为px
	 */
	public static int dip2px(Context context, float dipValue) {
		final float scale = context.getResources().getDisplayMetrics().density;
		return (int)(dipValue * scale + 0.5f);
	}

	/*
	 * 将px转换为sp
	 */
	public static int px2sp(Context context, float pxValue) {
		final float fontScale = context.getResources().getDisplayMetrics().scaledDensity;
		return (int)(pxValue / fontScale + 0.5f);
	}

	/*
	 * 将sp转换为px
	 */
	public static int sp2px(Context context, float spValue) {
		final float fontScale = context.getResources().getDisplayMetrics().scaledDensity;
		return (int)(spValue * fontScale + 0.5f);
	}

	public static int getScreenWidth(Context context) {
		WindowManager manager = (WindowManager) context
				.getSystemService(Context.WINDOW_SERVICE);
		Display display = manager.getDefaultDisplay();
		return display.getWidth();
	}

	public static int getScreenHeight(Context context) {
		WindowManager manager = (WindowManager) context
				.getSystemService(Context.WINDOW_SERVICE);
		Display display = manager.getDefaultDisplay();
		return display.getHeight();
	}

	public static void setMyPicLayoutParam(Context context, View view, int weight){
		float width = getScreenWidth(context) / weight;
		ViewGroup.LayoutParams layoutParams = view.getLayoutParams();
		layoutParams.width = (int) width;
		layoutParams.height = (int) (width * ShelfScale);
		view.setLayoutParams(layoutParams);
	}
}
