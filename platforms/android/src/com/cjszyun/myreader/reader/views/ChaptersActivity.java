package com.cjszyun.myreader.reader.views;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.BaseAdapter;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.toolbox.Volley;
import com.cjszyun.myreader.reader.AppData;
import com.cjszyun.myreader.reader.beans.BookBean;
import com.cjszyun.myreader.reader.beans.BookMarkListBean;
import com.cjszyun.myreader.reader.beans.ChapterBean;
import com.cjszyun.myreader.reader.model.BookModel;
import com.cjszyun.myreader.reader.model.BookMsg;
import com.cjszyun.myreader.reader.utils.DebugLog;
import com.cjszyun.myreader.reader.utils.SharedPreUtil;
import com.zhy.http.okhttp.OkHttpUtils;
import com.zhy.http.okhttp.callback.Callback;

import org.json.JSONObject;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import okhttp3.Call;
import okhttp3.Response;

import static com.cjszyun.myreader.reader.BookReader.GOTO_LOGIN;
import static com.cjszyun.myreader.reader.model.BookMsg.REFRESH_MARK;
import static com.cjszyun.myreader.reader.utils.UrlHelper.URL_DEL_BOOKMARK;


/**
 * Created by zhuzd on 15/6/8.
 */
public class ChaptersActivity extends BaseActivity {

    ImageView chapterIv;
    TextView chapterTitle;
    TextView chapterAuthor;
    ImageView up_down_iv;
    TextView up_down_tv;
    LinearLayout chapter_up_down;

    private TextView mChapterTv;
    private ListView mChapterListView;
    private ChapterAdapter mChapterAdapter;
    private List<ChapterBean> mChapterBeans = new ArrayList<ChapterBean>();

    private TextView mCommentTv;
    private ListView mBookMarkListView;
    private BookMarkAdapter mBookMarkAdapter;
    private List<BookMarkListBean.DataBean> mMarkBeans = new ArrayList<BookMarkListBean.DataBean>();

    private int mBookId;
    private int mChapterIndex;
    private boolean mIsFromReader;
    private boolean mIsChapter = true;
    private BookBean mBookBean;
    private BookModel mBookModel;


    @SuppressWarnings("all")
    private Handler mHandler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            switch (msg.what) {
                case BookMsg.LOAD_BOOK_SUCCESS:
                    mBookBean = (BookBean) msg.obj;
                    mBookModel.loadChapters(mBookBean.getBookId(), mBookBean.getChapterCount(), isEpub);
//                    mTitleTv.setText(mBookBean.getBookName());
                    break;

                case BookMsg.LOAD_CHAPTERS_SUCCESS:
                    mBookBean.setChapterBeans((List<ChapterBean>) msg.obj);
                    mChapterBeans = mBookBean.getChapterBeans();
                    mChapterAdapter.notifyDataSetChanged();
                    if (mChapterIndex > 0 && mChapterIndex < mBookBean.getChapterCount()) {
                        mChapterListView.setSelection(mChapterIndex);
                    }
                    break;

                case BookMsg.LOAD_BOOKMARK_SUCCESS:
                    mMarkBeans.clear();
                    List<BookMarkListBean.DataBean> newList = (List<BookMarkListBean.DataBean>) msg.obj;
                    if (null != newList && newList.size() > 0) {
                        mMarkBeans.addAll(newList);
                        mBookMarkAdapter.notifyDataSetChanged();
                    } else {
                        showToast("没有书签", Toast.LENGTH_SHORT);
                    }
                    break;
                case BookMsg.LOAD_BOOKMARK_FAILURE:
                    showToast((String) msg.obj, Toast.LENGTH_SHORT);
                    break;

                case BookMsg.LOAD_BOOK_FAILURE:
                case BookMsg.LOAD_CHAPTERS_FAILURE:
                    showToast((String) msg.obj, Toast.LENGTH_LONG);
                    finish();
                    break;

                default:
                    DebugLog.d("unknown msg:" + Integer.toHexString(msg.what));
                    break;
            }
        }
    };
    private String mBookName;
    private String mBookAuthor;
    private String mBookIcon;
    private boolean up;
    private boolean isEpub;
    private long mCommentPage;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(ChaptersActivity.this.getResources().getIdentifier("reader_chapters", "layout", ChaptersActivity.this.getPackageName()));
        AppData.getClient().setCallBackHandler(mHandler);
        initView();
        initData();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        DebugLog.trace();
        AppData.getClient().setNullCallBackHandler(mHandler);
    }

    @Override
    protected void onResume() {
        super.onResume();
        DebugLog.trace();
        AppData.getClient().setCallBackHandler(mHandler);
    }

    private void initData() {
        mBookId = getIntent().getIntExtra("bookID", 0);
        mBookName = getIntent().getStringExtra("bookName");
        mBookAuthor = getIntent().getStringExtra("bookAuthor");
        isEpub = getIntent().getBooleanExtra("isEpub", false);
        if (mBookIcon == null) {
            String userID = SharedPreUtil.readData(this, "userID");
            mBookIcon = SharedPreUtil.readData(this, "bookCover" + mBookId, userID);
        }
        Log.i("666666666", "mBookIcon = " + mBookIcon);
        chapterTitle.setText(mBookName);
        chapterAuthor.setText(mBookAuthor);
//        if (mBookIcon.equals("")) {
//            chapterIv.setImageResource(R.color.gray);
//        } else {
//            Picasso.with(this).load(mBookIcon).into(chapterIv);
//        }
        mChapterIndex = getIntent().getIntExtra("chapterIndex", 0);
        mIsChapter = getIntent().getBooleanExtra("isContent", true);
        mIsFromReader = getIntent().getBooleanExtra("fromReading", false);

        DebugLog.d(String.format("mBookId=%s, mChapterIndex=%s, mIsChapter=%s",
                mBookId, mChapterIndex, mIsChapter));

        mBookModel = new BookModel(Volley.newRequestQueue(this)); //getRequestQueue()

        selectMenu(mIsChapter);
        if (mIsChapter) {
            getChapter();
        } else {
            getBookMarks();
        }
    }

    private void initView() {
        ImageButton backBtn = (ImageButton) this.findViewById(ChaptersActivity.this.getResources().getIdentifier("top_back_btn", "id", ChaptersActivity.this.getPackageName()));
        chapterAuthor = (TextView) this.findViewById(ChaptersActivity.this.getResources().getIdentifier("chapter_author", "id", ChaptersActivity.this.getPackageName()));
        chapterTitle = (TextView) this.findViewById(ChaptersActivity.this.getResources().getIdentifier("chapter_title", "id", ChaptersActivity.this.getPackageName()));
        chapterIv = (ImageView) this.findViewById(ChaptersActivity.this.getResources().getIdentifier("chapter_iv", "id", ChaptersActivity.this.getPackageName()));
        chapter_up_down = (LinearLayout) this.findViewById(ChaptersActivity.this.getResources().getIdentifier("chapter_up_down", "id", ChaptersActivity.this.getPackageName()));
        backBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
        findViewById(ChaptersActivity.this.getResources().getIdentifier("rl_right_tran", "id", ChaptersActivity.this.getPackageName())).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });
//        mTitleTv = (TextView) this.findViewById(R.id.top_title_tv);

        mChapterTv = (TextView) findViewById(ChaptersActivity.this.getResources().getIdentifier("chapter_tv", "id", ChaptersActivity.this.getPackageName()));
        mChapterTv.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (!mIsChapter) {
                    selectMenu(true);
                    mIsChapter = true;
                }
                if (mChapterAdapter == null || mChapterBeans.size() <= 0) {
                    getChapter();
                }
            }
        });

        mCommentTv = (TextView) findViewById(ChaptersActivity.this.getResources().getIdentifier("comment_tv", "id", ChaptersActivity.this.getPackageName()));
        mCommentTv.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (mIsChapter) {
                    selectMenu(false);
                    mIsChapter = false;
                }
                if (mMarkBeans == null || mMarkBeans.size() <= 0) {
                    getBookMarks();
                }
            }
        });
        chapter_up_down.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //正序倒叙互换
                Collections.reverse(mChapterBeans);
                mChapterAdapter.notifyDataSetChanged();
                if (up) {
                    up = false;
                    up_down_tv.setText("正序");
                    up_down_iv.setImageResource(ChaptersActivity.this.getResources().getIdentifier("comment_up", "drawable", ChaptersActivity.this.getPackageName()));
                } else {
                    up = true;
                    up_down_tv.setText("倒序");
                    up_down_iv.setImageResource(ChaptersActivity.this.getResources().getIdentifier("comment_down", "drawable", ChaptersActivity.this.getPackageName()));
                }
            }
        });

        mChapterListView = (ListView) this.findViewById(ChaptersActivity.this.getResources().getIdentifier("chapter_list_view", "id", ChaptersActivity.this.getPackageName()));
        mChapterAdapter = new ChapterAdapter(this);
        mChapterListView.setAdapter(mChapterAdapter);
        mChapterListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                int toChapterIndex;
                if (up) {
                    toChapterIndex = mChapterBeans.size() - 1 - position;
                } else {
                    toChapterIndex = position;
                }
                Intent intent = new Intent(ChaptersActivity.this, OnlineReadActivity.class);
                if (mIsFromReader) {
                    DebugLog.d("set result for chapterIndex:" + toChapterIndex);
                    intent.putExtra("ChapterPos", toChapterIndex);
                    intent.putExtra("bookIcon", mBookIcon);
                    setResult(BookMsg.RESULT_JUMP_TO_CHAPTER, intent);
                    finish();
                } else {
                    intent.putExtra("OnlineID", mBookId);
                    intent.putExtra("BookName", mBookBean.getBookName());
                    intent.putExtra("ChapterPos", toChapterIndex);
                    intent.putExtra("PagePos", 0);
                    intent.putExtra("bookIcon", mBookIcon);
                    startActivity(intent);
                    finish();
                }
            }
        });

        mBookMarkListView = (ListView) findViewById(ChaptersActivity.this.getResources().getIdentifier("comment_list_view", "id", ChaptersActivity.this.getPackageName()));
        mBookMarkAdapter = new BookMarkAdapter(this);
        mBookMarkListView.setAdapter(mBookMarkAdapter);
        mBookMarkListView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Intent intent = new Intent(ChaptersActivity.this, OnlineReadActivity.class);
                BookMarkListBean.DataBean item = (BookMarkListBean.DataBean) mBookMarkAdapter.getItem(position);
                int toChapterIndex = 0;
                for (ChapterBean chapterBean : mBookBean.getChapterBeans()) {
                    if (item.chapter_id == chapterBean.getChapterId()) {
                        toChapterIndex = chapterBean.getIndex();
                    }
                }
                if (mIsFromReader) {
                    DebugLog.d("set result for chapterIndex:" + toChapterIndex);
                    intent.putExtra("ChapterPos", toChapterIndex);
                    setResult(BookMsg.RESULT_JUMP_TO_CHAPTER, intent);
                    finish();
                } else {
                    intent.putExtra("OnlineID", mBookId);
                    intent.putExtra("BookName", mBookBean.getBookName());
                    intent.putExtra("ChapterPos", toChapterIndex);
                    intent.putExtra("PagePos", 0);
                    startActivity(intent);
                }
            }
        });
        mBookMarkListView.setOnItemLongClickListener(new AdapterView.OnItemLongClickListener() {
            @Override
            public boolean onItemLongClick(AdapterView<?> parent, View view, int position, long id) {
                final BookMarkListBean.DataBean item = (BookMarkListBean.DataBean) mBookMarkAdapter.getItem(position);

                new AlertDialog.Builder(ChaptersActivity.this).setTitle("")//设置对话框标题
                        .setMessage("是否删除该书签")//设置显示的内容
                        .setPositiveButton("确定", new DialogInterface.OnClickListener() {//添加确定按钮
                            @Override
                            public void onClick(DialogInterface dialog, int which) {//确定按钮的响应事件
                                deletBookMark(item);
                            }

                        }).setNegativeButton("取消", new DialogInterface.OnClickListener() {//添加返回按钮

                            @Override
                            public void onClick(DialogInterface dialog, int which) {//响应事件

                            }
                }).show();
                return true;
            }
        });
        selectMenu(mIsChapter);
    }

    //删除书签
    private void deletBookMark(final BookMarkListBean.DataBean item) {
        int mark_id = item.mark_id;
        String token = SharedPreUtil.readData(this, "token");
        String dev_type = SharedPreUtil.readData(this, "dev_type");
        String url;
        url = URL_DEL_BOOKMARK;
        Map<String, String> paramsMap = new HashMap<String, String>();
        paramsMap.put("member_token", token);
        paramsMap.put("token_type", dev_type);
        paramsMap.put("marks", mark_id+"");

        OkHttpUtils.post().url(url).params(paramsMap).build().execute(new Callback<Integer>() {

            @Override
            public Integer parseNetworkResponse(Response response, int id) throws Exception {
                String string = response.body().string();
                JSONObject jsonObject = new JSONObject(string);
                int code = jsonObject.getInt("code");
                return code;
            }

            @Override
            public void onError(Call call, Exception e, int id) {
                showToast("网络异常，请稍后再试");
            }

            @Override
            public void onResponse(Integer response, int id) {
                if (response == 0) {
                    getBookMarks();
                    Intent intent = new Intent();
                    intent.putExtra("chid",item.chapter_id+"");
                    setResult(REFRESH_MARK,intent);
                    showToast("删除书签成功！");
                } else if (response == 600) {
                    setResult(GOTO_LOGIN);
                    showToast("登录超时");
                    finish();
                }
            }
        });
    }

    private void selectMenu(boolean isChapter) {
        if (isChapter) {
            mChapterTv.setSelected(true);
            mCommentTv.setSelected(false);
            mChapterListView.setVisibility(View.VISIBLE);
            mBookMarkListView.setVisibility(View.GONE);
        } else {
            mChapterTv.setSelected(false);
            mCommentTv.setSelected(true);
            mChapterListView.setVisibility(View.GONE);
            mBookMarkListView.setVisibility(View.VISIBLE);
        }
    }

    private void getChapter() {
        if (mBookBean == null) {
            mBookModel.loadBook(mBookId, mBookName, !mIsFromReader, isEpub);
        }
    }

    //加载书签
    private void getBookMarks() {
        mCommentPage++;
//        mBookModel.reqComment(mBookId, mCommentPage);
        String token = SharedPreUtil.readData(this, "token");
        String dev_type = SharedPreUtil.readData(this, "dev_type");
        mBookModel.reqBookMark(mBookId, isEpub, dev_type, token);
    }

    //章节适配器
    private class ChapterAdapter extends BaseAdapter {

        private LayoutInflater mInflater;

        public ChapterAdapter(Context context) {
            mInflater = LayoutInflater.from(context);
        }

        @Override
        public int getCount() {
            return mChapterBeans.size();
        }

        @Override
        public ChapterBean getItem(int position) {
            return mChapterBeans.get(position);
        }

        @Override
        public long getItemId(int position) {
            return position;
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            ViewHolder holder;
            if (null == convertView) {
                convertView = mInflater.inflate(ChaptersActivity.this.getResources().getIdentifier("reader_chapters_item", "layout", ChaptersActivity.this.getPackageName()), null);
                holder = new ViewHolder();
                holder.name = (TextView) convertView.findViewById(ChaptersActivity.this.getResources().getIdentifier("chapter_name_tv", "id", ChaptersActivity.this.getPackageName()));
                holder.vip = (TextView) convertView.findViewById(ChaptersActivity.this.getResources().getIdentifier("vip_tv", "id", ChaptersActivity.this.getPackageName()));
                convertView.setTag(holder);
            } else {
                holder = (ViewHolder) convertView.getTag();
            }
            ChapterBean item = getItem(position);
            if (mChapterIndex == position) {
                holder.name.setTextColor(getResources().getColor(ChaptersActivity.this.getResources().getIdentifier("read_green", "color", ChaptersActivity.this.getPackageName())));
            } else {
                if (localHave(position)) {
                    holder.name.setTextColor(getResources().getColor(ChaptersActivity.this.getResources().getIdentifier("gray", "color", ChaptersActivity.this.getPackageName())));
                } else {
                    holder.name.setTextColor(getResources().getColor(ChaptersActivity.this.getResources().getIdentifier("light_gray", "color", ChaptersActivity.this.getPackageName())));
                }
            }
            holder.name.setText(item.getChapterName());
            if (item.isVip()) {
                holder.vip.setTextColor(getResources().getColor(ChaptersActivity.this.getResources().getIdentifier("read_green", "color", ChaptersActivity.this.getPackageName())));
                holder.vip.setText("VIP");
            } else {
                holder.vip.setText("");
            }
            return convertView;
        }

        class ViewHolder {
            TextView name;
            TextView vip;
        }

        /**
         * 判断本地是否已下载本章节
         */
        private boolean localHave(int position) {
            String path = AppData.getConfig().getReadCacheRoot()
                    + "/" + mBookId + (isEpub ? "epub" : "") + "/ch" + position + "_" + getItem(position).getChapterId();
            File file = new File(path);//创建一个文件对象
            if (file.exists()) {
                return true;
            }
            return false;
        }
    }


    private class BookMarkAdapter extends BaseAdapter {

        private LayoutInflater mInflater;

        public BookMarkAdapter(Context context) {
            mInflater = LayoutInflater.from(context);
        }

        @Override
        public int getCount() {
            return mMarkBeans.size();
        }

        @Override
        public Object getItem(int position) {
            return mMarkBeans.get(position);
        }

        @Override
        public long getItemId(int position) {
            return position;
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            ViewHolder holder;
            if (null == convertView) {
                convertView = mInflater.inflate(ChaptersActivity.this.getResources().getIdentifier("reader_bookmark_item", "layout", ChaptersActivity.this.getPackageName()), parent, false);
                holder = new ViewHolder();
                holder.name = (TextView) convertView.findViewById(ChaptersActivity.this.getResources().getIdentifier("bookmark_name_tv", "id", ChaptersActivity.this.getPackageName()));
                holder.content = (TextView) convertView.findViewById(ChaptersActivity.this.getResources().getIdentifier("bookmark_content_tv", "id", ChaptersActivity.this.getPackageName()));
                holder.time = (TextView) convertView.findViewById(ChaptersActivity.this.getResources().getIdentifier("bookmark_time_tv", "id", ChaptersActivity.this.getPackageName()));
                convertView.setTag(holder);
            } else {
                holder = (ViewHolder) convertView.getTag();
            }
            BookMarkListBean.DataBean item = (BookMarkListBean.DataBean) getItem(position);
            holder.name.setText(item.name);
            holder.content.setText(item.content);
            holder.time.setText(item.create_time);
            return convertView;
        }

        private class ViewHolder {
            TextView name;
            TextView content;
            TextView time;
        }
    }

    @Override
    public void finish() {
        super.finish();
        overridePendingTransition(0, 0);
    }
}