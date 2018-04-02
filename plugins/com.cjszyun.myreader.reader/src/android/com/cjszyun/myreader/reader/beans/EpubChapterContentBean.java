package com.cjszyun.myreader.reader.beans;

/**
 * Created by Administrator on 2017/9/19 0019.
 */

public class EpubChapterContentBean {

    public int code;
    public DataBean data;
    public String message;

    public static class DataBean {

        public String content;
        public String ch_content;
        public String ch_name;
    }
}
