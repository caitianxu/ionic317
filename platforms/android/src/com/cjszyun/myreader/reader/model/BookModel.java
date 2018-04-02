package com.cjszyun.myreader.reader.model;

import android.graphics.drawable.Drawable;
import android.text.Html;
import android.text.Spanned;
import android.util.Log;

import com.android.volley.RequestQueue;
import com.cjszyun.myreader.reader.AppData;
import com.cjszyun.myreader.reader.beans.BookBean;
import com.cjszyun.myreader.reader.beans.BookMarkListBean;
import com.cjszyun.myreader.reader.beans.ChapterBean;
import com.cjszyun.myreader.reader.beans.EpubChapterBean;
import com.cjszyun.myreader.reader.beans.EpubChapterContentBean;
import com.cjszyun.myreader.reader.enginee.DownloadEpubPicTask;
import com.cjszyun.myreader.reader.enums.ChapterAction;
import com.cjszyun.myreader.reader.task.CallBackTask;
import com.cjszyun.myreader.reader.task.Task;
import com.cjszyun.myreader.reader.utils.DebugLog;
import com.cjszyun.myreader.reader.utils.FileUtil;
import com.cjszyun.myreader.reader.utils.SharedPreUtil;
import com.google.gson.Gson;
import com.zhy.http.okhttp.OkHttpUtils;
import com.zhy.http.okhttp.callback.Callback;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import okhttp3.Call;
import okhttp3.Response;

import static com.cjszyun.myreader.reader.utils.UrlHelper.URL_BOOKMARK_LIST;
import static com.cjszyun.myreader.reader.utils.UrlHelper.URL_CJZWW_CHAPTER;
import static com.cjszyun.myreader.reader.utils.UrlHelper.URL_CJZWW_CONTENT;
import static com.cjszyun.myreader.reader.utils.UrlHelper.URL_PUBLISH_CHAPTER;
import static com.cjszyun.myreader.reader.utils.UrlHelper.URL_PUBLISH_CONTENT;

/**
 * Created by zhuzd on 15/10/11.
 */
public class BookModel extends Model {

    private RequestQueue requestQueue;

    public BookModel(RequestQueue requestQueue) {
        this.requestQueue = requestQueue;
    }

    public static String getBookDirPath(int bookId, boolean isEpub) {
        return getBookDirPath(bookId, true, isEpub);
    }

    private static String getBookDirPath(int bookId, boolean build, boolean isEpub) {
        String s = isEpub ? "epub" : "";
        String dir = AppData.getConfig().getReadCacheRoot() + "/" + bookId + s;
        if (build)
            FileUtil.createFolderIfNotExist(dir);
        return dir;
    }

    private String getBookPath(int bookId, boolean isEpub) {
        return getBookDirPath(bookId, isEpub) + "/" + "bean";
    }

    private static String getChaptersPath(int bookId, boolean isEpub) {
        return getBookDirPath(bookId, isEpub) + "/" + "chapters";
    }

    private String getContentPath(final ChapterBean chapterBean, boolean isEpub) {
        return getBookDirPath(chapterBean.getBookId(), isEpub) + "/" +
                "ch" + chapterBean.getIndex() + "_" + chapterBean.getChapterId();
    }

    private boolean isCacheContent(final ChapterBean chapterBean, boolean isEpub) {
        File f = new File(getContentPath(chapterBean, isEpub));
        return f.exists();
    }


    public BookBean readBookBeanObject(int bookId, boolean isEpub) {
        return (BookBean) readObject(getBookPath(bookId, isEpub));
    }

    public List<ChapterBean> readChaptersObject(int bookId, boolean isEpub) {
        return (List<ChapterBean>) readObject(getChaptersPath(bookId, isEpub));
    }

    public String readContent(final ChapterBean chapterBean, boolean isEpub) {
        return FileUtil.readFile(getContentPath(chapterBean, isEpub));
    }

    //写入bookbean
    private void writeBookTask(final BookBean bookBean, final boolean isEpub) {
        final String task = "writeBook#" + bookBean.getBookId();
        getTaskManager().addTask(new Task(task) {
            @Override
            protected void doTask() {
                boolean result = writeObject(getBookPath(bookBean.getBookId(), isEpub), bookBean);
                if (!result) {
                    DebugLog.e("execute task: " + task + " failed!");
                }
            }
        });
    }

    private void writeChaptersTask(final int bookId, final List<ChapterBean> chapterBeans, final boolean isEpub) {
        final String task = "writeChapters#" + bookId;
        getTaskManager().addTask(new Task(task) {
            @Override
            protected void doTask() {
                boolean result = writeObject(getChaptersPath(bookId, isEpub), chapterBeans);
                if (!result) {
                    DebugLog.e("execute task: " + task + " failed!");
                    return;
                }
            }
        });
    }

    private void writeContentTask(final ChapterBean chapterBean, final String content, final boolean isEpub) {
        String task = String.format("writeContent#%s_%s_%s",
                chapterBean.getBookId(), chapterBean.getIndex(), chapterBean.getChapterId());
        getTaskManager().addTask(new Task(task) {
            @Override
            protected void doTask() {
                synchronized (content) {
                    FileUtil.writeFile(getContentPath(chapterBean, isEpub), content);
                }
            }
        });
    }


    public void loadBook(final int bookId, final String bookName, boolean isUpdate, final boolean isEpub) {

        if (!isEpub && isUpdate) { //是更新的章节，则在线阅读,只有网文更新
            reqBook(bookId, bookName, isEpub, false);
            return;
        }
        getTaskManager().addTask(new CallBackTask("readBook#" + bookId) {
            @Override
            protected void doTask() {
                BookBean bookBean = readBookBeanObject(bookId, isEpub);
                if (bookBean != null) {
                    sendMessage(BookMsg.LOAD_BOOK_SUCCESS, bookBean);
                } else {
                    reqBook(bookId, bookName, isEpub, false);
                }
            }
        });
    }

    //網絡加載寫bookbean到本地
    public void reqBook(final int bookId, final String bookName, final boolean isEpub, final boolean loadChapter) {
        String url;
        if (isEpub) {
            url = URL_PUBLISH_CHAPTER;
        } else {
            url = URL_CJZWW_CHAPTER;
        }
        final String token = SharedPreUtil.readData(AppData.getInstance().getApplicationContext(), "token");
        final String dev_type = SharedPreUtil.readData(AppData.getInstance().getApplicationContext(), "dev_type");
        OkHttpUtils.post().url(url)
                .addParams("book_id", bookId + "")
                .addParams("member_token", token)
                .addParams("token_type", dev_type)
                .build().execute(new Callback<EpubChapterBean>() {

            @Override
            public EpubChapterBean parseNetworkResponse(Response response, int id) throws Exception {
                String string = response.body().string();
                Log.i("bookmodel", "bookId = " + bookId + ",token = " + token + ",dev_type = " + dev_type + " : " + string);

                if (!isEpub) {
                    JSONObject jsonObject = new JSONObject(string);
                    JSONObject data = jsonObject.getJSONObject("data");
                    JSONObject chapters1 = data.getJSONObject("chapters");
                    JSONArray chapters = chapters1.getJSONArray("chapters");
                    EpubChapterBean.DataBean dataBean = new EpubChapterBean.DataBean();

                    EpubChapterBean.DataBean.ChapterList chapterList = new EpubChapterBean.DataBean.ChapterList();

                    List<EpubChapterBean.DataBean.ChaptersBean> chapterLists = new ArrayList<EpubChapterBean.DataBean.ChaptersBean>();

                    for (int i = 0; i < chapters.length(); i++) {
                        EpubChapterBean.DataBean.ChaptersBean chaptersBean = new EpubChapterBean.DataBean.ChaptersBean();
                        JSONObject jsonObject1 = chapters.getJSONObject(i);
                        chaptersBean.ch_id = jsonObject1.getString("ch_id");
                        chaptersBean.ch_index = jsonObject1.getInt("ch_index");
                        chaptersBean.ch_name = jsonObject1.getString("ch_name");
                        chaptersBean.ch_sale = jsonObject1.getInt("ch_sale");
                        chaptersBean.ch_update = jsonObject1.getString("ch_update");
                        chaptersBean.ch_vip = jsonObject1.getString("ch_vip");
                        chaptersBean.is_buyed = jsonObject1.getInt("is_buyed");
                        chapterLists.add(chaptersBean);
                    }
                    chapterList.all_count = chapters1.getInt("all_count");
                    chapterList.chapter_count = chapters1.getInt("chapter_count");
                    chapterList.chapters = chapterLists;

                    JSONObject info = data.getJSONObject("info");
                    EpubChapterBean.DataBean.InfoBean infoBean = new EpubChapterBean.DataBean.InfoBean();
                    infoBean.book_author = info.getString("book_author");
                    infoBean.book_cover = info.getString("book_cover");
                    infoBean.book_name = info.getString("book_name");
                    infoBean.book_cat_name = info.getString("book_cat_name");
                    infoBean.book_id = info.getInt("book_id");
                    infoBean.book_remark = info.getString("book_remark");
                    infoBean.is_finish = info.getInt("is_finish");
                    infoBean.word_size = info.getInt("word_size");
                    infoBean.create_time = info.getString("create_time");
                    infoBean.update_time = info.getString("update_time");

                    dataBean.info = infoBean;
                    dataBean.chapterList = chapterList;

                    EpubChapterBean epubChapterBean = new EpubChapterBean();
                    int code = jsonObject.getInt("code");
                    epubChapterBean.code = code;
                    epubChapterBean.data = dataBean;
                    epubChapterBean.message = jsonObject.getString("message");
                    return epubChapterBean;
                }
                EpubChapterBean epubChapterBean = new Gson().fromJson(string, EpubChapterBean.class);
                return epubChapterBean;
            }

            @Override
            public void onError(Call call, Exception e, int id) {
                sendMessage(BookMsg.LOAD_BOOK_FAILURE, "网络异常");
            }

            @Override
            public void onResponse(EpubChapterBean response, int id) {
                List<ChapterBean> chapterBeans;
                if (isEpub) {
                    chapterBeans = buildEpubChapter(response.data.chapters, 0);
                } else {
                    EpubChapterBean.DataBean.ChapterList chapterList = response.data.chapterList;
                    chapterBeans = fetchChapterBeans(chapterList.chapters, bookId);
                    if (chapterBeans == null || chapterBeans.isEmpty()) {
                        sendMessage(BookMsg.LOAD_CHAPTERS_FAILURE, "请求章节列表为空");
                        return;
                    }
                }
                if (loadChapter) {//加载章节
                    sendMessage(BookMsg.LOAD_CHAPTERS_SUCCESS, chapterBeans);
                } else {
                    BookBean bookBean = new BookBean(bookId, bookName, chapterBeans.size(),response.data.info.book_cover);
                    writeBookTask(bookBean, isEpub);
                    sendMessage(BookMsg.LOAD_BOOK_SUCCESS, bookBean);
                }
                writeChaptersTask(bookId, chapterBeans, isEpub);
            }
        });
    }

    //解析Epub的章节目录
    private List<ChapterBean> buildEpubChapter(List<EpubChapterBean.DataBean.ChaptersBean> data, int i) {
        int count = i;
        List<ChapterBean> chapterBeens = new ArrayList<ChapterBean>();
        for (EpubChapterBean.DataBean.ChaptersBean chaptersBean : data) {
            ChapterBean chapterBean = new ChapterBean(chaptersBean.book_id, chaptersBean.id, chaptersBean.name, chaptersBean.is_free == null ? 1 : 0, "0", 0);
            chapterBean.setpId(chaptersBean.pid);
            chapterBean.setIndex(count);
            chapterBeens.add(chapterBean);
            count += 1;
            List<EpubChapterBean.DataBean.ChaptersBean> child = chaptersBean.child;
            if (child != null && child.size() != 0) {
                List<ChapterBean> chapterBeen = buildEpubChapter(child, count);
                chapterBeens.addAll(chapterBeen);
                count += chapterBeen.size();
            }
        }
        return chapterBeens;
    }

    public void loadChapters(final int bookId, final int chapterCount, final boolean isEpub) {

        getTaskManager().addTask(new CallBackTask("readChapters#" + bookId) {
            @Override
            protected void doTask() {
                final List<ChapterBean> chapterBeans = readChaptersObject(bookId, isEpub);
                if (chapterBeans != null) {
                    sendMessage(BookMsg.LOAD_CHAPTERS_SUCCESS, chapterBeans);
                    return;
                }
                DebugLog.d("Failed to loading local cache chapters, and then loading from the network requests.");
//                reqChapters(bookId, isEpub);
                //網絡加載寫目錄bean到本地
                reqBook(bookId, "", isEpub, true);
            }
        });
    }


    //private
    public List<ChapterBean> fetchChapterBeans(final List<EpubChapterBean.DataBean.ChaptersBean> chaptersBeans, final int bookId) {
        List<ChapterBean> list = new ArrayList<ChapterBean>();
        int len = chaptersBeans.size();
        ChapterBean chapterBean;
        for (int i = 0; i < len; i++) {
            EpubChapterBean.DataBean.ChaptersBean chaptersBean = chaptersBeans.get(i);
            String ch_vip = chaptersBean.ch_vip;
            if (chaptersBean.is_buyed==1){
                ch_vip = "0";
            }
            chapterBean = new ChapterBean(bookId, Integer.parseInt(chaptersBean.ch_id), chaptersBean.ch_name,
                    Integer.parseInt(ch_vip), chaptersBean.ch_update, chaptersBean.ch_sale);
            chapterBean.setIndex(i);
            DebugLog.d(chapterBean.toString());
            list.add(chapterBean);
        }
        return list;
    }

    public void loadContent(final ChapterBean chapterBean, final ChapterAction chapterAction, final boolean isEpub) {

        String token = SharedPreUtil.readData(AppData.getInstance().getApplicationContext(), "token");
        DebugLog.d(String.format("loadContent: chapterBean:%s, chapterAction:%s)",
                chapterBean.toString(), chapterAction.toString()));
        if (isCacheContent(chapterBean, isEpub)) {//指定章节信息已经缓存
            String taskName = String.format("readContent#%s_%s_%s",
                    chapterBean.getBookId(), chapterBean.getIndex(), chapterBean.getChapterId());
            getTaskManager().addTask(new CallBackTask(taskName) {
                @Override
                protected void doTask() {
                    String content = readContent(chapterBean, isEpub);
                    if (content != null) {
                        //DebugLog.d("1111111111111111111111111111111111111111");
                        sendMessage(BookMsg.LOAD_CONTENT_SUCCESS, chapterBean.getIndex(), chapterAction.getValue(), content);
                    } else {
                        reqContent(chapterBean, chapterAction, isEpub);
                    }
                }
            });
        } else if (chapterBean.isVip() && ("".equals(token) || token == null)) {//指定章节信息是vip章节，同时用户token已经失效
            sendMessage(BookMsg.VIP_CHAPTER_NEED_LOGIN, chapterAction);
        } else {//未缓存章节
            reqContent(chapterBean, chapterAction, isEpub);
        }
    }

    //網絡加載寫章節內容到本地
    private void reqContent(final ChapterBean chapterBean, final ChapterAction chapterAction, final boolean isEpub) {
        String token = SharedPreUtil.readData(AppData.getInstance().getApplicationContext(), "token");
        String dev_type = SharedPreUtil.readData(AppData.getInstance().getApplicationContext(), "dev_type");
        String url;
        String chid;
        if (isEpub) {
            url = URL_PUBLISH_CONTENT;
            chid = "chapter_id";
        } else {
            url = URL_CJZWW_CONTENT;
            chid = "ch_id";
        }
        OkHttpUtils.post().url(url)
                .addParams("book_id", chapterBean.getBookId() + "")
                .addParams(chid, chapterBean.getChapterId() + "")
                .addParams("member_token", token)
                .addParams("token_type", dev_type)
                .build()
                .execute(new Callback<EpubChapterContentBean>() {
                    @Override
                    public EpubChapterContentBean parseNetworkResponse(Response response, int id) throws Exception {
                        String string = response.body().string();
                        JSONObject jsonObject = new JSONObject(string);
                        int code = jsonObject.getInt("code");
                        if (code == 0) {
                            EpubChapterContentBean epubChapterContentBean = new Gson().fromJson(string, EpubChapterContentBean.class);
                            return epubChapterContentBean;
                        } else {
                            EpubChapterContentBean epubChapterContentBean = new EpubChapterContentBean();
                            epubChapterContentBean.code = code;
                            epubChapterContentBean.data = null;
                            epubChapterContentBean.message = jsonObject.getString("message");
                            return epubChapterContentBean;
                        }
                    }

                    @Override
                    public void onError(Call call, Exception e, int id) {
                        e.printStackTrace();
                        sendMessage(BookMsg.LOAD_CONTENT_FAILURE, "网络连接异常");

                    }

                    @Override
                    public void onResponse(EpubChapterContentBean response, int id) {
                        if (response.code == 1) {
                            sendMessage(BookMsg.VIP_CHAPTER_NEED_BUY, chapterBean.getIndex(), chapterAction.getValue());
                            return;
                        }
                        if (response.code == 600){
                            sendMessage(BookMsg.VIP_CHAPTER_NEED_LOGIN);
                            return;
                        }
                        if (!isEpub) {
                            if (response.code == 0) {
                                final String content = response.data.ch_content;
                                content.replaceAll("\\r", "<br>");//网文VIP章节的bug
                                writeContentTask(chapterBean, content, isEpub);
                                sendMessage(BookMsg.LOAD_CONTENT_SUCCESS, chapterBean.getIndex(), chapterAction.getValue(), content);

                            } else {
                                sendMessage(BookMsg.VIP_CHAPTER_NEED_BUY, chapterBean.getIndex(), chapterAction.getValue());
//                                    sendMessage(BookMsg.LOAD_CONTENT_FAILURE, "您还没有购买该章节哦");
                            }
                            return;
                        }
                        final List<String> strings = new ArrayList<String>();
                        final List<String> downloadUrls = new ArrayList<String>();
                        String content = response.data.content;
                        Spanned s1 = Html.fromHtml(content, new Html.ImageGetter() {
                            @Override
                            public Drawable getDrawable(String source) {
//                                    InputStream is = null;
                                try {
                                    downloadUrls.add(source);
                                    String substring = source.substring(source.lastIndexOf("/"));
                                    String savePath = AppData.getConfig().getReadCacheRoot() + "/" + chapterBean.getBookId() + "epub" + substring;

                                    strings.add(savePath);
                                    Log.i("bookmodel", "source = " + source);
                                    return null;
                                } catch (Exception e) {
                                    return null;
                                }
                            }
                        }, null);
                        String s2 = s1 + "";
                        if (s2.endsWith("\n\n")) {//去掉章节最后的换行
                            s2 = s2.substring(0, s2.lastIndexOf("\n\n"));
                            s2 = s2.replaceAll("\\n\\n", "<br>\u3000\u3000");
                        }
                        if (s2.contains("￼")) {//将￼替换为图片url
                            String[] split = s2.split("￼");
                            StringBuffer stringBuffer = new StringBuffer();
                            for (int i = 0; i < split.length - 1; i++) {
                                String imgUrl = strings.get(i);
                                String s_i = split[i] + "￼" + imgUrl;
                                stringBuffer.append(s_i);
                            }
                            stringBuffer.append(split[split.length - 1]);
                            s2 = stringBuffer + "";
                        }

                        Log.i("bookmodel", "content = " + content);
                        Log.i("bookmodel", "s1 = " + s1);
                        Log.i("bookmodel", "s2 = " + s2);

                        //遍历下载该段落里的所有图片
                        if (downloadUrls != null && downloadUrls.size() > 0) {
                            for (String downloadUrl : downloadUrls) {
                                final String finalS = s2;
                                DownloadEpubPicTask target = new DownloadEpubPicTask(downloadUrl, chapterBean.getBookId(), new DownloadEpubPicTask.DownloadEpubPicInterface() {
                                    @Override
                                    public void downloadFinish() {
                                        if (AppData.getDownloadEpubPicMap().size() == 0) {
                                            //自定义接口用来判断所有加载的epub图片全部加载完毕
                                            sendMessage(BookMsg.LOAD_CONTENT_SUCCESS, chapterBean.getIndex(), chapterAction.getValue(), finalS);
                                        }
                                    }
                                });
                                AppData.getDownloadEpubPicMap().put(downloadUrl, target);
                                new Thread(target).start();
                            }
                        } else {
                            sendMessage(BookMsg.LOAD_CONTENT_SUCCESS, chapterBean.getIndex(), chapterAction.getValue(), s2);
                        }
                        writeContentTask(chapterBean, s2, isEpub);
                    }
                });

    }

    //获取书签列表
    public void reqBookMark(int mBookId, boolean isEpub, String dev_type, String token) {
        OkHttpUtils.post().url(URL_BOOKMARK_LIST)
                .addParams("member_token", token)
                .addParams("token_type", dev_type)
                .addParams("book_id", mBookId + "")
                .addParams("book_type", (isEpub ? 2 : 1) + "")
                .build().execute(new Callback<BookMarkListBean>() {
            @Override
            public BookMarkListBean parseNetworkResponse(Response response, int id) throws Exception {
                String string = response.body().string();
                JSONObject jsonObject = new JSONObject(string);
                int code = jsonObject.getInt("code");
                String message = jsonObject.getString("message");
                if (code == 600){
                    BookMarkListBean bookMarkListBean = new BookMarkListBean();
                    bookMarkListBean.code = code;
                    bookMarkListBean.message = message;
                    return bookMarkListBean;
                }
                BookMarkListBean bookMarkListBean = new Gson().fromJson(string, BookMarkListBean.class);
                return bookMarkListBean;
            }

            @Override
            public void onError(Call call, Exception e, int id) {
                sendMessage(BookMsg.LOAD_BOOKMARK_FAILURE, "网络异常");
            }

            @Override
            public void onResponse(BookMarkListBean response, int id) {
                if (response.code == 600){
                    sendMessage(BookMsg.VIP_CHAPTER_NEED_LOGIN, response.message);
                }
                if (response.code == 0) {
                    sendMessage(BookMsg.LOAD_BOOKMARK_SUCCESS, response.data);
                } else {
                    sendMessage(BookMsg.LOAD_BOOKMARK_FAILURE, "获取书签列表失败");
                }
            }
        });
    }

    /*public void reqComment(int bookId, int page) {
        reqJSONObject(requestQueue, UrlHelper.comments(bookId, page), new JsonParser() {
            @Override
            public void parser(JSONObject jsonObj) {
                DebugLog.d(jsonObj.toString());
                try {
                    int code = jsonObj.getInt("code");
                    if (code != 200) {
                        String error = jsonObj.getString("msg");
                        sendMessage(BookMsg.LOAD_COMMENT_FAILURE, String.format("code:%s, error:%s", code, error));
                        return;
                    }
                    JSONArray comments = jsonObj.getJSONArray("comments");
                    Type type = new TypeToken<List<BookReviewInfo>>() {
                    }.getType();
                    List<BookReviewInfo> bookComments = new Gson().fromJson(comments.toString(), type);
                    sendMessage(BookMsg.LOAD_COMMENT_SUCCESS, bookComments);
                } catch (Exception e) {
                    if (DebugLog.isDebuggable()) {
                        e.printStackTrace();
                    }
                    sendMessage(BookMsg.LOAD_COMMENT_FAILURE, e.getMessage());
                }
            }

            @Override
            public void error(NetException error) {
                if (DebugLog.isDebuggable()) {
                    error.printStackTrace();
                }
                sendMessage(BookMsg.LOAD_COMMENT_FAILURE, error.getMessage());
            }
        });
    }*/


}
