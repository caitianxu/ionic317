package com.cjszyun.myreader.reader.beans;

import java.util.List;

/**
 * Created by Administrator on 2017/10/29 0029.
 */

public class BookMarkListBean {

    public int code;
    public List<DataBean> data;
    public String message;

    public static class DataBean {
        /**
         * book_id : 12220
         * chapter_id : 1960752
         * content : fdsfdsfdsfdsfdsf
         * create_time : 2017-07-18 11:24:48
         * mark_id : 34
         * member_id : 220368
         * org_id : 187
         */

        public int book_id;
        public int chapter_id;
        public String content;
        public String name;
        public String create_time;
        public int mark_id;
        public int member_id;
        public int org_id;
    }
}
