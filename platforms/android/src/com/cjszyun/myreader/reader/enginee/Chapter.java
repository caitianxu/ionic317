package com.cjszyun.myreader.reader.enginee;

import android.os.Handler;

import com.cjszyun.myreader.reader.beans.LinePosition;

import java.util.Vector;

/**
 * Created by zhuzd on 15/6/1.
 */
abstract public class Chapter {

	abstract public void clear();
	abstract public void reset(boolean delay);
	abstract public void parse(String strChapter);
	abstract public Vector<LinePosition> getCurPageLinePositions();
	abstract public void setHandler(Handler mHandler);
	abstract public boolean isFinish();

	abstract public int getPageCount();
	abstract public int getCurPageIndex();
	abstract public int getCurPagePosition();
	abstract public void setCurPagePosition(int pagePosition);

	abstract public void pageFirst();
	abstract public void pageEnd();
	abstract public boolean pageUp();
	abstract public boolean pageDown();

}

