package com.cjszyun.myreader.reader.enums;

/**
 * Created by zhuzd on 15/10/22.
 */
public enum ChapterAction {

	INIT(0),			// 页面初始化到上次阅读位置
	DOWN(1),			// 翻到下一章
	UP(2),				// 翻到上一章
	JUMP(3),			// 章节跳转
	CACHE_PREV(4, true),// 加载上一章到缓存,不显示
	CACHE_NEXT(5, true),// 加载下一章到缓存,不显示
	LOAD(6, true);		// 预读章节到本地,不显示

	private int value;
	private boolean silent;

	public int getValue() {
		return value;
	}
	public boolean isSilent() {
		return silent;
	}

	ChapterAction(int value) {
		this.value = value;
	}
	ChapterAction(int value, boolean silent) {
		this.value = value;
		this.silent = silent;
	}

	public static ChapterAction getAction(int value) {
		switch(value) {
			case 0: return INIT;
			case 1: return DOWN;
			case 2: return UP;
			case 3: return JUMP;
			case 4: return CACHE_PREV;
			case 5: return CACHE_NEXT;
			case 6: return LOAD;
			default:
				return null;
		}
	}
}
