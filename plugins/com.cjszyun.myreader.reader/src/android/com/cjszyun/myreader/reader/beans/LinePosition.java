package com.cjszyun.myreader.reader.beans;


public class LinePosition {

	public int begin;
	public int size;
	public boolean isEndLine;
	public String str;
	public float spacing;
	public float actualWidth;
	public String picUrl;//图片url

	public LinePosition(int begin, int size) {
		super();
		this.begin = begin;
		this.size = size;
		this.isEndLine = false;
		this.str = "";

	}

	public LinePosition(int begin, int size, boolean isEndLine, String str, float spacing, float actualWidth) {
		this.begin = begin;
		this.size = size;
		this.isEndLine = isEndLine;
		this.str = str;
		this.spacing = spacing;
		this.actualWidth = actualWidth;
	}
}
