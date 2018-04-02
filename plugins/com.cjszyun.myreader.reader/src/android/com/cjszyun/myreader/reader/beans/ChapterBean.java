package com.cjszyun.myreader.reader.beans;

import java.io.Serializable;

/**
 * Created by zhuzd on 15/6/1.
 */
public class ChapterBean implements Serializable {

    //	private static final int TYPE_PUBLIC = 0;
    private static final int TYPE_VIP = 1;

    private int bookId;
    private int type; //0:public, 1:vip
    private int chapterId;
    private int pId;    //父级id
    private int chSale;


    private boolean select;

    private String chapterName;
    private String time;

    private int index = -1;

    public ChapterBean(int bookId, int chapterId, String chapterName, int type, String time, int chSale) {
        this.bookId = bookId;
        this.chapterId = chapterId;
        this.chapterName = chapterName;
        this.type = type;
        this.time = time;
        this.chSale = chSale;
    }

    public int getpId() {
        return pId;
    }

    public void setpId(int pId) {
        this.pId = pId;
    }


    public boolean isSelect() {
        return select;
    }

    public void setSelect(boolean select) {
        this.select = select;
    }
    public int getBookId() {
        return bookId;
    }

    public int getChapterId() {
        return chapterId;
    }

    public String getChapterName() {
        return chapterName;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public void setType(int type) {
        this.type = type;
    }

    public boolean isVip() {
        return type == TYPE_VIP;
    }

    public int getIndex() {
        return index;
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public int getChSale() {
        return chSale;
    }

    public void setChSale(int chSale) {
        this.chSale = chSale;
    }

    @Override
    public String toString() {
        return ChapterBean.class.getSimpleName() + '{' +
                "index=" + index +
                ", " + (type == TYPE_VIP ? "[VIP] " : "") +
                "chapterName='" + chapterName + '\'' +
                ", chapterId=" + chapterId +
                ", bookId=" + bookId +
                ", type=" + type +
                ", time=" + time +
                ", chSale=" + chSale +
                '}';
    }


}
