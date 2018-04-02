package com.cjszyun.myreader.reader.enginee;

/**
 * Created by zhuzd on 15/6/1.
 */
public class ChapterManager {

	public enum PageJump {
		PREVIOUS, CURRENT, NEXT;

		public PageJump getNext() {
			switch(this) {
				case NEXT:
					return CURRENT;
				case CURRENT:
					return PREVIOUS;
				default:
					return null;
			}
		}

		public PageJump getPrevious() {
			switch(this) {
				case PREVIOUS:
					return CURRENT;
				case CURRENT:
					return NEXT;
				default:
					return null;
			}
		}
	}


	private final int SIZE = 3;
	private Chapter[] mChapters = new Chapter[SIZE];
	private PageJump[] mPageJumps = new PageJump[SIZE];

	private Class<?> mChapterClass;


	public ChapterManager(Class<?> chapterClass) {
		this.mChapterClass = chapterClass;
	}

	public Chapter getChapter(PageJump pageJump) {
		for (int i=0; i<SIZE; i++) {
			if (pageJump == mPageJumps[i]) {
				return mChapters[i];
			}
		}
		int i = getInternalIndex();
		mPageJumps[i] = pageJump;
		if (null == mChapters[i]) {
			try {
				mChapters[i] = (Chapter) mChapterClass.newInstance();
			} catch (InstantiationException e) {
				e.printStackTrace();
			} catch (IllegalAccessException e) {
				e.printStackTrace();
			}
		}
		return mChapters[i];
	}
	private int getInternalIndex() {
		for (int i=0; i<SIZE; i++) {
			if (null == mPageJumps[i]) {
				return i;
			}
		}
		for (int i=0; i<SIZE; i++) {
			if (mPageJumps[i] != PageJump.CURRENT) {
				return i;
			}
		}
		throw new RuntimeException("the PageIndex of cache is impossible");
	}

	public void clear() {
		for (int i=0; i<SIZE; i++) {
			mPageJumps[i] = null;
		}
		for (int i=0; i<SIZE; i++) {
			mChapters[i] = null;
		}
	}

	public void reset() {
		for (int i=0; i<SIZE; i++) {
			if (null != mChapters[i]) {
				if (mPageJumps[i] == PageJump.CURRENT) {
					mChapters[i].reset(false);
				} else {
					mChapters[i].reset(true);
				}
			}
		}
	}

	public void movePrevious() {
		move(false); // current pointer from previous
	}

	public void moveNext() {
		move(true); // current pointer from next
	}

	private void move(boolean forward) {
		for (int i=0; i<SIZE; i++) {
			if (null == mPageJumps[i]) {
				continue;
			}
			mPageJumps[i] = forward ? mPageJumps[i].getNext() : mPageJumps[i].getPrevious();
			if (null == mPageJumps[i]) {
				if (mChapters[i] != null) {
					mChapters[i].clear();
				}
			}
		}
	}

}
