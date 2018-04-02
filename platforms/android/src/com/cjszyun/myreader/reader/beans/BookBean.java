package com.cjszyun.myreader.reader.beans;

import com.cjszyun.myreader.reader.utils.DebugLog;

import java.io.Serializable;
import java.util.List;

/**
 * Created by zhuzd on 15/10/20.
 */
public class BookBean implements Serializable {

	private int bookId;
	private String bookName;
	private int chapterCount;

	private List<ChapterBean> chapterBeans;
    private String bookCover;

    public String getBookCover() {
        return bookCover;
    }


	public BookBean(int bookId, String bookName, int chapterCount) {
		this.bookId = bookId;
		this.bookName = bookName;
		this.chapterCount = chapterCount;
	}
	public BookBean(int bookId, String bookName, int chapterCount,String bookCover) {
		this.bookId = bookId;
		this.bookName = bookName;
		this.chapterCount = chapterCount;
        this.bookCover = bookCover;
    }

	public ChapterBean getChapterBean(int chapterIndex) {
		return chapterBeans.get(chapterIndex);
	}

	public int getBookId() {
		return bookId;
	}
	public String getBookName() {
		return bookName;
	}
	public int getChapterCount() {
		return chapterCount;
	}
	public int getChapterIndex(int chapterId) {
		for (ChapterBean chapterBean : chapterBeans) {
			if (chapterBean.getChapterId()==chapterId){
				return chapterBean.getIndex();
			}
		}
		return 0;
	}
	public List<ChapterBean> getChapterBeans() {
		return chapterBeans;
	}
	public void setChapterBeans(List<ChapterBean> chapterBeans) {
		DebugLog.d("--------- setChapterBeans(List<ChapterBean> chapterBeans) " + (chapterBeans == null ? "ERROR null !!!!!!!!!!!!!!!!!!!!" : chapterBeans.size()));
		this.chapterBeans = chapterBeans;
	}

	@Override
	public String toString() {
		return "BookBean{" +
				"bookId=" + bookId +
				", bookName='" + bookName + '\'' +
				", chapterCount=" + chapterCount +
				'}';
	}

}
