package com.cjszyun.myreader.reader.enginee;

import android.os.Handler;
import android.os.Message;

import com.cjszyun.myreader.reader.AppData;
import com.cjszyun.myreader.reader.beans.LinePosition;
import com.cjszyun.myreader.reader.config.ReadConfig;
import com.cjszyun.myreader.reader.model.BookMsg;
import com.cjszyun.myreader.reader.utils.DebugLog;

import java.util.ArrayList;
import java.util.List;
import java.util.Vector;

/**
 * Created by zhuzd on 15/6/1.
 */
public class OnlineChapter extends Chapter {

	private String buf;
	private int curPageIndex;
	private List<Vector<LinePosition>> mPageList;

	private Vector<LinePosition> mLinePositions;
	private ReadConfig mReadConfig;
	private int mPagePosition;

	private Handler mHandler;
	private boolean isFinish;

	/* constructor */
	public OnlineChapter() {
		curPageIndex = 0;
		mPageList = new ArrayList<Vector<LinePosition>>();
		mLinePositions= new Vector<LinePosition>();
		mReadConfig = AppData.getConfig().getReadConfig();
	}

	private boolean isRest = false;

	private Handler mParserHandler = new Handler() {
		@Override
		public void handleMessage(Message msg) {
			super.handleMessage(msg);
			switch(msg.what) {
				case BookMsg.PARSER_FINAL_PAGE_SUCCESS:
					isFinish = true;
					getCurrentPage(mPagePosition);
					if (mHandler!=null) {
						mHandler.sendEmptyMessage(BookMsg.PARSER_CURRENT_PAGE_SUCCESS);
					}
					break;
				default:
					DebugLog.d("unknown msg:" + Integer.toHexString(msg.what));
					break;
			}
		}
	};

	@Override
	public void reset(boolean delay) {
		if (this.buf == null) {
			return;
		}
		if (delay) {
			isRest = true; // 延期重置，在下次执行 getLines() 方法时执行
		} else {
			mPagePosition = getCurPagePosition();
			parse(this.buf);
			isRest = false;
		}
	}

	@Override
	public Vector<LinePosition> getCurPageLinePositions() {
		if (isRest) {
			reset(false); // 执行上一次延期重置
		}
		if (mLinePositions.size() == 0) {
			if (mPageList.size() > 0) {
				mLinePositions.addAll(mPageList.get(curPageIndex));
			}
		}
		return mLinePositions;
	}

	@Override
	public int getPageCount() {
		return mPageList.size();
	}

	@Override
	public int getCurPageIndex() {
		return curPageIndex;
	}

	@Override
	public int getCurPagePosition() {
		if (mPageList.size() == 0 || curPageIndex > mPageList.size()) {
			return 0;
		} else {
			return mPageList.get(curPageIndex).get(0).begin;
		}
	}

	@Override
	public void setCurPagePosition(int pagePosition) {
		mPagePosition = pagePosition;
	}

	private int convertPageIndex(int position) {
		if (this.buf == null) {
			return 0;
		}
		if (position < 0 || position >= this.buf.length()) {
			throw new RuntimeException("Page Position is out of Index, position:" + position + ", size:" + mPageList.size());
		}
		for (int i = 0; i < mPageList.size(); i++) {
			Vector<LinePosition> v = mPageList.get(i);
			LinePosition first = v.get(0);
			if (position == first.begin) {
				return i;
			}
		}
		DebugLog.d("this position is error, set curPageIndex to first");
		return 0;
	}

	@Override
	public void pageFirst() {
		curPageIndex = 0;
	}

	@Override
	public void pageEnd() {
		if (mPageList.size() > 0) {
			curPageIndex = mPageList.size() - 1;
		} else {
			curPageIndex = 0;
		}
	}

	@Override
	public boolean pageUp() {
		if (curPageIndex <= 0) {
			DebugLog.d("FALSE");
			return false;
		}
		curPageIndex--;
		if (!isFinish) {
			mPagePosition = mPageList.get(curPageIndex).firstElement().begin;
		}
		mLinePositions.clear();
		return true;
	}

	@Override
	public boolean pageDown() {
		if (curPageIndex + 1 >= mPageList.size()) {
			DebugLog.d("FALSE");
			return false;
		}
		curPageIndex++;
		if (!isFinish) {
			mPagePosition = mPageList.get(curPageIndex).firstElement().begin;
		}
		mLinePositions.clear();
		return true;
	}

	@Override
	public void clear() {
		if (buf != null) {
			synchronized (buf) {
				mLinePositions.clear();
				mPageList.clear();
				curPageIndex = -1;
				buf = null;
				DebugLog.d("set buf to null");
			}
		}
	}

	@Override
	synchronized public void parse(final String strChapter) {
		if (null == strChapter) {
			throw new RuntimeException("strChapter is null");
		}
		isFinish = false;
		mLinePositions.clear();
		mPageList.clear();
		curPageIndex = 0;
		this.buf = strChapter;
		mReadConfig.calLineSpacing();
		ChapterParser chapterParser = new ChapterParser(mReadConfig.getNormalLineSpacing(),
														mReadConfig.getBigLineSpacing(),
														mReadConfig.getVisibleWidth(),
														mReadConfig.getVisibleHeight(),
														mReadConfig.getTextPaint(),
														mReadConfig.getPicPaint(),
														mReadConfig.getCharSpacing());
		chapterParser.setPagePosition(mPagePosition);
		chapterParser.setHandler(mParserHandler);
		chapterParser.parse(strChapter);
		mPageList = chapterParser.getPageList();
		getCurrentPage(mPagePosition);
	}

	public void getCurrentPage(int pagePosition){
		if (mPageList.size() == 0) {
			return;
		}
		curPageIndex = convertPageIndex(pagePosition);
	}

	@Override
	public void setHandler(Handler mHandler) {
		this.mHandler = mHandler;
	}

	@Override
	public boolean isFinish() {
		return isFinish;
	}
}
