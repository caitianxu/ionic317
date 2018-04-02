package com.cjszyun.myreader.reader.enginee;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * Created by zhuzd on 15/6/1.
 */
public class OnlinePage extends Page {

	public interface OnDrawHeadListener {
		String getChapterName();
	}


	private OnDrawHeadListener mOnDrawHeadListener;

	public void setOnDrawHeaderListener(OnDrawHeadListener onDrawHeadListener) {
		this.mOnDrawHeadListener = onDrawHeadListener;
	}

	public OnlinePage(ChapterManager chapterManager) {
		super(chapterManager);
	}

	@Override
	protected void drawHead(final Canvas canvas) {
		if (mOnDrawHeadListener != null) {
			String chapterName = mOnDrawHeadListener.getChapterName();
			int index = chapterName.indexOf("章");
			chapterName = chapterName.substring(0,index + 1) + " " + chapterName.substring(index + 1) ;
			final Paint paint = mReadConfig.getExtraPaint();
//			paint.setTypeface(Typeface.DEFAULT_BOLD); //TODO BOLD ?
			canvas.drawText(chapterName, mReadConfig.getMarginWidth(), mReadConfig.getExtraTextHeight(), paint);
			paint.setTypeface(null);
		}
	}

	@Override
	protected void drawFoot(final Canvas canvas) {
		final Paint paint = mReadConfig.getExtraPaint();

		int width = mReadConfig.getWidth();
		int height = mReadConfig.getHeight();

		float marginWidth = mReadConfig.getMarginWidth();
		//float marginHeight = mReadConfig.getMarginHeight();

		float batteryWidth = mReadConfig.getBatteryWidth();
		float batteryHeight = mReadConfig.getBatteryHeight();

		//1. 电量
		int batteryTailWidth = 3;
		int gap = 2;
		paint.setColor(Color.GRAY);
		paint.setStyle(Paint.Style.STROKE);

		float batteryTop =  height - (batteryHeight + 5);
		canvas.drawRect(marginWidth, batteryTop - 5, marginWidth + batteryWidth, batteryTop + batteryHeight - 5, paint);
		canvas.drawRect(marginWidth + batteryWidth, batteryTop - 5 + batteryHeight/4, marginWidth + batteryWidth + batteryTailWidth, batteryTop - 5+ batteryHeight/4*3, paint);
		paint.setStyle(Paint.Style.FILL);
		canvas.drawRect(marginWidth + gap, batteryTop + gap - 5, marginWidth + gap + (batteryWidth - 2*gap) * mReadConfig.getBatterPercent(), batteryTop + batteryHeight - gap - 5, paint);


		//2.时间
		SimpleDateFormat sdf = new SimpleDateFormat("HH:mm", Locale.getDefault());
		String strTime = sdf.format(new Date());
		canvas.drawText(strTime, marginWidth + batteryWidth + batteryTailWidth + 10, height - 10, paint);

		//3. 进度
		final Chapter curCache = mChapterManager.getChapter(ChapterManager.PageJump.CURRENT);
		if (curCache.isFinish()) {
			String strPercent = (curCache.getCurPageIndex() + 1) + "/" + curCache.getPageCount();
			float nPercentWidth = paint.measureText(strPercent);
			canvas.drawText(strPercent, width - nPercentWidth - marginWidth, height - 10, paint);
		}
	}

}
