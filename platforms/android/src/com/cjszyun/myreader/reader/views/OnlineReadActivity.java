package com.cjszyun.myreader.reader.views;

import android.Manifest;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.os.Debug;
import android.os.Handler;
import android.os.Message;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.PopupWindow;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.SeekBar;
import android.widget.TextView;
import android.widget.Toast;

import com.cjszyun.myreader.reader.AppData;
import com.cjszyun.myreader.reader.beans.BookBean;
import com.cjszyun.myreader.reader.beans.BookBuyBean;
import com.cjszyun.myreader.reader.beans.BookMarkBean;
import com.cjszyun.myreader.reader.beans.BookMarkListBean;
import com.cjszyun.myreader.reader.beans.ChapterBean;
import com.cjszyun.myreader.reader.beans.EpubChapterContentBean;
import com.cjszyun.myreader.reader.enums.ChapterAction;
import com.cjszyun.myreader.reader.model.BookModel;
import com.cjszyun.myreader.reader.model.BookMsg;
import com.cjszyun.myreader.reader.utils.DebugLog;
import com.cjszyun.myreader.reader.utils.DisplayUtil;
import com.cjszyun.myreader.reader.utils.NetUtil;
import com.cjszyun.myreader.reader.utils.SharedPreUtil;
import com.google.gson.Gson;
import com.zhy.http.okhttp.OkHttpUtils;
import com.zhy.http.okhttp.callback.Callback;

import org.json.JSONObject;

import java.io.File;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import me.weyye.hipermission.HiPermission;
import me.weyye.hipermission.PermissionCallback;
import okhttp3.Call;
import okhttp3.Response;

import static com.cjszyun.myreader.reader.BookReader.GOTO_LOGIN;
import static com.cjszyun.myreader.reader.BookReader.GOTO_RECHARGE;
import static com.cjszyun.myreader.reader.enums.ChapterAction.CACHE_NEXT;
import static com.cjszyun.myreader.reader.enums.ChapterAction.CACHE_PREV;
import static com.cjszyun.myreader.reader.utils.UrlHelper.DS_URL;
import static com.cjszyun.myreader.reader.utils.UrlHelper.URL_ADD_BOOKMARK;
import static com.cjszyun.myreader.reader.utils.UrlHelper.URL_BUY_CHAPTER;
import static com.cjszyun.myreader.reader.utils.UrlHelper.URL_BUY_PUBLISH;
import static com.cjszyun.myreader.reader.utils.UrlHelper.URL_GETPRICE_CHAPTER;
import static com.cjszyun.myreader.reader.utils.UrlHelper.URL_GETPRICE_PUBLISH;
import static com.cjszyun.myreader.reader.utils.UrlHelper.URL_GETUSER_INFO;
import static com.cjszyun.myreader.reader.utils.UrlHelper.URL_PUBLISH_CONTENT;
import static com.cjszyun.myreader.reader.utils.UrlHelper.URL_UPDATAREADRECORD;

/**
 * Created by zhuzd on 15/5/16.
 */
public class OnlineReadActivity extends ReadActivity {

    private int mBookId;
    private int mChapterIndex = 0;
    private int mPagePos; // which page in chapter
    private BookBean mBookBean;
    private BookModel mBookModel;
    private List<String> mBookMarks = new ArrayList<String>();

    @SuppressWarnings("all")
    private Handler mHandler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            switch (msg.what) {
                case BookMsg.LOAD_BOOK_SUCCESS:
                    mBookBean = (BookBean) msg.obj;
                    mBookModel.loadChapters(mBookBean.getBookId(), mBookBean.getChapterCount(), isEpub);
                    break;

                case BookMsg.LOAD_CHAPTERS_SUCCESS:
                    hideProgress();
                    mBookBean.setChapterBeans((List<ChapterBean>) msg.obj);
                    //外部点击目录跳转
                    int chapterId = getIntent().getIntExtra("ChapterId", 0);
//                    showToast(chapterId+"");
                    if (chapterId != 0) {
                        mChapterIndex = mBookBean.getChapterIndex(chapterId);
                    }
                    getContent(mChapterIndex, ChapterAction.INIT);
                    break;
                case BookMsg.LOAD_BOOKMARK_SUCCESS:
                    mBookMarks.clear();
                    List<BookMarkListBean.DataBean> newList = (List<BookMarkListBean.DataBean>) msg.obj;
                    if (null != newList && newList.size() > 0) {
                        for (BookMarkListBean.DataBean dataBean : newList) {
                            mBookMarks.add(dataBean.chapter_id + "");
                        }
                    }
                    Log.i("onlineactivity","书签获取成功："+mBookMarks);
                    break;
                case BookMsg.LOAD_CONTENT_SUCCESS:
                    hideProgress();
                    refreshNewChapter(msg.arg1, (String) msg.obj, ChapterAction.getAction(msg.arg2));
                    String eventkey = getIntent().getStringExtra("eventkey");
                    if (eventkey.equals("areward")){
                        showDsWindow();
                    }
                    break;

                case BookMsg.LOAD_BOOK_FAILURE:
                case BookMsg.LOAD_CHAPTERS_FAILURE:
                case BookMsg.LOAD_CONTENT_FAILURE:
                    hideProgress();
                    showToast((String) msg.obj);
                    if (mBookBean == null || mBookBean.getChapterBeans() == null || mBookBean.getChapterBeans().size() == 0) {
                        showToast(msg.obj.toString());
                        goBack();
                    }
                    break;

                case BookMsg.VIP_CHAPTER_NEED_LOGIN:
                    hideProgress();
                    setResult(GOTO_LOGIN);
                    finish();
                    break;

                case BookMsg.VIP_CHAPTER_NEED_BUY:
//                    reqVipInfo(msg.arg1, ChapterAction.getAction(msg.arg2));
                    hideProgress();
                    if (ChapterAction.getAction(msg.arg2).getValue() == CACHE_PREV.getValue() || ChapterAction.getAction(msg.arg2).getValue() == CACHE_NEXT.getValue())
                        return;
                    popupBuyWindow(msg.arg1, ChapterAction.getAction(msg.arg2));
//                    showToast("请购买后阅读", Toast.LENGTH_SHORT);
                    break;

                default:
                    DebugLog.d("unknown msg:" + Integer.toHexString(msg.what));
                    break;
            }
        }
    };
    private String mBookAuthor;
    private boolean needUpdate;
    private boolean isEpub;
    private String mBookName;
    private String userId;
    private String token;
/*判断是否为epub*/
    @Override
    protected boolean isEpub() {
        return isEpub;
    }

    @Override
    protected void doDs(int dsMoney, String review) {
        String token = SharedPreUtil.readData(this, "token");
        if (null == token || token.equals("")) {
            showLoginDialog();
            return;
        }
        String url = DS_URL;
        Map<String, String> paramsMap = new HashMap<String, String>();
        paramsMap.put("member_token", token);
        paramsMap.put("book_id", mBookId + "");
        paramsMap.put("token_type", "android");
        paramsMap.put("amount", dsMoney+"");
        if (review != null && !"".equals(review)) {
            paramsMap.put("review", review);
        }
        OkHttpUtils.post().url(url).params(paramsMap).build().execute(new Callback<Integer>() {
            @Override
            public Integer parseNetworkResponse(okhttp3.Response response,int id) throws Exception {
                String string = response.body().string();
                JSONObject jsonObject = new JSONObject(string);
                int code = jsonObject.getInt("code");
                return code;
            }

            @Override
            public void onError(Call call, Exception e, int id) {
                showToast( "网络异常，请检查网络");
            }

            @Override
            public void onResponse(Integer response, int id) {
                if (response != null) {
                    if (response == 0) {
                        showToast( "谢谢打赏，感谢您对作者的支持~",Toast.LENGTH_LONG);
                    } else if (response == 1) {
                        new AlertDialog.Builder(OnlineReadActivity.this).setTitle("提示")//设置对话框标题
                                .setMessage("账户余额不足，是否充值？")//设置显示的内容
                                .setPositiveButton("确定", new DialogInterface.OnClickListener() {//添加确定按钮
                                    @Override
                                    public void onClick(DialogInterface dialog, int which) {//确定按钮的响应事件
                                        Intent intent = getIntent();
                                        intent.putExtra("bookid",mBookId+"");
                                        intent.putExtra("chid",mBookBean.getChapterBean(mChapterIndex).getChapterId()+"");
                                        intent.putExtra("pagenum",getLatestPagePosition()+"");
                                        intent.putExtra("bookname",mBookName);
                                        intent.putExtra("booktype",isEpub?"2":"1");
                                        intent.putExtra("eventkey","areward");
                                        setResult(GOTO_RECHARGE,intent);
                                        finish();
                                    }
                                }).setNegativeButton("取消", new DialogInterface.OnClickListener() {//添加返回按钮
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                            }
                        }).show();
                    } else if (response == 600) {
                        showLoginDialog();
                    }
                } else {
                    showToast( "打赏失败");
                }
            }
        });
    }

    private void showLoginDialog() {
        new AlertDialog.Builder(OnlineReadActivity.this).setTitle("提示")//设置对话框标题
                .setMessage("您的登录信息已过期，请重新登录")//设置显示的内容
                .setPositiveButton("确定", new DialogInterface.OnClickListener() {//添加确定按钮
                    @Override
                    public void onClick(DialogInterface dialog, int which) {//确定按钮的响应事件
//                        startActivity(new Intent(OnlineReadActivity.this, LoginActivity.class));
                        setResult(GOTO_LOGIN);
                        finish();
                    }
                }).setNegativeButton("取消", new DialogInterface.OnClickListener() {//添加返回按钮
            @Override
            public void onClick(DialogInterface dialog, int which) {
            }
        }).show();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState); // run ReadingActivity.onCreate();
        //Debug.startMethodTracing(OnlineReadActivity.class.getSimpleName());

        AppData.getClient().setCallBackHandler(mHandler);
        initData();
        checkPermission();
    }

    /*检查是否有读写SD卡的权限*/
    private void checkPermission() {
        //检查权限
        HiPermission.create(this).checkSinglePermission(Manifest.permission.WRITE_EXTERNAL_STORAGE, new PermissionCallback() {
            @Override
            public void onClose() {
                Log.i("DownloadChapterActivity", "checkPermission ==> onclose");
            }

            @Override
            public void onFinish() {
                Log.i("DownloadChapterActivity", "checkPermission ==> onFinish");

            }

            //拒绝
            @Override
            public void onDeny(String permission, int position) {
                Log.i("DownloadChapterActivity", "checkPermission ==> onDeny");
                showToast("未授权，请在设置--应用权限中开启SD卡读写权限后使用");
                goBack();
            }

            //授权
            @Override
            public void onGuarantee(String permission, int position) {
//                    showToast("长江悦读欢迎您~");
            }
        });


    }

    @Override
    protected void onDestroy() {
        super.onDestroy(); // run ReadingActivity.onDestroy();
        DebugLog.trace();

        hideProgress();
        // 异步任务会导致窗口句柄泄漏: has leaked window com.android.internal.policy.impl.PhoneWindow
        // 在异步任务里面已经发生了严重的错误，而导致Activity的强制关闭。Activity强制关闭了，可是ProgressDialog并没有dismiss()掉，所以出现了窗口句柄的泄漏。
        // 在窗口毁消之前一定要关闭弹出框。否则弹出框就没有句柄了，就报这样的错误。

        AppData.getClient().setNullCallBackHandler(mHandler);
        Debug.stopMethodTracing();
    }

    @Override
    protected void onResume() {
        super.onResume();
        DebugLog.trace();
        //mReadActionView.setVisibility(View.GONE);
        hideReadActionWindow();
        AppData.getClient().setCallBackHandler(mHandler);
    }

    @Override
    protected void onStop() {
        super.onStop();
        DebugLog.trace();
        hideReadActionWindow();
        hideEndWindow();
        // 更新最后阅读位置
//        AppData.getDB().updateLastReadOnline(mBookId, mChapterIndex, getLatestPagePosition());

        if (getIntent().getBooleanExtra("fromShelf", false)) {
            SharedPreUtil.writeData(this, "shelf" + mBookId, mChapterIndex + "|" + getLatestPagePosition(), userId);
        }
    }

    @Override
    public void onBackPressed() {
        //super.onBackPressed();
        goBack();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        DebugLog.trace();
        if (BookMsg.RESULT_JUMP_TO_CHAPTER == resultCode) {
            int chapterIndex = data.getIntExtra("ChapterPos", -1);
            AppData.getClient().setCallBackHandler(mHandler);
            DebugLog.i("jump to:" + chapterIndex);
            if (chapterIndex != -1 && chapterIndex != mChapterIndex) {
                getContent(chapterIndex, ChapterAction.JUMP);
            }
        }
        if (BookMsg.REFRESH_MARK == resultCode){
            String chid = data.getStringExtra("chid");
            if (ibBookmark!=null){
                mBookMarks.remove(chid);
                checkMark(ibBookmark);
            }
        }
    }

    private void initData() {
        Intent intent = getIntent();

        String bookid = intent.getStringExtra("OnlineID");
        mBookId = Integer.parseInt(bookid);
        mBookName = intent.getStringExtra("BookName");
        mChapterIndex = intent.getIntExtra("ChapterPos", 0);
        mPagePos = intent.getIntExtra("PagePos", 0);
        userId = intent.getStringExtra("userId");

        String shelfBook = SharedPreUtil.readData(this, "shelf" + bookid, userId);
        if (shelfBook != null && !shelfBook.equals("")) {
            mChapterIndex = Integer.parseInt(shelfBook.split("\\|")[0]);
            mPagePos = Integer.parseInt(shelfBook.split("\\|")[1]);
        }

        mBookAuthor = intent.getStringExtra("bookAuthor");
        isEpub = intent.getBooleanExtra("isEpub", false);
        token = intent.getStringExtra("token");
        String dev_type = intent.getStringExtra("dev_type");
        SharedPreUtil.writeData(this, "token", token);
        SharedPreUtil.writeData(this, "dev_type", dev_type);
//        getUserBalance(token,dev_type);

        DebugLog.d(String.format("mBookId=%s, mChapterIndex=%s, mPagePos=%s, needUpdate=%s", mBookId, mChapterIndex, mPagePos, needUpdate));

        showProgress("", getResources().getString(getResources().getIdentifier("loading", "string", getPackageName())));

        mBookModel = new BookModel(getRequestQueue());
        if (NetUtil.getNetWorkState(this) != -1) {//如果有网就一直取最新章节
            needUpdate = true;
        } else {
            needUpdate = false;
        }
        mBookModel.loadBook(mBookId, mBookName, needUpdate, isEpub);
        mBookModel.reqBookMark(mBookId,isEpub,dev_type,token);
//      mBookModel.loadBook(mBookId, true);
    }

    /*获取用户余额*/
    private void getUserBalance(String token, String dev_type) {
        OkHttpUtils.post().url(URL_GETUSER_INFO)
                .addParams("member_token", token)
                .addParams("token_type", dev_type)
                .build().execute(new Callback<Integer>() {
            @Override
            public Integer parseNetworkResponse(Response response, int id) throws Exception {
                String string = response.body().string();
                JSONObject jsonObject = new JSONObject(string);
                int code = jsonObject.getInt("code");
                int balance = -1;
                if (code == 0) {
                    JSONObject data = jsonObject.getJSONObject("data");
                    balance = data.getInt("balance");
                }
                return balance;
            }

            @Override
            public void onError(Call call, Exception e, int id) {
                showToast("网络异常");
            }

            @Override
            public void onResponse(Integer response, int id) {
                if (response == -1) {
                    Log.i("onlinereadactivity", "数据异常");
                } else {
                    int balance = response;
                    SharedPreUtil.writeData(OnlineReadActivity.this, "user_balance", balance + "");
                }
            }
        });
    }

    /*获取章节内容*/
    protected void getContent(final int chapterIndex, final ChapterAction chapterAction) {
        if (!chapterAction.isSilent()) {
            showProgress("", getResources().getString(getResources().getIdentifier("loading", "string", getPackageName())));
        }
        mBookModel.loadContent(mBookBean.getChapterBean(chapterIndex), chapterAction, isEpub);
    }

    private PopupWindow popupWindowBuy = null;

    private void popupBuyWindow(int chapterPos, ChapterAction action) {
        getUserBalance(token, "android");
        View view;
        boolean haveNoDownload = false;
        //        判断是否全部下载
        final List<ChapterBean> chapterBeans = mBookModel.readChaptersObject(mBookId, isEpub);
        if (chapterBeans != null) {
            for (ChapterBean bean : chapterBeans) {
                String path = AppData.getConfig().getReadCacheRoot()
                        + "/" + mBookId + "epub/ch" + chapterBeans.indexOf(bean) + "_" + bean.getChapterId();
                File file = new File(path);//创建一个文件对象
                if (!file.exists()) {
                    haveNoDownload = true;
                }
            }
            if (!haveNoDownload) {
                showToast("已经全部下载咯~");
                return;
            }
        }

        if (isEpub) {
            view = getEpubBuyView(chapterPos, action);
        } else {
            view = getBuyView(chapterPos, action);
        }
        if (null != popupWindowBuy) {
            popupWindowBuy.dismiss();
            popupWindowBuy = null;
        }
        if (null == popupWindowBuy) {
            popupWindowBuy = new PopupWindow(view,
                    LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);
            popupWindowBuy.setFocusable(true);
            popupWindowBuy.setTouchable(true);
            popupWindowBuy.setBackgroundDrawable(new ColorDrawable(0xb0000000));
//            popupWindowBuy.setSoftInputMode(PopupWindow.INPUT_METHOD_NEEDED);
            popupWindowBuy.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        }

        popupWindowBuy.showAtLocation(getPageWidget(), Gravity.BOTTOM, 0, 0);
    }

    private void hideBuyWindow() {
        if (null != popupWindowBuy) {
            popupWindowBuy.dismiss();
        }
    }

    /*获取购买的view*/
    private View getBuyView(final int chapterIndex, final ChapterAction action) {
        final String token = SharedPreUtil.readData(this, "token");
        final String dev_type = SharedPreUtil.readData(this, "dev_type");
        View view = View.inflate(this, getResources().getIdentifier("read_pop_buy_publish", "layout", getPackageName()), null);
        TextView bookName = (TextView) view.findViewById(getResources().getIdentifier("book_name_tv", "id", getPackageName()));
        ImageView close = (ImageView) view.findViewById(getResources().getIdentifier("close_iv", "id", getPackageName()));
        bookName.setText(mBookName);
        close.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                hideBuyWindow();
            }
        });
        final ProgressBar loading_pb = (ProgressBar) view.findViewById(getResources().getIdentifier("loading_pb", "id", getPackageName()));
        final TextView have_buy_tv = (TextView) view.findViewById(getResources().getIdentifier("have_buy_tv", "id", getPackageName()));
        final LinearLayout price_ll = (LinearLayout) view.findViewById(getResources().getIdentifier("price_ll", "id", getPackageName()));
        final TextView price = (TextView) view.findViewById(getResources().getIdentifier("price_tv", "id", getPackageName()));
        final TextView balance = (TextView) view.findViewById(getResources().getIdentifier("balance_tv", "id", getPackageName()));
        final TextView surePrice = (TextView) view.findViewById(getResources().getIdentifier("sure_price_tv", "id", getPackageName()));
        final TextView buy = (TextView) view.findViewById(getResources().getIdentifier("buy_tv", "id", getPackageName()));
        final String publish_price = SharedPreUtil.readData(this, "publish_price");
        final String user_balance = SharedPreUtil.readData(this, "user_balance");
        price.setText("价格：" + publish_price + "长江币");
        balance.setText("余额：" + user_balance + "长江币");
        buy.setTag(action);

        final LinearLayout chose_chapter_ll = (LinearLayout) view.findViewById(getResources().getIdentifier("chose_chapter_ll", "id", getPackageName()));
        chose_chapter_ll.setVisibility(View.VISIBLE);
        TextView chapter_down_tv = (TextView) view.findViewById(getResources().getIdentifier("chapter_down_tv", "id", getPackageName()));
        TextView start_chapter_tv = (TextView) view.findViewById(getResources().getIdentifier("start_chapter_tv", "id", getPackageName()));
        start_chapter_tv.setText("起始章节：" + mBookBean.getChapterBean(chapterIndex).getChapterName());
        final EditText chapter_et = (EditText) view.findViewById(getResources().getIdentifier("chapter_et", "id", getPackageName()));
        TextView chapter_up_tv = (TextView) view.findViewById(getResources().getIdentifier("chapter_up_tv", "id", getPackageName()));
        final LinearLayout edit_chapter_ll = (LinearLayout) view.findViewById(getResources().getIdentifier("edit_chapter_ll", "id", getPackageName()));
        final RelativeLayout ten_chapter_rl = (RelativeLayout) view.findViewById(getResources().getIdentifier("ten_chapter_rl", "id", getPackageName()));
        final RelativeLayout forty_chapter_rl = (RelativeLayout) view.findViewById(getResources().getIdentifier("forty_chapter_rl", "id", getPackageName()));
        final RelativeLayout oneh_chapter_rl = (RelativeLayout) view.findViewById(getResources().getIdentifier("oneh_chapter_rl", "id", getPackageName()));
        chapter_et.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                oneh_chapter_rl.setSelected(false);
                ten_chapter_rl.setSelected(false);
                edit_chapter_ll.setSelected(true);
                forty_chapter_rl.setSelected(false);
            }
        });
        chapter_down_tv.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                oneh_chapter_rl.setSelected(false);
                ten_chapter_rl.setSelected(false);
                edit_chapter_ll.setSelected(true);
                forty_chapter_rl.setSelected(false);

                String s = chapter_et.getText().toString();
                int i = Integer.parseInt(s);
                if (i == 0) {
                    return;
                }
                int i1 = i - 10;
                if (i1 < 0) {
                    i1 = 0;
                }
                String text = i1 + "";
                chapter_et.setText(text);
                chapter_et.setSelection(text.length());
            }
        });
        chapter_up_tv.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                oneh_chapter_rl.setSelected(false);
                ten_chapter_rl.setSelected(false);
                edit_chapter_ll.setSelected(true);
                forty_chapter_rl.setSelected(false);

                String s = chapter_et.getText().toString();
                int i = Integer.parseInt(s);
                if (i == mBookBean.getChapterCount()) {
                    return;
                }
                int i1 = i + 10;
                if (i1 > mBookBean.getChapterCount()) {
                    i1 = mBookBean.getChapterCount();
                }
                String text = i1 + "";
                chapter_et.setText(text);
                chapter_et.setSelection(text.length());
            }
        });
        chapter_et.addTextChangedListener(new TextWatcher() {

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                // 输入的内容变化的监听
                Log.e("输入过程中执行该方法", "文字变化=" + s);
                if (s.length() == 0) {//删除到最后一个数字
                    chapter_et.setText("0");
                    chapter_et.setSelection(1);
                    return;
                }
                String s1 = s.toString();
                int i = Integer.parseInt(s1);
                // 如果第一个输入的是0
                if (s1.length() == 2) {
                    String s2 = i + "";
                    if (s2.length() != 2) {
                        chapter_et.setText(s2);
                        chapter_et.setSelection(1);
                    }
                }
                if (i > mBookBean.getChapterCount()) {
                    String s2 = mBookBean.getChapterCount() + "";
                    chapter_et.setText(s2);
                    chapter_et.setSelection(s2.length());
                }
            }

            @Override
            public void beforeTextChanged(CharSequence s, int start, int count,
                                          int after) {
                // 输入前的监听
                Log.e("输入前确认执行该方法", "开始输入=" + s);
            }

            @Override
            public void afterTextChanged(Editable s) {
                // 输入后的监听
                Log.e("输入结束执行该方法", "输入结束=" + s);

                String s1 = s.toString();
                if (s1.length() == 0) return;
                int i = Integer.parseInt(s1);

                if (i < 0) return;
                getChapterPrice(i, token, dev_type, chapterIndex, loading_pb, buy, price, balance, user_balance, surePrice, action);
            }
        });

        ten_chapter_rl.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                ten_chapter_rl.setSelected(true);
                edit_chapter_ll.setSelected(false);
                forty_chapter_rl.setSelected(false);
                oneh_chapter_rl.setSelected(false);
                getChapterPrice(10, token, dev_type, chapterIndex, loading_pb, buy, price, balance, user_balance, surePrice, action);
            }
        });
        forty_chapter_rl.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                forty_chapter_rl.setSelected(true);
                ten_chapter_rl.setSelected(false);
                edit_chapter_ll.setSelected(false);
                oneh_chapter_rl.setSelected(false);
                getChapterPrice(40, token, dev_type, chapterIndex, loading_pb, buy, price, balance, user_balance, surePrice, action);
            }
        });
        oneh_chapter_rl.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                oneh_chapter_rl.setSelected(true);
                ten_chapter_rl.setSelected(false);
                edit_chapter_ll.setSelected(false);
                forty_chapter_rl.setSelected(false);
                getChapterPrice(100, token, dev_type, chapterIndex, loading_pb, buy, price, balance, user_balance, surePrice, action);
            }
        });
        chapter_et.setText("2");
        chapter_et.setSelection(1);
        edit_chapter_ll.setSelected(true);

        return view;

    }

    /*获取网文章节定价*/
    private void getChapterPrice(final int i, final String token, final String dev_type, final int chapterIndex, final ProgressBar loading_pb, final TextView buy, final TextView price, final TextView balance, final String user_balance, final TextView surePrice, final ChapterAction action) {
        OkHttpUtils.post().url(URL_GETPRICE_CHAPTER)
                .addParams("member_token", token)
                .addParams("token_type", dev_type)
                .addParams("book_id", mBookId + "")
                .addParams("ch_id", mBookBean.getChapterBean(chapterIndex).getChapterId() + "")
                .addParams("count", i + "")
                .build().execute(new Callback<BookBuyBean>() {
            @Override
            public BookBuyBean parseNetworkResponse(Response response, int id) throws Exception {
                String string = response.body().string();
                BookBuyBean bookBuyBean = new Gson().fromJson(string, BookBuyBean.class);
                return bookBuyBean;
            }

            @Override
            public void onError(Call call, Exception e, int id) {
                loading_pb.setVisibility(View.GONE);
                showToast("网络异常，请稍后再试");
                buy.setEnabled(false);
            }

            @Override
            public void onResponse(BookBuyBean response, int id) {
                loading_pb.setVisibility(View.GONE);
                if (response.code == 0) {
                    buy.setEnabled(true);
                    int price1 = response.data.price;
                    price.setText("价格：" + price1 + "长江币");
                    int balance1 = response.data.balance;
                    balance.setText("余额：" + balance1 + "长江币");
                    if (balance1 < price1) {
                        surePrice.setText("余额不足是否充值？");
                        buy.setText("充值");
                        buy.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                if (popupWindowBuy.isShowing()) {
                                    popupWindowBuy.dismiss();
                                }
                                Intent intent = getIntent();
                                intent.putExtra("bookid",mBookId+"");
                                intent.putExtra("chid",mBookBean.getChapterBean(mChapterIndex).getChapterId()+"");
                                intent.putExtra("pagenum",getLatestPagePosition()+"");
                                intent.putExtra("bookname",mBookName);
                                intent.putExtra("booktype",isEpub?"2":"1");
                                intent.putExtra("eventkey","buy");
                                setResult(GOTO_RECHARGE,intent);
                                finish();
                            }
                        });
                    } else {
                        surePrice.setText(price1 + "长江币");
                        buy.setText("确认");
                        buy.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                loading_pb.setVisibility(View.VISIBLE);
                                buyChapter(token, dev_type, chapterIndex, i, loading_pb, action);
                            }
                        });
                    }
                } else {
                    showToast("数据异常");
                }
            }
        });
    }

    /*购买网文章节*/
    private void buyChapter(String token, String dev_type, final int chapterIndex, int i, final ProgressBar loading_pb, final ChapterAction action) {
        OkHttpUtils.post().url(URL_BUY_CHAPTER)
                .addParams("member_token", token)
                .addParams("token_type", dev_type)
                .addParams("book_id", mBookId + "")
                .addParams("ch_id", mBookBean.getChapterBean(chapterIndex).getChapterId() + "")
                .addParams("count", i + "")
                .build().execute(new Callback<BookBuyBean>() {
            @Override
            public BookBuyBean parseNetworkResponse(Response response, int id) throws Exception {
                String string = response.body().string();
                BookBuyBean bookBuyBean = new Gson().fromJson(string, BookBuyBean.class);
                return bookBuyBean;
            }

            @Override
            public void onError(Call call, Exception e, int id) {
                loading_pb.setVisibility(View.GONE);
                showToast("网络异常，请稍后再试");
            }

            @Override
            public void onResponse(BookBuyBean response, int id) {
                loading_pb.setVisibility(View.GONE);
                if (response.code == 0) {
                    showToast("购买成功");
                    hideBuyWindow();
                    getContent(chapterIndex, action);
                } else {
                    showToast("数据异常");
                }
            }
        });
    }

    /*获取出版图书购买view*/
    public View getEpubBuyView(final int chapterPos, ChapterAction action) {
        //判断是否正在下载

        View view = View.inflate(this, getResources().getIdentifier("read_pop_buy_publish", "layout", getPackageName()), null);
        TextView bookName = (TextView) view.findViewById(getResources().getIdentifier("book_name_tv", "id", getPackageName()));
        ImageView close = (ImageView) view.findViewById(getResources().getIdentifier("close_iv", "id", getPackageName()));
        LinearLayout chose_chapter_ll = (LinearLayout) view.findViewById(getResources().getIdentifier("chose_chapter_ll", "id", getPackageName()));
        chose_chapter_ll.setVisibility(View.GONE);
        bookName.setText(mBookName);
        close.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                hideBuyWindow();
            }
        });
        final ProgressBar loading_pb = (ProgressBar) view.findViewById(getResources().getIdentifier("loading_pb", "id", getPackageName()));

        final LinearLayout price_ll = (LinearLayout) view.findViewById(getResources().getIdentifier("price_ll", "id", getPackageName()));
        final TextView price = (TextView) view.findViewById(getResources().getIdentifier("price_tv", "id", getPackageName()));
        final TextView balance = (TextView) view.findViewById(getResources().getIdentifier("balance_tv", "id", getPackageName()));
        final TextView surePrice = (TextView) view.findViewById(getResources().getIdentifier("sure_price_tv", "id", getPackageName()));
        final TextView have_buy_tv = (TextView) view.findViewById(getResources().getIdentifier("have_buy_tv", "id", getPackageName()));
        final TextView buy = (TextView) view.findViewById(getResources().getIdentifier("buy_tv", "id", getPackageName()));

        String user_balance = SharedPreUtil.readData(this, "user_balance");
        String publish_price = SharedPreUtil.readData(this, "publish_price");
        price.setText("价格：" + publish_price + "长江币");
        balance.setText("余额：" + user_balance + "长江币");
        buy.setTag(action);

        //取最后一章判断是否是已购买章节
        String token = SharedPreUtil.readData(this, "token");
        String dev_type = SharedPreUtil.readData(this, "dev_type");
        OkHttpUtils.post().url(URL_PUBLISH_CONTENT)
                .addParams("book_id", mBookId + "")
                .addParams("chapter_id", mBookBean.getChapterBeans().get(mBookBean.getChapterBeans().size() - 1).getChapterId() + "")
                .addParams("member_token", token)
                .addParams("token_type", dev_type)
                .build().execute(new Callback<EpubChapterContentBean>() {
            @Override
            public EpubChapterContentBean parseNetworkResponse(Response response, int id) throws Exception {
                String string = response.body().string();
                EpubChapterContentBean epubChapterContentBean = new Gson().fromJson(string, EpubChapterContentBean.class);
                return epubChapterContentBean;
            }

            @Override
            public void onError(Call call, Exception e, int id) {
                //没有购买则显示购买的样式
                loading_pb.setVisibility(View.GONE);
                price_ll.setVisibility(View.VISIBLE);
                getPublishPrice(price, surePrice, balance, loading_pb, buy, chapterPos);

            }

            @Override
            public void onResponse(EpubChapterContentBean response, int id) {
                loading_pb.setVisibility(View.GONE);
                if (response.code == 0) {
                    //已购买就显示是否下载
                    have_buy_tv.setVisibility(View.VISIBLE);
                    price_ll.setVisibility(View.GONE);
                    surePrice.setText("0长江币");

                    buy.setOnClickListener(new View.OnClickListener() {
                        @Override
                        public void onClick(View v) {
                            showToast("正在下载");
                            new Thread(new Runnable() {
                                @Override
                                public void run() {
                                    final List<ChapterBean> chapterBeans = mBookModel.readChaptersObject(mBookId, isEpub);
                                    for (ChapterBean bean : chapterBeans) {
                                        String path = AppData.getConfig().getReadCacheRoot()
                                                + "/" + mBookId + "epub/ch" + chapterBeans.indexOf(bean) + "_" + bean.getChapterId();
                                        File file = new File(path);//创建一个文件对象
                                        if (!file.exists()) {
                                            mBookModel.loadContent(bean, ChapterAction.LOAD, true);
                                        }
                                    }
                                }
                            }).start();
                            hideBuyWindow();
                        }
                    });
                } else {
                    //没有购买则显示购买的样式
                    getPublishPrice(price, surePrice, balance, loading_pb, buy, chapterPos);
                }
            }
        });

        return view;
    }

    /*获取出版图书价格*/
    private void getPublishPrice(final TextView price, final TextView surePrice, final TextView balance, final ProgressBar loading_pb, final TextView buy, final int chapterPos) {
        OkHttpUtils.post().url(URL_GETPRICE_PUBLISH)
                .addParams("member_token", token)
                .addParams("token_type", "android")
                .addParams("book_id", mBookId + "")
                .build().execute(new Callback<BookBuyBean>() {
            @Override
            public BookBuyBean parseNetworkResponse(Response response, int id) throws Exception {
                String string = response.body().string();
                BookBuyBean bookBuyBean = new Gson().fromJson(string, BookBuyBean.class);
                return bookBuyBean;
            }

            @Override
            public void onError(Call call, Exception e, int id) {
                loading_pb.setVisibility(View.GONE);
                showToast("网络异常，请稍后再试");
                buy.setEnabled(false);
            }

            @Override
            public void onResponse(BookBuyBean response, int id) {
                loading_pb.setVisibility(View.GONE);
                if (response.code == 0) {
                    buy.setEnabled(true);
                    int cost = (int) (response.data.cost * 100);
                    price.setText("价格：" + cost + "长江币");
                    int mbalance = response.data.balance;
                    balance.setText("余额：" + mbalance + "长江币");
                    if (mbalance < cost) {//如果余额不足就去充值
                        surePrice.setText("余额不足是否充值？");
                        buy.setText("充值");
                        buy.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                if (popupWindowBuy.isShowing()) {
                                    popupWindowBuy.dismiss();
                                }
                                Intent intent = getIntent();
                                intent.putExtra("bookid",mBookId+"");
                                intent.putExtra("chid",mBookBean.getChapterBean(mChapterIndex).getChapterId()+"");
                                intent.putExtra("pagenum",getLatestPagePosition()+"");
                                intent.putExtra("bookname",mBookName);
                                intent.putExtra("booktype",isEpub?"2":"1");
                                intent.putExtra("eventkey","buy");
                                setResult(GOTO_RECHARGE,intent);
                                finish();
                            }
                        });
                    } else {
                        surePrice.setText(cost + "长江币");
                        buy.setText("确认");
                        buy.setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                ChapterAction buyAction = (ChapterAction) v.getTag();
                                buyPublishBook(chapterPos, buyAction);
                            }
                        });
                    }
                } else {
                    showToast("数据异常");
                }
            }
        });
    }

    /*购买出版图书*/
    private void buyPublishBook(final int chapterPos, final ChapterAction buyAction) {
        String token = SharedPreUtil.readData(this, "token");
        String dev_type = SharedPreUtil.readData(this, "dev_type");
        OkHttpUtils.post().url(URL_BUY_PUBLISH)
                .addParams("member_token", token)
                .addParams("token_type", dev_type)
                .addParams("book_id", mBookId + "")
                .build().execute(new Callback<BookBuyBean>() {
            @Override
            public BookBuyBean parseNetworkResponse(Response response, int id) throws Exception {
                String string = response.body().string();
                JSONObject jsonObject = new JSONObject(string);
                int code = jsonObject.getInt("code");
                if (code != 0) {
                    BookBuyBean bookBuyBean = new BookBuyBean();
                    bookBuyBean.code = code;
                    bookBuyBean.message = jsonObject.getString("message");
                    return bookBuyBean;
                }
                BookBuyBean bookBuyBean = new Gson().fromJson(string, BookBuyBean.class);
                return bookBuyBean;
            }

            @Override
            public void onError(Call call, Exception e, int id) {
                showToast("网络异常，请重新连接");
            }

            @Override
            public void onResponse(BookBuyBean response, int id) {
                if (response.code == 0) {
                    showToast("购买成功");
                    int balance = response.data.balance;
                    SharedPreUtil.writeData(OnlineReadActivity.this, "user_balance", balance + "");
                    AppData.getConfig().getClientUser().setBalance(balance);
                    getContent(chapterPos, buyAction);
                    hideBuyWindow();
                } else {
                    showToast("账户余额不足,请充值");
                    //跳转充值页面
                }
            }
        });
    }

    protected String getBookName() {
        return mBookBean.getBookName();
    }

    protected int getPagePos() {
        return mPagePos;
    }

    protected int getChapterIndex() {
        return mChapterIndex;
    }

    protected void setChapterIndex(int chapterIndex) {
        this.mChapterIndex = chapterIndex;
    }

    protected List<ChapterBean> getChapterBeans() {
        if (mBookBean == null) {
            DebugLog.w("mBookBean == null !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            DebugLog.d("mBookModel:" + mBookBean); //TODO HEIR!!
            return null;
        } else {
            DebugLog.w("mBookBean =" + mBookBean.toString() + ", ChapterId=" + mBookBean.getChapterBean(mChapterIndex).getChapterId());
        }
        return mBookBean.getChapterBeans();
    }

    protected void goChaptersActivity() {
        Intent intent = new Intent(OnlineReadActivity.this, ChaptersActivity.class);
        intent.putExtra("bookID", mBookBean.getBookId());
        intent.putExtra("bookName", mBookBean.getBookName());
        intent.putExtra("fromReading", true);
        intent.putExtra("chapterIndex", getChapterIndex());
        intent.putExtra("bookAuthor", mBookAuthor);
        intent.putExtra("isEpub", isEpub);
        //intent.putExtra("bookBean", mBookBean);
        startActivityForResult(intent, BookMsg.RESULT_JUMP_TO_CHAPTER);
    }

    protected void goBack() {
        if (getIntent().getBooleanExtra("fromShelf", false)) {
//            String s = SharedPreUtil.readData(this, "userInfo");
//            UserInfo userInfo = new Gson().fromJson(s, UserInfo.class);
            SharedPreUtil.writeData(this, "shelf" + mBookId, mChapterIndex + "|" + getLatestPagePosition(), userId);
//            SharedPreUtil.writeData(this, "shelf" + mBookId, mChapterIndex + "," + getLatestPagePosition(), "" + userInfo.userID);
        }
        finish();
    }


    private View endView;

    protected View getEndView() {
        if (null == endView) {
            endView = LayoutInflater.from(this).inflate(getResources().getIdentifier("read_end", "layout", getPackageName()), null);
            endView.setOnTouchListener(new View.OnTouchListener() {
                private boolean isAlwaysInTab = false;
                private float moveDownMotionX = 0;

                @Override
                public boolean onTouch(View v, MotionEvent event) {
                    switch (event.getAction()) {
                        case MotionEvent.ACTION_DOWN:
                            moveDownMotionX = event.getX();
                            isAlwaysInTab = false;
                            break;
                        case MotionEvent.ACTION_MOVE:
                            isAlwaysInTab = true;
                            break;
                        case MotionEvent.ACTION_UP:
                            if (isAlwaysInTab) { // to right
                                float dis = event.getX() - moveDownMotionX;
                                if (dis > 150) {
                                    hideEndWindow();
                                }
                            }
                            break;
                        default:
                            break;
                    }
                    return false;
                }
            });

            endView.findViewById(getResources().getIdentifier("go_bookshelf_btn", "id", getPackageName())).setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View arg0) {
                    goBack();
                }
            });

            endView.findViewById(getResources().getIdentifier("go_bookstore_btn", "id", getPackageName())).setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View arg0) {
                    goBack();
                }
            });
        }

        return endView;
    }

    /**
     * 添加书签
     */
    @Override
    protected void addBookMark() {

        String dev_type = SharedPreUtil.readData(this, "dev_type");
        String url;
        url = URL_ADD_BOOKMARK;
        ChapterBean chapterBean = mBookBean.getChapterBean(mChapterIndex);
        String s = mBookModel.readContent(chapterBean, isEpub);
        final int chapterId = chapterBean.getChapterId();
        if (TextUtils.isEmpty(s)) {
            s = chapterBean.getChapterName();
        }
        Map<String, String> paramsMap = new HashMap<String, String>();
        paramsMap.put("member_token", token);
        paramsMap.put("token_type", dev_type);
        paramsMap.put("book_id", mBookId + "");
        paramsMap.put("chapter_id", chapterId + "");
        paramsMap.put("book_type", (isEpub ? 2 : 1) + "");
        paramsMap.put("chapter_name", chapterBean.getChapterName() + "");
        paramsMap.put("content", s.length() > 30 ? s.substring(0, 30) : s);

        OkHttpUtils.post().url(url).params(paramsMap).build().execute(new Callback<BookMarkBean>() {

            @Override
            public BookMarkBean parseNetworkResponse(Response response, int id) throws Exception {
                String string = response.body().string();
                JSONObject jsonObject = new JSONObject(string);
                int code = jsonObject.getInt("code");
                BookMarkBean bookMarkBean;
                if (code == 0) {
                    bookMarkBean = new Gson().
                            fromJson(string, BookMarkBean.class);
                } else {
                    bookMarkBean = new BookMarkBean();
                    bookMarkBean.code = code;
                    bookMarkBean.message = jsonObject.getString("message");
                }
                return bookMarkBean;
            }

            @Override
            public void onError(Call call, Exception e, int id) {
                showToast("网络异常，请稍后再试");
            }

            @Override
            public void onResponse(BookMarkBean response, int id) {
                hideReadActionWindow();
                if (response.code == 0) {
                    mBookMarks.add(chapterId + "");
                    showToast("添加书签成功！");
                } else if (response.code == 600) {//未登录
                    setResult(GOTO_LOGIN);
                    showToast(response.message + "");
                    finish();
                }else {
                    showToast(response.message + "");
                }
            }
        });
    }

    /*显示进度跳转*/
    @Override
    protected View progressJump() {

        View progressView = LayoutInflater.from(this).inflate(getResources().getIdentifier("read_action_progress", "layout", getPackageName()), null);
        progressView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
            }
        });

        final TextView tvProgress = (TextView) progressView.findViewById(getResources().getIdentifier("progressText", "id", getPackageName()));
        final SeekBar seekBar = (SeekBar) progressView.findViewById(getResources().getIdentifier("seekBar", "id", getPackageName()));

        final TextView ibDown = (TextView) progressView.findViewById(getResources().getIdentifier("progress_down_btn", "id", getPackageName()));
        final TextView ibUp = (TextView) progressView.findViewById(getResources().getIdentifier("progress_up_btn", "id", getPackageName()));
        ibDown.setText("上一章");
        ibUp.setText("下一章");
        ibDown.setTextSize(DisplayUtil.sp2px(this, 4));
        ibUp.setTextSize(DisplayUtil.sp2px(this, 4));
        Log.i("readactivity", "mChapterIndex" + mChapterIndex);
        if (mBookBean != null) {
            seekBar.setMax(mBookBean.getChapterCount() - 1);
            tvProgress.setText("" + mBookBean.getChapterBean(mChapterIndex).getChapterName());
        } else {
            seekBar.setMax(1000);
        }
        seekBar.setProgress(mChapterIndex);

        seekBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {

            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {
                int progress = seekBar.getProgress();
//                tvProgress.setText("第" + progress + "章");
                if (progress != -1 && progress != mChapterIndex) {
                    getContent(progress, ChapterAction.JUMP);
                    hideReadActionWindow();
                }
            }

            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {
            }

            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                tvProgress.setText("" + mBookBean.getChapterBean(progress).getChapterName());
            }
        });


        ibDown.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.i("onlinereadactivity", "上一章" + seekBar.getProgress());
                if (seekBar.getProgress() == 0) {
                    return;
                }
                int progress = seekBar.getProgress();
                seekBar.setProgress(progress - 1);
                getContent(progress - 1, ChapterAction.JUMP);
                hideReadActionWindow();
            }
        });

        ibUp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Log.i("onlinereadactivity", "下一章" + seekBar.getProgress());
                if (seekBar.getProgress() == seekBar.getMax()) {
                    return;
                }
                int progress = seekBar.getProgress();
                seekBar.setProgress(progress + 1);
                getContent(progress + 1, ChapterAction.JUMP);
                hideReadActionWindow();
            }
        });
        return progressView;
    }

    /*点击下载*/
    @Override
    protected void download() {
        if (NetUtil.getNetWorkState(this) != -1) {//如果有网就一直取最新章节
            popupBuyWindow(mChapterIndex, ChapterAction.LOAD);
        } else {
            showToast("请先连接网络吧");
        }
    }

    /*更新用户阅读记录*/
    @Override
    protected void refreshReadLog(int index) {
        ChapterBean chapterBean = mBookBean.getChapterBean(index);
        int chapterCount = mBookBean.getChapterCount();
        String schedule = new DecimalFormat("0.00").format(index * 100f / chapterCount);
        Log.i("onlinereadactivity", "" + schedule);
        BookBean bookBean = mBookModel.readBookBeanObject(mBookId, isEpub);
        OkHttpUtils.post().url(URL_UPDATAREADRECORD)
                .addParams("book_id", mBookId + "")
                .addParams("last_chapter_id", chapterBean.getChapterId() + "")
                .addParams("member_token", token)
                .addParams("token_type", "android")
                .addParams("schedule", chapterBean.getChapterId() + "|" + schedule)
                .addParams("book_type", (isEpub ? 2 : 1) + "")
                .addParams("book_name", mBookName)
                .addParams("book_cover", bookBean == null ? "" : bookBean.getBookCover())
                .addParams("chapter_name", chapterBean.getChapterName())
                .build().execute(new Callback() {
            @Override
            public Object parseNetworkResponse(Response response, int id) throws Exception {
                Log.i("onlinereadactivity", "response = " + response.body().string());
                return null;
            }

            @Override
            public void onError(Call call, Exception e, int id) {

            }

            @Override
            public void onResponse(Object response, int id) {

            }
        });
    }

    /*检查改章是否添加书签*/
    @Override
    protected void checkMark(TextView ibBookmark) {
        if (ibBookmark==null){
            return;
        }
        ChapterBean chapterBean = mBookBean.getChapterBean(mChapterIndex);
        int chapterId = chapterBean.getChapterId();
        if (mBookMarks.contains(chapterId + "")) {

            Drawable img = getResources().getDrawable(getResources().getIdentifier("mark_red", "drawable", getPackageName()));
// 调用setCompoundDrawables时，必须调用Drawable.setBounds()方法,否则图片不显示
            img.setBounds(0, 0, img.getMinimumWidth(), img.getMinimumHeight());
//            ibBookmark.setImageResource(getResources().getIdentifier("read_shuqian2", "drawable", getPackageName()));
            ibBookmark.setCompoundDrawables(img,null,null,null);
            ibBookmark.setText("已加书签");
        } else {
            Drawable img = getResources().getDrawable(getResources().getIdentifier("mark", "drawable", getPackageName()));
// 调用setCompoundDrawables时，必须调用Drawable.setBounds()方法,否则图片不显示
            img.setBounds(0, 0, img.getMinimumWidth(), img.getMinimumHeight());
//            ibBookmark.setImageResource(getResources().getIdentifier("read_shuqian2", "drawable", getPackageName()));
            ibBookmark.setCompoundDrawables(img,null,null,null);
//            ibBookmark.setImageResource(getResources().getIdentifier("read_shuqian", "drawable", getPackageName()));
        }
    }

}
