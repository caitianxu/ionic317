package com.cjszyun.myreader.reader.beans;

import java.util.List;

/**
 * Created by Administrator on 2017/9/19 0019.
 */
public class EpubChapterBean {

    public int code;
    public DataBean data;
    public String message;

    public static class DataBean {

        public InfoBean info;
        public List<ChaptersBean> chapters;
        public ChapterList chapterList;

        public static class InfoBean {

            public String book_author;
            public String book_cover;
            public String book_cover_small;
            public int book_id;
            public String book_name;
            public String book_url;
            public double price;
            public String schedule;
            //网文
            public String book_cat_name;
            public String book_remark;
            public String create_time;
            public String update_time;
            public int is_finish;
            public int word_size;
        }

        public static class ChaptersBean {

            public int book_id;
            public String code;
            public String create_time;
            public String format;
            public int id;
            public String name;
            public String path;
            public int pid;
            public String pname;
            public String purl;
            public int start_page;
            public Integer is_free;
            public String url;
            public List<ChaptersBean> child;

            /**
             * 网文的章节bean
             */

            public String ch_id;
            public int ch_index;
            public String ch_name;
            public int ch_sale;
            public String ch_update;
            public String ch_vip;
            public int is_buyed;
        }
        public static class ChapterList {

            public int all_count;
            public int chapter_count;
            public List<ChaptersBean> chapters;

        }
    }
}
