package com.cjszyun.myreader.reader.utils;

/**
 * Created by zhuzd on 15/6/5.
 */
public class UrlHelper {

    public static String URL_CJSZYUN = "http://www.cjszyun.net";

    //出版章节列表
    public static final String URL_PUBLISH_CHAPTER = URL_CJSZYUN + "/v3/api/book/chapterTree";

    //网文章节列表
    public static final String URL_CJZWW_CHAPTER = URL_CJSZYUN + "/v3/bookChapter/list";

    //出版获取章节内容
    public static final String URL_PUBLISH_CONTENT = URL_CJSZYUN + "/v3/api/book/getChapterContent";

    //网文获取章节内容
    public static final String URL_CJZWW_CONTENT = URL_CJSZYUN + "/v3/chapter/content";

    //购买出版图书整本
    public static final String URL_BUY_PUBLISH = URL_CJSZYUN + "/v3/bookOrder/saveOrder";

    //购买网文图书章节
    public static final String URL_BUY_CHAPTER = URL_CJSZYUN + "/v3/payChapter/buyChapter";

    //获取网文章节价格
    public static final String URL_GETPRICE_CHAPTER = URL_CJSZYUN + "/v3/payChapter/getPrice";

    //获取出版价格
    public static final String URL_GETPRICE_PUBLISH = URL_CJSZYUN + "/v3/payBook/getPrice";

    //添加书签
    public static final String URL_ADD_BOOKMARK = URL_CJSZYUN + "/v2/api/member/addBookMark";

    //书签列表
    public static final String URL_BOOKMARK_LIST = URL_CJSZYUN + "/v2/api/member/getMarkList";

    //删除书签
    public static final String URL_DEL_BOOKMARK = URL_CJSZYUN + "/v2/api/member/deleteMarks";

    //获取用户信息
    public static final String URL_GETUSER_INFO = URL_CJSZYUN + "/v2/api/mobile/memberInfo";

    //更新阅读记录
    public static final String URL_UPDATAREADRECORD = URL_CJSZYUN + "/v3/api/bookShelf/updateMemberReadRecord";

    //打赏
    public static final String DS_URL = URL_CJSZYUN + "/v3/book/reward";

}
