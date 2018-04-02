package com.cjszyun.myreader.reader.views;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.ActivityInfo;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Rect;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.annotation.IdRes;
import android.util.Log;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewTreeObserver;
import android.view.Window;
import android.view.WindowManager;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.PopupWindow;
import android.widget.RadioGroup;
import android.widget.RelativeLayout;
import android.widget.SeekBar;
import android.widget.TextView;
import android.widget.Toast;

import com.cjszyun.myreader.reader.AppData;
import com.cjszyun.myreader.reader.beans.ChapterBean;
import com.cjszyun.myreader.reader.config.ReadConfig;
import com.cjszyun.myreader.reader.enginee.Chapter;
import com.cjszyun.myreader.reader.enginee.ChapterManager;
import com.cjszyun.myreader.reader.enginee.OnlineChapter;
import com.cjszyun.myreader.reader.enginee.OnlinePage;
import com.cjszyun.myreader.reader.enums.ChapterAction;
import com.cjszyun.myreader.reader.model.BookMsg;
import com.cjszyun.myreader.reader.utils.DebugLog;
import com.cjszyun.myreader.reader.utils.DisplayUtil;
import com.cjszyun.myreader.reader.utils.FileUtil;
import com.readystatesoftware.systembartint.SystemBarTintManager;

import java.util.ArrayList;
import java.util.List;

import static com.cjszyun.myreader.reader.model.BookMsg.HTML_BR;

/**
 * Created by zhuzd on 15/10/9.
 */
public abstract class ReadActivity extends BaseActivity {

    private ReadConfig mReadConfig;
    private int mWidth, mHeight;
    private Canvas mCurPageCanvas, mNextPageCanvas;
    private Bitmap mCurPageBitmap, mNextPageBitmap;
    private PageWidget mPageWidget;
    private ChapterManager mChapterManager;
    private OnlinePage mOnlinePage;

    private static final long TEXT_SIZE_CHANGE_DURATION = 150;
    private static final int TEXT_SIZE_CHANGE = 1;
    private static final int TEXT_SIZE_MIN = 2;
    private static final int TEXT_SIZE_MAX = 4;

    private Handler mHandler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            if (msg.what == BookMsg.PARSER_CURRENT_PAGE_SUCCESS) {
                mOnlinePage.draw(mCurPageCanvas);
                mOnlinePage.draw(mNextPageCanvas);
                mPageWidget.invalidate();
            } else if (msg.what == TEXT_SIZE_CHANGE) {
                String size = msg.arg1 + "";
                ((TextView) msg.obj).setText(size);
                showToast("当前字号：" + size);
            } else if (msg.what == TEXT_SIZE_MAX) {
                showToast("已经是最大号字体了", Toast.LENGTH_SHORT);
            } else if (msg.what == TEXT_SIZE_MIN) {
                showToast("已经是最小号字体了", Toast.LENGTH_SHORT);
            } else {
                DebugLog.d("unknown msg:" + Integer.toHexString(msg.what));
            }
        }
    };
    private SystemBarTintManager tintManager;
    private PopupWindow popupList;

    protected PageWidget getPageWidget() {
        return mPageWidget;
    }

    //	protected ChapterManager getChapterManager() {
//		return mChapterManager;
//	}
    protected int getLatestPagePosition() {
        return mChapterManager.getChapter(ChapterManager.PageJump.CURRENT).getCurPagePosition();
    }

    protected BroadcastReceiver mBatteryChangedReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            if (Intent.ACTION_BATTERY_CHANGED.equals(intent.getAction())) {
                int level = intent.getIntExtra("level", 0);
                int scale = intent.getIntExtra("scale", 100);
                level = level > scale ? scale : level;
                float percent = level * 1.0f / scale;
                mReadConfig.setBatteryPercent(percent);
            }
        }
    };

    protected void initReader() {
        mReadConfig = AppData.getConfig().getReadConfig();
        // 1.横竖屏
        if (mReadConfig.isPortrait()) {
            this.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        } else {
            this.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
        }
        // 2.亮度
        if (!mReadConfig.isSysBrightness()) {
            WindowManager.LayoutParams lp = getWindow().getAttributes();
            lp.screenBrightness = mReadConfig.getReadBrightness() * (1f / 255f);
            getWindow().setAttributes(lp);
        }

        mPageWidget = new PageWidget(this);
        mPageWidget.setLayoutParams(new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT));
        setContentView(mPageWidget);

        mPageWidget.setOnSizeChangedListener(new OnPageSizeChangedListener());
        mPageWidget.setOnTouchListener(new OnPageTouchListener());

        mCurPageCanvas = new Canvas();
        mNextPageCanvas = new Canvas();
        mChapterManager = new ChapterManager(OnlineChapter.class);
        mOnlinePage = new OnlinePage(mChapterManager);
        mOnlinePage.setOnDrawHeaderListener(new OnlinePage.OnDrawHeadListener() {
            @Override
            public String getChapterName() {
                if (null != getChapterBeans()) {
                    return getChapterBeans().get(getChapterIndex()).getChapterName();
                }
                return "";
            }
        });
    }

    private boolean mAlwaysInTapRegion = false;
    private float mCurrentDownMotionX = 0.0f;
    private float mCurrentDownMotionY = 0.0f;
    private float mMiddleDownMotionX = 0.0f;

    private class OnPageTouchListener implements View.OnTouchListener {
        @Override
        public boolean onTouch(View v, MotionEvent event) {
            boolean result = false; // return True if the listener has consumed the event, false otherwise.
            do {
                if (!mPageWidget.getAnimationState() /*|| !mPageWidget.canDragOver(event.getX(), event.getY())*/) {
                    break;
                }

                if (event.getAction() == MotionEvent.ACTION_DOWN) {
                    mAlwaysInTapRegion = true;
                    mCurrentDownMotionX = event.getX();
                    mCurrentDownMotionY = event.getY();
                    mMiddleDownMotionX = event.getX();

                    mOnlinePage.draw(mCurPageCanvas);
                    // Do not turn page, only display function controls.
                    if (isTouchInPopupRect(event.getX(), event.getY())) {
                        result = true;
                        break;
                    }

                    mPageWidget.abortAnimation();
                    mPageWidget.calcCornerXY(event.getX(), event.getY());

                    dragToRightOrLeft(false);
                    mOnlinePage.draw(mNextPageCanvas);
                    mPageWidget.doInternalTouchDown(event);

                } else if (event.getAction() == MotionEvent.ACTION_MOVE) {
                    if (mAlwaysInTapRegion) {
                        final int deltaX = (int) (event.getX() - mCurrentDownMotionX);
                        final int deltaY = (int) (event.getY() - mCurrentDownMotionY);
                        int distance = (deltaX * deltaX) + (deltaY * deltaY);
                        if (distance > 20) {
                            mAlwaysInTapRegion = false;
                        }
                    }

                    if ((mPageWidget.DragToRight() && event.getX() >= mMiddleDownMotionX) ||
                            (!mPageWidget.DragToRight() && event.getX() <= mMiddleDownMotionX)) {
                        mMiddleDownMotionX = event.getX();
                    }
                    mPageWidget.doInternalTouchMove(event);
                } else if (event.getAction() == MotionEvent.ACTION_UP) {
                    if (mAlwaysInTapRegion) {
                        if (isTouchInPopupRect(event.getX(), event.getY())) {
                            mPageWidget.setScrolling(false);

                            Log.i("readactivity", "点击了");
                            popupReadActionWindow();
                            break;
                        }
                    }
                    if ((mPageWidget.DragToRight() && event.getX() + 10 < mMiddleDownMotionX) ||
                            (!mPageWidget.DragToRight() && event.getX() - 10 > mMiddleDownMotionX)) {
                        mPageWidget.doInternalTouchUp(event, true);
                        dragToRightOrLeft(true);
                        mOnlinePage.draw(mCurPageCanvas);
                    } else {
                        mPageWidget.doInternalTouchUp(event, false);
                    }

                }
                result = true;
            } while (false);
            return result;
        }
    }

    private void dragToRightOrLeft(boolean isReturn) {
        mPageWidget.setScrolling(true);
        if (isReturn ? !mPageWidget.DragToRight() : mPageWidget.DragToRight()) {
            // Turn to previous page
            if (!mOnlinePage.pageUp()) {
                if (0 == getChapterIndex()) {
                    showToast("已经是第一页了", Toast.LENGTH_SHORT);
                    mPageWidget.setScrolling(false);
                    return;
                } else {
                    DebugLog.d("Loading PREVIOUS chapter.  <<<<<<<<<<<<<<<<<<<<<<<<<<");
                    Chapter chapter = mChapterManager.getChapter(ChapterManager.PageJump.PREVIOUS);
                    if (chapter.getPageCount() > 0) {
                        DebugLog.d("Hit, ");
                        chapter.pageEnd(); //翻页到上一章的最后一页
                        mChapterManager.movePrevious();
                        setChapterIndex(getChapterIndex() - 1); //章节索引减 1

                        DebugLog.d("and pre-load previous chapter data.");
                        if (getChapterIndex() - 1 >= 0) {
                            getContent(getChapterIndex() - 1, ChapterAction.CACHE_PREV);
                        }
                    } else {
                        DebugLog.d("NOT hit.");
                        getContent(getChapterIndex() - 1, ChapterAction.UP);
                    }
                }
            }
        } else {
            // Turn to next page, note that VIP detection.
            if (!mOnlinePage.pageDown()) {
                if (getChapterBeans() != null && getChapterIndex() + 1 >= getChapterBeans().size()) {
                    mPageWidget.setScrolling(false);
//                    popupEndWindow();
                    showToast("已经是最后一页了", Toast.LENGTH_SHORT);
                    return;

                } else {
                    DebugLog.d("Loading NEXT chapter.  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                    Chapter chapter = mChapterManager.getChapter(ChapterManager.PageJump.NEXT);
                    if (chapter.getPageCount() > 0) {
                        DebugLog.d("Hit, ");
                        chapter.pageFirst(); //翻页到下一章的第一页
                        mChapterManager.moveNext();
                        setChapterIndex(getChapterIndex() + 1); //章节索引加 1

                        DebugLog.d("and pre-load previous chapter data.");
                        if (getChapterIndex() + 1 < getChapterBeans().size()) {
                            getContent(getChapterIndex() + 1, ChapterAction.CACHE_NEXT);
                        }
                    } else {
                        DebugLog.d("NOT hit.");
                        getContent(getChapterIndex() + 1, ChapterAction.DOWN);
                    }
                }
            }
        }
    }

    protected void refreshNewChapter(final int chapterIndex, final String content, final ChapterAction chapterAction) {
        DebugLog.d("*****************************************************************************");
        DebugLog.d(String.format("chapterIndex:%s, content length:%s, chapterAction value:%s",
                chapterIndex, content == null ? "null" : content.length(), chapterAction.getValue()));
        ChapterAction mChapterAction = chapterAction;
        switch (chapterAction) {
            case INIT: {
                mChapterManager.clear();
                Chapter chapter = mChapterManager.getChapter(ChapterManager.PageJump.CURRENT);

                chapter.setHandler(mHandler);
                chapter.setCurPagePosition(getPagePos());
                chapter.parse(content);
                Log.i("readactivity", "INIT");
                setChapterIndex(chapterIndex);
            }
            break;
            case DOWN: {
                Chapter chapter = mChapterManager.getChapter(ChapterManager.PageJump.NEXT);
                chapter.setCurPagePosition(0);
                chapter.setHandler(mHandler);
                chapter.parse(content);
                chapter.pageFirst();
                mChapterManager.moveNext();
                Log.i("readactivity", "DOWN");
                setChapterIndex(chapterIndex);
            }
            break;
            case UP: {
                Chapter chapter = mChapterManager.getChapter(ChapterManager.PageJump.PREVIOUS);
                chapter.setHandler(mHandler);
                chapter.setCurPagePosition(content.lastIndexOf(HTML_BR) + HTML_BR.length());
                chapter.parse(content);
                chapter.pageEnd();
                mChapterManager.movePrevious();
                setChapterIndex(chapterIndex);
                Log.i("readactivity", "UP");
            }
            break;
            case JUMP: {
                mChapterManager.clear();
                Chapter curCache = mChapterManager.getChapter(ChapterManager.PageJump.CURRENT);
                curCache.setCurPagePosition(0);
                curCache.setHandler(mHandler);
                curCache.parse(content);
                setChapterIndex(chapterIndex);
                Log.i("readactivity", "JUMP");
            }
            break;
            case CACHE_PREV: {
                Chapter prevCache = mChapterManager.getChapter(ChapterManager.PageJump.PREVIOUS);
                prevCache.setCurPagePosition(content.lastIndexOf(HTML_BR) + HTML_BR.length());
                prevCache.parse(content);
                prevCache.pageEnd();
                Log.i("readactivity", "CACHE_PREV" + chapterIndex);
                refreshReadLog(chapterIndex + 1);
                return;
            }
            case CACHE_NEXT: {
                Chapter nextCache = mChapterManager.getChapter(ChapterManager.PageJump.NEXT);
                nextCache.setCurPagePosition(0);
                nextCache.parse(content);
                nextCache.pageFirst();
                Log.i("readactivity", "CACHE_NEXT" + chapterIndex);
                refreshReadLog(chapterIndex - 1);
                return;
            }
            case LOAD: {
                DebugLog.d(String.format("章节预读到本地完成, pos:%s, chapterID:%s",
                        getChapterIndex(), getChapterBeans().get(getChapterIndex()).getChapterId()));
                Log.i("readactivity", "LOAD");
                return;
            }
            default:
                return;
        }
        mOnlinePage.draw(mCurPageCanvas);
        mOnlinePage.draw(mNextPageCanvas);
        mPageWidget.postInvalidate();
        //初始化章节信息或者跳转章节时
        if (mChapterAction == ChapterAction.INIT || mChapterAction == ChapterAction.JUMP) {
            if (getChapterIndex() + 1 < getChapterBeans().size()) {
                getContent(getChapterIndex() + 1, ChapterAction.CACHE_NEXT);
            }
            if (getChapterIndex() - 1 >= 0 && getChapterIndex() - 1 < getChapterBeans().size()) {
                getContent(getChapterIndex() - 1, ChapterAction.CACHE_PREV);
            }
        }
    }


    private PopupWindow popupWindowEnd;

    private void popupEndWindow() {
        View view = getEndView();
        if (null == popupWindowEnd) {
            popupWindowEnd = new PopupWindow(view,
                    LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);
            popupWindowEnd.setFocusable(true);
            popupWindowEnd.setTouchable(true);
            //popupWindowEnd.setBackgroundDrawable(new ColorDrawable(0xb0000000));
            popupWindowEnd.setAnimationStyle(getResources().getIdentifier("pop_read_end_anim", "style", getPackageName()));
        }
        popupWindowEnd.showAtLocation(mPageWidget, Gravity.NO_GRAVITY, 0, 0);
//		getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
    }

    protected void hideEndWindow() {
        if (null != popupWindowEnd) {
            popupWindowEnd.dismiss();
//			getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        }
    }


    private void redraw() {
        mChapterManager.reset();
        mOnlinePage.draw(mCurPageCanvas);
        mPageWidget.postInvalidate();
    }

    public class OnPageSizeChangedListener implements PageWidget.OnSizeChangedListener {
        @Override
        public void onSizeChanged(int w, int h, int oldW, int oldH) {
            DebugLog.trace();
            mWidth = w;
            mHeight = h;
            if (null != mCurPageBitmap) {
                mCurPageBitmap.recycle();
                mCurPageBitmap = null;
            }
            if (null != mNextPageBitmap) {
                mNextPageBitmap.recycle();
                mNextPageBitmap = null;
            }
            try {
                mCurPageBitmap = Bitmap.createBitmap(mWidth, mHeight, Bitmap.Config.ARGB_8888);
            } catch (OutOfMemoryError e) {
                System.gc();
                System.gc();
                mCurPageBitmap = Bitmap.createBitmap(mWidth, mHeight, Bitmap.Config.ARGB_8888);
            }
            try {
                mNextPageBitmap = Bitmap.createBitmap(mWidth, mHeight, Bitmap.Config.ARGB_8888);
            } catch (OutOfMemoryError e) {
                System.gc();
                System.gc();
                mNextPageBitmap = Bitmap.createBitmap(mWidth, mHeight, Bitmap.Config.ARGB_8888);
            }
            mCurPageCanvas.setBitmap(mCurPageBitmap);
            mNextPageCanvas.setBitmap(mNextPageBitmap);

            mReadConfig.setSize(mWidth, mHeight);

            mChapterManager.reset();
            mOnlinePage.draw(mCurPageCanvas);

            mPageWidget.setScrolling(false);
            if (mReadConfig.getBackColorIndex() == 0 && mReadConfig.getBitmapBackground() != null) {
                mPageWidget.setBitmapBackground(mReadConfig.getBitmapBackground());
            } else {
                mPageWidget.setBgColor(mReadConfig.getBackColor());
            }
            mPageWidget.setBitmaps(mCurPageBitmap, mNextPageBitmap);

        }
    }


    private boolean isTouchInPopupRect(float x, float y) {
        int rate = 6;
        if (x < mWidth / 2 + mWidth / rate
                && x > mWidth / 2 - mWidth / rate
                && y < mHeight / 2 + mHeight / rate
                && y > mHeight / 2 - mHeight / rate) {
            return true;
        }
        return false;
    }

    /**********************************************************************************************/

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        switch (keyCode) {
            case KeyEvent.KEYCODE_MENU:
                popupReadActionWindow();
                break;
            case KeyEvent.KEYCODE_BACK:
                hideReadActionWindow();
                break;
        }
        return super.onKeyDown(keyCode, event);
    }


    private View mReadTopActionView = null;
    private View mReadBottomActionView = null;
    private PopupWindow mReadTopActionPop = null;
    private PopupWindow mReadBottomActionPop = null;
    private FrameLayout mActionPopFrame = null;
    public TextView ibBookmark = null;

    /*显示操作popwindow*/
    private void popupReadActionWindow() {
        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS, WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);

        if (tintManager == null) {
            tintManager = new SystemBarTintManager(ReadActivity.this);
            tintManager.setStatusBarTintEnabled(true);
            tintManager.setStatusBarTintResource(getResources().getIdentifier("light_black", "color", getPackageName()));// 通知栏所需颜色
        }
        if (null == mReadTopActionView || null == mReadBottomActionView) {
            mReadTopActionPop = new PopupWindow(getReadTopActionView(),
                    LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
            mReadBottomActionPop = new PopupWindow(getReadBottomActionView(),
                    LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);

            mReadTopActionPop.setFocusable(false);
            mReadBottomActionPop.setFocusable(false);

            //设置popWindow的显示和消失动画
            mReadTopActionPop.setAnimationStyle(getResources().getIdentifier("toppopwindow_anim_style", "style", getPackageName()));
            mReadBottomActionPop.setAnimationStyle(getResources().getIdentifier("bottompopwindow_anim_style", "style", getPackageName()));

        }
        // 在底部显示
        mReadBottomActionPop.showAtLocation((View) getPageWidget().getParent(),
                Gravity.BOTTOM, 0, 0);
        // 在顶部显示
        Rect rect = new Rect();
        getWindow().getDecorView().getWindowVisibleDisplayFrame(rect);
        mReadTopActionPop.showAtLocation((View) getPageWidget().getParent(),
                Gravity.TOP, 0, rect.top);

        //显示进度跳转
        showProgressWindow();

    }

    /*隐藏操作popwindow*/
    protected void hideReadActionWindow() {
        if (null != mReadTopActionPop) {
            mReadTopActionPop.dismiss();
        }
        if (null != mReadBottomActionPop) {
            mReadBottomActionPop.dismiss();
            mActionPopFrame.setVisibility(View.INVISIBLE);
        }
        if (null != popupList) {
            popupList.dismiss();
        }
//        SystemBarTintManager tintManager = new SystemBarTintManager(ReadActivity.this);
//        tintManager.setStatusBarTintEnabled(true);
//        tintManager.setStatusBarTintResource(R.color.tran);// 通知栏所需颜色
        if (tintManager != null) {
            tintManager.setStatusBarTintEnabled(true);
            tintManager.setStatusBarTintResource(getResources().getIdentifier("tran", "color", getPackageName()));// 通知栏所需颜色
            tintManager.setStatusBarTintEnabled(false);
            tintManager = null;
        }
        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
    }


    /*得到操作顶部popwindow*/
    private View getReadTopActionView() {
        if (null == mReadTopActionView) {
            mReadTopActionView = LayoutInflater.from(this).inflate(getResources().getIdentifier("read_action_top", "layout", getPackageName()), null);

            // 1. 返回书架
            ImageButton btnBack = (ImageButton) mReadTopActionView.findViewById(getResources().getIdentifier("read_go_back_ib", "id", getPackageName()));
            btnBack.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    goBack();
                    overridePendingTransition(getResources().getIdentifier("move_left_in", "anim", getPackageName()), getResources().getIdentifier("move_left_out", "anim", getPackageName()));
                }
            });

            // 2.标题栏
            TextView tvTitle = (TextView) mReadTopActionView.findViewById(getResources().getIdentifier("read_title_tv", "id", getPackageName()));
            tvTitle.setText(getBookName());

            // 3.在线书签
//            ibBookmark = (ImageButton) mReadTopActionView.findViewById(getResources().getIdentifier("read_bookmark_ib", "id", getPackageName()));
//            ibBookmark.setOnClickListener(new View.OnClickListener() {
//                @Override
//                public void onClick(View v) {
//                    ibBookmark.setImageResource(getResources().getIdentifier("read_shuqian2", "drawable", getPackageName()));
//                    addBookMark();
//                }
//            });

            // 4.操作列表
            ImageButton btList = (ImageButton) mReadTopActionView.findViewById(getResources().getIdentifier("read_top_list", "id", getPackageName()));
            btList.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {

                    showTopPopList();

                }
            });

        }

        return mReadTopActionView;
    }

    /*显示操作popList
    * 全文检索
    * 添加书签
    * 分享
    * 打赏*/
    private void showTopPopList() {
        if (popupList == null) {
            View popListView = View.inflate(this, getResources().getIdentifier("read_action_top_list", "layout", getPackageName()), null);

            RelativeLayout popListRl = (RelativeLayout) popListView.findViewById(getResources().getIdentifier("rl_top_list", "id", getPackageName()));
            popListRl.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    hideReadActionWindow();
                }
            });

            //点击书签
            ibBookmark = popListView.findViewById(getResources().getIdentifier("list_mark_tv", "id", getPackageName()));
            ibBookmark.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Drawable img = getResources().getDrawable(getResources().getIdentifier("mark_red", "drawable", getPackageName()));
                    // 调用setCompoundDrawables时，必须调用Drawable.setBounds()方法,否则图片不显示
                    img.setBounds(0, 0, img.getMinimumWidth(), img.getMinimumHeight());
                    ibBookmark.setCompoundDrawables(img,null,null,null);
                    addBookMark();
                }
            });

            //打赏
            TextView dsTv = popListView.findViewById(getResources().getIdentifier("list_ds_tv", "id", getPackageName()));
            if (!isEpub()){
                dsTv.setVisibility(View.VISIBLE);
            }
            dsTv.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    showDsWindow();
                }
            });
            popupList = new PopupWindow(popListView, LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);

        } else {
            if (popupList.isShowing()) {
                popupList.dismiss();
                return;
            }
        }
        checkMark(ibBookmark);
        popupList.setFocusable(false);
        popupList.setOutsideTouchable(true);
        Rect rect = new Rect();
        getWindow().getDecorView().getWindowVisibleDisplayFrame(rect);
        popupList.setAnimationStyle(getResources().getIdentifier("toppopwindowlist_anim_style", "style", getPackageName()));
        popupList.showAtLocation((View) getPageWidget().getParent(), Gravity.TOP, 0, DisplayUtil.dip2px(this,46)+rect.top);
    }

    protected abstract boolean isEpub();


    /*得到操作底部popwindow*/
    private View getReadBottomActionView() {
        if (null == mReadBottomActionView) {
            mReadBottomActionView = LayoutInflater.from(this).inflate(getResources().getIdentifier("read_action_bottom", "layout", getPackageName()), null);

            final RelativeLayout btnBright = (RelativeLayout) mReadBottomActionView.findViewById(getResources().getIdentifier("read_bright_ib", "id", getPackageName()));
            final RelativeLayout btnFont = (RelativeLayout) mReadBottomActionView.findViewById(getResources().getIdentifier("read_font_ib", "id", getPackageName()));
            final RelativeLayout btnDs = (RelativeLayout) mReadBottomActionView.findViewById(getResources().getIdentifier("read_ds_ib", "id", getPackageName()));
            final RelativeLayout btnMore = (RelativeLayout) mReadBottomActionView.findViewById(getResources().getIdentifier("read_more_ib", "id", getPackageName()));
            final RelativeLayout btnMenu = (RelativeLayout) mReadBottomActionView.findViewById(getResources().getIdentifier("read_menu_rl", "id", getPackageName()));
            final RelativeLayout btnDownload = (RelativeLayout) mReadBottomActionView.findViewById(getResources().getIdentifier("read_download_rl", "id", getPackageName()));
            final ImageView nightIv = (ImageView) mReadBottomActionView.findViewById(getResources().getIdentifier("read_night_iv", "id", getPackageName()));

            if (mReadConfig.isNight()) {
                nightIv.setImageResource(getResources().getIdentifier("read_day", "drawable", getPackageName()));
            } else {
                nightIv.setImageResource(getResources().getIdentifier("read_night", "drawable", getPackageName()));
            }
            mReadBottomActionView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    hideReadActionWindow();

                }
            });
            // 1.夜晚模式
            mReadBottomActionView.findViewById(getResources().getIdentifier("read_night_ib", "id", getPackageName())).setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
//                    hideReadActionWindow();
                    boolean isNight = !mReadConfig.isNight();
                    if (isNight) {
                        nightIv.setImageResource(getResources().getIdentifier("read_day", "drawable", getPackageName()));
                    } else {
                        nightIv.setImageResource(getResources().getIdentifier("read_night", "drawable", getPackageName()));
                    }
                    mReadConfig.setNight(isNight);
                    redraw();
                }
            });

            // 2.亮度
            btnBright.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    showBrightView();
                }
            });

            // 3.字体大小
            btnFont.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    
                }
            });

            // 4.横竖屏切换
            mReadBottomActionView.findViewById(getResources().getIdentifier("read_portrait_ib", "id", getPackageName())).setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    hideReadActionWindow();
                    if (mReadConfig.isPortrait()) {
                        // 竖屏切换为横屏
                        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
                        mReadConfig.setPortrait(false);
                    } else {
                        // 横屏切换为竖屏
                        setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
                        mReadConfig.setPortrait(true);
                    }
                }
            });

            // 6.更多选项
            btnMore.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    showMoreWindow();
                }
            });

            // 7.打赏
            btnDs.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    showDsWindow();
                }
            });

            //目录
            btnMenu.setOnClickListener(new View.OnClickListener() {

                @Override
                public void onClick(View v) {
                    hideReadActionWindow();
                    goChaptersActivity();
                }
            });

            //下载
            btnDownload.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    download();
                }
            });

            // frame
            mActionPopFrame = (FrameLayout) mReadBottomActionView.findViewById(getResources().getIdentifier("pop_frame", "id", getPackageName()));
        }
        return mReadBottomActionView;
    }

    /**
     * 打赏
     */
    private PopupWindow mDsPop = null;
    private int dsMoney;

    public void showDsWindow() {
        hideReadActionWindow();
        dsMoney = 98;
        if (null == mDsPop) {
            View dSView = LayoutInflater.from(this).inflate(getResources().getIdentifier("read_action_ds", "layout", getPackageName()), null);
            dSView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (null != mDsPop) {
                        mDsPop.dismiss();
                    }
                }
            });
            ArrayList<LinearLayout> linearLayouts = new ArrayList<LinearLayout>();
            ImageView close = dSView.findViewById(getResources().getIdentifier("close_iv", "id", getPackageName()));

            final LinearLayout oneLl = dSView.findViewById(getResources().getIdentifier("one_ll", "id", getPackageName()));
            final LinearLayout twoLl = dSView.findViewById(getResources().getIdentifier("two_ll", "id", getPackageName()));
            final LinearLayout threeLl = dSView.findViewById(getResources().getIdentifier("three_ll", "id", getPackageName()));
            final LinearLayout fourLl = dSView.findViewById(getResources().getIdentifier("four_ll", "id", getPackageName()));
            final LinearLayout fiveLl = dSView.findViewById(getResources().getIdentifier("five_ll", "id", getPackageName()));
            final LinearLayout sixLl = dSView.findViewById(getResources().getIdentifier("six_ll", "id", getPackageName()));
            final LinearLayout sevenLl = dSView.findViewById(getResources().getIdentifier("seven_ll", "id", getPackageName()));
            final LinearLayout eightLl = dSView.findViewById(getResources().getIdentifier("eight_ll", "id", getPackageName()));
            final LinearLayout nineLl = dSView.findViewById(getResources().getIdentifier("nine_ll", "id", getPackageName()));
            linearLayouts.add(oneLl);
            linearLayouts.add(twoLl);
            linearLayouts.add(threeLl);
            linearLayouts.add(fourLl);
            linearLayouts.add(fiveLl);
            linearLayouts.add(sixLl);
            linearLayouts.add(sevenLl);
            linearLayouts.add(eightLl);
            linearLayouts.add(nineLl);
            final TextView price_tv = dSView.findViewById(getResources().getIdentifier("ds_price_tv", "id", getPackageName()));
            oneLl.setSelected(true);
            price_tv.setText("98长江币");
            TextView enter_tv = dSView.findViewById(getResources().getIdentifier("enter_tv", "id", getPackageName()));
            final ArrayList<LinearLayout> flList = linearLayouts;
            close.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    if (null != mDsPop) {
                        mDsPop.dismiss();
                    }
                }
            });
            oneLl.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    dsMoney = checkLl(oneLl, flList, price_tv);
                }
            });
            twoLl.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    dsMoney = checkLl(twoLl, flList, price_tv);
                }
            });
            threeLl.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    dsMoney = checkLl(threeLl, flList, price_tv);
                }
            });
            fourLl.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    dsMoney = checkLl(fourLl, flList, price_tv);
                }
            });
            fiveLl.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    dsMoney = checkLl(fiveLl, flList, price_tv);
                }
            });
            sixLl.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    dsMoney = checkLl(sixLl, flList, price_tv);
                }
            });
            sevenLl.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    dsMoney = checkLl(sevenLl, flList, price_tv);
                }
            });
            eightLl.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    dsMoney = checkLl(eightLl, flList, price_tv);
                }
            });
            nineLl.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    dsMoney = checkLl(nineLl, flList, price_tv);
                }
            });
            enter_tv.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    doDs(dsMoney,null);
                }
            });
            mDsPop = new PopupWindow(dSView, LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
            mDsPop.setFocusable(false);
            mDsPop.setOutsideTouchable(true);
            //设置popWindow的显示和消失动画
            mDsPop.setAnimationStyle(getResources().getIdentifier("bottompopwindow_anim_style", "style", getPackageName()));
        }
        // 在底部显示
        mDsPop.showAtLocation((View) getPageWidget().getParent(), Gravity.BOTTOM, 0, 0);
    }

    public int checkLl(LinearLayout checkLl, ArrayList<LinearLayout> linearLayouts, TextView price_tv){
        int price = 0;
        int count = 0;
        for(int i = 0;i<linearLayouts.size();i++){
            LinearLayout linearLayout = linearLayouts.get(i);
            if (linearLayout==checkLl){
                count = i;
                checkLl.setSelected(true);
            }else {
                linearLayout.setSelected(false);
            }
        }
        switch (count){
            case 0:
                price = 98;
                break;
            case 1:
                price = 188;
                break;
            case 2:
                price = 388;
                break;
            case 3:
                price = 588;
                break;
            case 4:
                price = 1888;
                break;
            case 5:
                price = 5888;
                break;
            case 6:
                price = 8888;
                break;
            case 7:
                price = 18888;
                break;
            case 8:
                price = 88888;
                break;
        }

        price_tv.setText(price+"长江币");
        return price;
    }

    /*打赏*/
    protected abstract void doDs(int dsMoney, String review);


    private View progressView = null;

    /*
     * 进度跳转弹窗
     */
    private void showProgressWindow() {
        progressView = progressJump();
        mActionPopFrame.setBackgroundResource(getResources().getIdentifier("light_black", "color", getPackageName()));
        mActionPopFrame.removeAllViews();
        mActionPopFrame.addView(progressView);
        mActionPopFrame.setVisibility(View.VISIBLE);

    }


    /*
     * 设置亮度
     */
    private View brightView = null;
    private boolean isProgress = true;

    private void showBrightView() {
        if (null == brightView) {
            brightView = LayoutInflater.from(this).inflate(getResources().getIdentifier("read_action_bright", "layout", getPackageName()), null);
            brightView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                }
            });

            final CheckBox cbSysBrightness = (CheckBox) brightView.findViewById(getResources().getIdentifier("read_system_brightness_cb", "id", getPackageName()));
            cbSysBrightness.setChecked(mReadConfig.isSysBrightness());
            final SeekBar seekBar = (SeekBar) brightView.findViewById(getResources().getIdentifier("seekBar", "id", getPackageName()));
            seekBar.setMax(255);
            seekBar.setProgress(mReadConfig.getReadBrightness());

            seekBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
                @Override
                public void onStopTrackingTouch(SeekBar seekBar) {
                }

                @Override
                public void onStartTrackingTouch(SeekBar seekBar) {
                    cbSysBrightness.setChecked(false);
                    isProgress = true;
                }

                @Override
                public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                    //Settings.System.putInt(getContentResolver(), Settings.System.SCREEN_BRIGHTNESS, progress);
                    if (isProgress && progress > 5) {
                        WindowManager.LayoutParams lp = getWindow().getAttributes();
                        lp.screenBrightness = Float.valueOf(progress) * (1f / 255f);
                        getWindow().setAttributes(lp);
                        mReadConfig.setReadBrightness(progress);
                    }
                }
            });

            cbSysBrightness.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
                @Override
                public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                    if (isChecked) {
                        WindowManager.LayoutParams lp = getWindow().getAttributes();
                        lp.screenBrightness = WindowManager.LayoutParams.BRIGHTNESS_OVERRIDE_NONE;
                        getWindow().setAttributes(lp);
                    } else {
                        WindowManager.LayoutParams lp = getWindow().getAttributes();
                        lp.screenBrightness = Float.valueOf(mReadConfig.getReadBrightness()) * (1f / 255f);
                        getWindow().setAttributes(lp);
                    }
                    mReadConfig.setSysBrightness(isChecked);
                }
            });

            TextView ibSub = (TextView) brightView.findViewById(getResources().getIdentifier("progress_down_btn", "id", getPackageName()));
            TextView ibAdd = (TextView) brightView.findViewById(getResources().getIdentifier("progress_up_btn", "id", getPackageName()));
            ibSub.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (seekBar.getProgress() == 0 || cbSysBrightness.isChecked()) {
                        return;
                    }
                    isProgress = false;

                    int progress = mReadConfig.getReadBrightness();
                    progress -= 5;
                    progress = progress < 0 ? 0 : progress;

                    WindowManager.LayoutParams lp = getWindow().getAttributes();
                    lp.screenBrightness = progress * 1.0f / 255;
                    getWindow().setAttributes(lp);
                    mReadConfig.setReadBrightness(progress);

                    seekBar.setProgress(progress);
                }
            });

            ibAdd.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (seekBar.getProgress() == seekBar.getMax() || cbSysBrightness.isChecked()) {
                        return;
                    }
                    isProgress = false;

                    int progress = mReadConfig.getReadBrightness();
                    progress += 5;
                    progress = progress > 255 ? 255 : progress;

                    WindowManager.LayoutParams lp = getWindow().getAttributes();
                    lp.screenBrightness = progress * 1.0f / 255;
                    getWindow().setAttributes(lp);
                    mReadConfig.setReadBrightness(progress);

                    seekBar.setProgress(progress);
                }
            });
        }
        mActionPopFrame.setBackgroundResource(getResources().getIdentifier("light_black", "color", getPackageName()));
        mActionPopFrame.removeAllViews();
        mActionPopFrame.addView(brightView);
        mActionPopFrame.setVisibility(View.VISIBLE);
    }


    /*
     * 设置更多
     */
    private View moreView = null;
    private TextView tvMarginWidth, tvLineSpace;
    private SeekBar sbMarginWidth, sbLineSpace, sbParagraphSpace;
    private TextView tvPage[] = new TextView[4];
    private TextView tvType[] = new TextView[4];
    private RadioGroup readRg;

    private void showMoreWindow() {
        if (null == moreView) {
            moreView = LayoutInflater.from(this).inflate(getResources().getIdentifier("read_action_more", "layout", getPackageName()), null);
            moreView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                }
            });
            //***********************************  背景  ******************************************
            readRg = (RadioGroup) moreView.findViewById(getResources().getIdentifier("read_bg_rg", "id", getPackageName()));
            int bgIndex = getSharedPreferences("read_action", Context.MODE_PRIVATE).getInt("bg_color_index", 0);
            if (bgIndex == 0)
                readRg.check(getResources().getIdentifier("read_bg1_rb", "id", getPackageName()));
            if (bgIndex == 1)
                readRg.check(getResources().getIdentifier("read_bg2_rb", "id", getPackageName()));
            if (bgIndex == 2)
                readRg.check(getResources().getIdentifier("read_bg3_rb", "id", getPackageName()));
            if (bgIndex == 3)
                readRg.check(getResources().getIdentifier("read_bg4_rb", "id", getPackageName()));

            readRg.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
                @Override
                public void onCheckedChanged(RadioGroup group, @IdRes int checkedId) {
                    if (mReadConfig.isNight()) {
                        mReadConfig.setNight(false);
                        ((ImageView) mReadBottomActionView.findViewById(getResources().getIdentifier("read_night_iv", "id", getPackageName()))).setImageResource(getResources().getIdentifier("read_night", "drawable", getPackageName()));
                    }
                    if (checkedId == getResources().getIdentifier("read_bg1_rb", "id", getPackageName())) {
                        mReadConfig.setBackColorIndex(0);
                        Log.i("readactivity", "0");
                        Bitmap bitmap = BitmapFactory.decodeResource(getResources(), getResources().getIdentifier("read_bg", "drawable", getPackageName()));
                        Bitmap bm = FileUtil.fitBitmap(bitmap, getWindowManager().getDefaultDisplay().getWidth(), getWindowManager().getDefaultDisplay().getHeight());
                        mReadConfig.setBitmapBackground(bm);
                        //                            Bitmap bitmap1 = BitmapFactory.decodeResource(getResources(), R.drawable.aaaaaaa);
                        mPageWidget.setBitmapBackground(bm);
                    } else if (checkedId == getResources().getIdentifier("read_bg2_rb", "id", getPackageName())) {
                        mReadConfig.setBackColorIndex(1);
                        Log.i("readactivity", "1");
                        mReadConfig.setBitmapBackground(null);
                        mPageWidget.setBitmapBackground(null);
                        mPageWidget.setBgColor(mReadConfig.getBackColor());
                    } else if (checkedId == getResources().getIdentifier("read_bg3_rb", "id", getPackageName())) {
                        mReadConfig.setBackColorIndex(2);
                        Log.i("readactivity", "2");
                        mReadConfig.setBitmapBackground(null);
                        mPageWidget.setBitmapBackground(null);
                        mPageWidget.setBgColor(mReadConfig.getBackColor());
                    } else if (checkedId == getResources().getIdentifier("read_bg4_rb", "id", getPackageName())) {
                        mReadConfig.setBackColorIndex(3);
                        Log.i("readactivity", "3");
                        mReadConfig.setBitmapBackground(null);
                        mPageWidget.setBitmapBackground(null);
                        mPageWidget.setBgColor(mReadConfig.getBackColor());
                    }
                    redraw();
                }
            });

            //*********************************** 背景end ******************************************


            // ************************************  翻页特效  *************************************
            tvPage[0] = (TextView) moreView.findViewById(getResources().getIdentifier("read_style_curl_tv", "id", getPackageName()));
            tvPage[1] = (TextView) moreView.findViewById(getResources().getIdentifier("read_style_shift_tv", "id", getPackageName()));
            tvPage[2] = (TextView) moreView.findViewById(getResources().getIdentifier("read_style_none_tv", "id", getPackageName()));
            tvPage[3] = (TextView) moreView.findViewById(getResources().getIdentifier("read_style_fade_tv", "id", getPackageName()));
            PageWidget.Mode mode = mReadConfig.getScrollMode();
            DebugLog.d(String.format("My pageWidget mode.index=%s", mode.index));
            if (mode.index >= tvPage.length) {
                mode.index = tvPage.length;
                DebugLog.d(String.format("set mode.index=%s，WHEN mode.index >= tvPage.length", mode.index));
            }
            tvPage[mode.index].setSelected(true);

            tvPage[0].setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    PageWidget.Mode mode = mReadConfig.getScrollMode();
                    changedMode(mode, PageWidget.Mode.Curl);
                }
            });

            tvPage[1].setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    PageWidget.Mode mode = mReadConfig.getScrollMode();
                    changedMode(mode, PageWidget.Mode.Shift);
                }
            });

            tvPage[2].setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    PageWidget.Mode mode = mReadConfig.getScrollMode();
                    changedMode(mode, PageWidget.Mode.None);
                }
            });
            tvPage[3].setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    PageWidget.Mode mode = mReadConfig.getScrollMode();
                    changedMode(mode, PageWidget.Mode.Fade);
                }
            });
            // ************************************ 翻页特效end *************************************

            //***********************************  设置间距  ***************************************
            tvMarginWidth = (TextView) moreView.findViewById(getResources().getIdentifier("margin_lr_tv", "id", getPackageName()));
            tvLineSpace = (TextView) moreView.findViewById(getResources().getIdentifier("line_space_tv", "id", getPackageName()));
            sbMarginWidth = (SeekBar) moreView.findViewById(getResources().getIdentifier("margin_lr_seekBar", "id", getPackageName()));
            sbLineSpace = (SeekBar) moreView.findViewById(getResources().getIdentifier("line_space_seekBar", "id", getPackageName()));
            sbParagraphSpace = (SeekBar) moreView.findViewById(getResources().getIdentifier("paragraph_space_seekBar", "id", getPackageName()));
            sbMarginWidth.setMax(90);
            sbLineSpace.setMax(13);
            sbParagraphSpace.setMax(16);

            sbMarginWidth.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
                @Override
                public void onStopTrackingTouch(SeekBar seekBar) {
                    int progress = seekBar.getProgress();
                    mReadConfig.setMarginWidth(10 + progress);
                    redraw();
                }

                @Override
                public void onStartTrackingTouch(SeekBar seekBar) {
                }

                @Override
                public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                    tvMarginWidth.setText(String.valueOf(progress));
                }
            });

            sbLineSpace.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
                @Override
                public void onStopTrackingTouch(SeekBar seekBar) {
                    int progress = seekBar.getProgress() + 2;
                    mReadConfig.setNormalLineSpacingRate(progress / 10f);
                    redraw();
                }

                @Override
                public void onStartTrackingTouch(SeekBar seekBar) {
                }

                @Override
                public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                    tvLineSpace.setText(String.valueOf(progress));
                }
            });

            sbParagraphSpace.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
                @Override
                public void onStopTrackingTouch(SeekBar seekBar) {
                    int progress = seekBar.getProgress() + 4;
                    mReadConfig.setBigLineSpacingRate(progress / 10f);
                    redraw();
                }

                @Override
                public void onStartTrackingTouch(SeekBar seekBar) {
                }

                @Override
                public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                    tvLineSpace.setText(String.valueOf(progress));
                }
            });
        }
        //*************************************  设置间距end  ***************************************

        //****************************************  设置字体  ***************************************
        tvType[0] = (TextView) moreView.findViewById(getResources().getIdentifier("read_text_type1_tv", "id", getPackageName()));
        tvType[1] = (TextView) moreView.findViewById(getResources().getIdentifier("read_text_type2_tv", "id", getPackageName()));
        tvType[2] = (TextView) moreView.findViewById(getResources().getIdentifier("read_text_type3_tv", "id", getPackageName()));
        tvType[3] = (TextView) moreView.findViewById(getResources().getIdentifier("read_text_type4_tv", "id", getPackageName()));
        int typeIndex = mReadConfig.getTextTypeIndex();
        if (typeIndex >= tvType.length) {
            typeIndex = tvType.length;
        }
        tvType[typeIndex].setSelected(true);

        tvType[0].setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int typeIndex = mReadConfig.getTextTypeIndex();
                changedTextType(typeIndex, 0);
            }
        });

        tvType[1].setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int typeIndex = mReadConfig.getTextTypeIndex();
                changedTextType(typeIndex, 1);
            }
        });

        tvType[2].setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int typeIndex = mReadConfig.getTextTypeIndex();
                changedTextType(typeIndex, 2);
            }
        });
        tvType[3].setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int typeIndex = mReadConfig.getTextTypeIndex();
                changedTextType(typeIndex, 3);
            }
        });
        //*************************************** 设置字体end ***************************************

        //****************************************  设置字号  ***************************************
        final TextView textSize = (TextView) moreView.findViewById(getResources().getIdentifier("read_font_textSize", "id", getPackageName()));
        final TextView tvLow = (TextView) moreView.findViewById(getResources().getIdentifier("tv_font_low", "id", getPackageName()));
        tvLow.setOnTouchListener(new View.OnTouchListener() {
            boolean isDown;
            int size = mReadConfig.getTextSize();

            @Override
            public boolean onTouch(View view, final MotionEvent motionEvent) {
                size = mReadConfig.getTextSize();
                switch (motionEvent.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        tvLow.setTextColor(getResources().getColor(getResources().getIdentifier("read_green", "color", getPackageName())));
                        isDown = true;
                        view.setPressed(true);
                        new Thread() {
                            @Override
                            public void run() {
                                do {
                                    try {
                                        size--;
                                        if (mReadConfig.setTextSize(size)) {
                                            Message msg = new Message();
                                            msg.obj = textSize;
                                            msg.what = TEXT_SIZE_CHANGE;
                                            msg.arg1 = size;
                                            mHandler.sendMessage(msg);
                                        } else {
                                            mHandler.sendEmptyMessage(TEXT_SIZE_MIN);
                                            isDown = false;
                                        }

                                        sleep(TEXT_SIZE_CHANGE_DURATION);
                                    } catch (InterruptedException e) {
                                        e.printStackTrace();
                                    }
                                } while (isDown);
                            }
                        }.start();
                        break;
                    case MotionEvent.ACTION_UP:
                        tvLow.setTextColor(getResources().getColor(getResources().getIdentifier("white", "color", getPackageName())));
                        isDown = false;
                        view.setPressed(false);
                        view.postInvalidate();
                        redraw();
                        tvLow.setEnabled(false);
                        //view重绘时回调
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
                            view.getViewTreeObserver().addOnDrawListener(new ViewTreeObserver.OnDrawListener() {
                                @Override
                                public void onDraw() {
                                    tvLow.setEnabled(true);
                                }
                            });
                        }
                        break;
                    default:
                        break;
                }
                return true;
            }
        });
        final TextView tvUp = (TextView) moreView.findViewById(getResources().getIdentifier("tv_font_up", "id", getPackageName()));
        tvUp.setOnTouchListener(new View.OnTouchListener() {
            boolean isDown;
            int size = mReadConfig.getTextSize();

            @Override
            public boolean onTouch(View view, final MotionEvent motionEvent) {
                size = mReadConfig.getTextSize();
                switch (motionEvent.getAction()) {
                    case MotionEvent.ACTION_DOWN:
                        tvUp.setTextColor(getResources().getColor(getResources().getIdentifier("read_green", "color", getPackageName())));
                        isDown = true;
                        view.setPressed(true);
                        new Thread() {
                            @Override
                            public void run() {
                                do {
                                    try {
                                        size++;
                                        if (mReadConfig.setTextSize(size)) {
                                            Message msg = new Message();
                                            msg.obj = textSize;
                                            msg.what = TEXT_SIZE_CHANGE;
                                            msg.arg1 = size;
                                            mHandler.sendMessage(msg);
                                        } else {
                                            mHandler.sendEmptyMessage(TEXT_SIZE_MAX);
                                            isDown = false;
                                        }
                                        sleep(TEXT_SIZE_CHANGE_DURATION);
                                    } catch (InterruptedException e) {
                                        e.printStackTrace();
                                    }
                                } while (isDown);
                            }
                        }.start();
                        break;
                    case MotionEvent.ACTION_UP:
                        tvUp.setTextColor(getResources().getColor(getResources().getIdentifier("white", "color", getPackageName())));
                        isDown = false;
                        view.setPressed(false);
                        redraw();
                        tvUp.setEnabled(false);
                        //view重绘时回调
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN) {
                            view.getViewTreeObserver().addOnDrawListener(new ViewTreeObserver.OnDrawListener() {
                                @Override
                                public void onDraw() {
                                    tvUp.setEnabled(true);
                                }
                            });
                        }
                        break;
                    default:
                        break;
                }
                return true;
            }
        });
        //*************************************** 设置字号end ***************************************

        tvMarginWidth.setText((int) mReadConfig.getMarginWidth() + "");
        tvLineSpace.setText(mReadConfig.getLineSpacing() + "");

        sbMarginWidth.setProgress((int) mReadConfig.getMarginWidth() - 10);
        sbLineSpace.setProgress((int) (mReadConfig.getNormalLineSpacingRate() * 10) - 2);
        sbParagraphSpace.setProgress((int) (mReadConfig.getBigLineSpacingRate() * 10) - 4);

        mActionPopFrame.setBackgroundResource(getResources().getIdentifier("light_black", "color", getPackageName()));
        mActionPopFrame.removeAllViews();
        mActionPopFrame.addView(moreView);
        mActionPopFrame.setVisibility(View.VISIBLE);
    }

    //更改翻页模式
    private void changedMode(PageWidget.Mode oldMode, PageWidget.Mode newMode) {
        if (oldMode == newMode) {
            return;
        }
        tvPage[oldMode.index].setSelected(false);
        tvPage[newMode.index].setSelected(true);
        mReadConfig.setScrollMode(newMode);
    }

    //更改字体
    private void changedTextType(int oldType, int newType) {
        if (oldType == newType) {
            return;
        }
        tvType[oldType].setSelected(false);
        tvType[newType].setSelected(true);
        mReadConfig.setTextType(newType);
        redraw();
    }


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        DebugLog.trace();
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        initReader();
        registerReceiver(mBatteryChangedReceiver, new IntentFilter(Intent.ACTION_BATTERY_CHANGED));
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        DebugLog.trace();
        if (null != mCurPageBitmap) {
            mCurPageBitmap.recycle();
            mCurPageBitmap = null;
        }
        if (null != mNextPageBitmap) {
            mNextPageBitmap.recycle();
            mNextPageBitmap = null;
        }
        unregisterReceiver(mBatteryChangedReceiver);
    }


    protected abstract String getBookName();

    protected abstract int getPagePos();

    protected abstract int getChapterIndex();

    protected abstract void setChapterIndex(int chapterIndex);

    protected abstract List<ChapterBean> getChapterBeans();

    protected abstract void getContent(final int chapterIndex, final ChapterAction action);

    protected abstract void goChaptersActivity();

    protected abstract void goBack();

    protected abstract View getEndView();

    protected abstract void addBookMark();

    protected abstract View progressJump();

    protected abstract void download();

    protected abstract void refreshReadLog(int index);

    protected abstract void checkMark(TextView ibBookmark);

}
