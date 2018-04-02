package com.cjszyun.myreader.reader.model;

/**
 * Created by zhuzd on 15/10/21.
 */
public class BookMsg {

	public static final int LOAD_BOOK_SUCCESS = 0x20001;
	public static final int LOAD_BOOK_FAILURE = 0x20002;
	public static final int LOAD_CHAPTERS_SUCCESS = 0x20003;
	public static final int LOAD_CHAPTERS_FAILURE = 0x20004;
	public static final int LOAD_CONTENT_SUCCESS = 0x20005;
	public static final int LOAD_CONTENT_FAILURE = 0x20006;
	public static final int LOAD_BOOKMARK_SUCCESS = 0x20010;
	public static final int LOAD_BOOKMARK_FAILURE = 0x20011;

	public static final int VIP_CHAPTER_NEED_LOGIN = 0x20101;
	public static final int VIP_CHAPTER_NEED_BUY = 0x20102;
	public static final int LOAD_CONTENT_PIC = 0x20103;//下载epub中的图片

	public final static int TAB_TO_BOOKSHELF = 0x30001;

	public final static int RESULT_JUMP_TO_CHAPTER = 0x10;
	public final static int RESULT_TAB_TO_BOOKSHELF = 0x12;

	public static final int PARSER_CURRENT_PAGE_SUCCESS = 0x21;
	public static final int PARSER_FINAL_PAGE_SUCCESS = 0x22;
    public static final int REFRESH_MARK = 0x23;//删除书签之后刷新书签imagebutton


	public static final String PUNCTUATION = ",.:'\"!()-_+/?[]，。！？》〉、；：（）［］｛｝〕．·“”’…";
    public static final String END_PUNCTUATION = ".'\"!()[]。！？》〉（）［］｛｝〕．·“”’…";

	public static final String HTML_BR = "<br>";
}
