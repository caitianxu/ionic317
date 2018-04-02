package com.cjszyun.myreader.reader.views;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.ColorMatrix;
import android.graphics.ColorMatrixColorFilter;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.PointF;
import android.graphics.Rect;
import android.graphics.Region;
import android.graphics.drawable.GradientDrawable;
import android.util.AttributeSet;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Scroller;

import com.cjszyun.myreader.reader.AppData;

/**
 * Created by zhuzd on 15/5/17.
 */
public class PageWidget extends View {

    public enum Mode {
        Curl(0),
        Shift(1),
        None(2),
        Fade(3); // is not used

        public int index;

        Mode(int index) {
            this.index = index;
        }

        public static Mode getMode(int index) {
            switch (index) {
                case 0:
                    return Curl;
                case 1:
                    return Shift;
                case 2:
                    return None;
                case 3:
                    return Fade;
                default:
                    return null;
            }
        }
    }

    private PointF mTouch = new PointF(); // 拖拽点

    private PointF mBezierStart1 = new PointF(); // 贝塞尔曲线起始点
    private PointF mBezierControl1 = new PointF(); // 贝塞尔曲线控制点
    private PointF mBezierVertex1 = new PointF(); // 贝塞尔曲线顶点
    private PointF mBezierEnd1 = new PointF(); // 贝塞尔曲线结束点

    private PointF mBezierStart2 = new PointF(); // 另一条贝塞尔曲线
    private PointF mBezierControl2 = new PointF();
    private PointF mBezierVertex2 = new PointF();
    private PointF mBezierEnd2 = new PointF();

    private float mMiddleX, mMiddleY;
    private float mDegrees;
    private float mTouchToCornerDis;


    private int mWidth, mHeight;
    private float mMaxLength; // sqrt(mWidth*mWidth + mHeight*mHeight)

    private int mCornerX = 0; // 拖拽点对应的页脚
    private int mCornerY = 0;
    private boolean mIsRTandLB; // 是否属于右上或左下

    private ColorMatrixColorFilter mColorMatrixFilter;
    private Matrix mMatrix;
    private float[] mMatrixArray = {0, 0, 0, 0, 0, 0, 0, 0, 1.0f};

    private int[] mBackShadowColors;
    private int[] mFrontShadowColors;

    private GradientDrawable mBackShadowDrawableLR;
    private GradientDrawable mBackShadowDrawableRL;

    private GradientDrawable mFolderShadowDrawableLR;
    private GradientDrawable mFolderShadowDrawableRL;

    private GradientDrawable mFrontShadowDrawableHBT;
    private GradientDrawable mFrontShadowDrawableHTB;
    private GradientDrawable mFrontShadowDrawableVLR;
    private GradientDrawable mFrontShadowDrawableVRL;

    private Paint mPaint;
    private Path mPath0, mPath1;

    private Scroller mScroller;

    private boolean mIsScrolling = true;

    private Bitmap mCurPageBitmap, mNextPageBitmap;

    private int mBgColor;
    private Bitmap mBitmapBackground;
    private final int mAnimationTime = 1500;
    private final int mAnimationTimeRate1 = 3;
    private final int mAnimationTimeRate2 = 4;
    private boolean mIsAnimationEnd = true;
    private final int mShiftOffset = 30;

    public boolean getAnimationState() {
        return mIsAnimationEnd;
    }

    public void setScrolling(boolean is) {
        mIsScrolling = is;
    }

    public void setBitmaps(Bitmap bm1, Bitmap bm2) {
        mCurPageBitmap = bm1;
        mNextPageBitmap = bm2;
    }


    public interface OnSizeChangedListener {
        void onSizeChanged(int w, int h, int oldw, int oldh);
    }

    private OnSizeChangedListener mListenerSizeChanged;

    public void setOnSizeChangedListener(OnSizeChangedListener listener) {
        mListenerSizeChanged = listener;
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
        mWidth = w;
        mHeight = h;
        mMaxLength = (float) Math.hypot(mWidth, mHeight);
        if (null != mListenerSizeChanged) {
            mListenerSizeChanged.onSizeChanged(w, h, oldw, oldh);
        }
    }


    public PageWidget(Context context) {
        super(context);
        init();
    }

    public PageWidget(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public PageWidget(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    private void init() {
        mPath0 = new Path();
        mPath1 = new Path();

        createDrawable();

        mPaint = new Paint();
        mPaint.setStyle(Paint.Style.FILL);

        ColorMatrix cm = new ColorMatrix();
        float array[] = {0.55f, 0, 0, 0, 80.0f,
                0, 0.55f, 0, 0, 80.0f,
                0, 0, 0.55f, 0, 80.0f,
                0, 0, 0, 0.2f, 0};
//		float array[] = { 1, 0, 0, 0, 0,
//				0, 1, 0, 0, 0,
//				0, 0,1, 0, 0,
//				0, 0, 0, 1, 0 };
        cm.set(array);
        mColorMatrixFilter = new ColorMatrixColorFilter(cm);

        mMatrix = new Matrix();
        mScroller = new Scroller(getContext());

        mTouch.x = 0.01f; // 不让x,y为0,否则在点计算时会有问题
        mTouch.y = 0.01f;
    }

    //创建阴影的GradientDrawable
    private void createDrawable() {
        int[] color = {0x00333333, 0xb0333333};

        mFolderShadowDrawableRL = new GradientDrawable(GradientDrawable.Orientation.RIGHT_LEFT, color);
        mFolderShadowDrawableRL.setGradientType(GradientDrawable.LINEAR_GRADIENT);

        mFolderShadowDrawableLR = new GradientDrawable(GradientDrawable.Orientation.LEFT_RIGHT, color);
        mFolderShadowDrawableLR.setGradientType(GradientDrawable.LINEAR_GRADIENT);

        mBackShadowColors = new int[]{0xff111111, 0x111111};

        mBackShadowDrawableRL = new GradientDrawable(GradientDrawable.Orientation.RIGHT_LEFT, mBackShadowColors);
        mBackShadowDrawableRL.setGradientType(GradientDrawable.LINEAR_GRADIENT);

        mBackShadowDrawableLR = new GradientDrawable(GradientDrawable.Orientation.LEFT_RIGHT, mBackShadowColors);
        mBackShadowDrawableLR.setGradientType(GradientDrawable.LINEAR_GRADIENT);

        mFrontShadowColors = new int[]{0x80111111, 0x111111};

        mFrontShadowDrawableVLR = new GradientDrawable(GradientDrawable.Orientation.LEFT_RIGHT, mFrontShadowColors);
        mFrontShadowDrawableVLR.setGradientType(GradientDrawable.LINEAR_GRADIENT);

        mFrontShadowDrawableVRL = new GradientDrawable(GradientDrawable.Orientation.RIGHT_LEFT, mFrontShadowColors);
        mFrontShadowDrawableVRL.setGradientType(GradientDrawable.LINEAR_GRADIENT);

        mFrontShadowDrawableHTB = new GradientDrawable(GradientDrawable.Orientation.TOP_BOTTOM, mFrontShadowColors);
        mFrontShadowDrawableHTB.setGradientType(GradientDrawable.LINEAR_GRADIENT);

        mFrontShadowDrawableHBT = new GradientDrawable(GradientDrawable.Orientation.BOTTOM_TOP, mFrontShadowColors);
        mFrontShadowDrawableHBT.setGradientType(GradientDrawable.LINEAR_GRADIENT);
    }

    /**
     * 计算拖拽点对应的拖拽脚
     */
    public void calcCornerXY(float x, float y) {
        mCornerX = (x <= mWidth / 2) ? 0 : mWidth;
        mCornerY = (y <= mHeight / 2) ? 0 : mHeight;
        if ((mCornerX == 0 && mCornerY == mHeight)
                || (mCornerX == mWidth && mCornerY == 0)) {
            mIsRTandLB = true;
        } else {
            mIsRTandLB = false;
        }
    }

    public void setBgColor(int mBgColor) {
        this.mBgColor = mBgColor;
    }

    public void setBitmapBackground(Bitmap bm) {
        this.mBitmapBackground = bm;
    }

    public void doInternalTouchMove(MotionEvent event) {
        mTouch.x = event.getX();
        mTouch.y = event.getY();
        if (mTouch.y > mHeight / 5.0f * 2
                && mTouch.y < mHeight / 5.0f * 3) {
            mTouch.y = 0.1f;
        }
        if (mIsScrolling && mCornerX < 0) {
            Mode mode = AppData.getConfig().getReadConfig().getScrollMode();

            if (mode == Mode.Curl) {
                mTouch.y = mHeight;
            }
        }
        this.postInvalidate();
    }

    public void doInternalTouchDown(MotionEvent event) {
        mTouch.x = event.getX();
        mTouch.y = event.getY();
        if (mTouch.y > mHeight / 5.0f * 2
                && mTouch.y < mHeight / 5.0f * 3) {
            mTouch.y = 0.1f;
        }
        if (mIsScrolling && mCornerX < 0) {
            Mode mode = AppData.getConfig().getReadConfig().getScrollMode();

            if (mode == Mode.Curl) {
                mTouch.y = mHeight;
            }
        }
    }

    public void doInternalTouchUp(MotionEvent event, boolean isReturn) {
        mIsAnimationEnd = false;
        startAnimation(mAnimationTime, event.getX(), event.getY(), isReturn);
        this.postInvalidate();
    }

    public boolean canDragOver(float x, float y) {
        mTouchToCornerDis = (float) Math.hypot((x - mCornerX), (y - mCornerY));
        if (mTouchToCornerDis > mWidth / 10)
            return true;
        return false;
    }

    /**
     * 求解直线P1P2和直线P3P4的交点坐标
     */
    private PointF getCross(PointF P1, PointF P2, PointF P3, PointF P4) {
        PointF CrossP = new PointF();
        // 二元函数通式： y=ax+b
        float a1 = (P2.y - P1.y) / (P2.x - P1.x);
        float b1 = ((P1.x * P2.y) - (P2.x * P1.y)) / (P1.x - P2.x);

        float a2 = (P4.y - P3.y) / (P4.x - P3.x);
        float b2 = ((P3.x * P4.y) - (P4.x * P3.y)) / (P3.x - P4.x);
        CrossP.x = (b2 - b1) / (a1 - a2);
        CrossP.y = a1 * CrossP.x + b1;
        return CrossP;
    }


    @Override
    protected void onDraw(Canvas canvas) {
        //DebugLog.d("Page", "touch.x:" + mTouch.x + ", touch.y:" + mTouch.y);
        if (mBitmapBackground == null||AppData.getConfig().getReadConfig().isNight()) {
            canvas.drawColor(AppData.getConfig().getReadConfig().getBackColor());
        } else {
            canvas.drawBitmap(mBitmapBackground, 0, 0, null);
        }
        if (mIsScrolling) {
            Mode mode = AppData.getConfig().getReadConfig().getScrollMode();
            switch (mode) {
                case Curl:
                    drawCurlPage(canvas);
                    break;
                case Shift:
                    drawShiftPage(canvas);
                    break;
                case Fade:
                    drawFade(canvas);
                    break;
                case None:
                default:
                    drawStatic(canvas, mNextPageBitmap);
                    break;
            }
        } else {
            //DebugLog.d("draw static");
            drawStatic(canvas, mCurPageBitmap);
        }
    }

    private void drawCurlPage(Canvas canvas) {
        calcPoints();
        drawCurrentPageArea(canvas);
        drawNextPageAreaAndShadow(canvas);
        drawCurrentPageShadow(canvas);
        drawCurrentBackArea(canvas);
    }

    private void drawShiftPage(Canvas canvas) {
        Rect right = new Rect((int) mTouch.x, 0, mWidth, mHeight);
        Rect left = new Rect(0, 0, (int) mTouch.x, mHeight);

        GradientDrawable mCurrentPageShadow = mBackShadowDrawableLR;
        mCurrentPageShadow.setBounds((int) (mTouch.x + mShiftOffset - 100), 0, (int) (mTouch.x + mShiftOffset), mHeight);

        if (mCornerX > 0) {
            // to left
            canvas.save();
            canvas.drawBitmap(mNextPageBitmap, right, right, null);
            canvas.restore();

            mCurrentPageShadow.draw(canvas);

            Rect src = new Rect((int) (mWidth - mTouch.x), 0, mWidth, mHeight);
            canvas.save();
            canvas.drawBitmap(mCurPageBitmap, src, left, null);
            canvas.restore();
        } else {
            // to right
            canvas.save();
            canvas.drawBitmap(mCurPageBitmap, right, right, null);
            canvas.restore();

            mCurrentPageShadow.draw(canvas);

            Rect src = new Rect((int) (mWidth - mTouch.x), 0, mWidth, mHeight);
            canvas.save();
            canvas.drawBitmap(mNextPageBitmap, src, left, null);
            canvas.restore();
        }
    }


    private void calcPoints() {
        mMiddleX = (mTouch.x + mCornerX) / 2;
        mMiddleY = (mTouch.y + mCornerY) / 2;
        mBezierControl1.x = mMiddleX - (mCornerY - mMiddleY) * (mCornerY - mMiddleY) / (mCornerX - mMiddleX);
        mBezierControl1.y = mCornerY;
        mBezierControl2.x = mCornerX;
        mBezierControl2.y = mMiddleY - (mCornerX - mMiddleX) * (mCornerX - mMiddleX) / (mCornerY - mMiddleY);

        mBezierStart1.x = mBezierControl1.x - (mCornerX - mBezierControl1.x) / 2;
        mBezierStart1.y = mCornerY;

        // 当mBezierStart1.x < 0或者mBezierStart1.x > width时
        // 如果继续翻页，会出现BUG故在此限制
        if (mTouch.x > 0 && mTouch.x < mWidth) {
            if (mBezierStart1.x < 0 || mBezierStart1.x > mWidth) {
                if (mBezierStart1.x < 0) {
                    mBezierStart1.x = mWidth - mBezierStart1.x;
                }
                float f1 = Math.abs(mCornerX - mTouch.x);
                float f2 = mWidth * f1 / mBezierStart1.x;
                mTouch.x = Math.abs(mCornerX - f2);

                float f3 = Math.abs(mCornerX - mTouch.x) * Math.abs(mCornerY - mTouch.y) / f1;
                mTouch.y = Math.abs(mCornerY - f3);

                mMiddleX = (mTouch.x + mCornerX) / 2;
                mMiddleY = (mTouch.y + mCornerY) / 2;

                mBezierControl1.x = mMiddleX - (mCornerY - mMiddleY)
                        * (mCornerY - mMiddleY) / (mCornerX - mMiddleX);
                mBezierControl1.y = mCornerY;

                mBezierControl2.x = mCornerX;
                mBezierControl2.y = mMiddleY - (mCornerX - mMiddleX) * (mCornerX - mMiddleX) / (mCornerY - mMiddleY);
                mBezierStart1.x = mBezierControl1.x - (mCornerX - mBezierControl1.x) / 2;
            }
        }
        mBezierStart2.x = mCornerX;
        mBezierStart2.y = mBezierControl2.y - (mCornerY - mBezierControl2.y) / 2;

        mTouchToCornerDis = (float) Math.hypot((mTouch.x - mCornerX), (mTouch.y - mCornerY));

        mBezierEnd1 = getCross(mTouch, mBezierControl1, mBezierStart1, mBezierStart2);
        mBezierEnd2 = getCross(mTouch, mBezierControl2, mBezierStart1, mBezierStart2);

        mBezierVertex1.x = (mBezierStart1.x + 2 * mBezierControl1.x + mBezierEnd1.x) / 4;
        mBezierVertex1.y = (2 * mBezierControl1.y + mBezierStart1.y + mBezierEnd1.y) / 4;
        mBezierVertex2.x = (mBezierStart2.x + 2 * mBezierControl2.x + mBezierEnd2.x) / 4;
        mBezierVertex2.y = (2 * mBezierControl2.y + mBezierStart2.y + mBezierEnd2.y) / 4;
    }

    private void drawCurrentPageArea(Canvas canvas) {
        mPath0.reset();
        mPath0.moveTo(mBezierStart1.x, mBezierStart1.y);
        mPath0.quadTo(mBezierControl1.x, mBezierControl1.y, mBezierEnd1.x, mBezierEnd1.y);
        mPath0.lineTo(mTouch.x, mTouch.y);
        mPath0.lineTo(mBezierEnd2.x, mBezierEnd2.y);
        mPath0.quadTo(mBezierControl2.x, mBezierControl2.y, mBezierStart2.x, mBezierStart2.y);
        mPath0.lineTo(mCornerX, mCornerY);
        mPath0.close();

        canvas.save();
        canvas.clipPath(mPath0, Region.Op.XOR);
        canvas.drawBitmap(mCurPageBitmap, 0, 0, null);
        canvas.restore();
    }

    private void drawNextPageAreaAndShadow(Canvas canvas) {
        mPath1.reset();
        mPath1.moveTo(mBezierStart1.x, mBezierStart1.y);
        mPath1.lineTo(mBezierVertex1.x, mBezierVertex1.y);
        mPath1.lineTo(mBezierVertex2.x, mBezierVertex2.y);
        mPath1.lineTo(mBezierStart2.x, mBezierStart2.y);
        mPath1.lineTo(mCornerX, mCornerY);
        mPath1.close();

        mDegrees = (float) Math.toDegrees(Math.atan2(mBezierControl1.x - mCornerX, mBezierControl2.y - mCornerY));
        int leftx;
        int rightx;
        GradientDrawable mBackShadowDrawable;
        if (mIsRTandLB) {
            leftx = (int) (mBezierStart1.x);
            rightx = (int) (mBezierStart1.x + mTouchToCornerDis / 4);
            mBackShadowDrawable = mBackShadowDrawableLR;
        } else {
            leftx = (int) (mBezierStart1.x - mTouchToCornerDis / 4);
            rightx = (int) mBezierStart1.x;
            mBackShadowDrawable = mBackShadowDrawableRL;
        }
        canvas.save();
        canvas.clipPath(mPath0);
        canvas.clipPath(mPath1, Region.Op.INTERSECT);
        canvas.drawBitmap(mNextPageBitmap, 0, 0, null);
        canvas.rotate(mDegrees, mBezierStart1.x, mBezierStart1.y);
        mBackShadowDrawable.setBounds(leftx, (int) mBezierStart1.y, rightx, (int) (mMaxLength + mBezierStart1.y));
        mBackShadowDrawable.draw(canvas);
        canvas.restore();
    }


    private void drawCurrentPageShadow(Canvas canvas) {
        double degree;
        if (mIsRTandLB) {
            degree = Math.PI
                    / 4
                    - Math.atan2(mBezierControl1.y - mTouch.y, mTouch.x
                    - mBezierControl1.x);
        } else {
            degree = Math.PI
                    / 4
                    - Math.atan2(mTouch.y - mBezierControl1.y, mTouch.x
                    - mBezierControl1.x);
        }
        // 翻起页阴影顶点与touch点的距离
        double d1 = (float) 25 * 1.414 * Math.cos(degree);
        double d2 = (float) 25 * 1.414 * Math.sin(degree);
        float x = (float) (mTouch.x + d1);
        float y;
        if (mIsRTandLB) {
            y = (float) (mTouch.y + d2);
        } else {
            y = (float) (mTouch.y - d2);
        }
        mPath1.reset();
        mPath1.moveTo(x, y);
        mPath1.lineTo(mTouch.x, mTouch.y);
        mPath1.lineTo(mBezierControl1.x, mBezierControl1.y);
        mPath1.lineTo(mBezierStart1.x, mBezierStart1.y);
        mPath1.close();
        canvas.save();
        canvas.clipPath(mPath0, Region.Op.XOR);
        canvas.clipPath(mPath1, Region.Op.INTERSECT);

        int leftX;
        int rightX;
        GradientDrawable mCurrentPageShadow;
        if (mIsRTandLB) {
            leftX = (int) (mBezierControl1.x);
            rightX = (int) mBezierControl1.x + 25;
            mCurrentPageShadow = mFrontShadowDrawableVLR;
        } else {
            leftX = (int) (mBezierControl1.x - 25);
            rightX = (int) mBezierControl1.x + 1;
            mCurrentPageShadow = mFrontShadowDrawableVRL;
        }

        float rotateDegrees = (float) Math.toDegrees(Math.atan2(mTouch.x
                - mBezierControl1.x, mBezierControl1.y - mTouch.y));
        canvas.rotate(rotateDegrees, mBezierControl1.x, mBezierControl1.y);
        mCurrentPageShadow.setBounds(leftX,
                (int) (mBezierControl1.y - mMaxLength), rightX,
                (int) (mBezierControl1.y));
        mCurrentPageShadow.draw(canvas);
        canvas.restore();

        mPath1.reset();
        mPath1.moveTo(x, y);
        mPath1.lineTo(mTouch.x, mTouch.y);
        mPath1.lineTo(mBezierControl2.x, mBezierControl2.y);
        mPath1.lineTo(mBezierStart2.x, mBezierStart2.y);
        mPath1.close();
        canvas.save();
        canvas.clipPath(mPath0, Region.Op.XOR);
        canvas.clipPath(mPath1, Region.Op.INTERSECT);
        if (mIsRTandLB) {
            leftX = (int) (mBezierControl2.y);
            rightX = (int) (mBezierControl2.y + 25);
            mCurrentPageShadow = mFrontShadowDrawableHTB;
        } else {
            leftX = (int) (mBezierControl2.y - 25);
            rightX = (int) (mBezierControl2.y + 1);
            mCurrentPageShadow = mFrontShadowDrawableHBT;
        }
        rotateDegrees = (float) Math.toDegrees(Math.atan2(mBezierControl2.y
                - mTouch.y, mBezierControl2.x - mTouch.x));
        canvas.rotate(rotateDegrees, mBezierControl2.x, mBezierControl2.y);
        float temp;
        if (mBezierControl2.y < 0)
            temp = mBezierControl2.y - mHeight;
        else
            temp = mBezierControl2.y;

        int m = (int) Math.hypot(mBezierControl2.x, temp);
        if (m > mMaxLength) {
            mCurrentPageShadow.setBounds(
                    (int) (mBezierControl2.x - 25) - m, leftX,
                    (int) (mBezierControl2.x + mMaxLength) - m, rightX);
        } else {
            mCurrentPageShadow.setBounds(
                    (int) (mBezierControl2.x - mMaxLength), leftX,
                    (int) (mBezierControl2.x), rightX);
        }

        mCurrentPageShadow.draw(canvas);
        canvas.restore();
    }

    /**
     * 绘制翻起页背面
     */
    private void drawCurrentBackArea(Canvas canvas) {
        int i = (int) (mBezierStart1.x + mBezierControl1.x) / 2;
        float f1 = Math.abs(i - mBezierControl1.x);
        int i1 = (int) (mBezierStart2.y + mBezierControl2.y) / 2;
        float f2 = Math.abs(i1 - mBezierControl2.y);
        float f3 = Math.min(f1, f2);
        mPath1.reset();
        mPath1.moveTo(mBezierVertex2.x, mBezierVertex2.y);
        mPath1.lineTo(mBezierVertex1.x, mBezierVertex1.y);
        mPath1.lineTo(mBezierEnd1.x, mBezierEnd1.y);
        mPath1.lineTo(mTouch.x, mTouch.y);
        mPath1.lineTo(mBezierEnd2.x, mBezierEnd2.y);
        mPath1.close();
        GradientDrawable mFolderShadowDrawable;
        int left;
        int right;
        if (mIsRTandLB) {
            left = (int) (mBezierStart1.x - 1);
            right = (int) (mBezierStart1.x + f3 + 1);
            mFolderShadowDrawable = mFolderShadowDrawableLR;
        } else {
            left = (int) (mBezierStart1.x - f3 - 1);
            right = (int) (mBezierStart1.x + 1);
            mFolderShadowDrawable = mFolderShadowDrawableRL;
        }
        canvas.save();
        canvas.clipPath(mPath0);
        canvas.clipPath(mPath1, Region.Op.INTERSECT);

        mPaint.setColorFilter(mColorMatrixFilter);

        float dis = (float) Math.hypot(mCornerX - mBezierControl1.x,
                mBezierControl2.y - mCornerY);
        float f8 = (mCornerX - mBezierControl1.x) / dis;
        float f9 = (mBezierControl2.y - mCornerY) / dis;
        mMatrixArray[0] = 1 - 2 * f9 * f9;
        mMatrixArray[1] = 2 * f8 * f9;
        mMatrixArray[3] = mMatrixArray[1];
        mMatrixArray[4] = 1 - 2 * f8 * f8;
        mMatrix.reset();
        mMatrix.setValues(mMatrixArray);
        mMatrix.preTranslate(-mBezierControl1.x, -mBezierControl1.y);
        mMatrix.postTranslate(mBezierControl1.x, mBezierControl1.y);
        canvas.drawBitmap(mCurPageBitmap, mMatrix, mPaint);
//         canvas.drawBitmap(mBitmapBackground, mMatrix, null);
        mPaint.setColorFilter(null);
        canvas.rotate(mDegrees, mBezierStart1.x, mBezierStart1.y);
        mFolderShadowDrawable.setBounds(left, (int) mBezierStart1.y, right,
                (int) (mBezierStart1.y + mMaxLength));
        mFolderShadowDrawable.draw(canvas);
        canvas.restore();
    }

    private void drawStatic(Canvas canvas, Bitmap bitmap) {
        mPaint.setAlpha(255);
        canvas.drawBitmap(bitmap, 0, 0, mPaint);
    }

    /**
     * 绘制淡入效果，利用x轴变化， 修改透明度
     */
    private void drawFade(Canvas canvas) {
        int alpha = (int) mTouch.x;
        if (alpha < 255) {
            alpha = (255 - alpha) > 0 ? 255 - alpha : 0;
            if (mPaint.getAlpha() == 0) {
                return;
            }
            mPaint.setAlpha(alpha);
            canvas.drawBitmap(mCurPageBitmap, 0, 0, mPaint);
        } else {
            alpha = (alpha - 255) > 255 ? 255 : (alpha - 255);
            mPaint.setAlpha(alpha);
            canvas.drawBitmap(mNextPageBitmap, 0, 0, mPaint);
        }
    }

    @Override
    public void computeScroll() {
        if (mScroller.computeScrollOffset()) {
            float x = mScroller.getCurrX();
            float y = mScroller.getCurrY();
            if (mScroller.timePassed() > mAnimationTime / mAnimationTimeRate1) {
                mIsAnimationEnd = true;
            }

            mTouch.x = x;
            mTouch.y = y;
            //DebugLog.d("touch.x:" + mTouch.x + ", touch.y:" + mTouch.y);
            postInvalidate();
        }
        super.computeScroll();
    }

    private void startAnimation(int delayMillis, float x, float y, boolean isReturn) {
        Mode mode = AppData.getConfig().getReadConfig().getScrollMode();
        switch (mode) {
            case Curl:
                startAnimationCurl(delayMillis, x, y, isReturn);
                break;
            case Shift:
                startAnimationShift(delayMillis, x, y, isReturn);
                break;
            case Fade:
                startAnimationFade(delayMillis);
                break;
            case None:
                new Thread() {
                    @Override
                    public void run() {
                        try {
                            sleep(mAnimationTime / mAnimationTimeRate2);
                            mIsAnimationEnd = true;
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    }
                }.start();
            default:
                break;
        }
    }

    private void startAnimationCurl(int delayMillis, float x, float y, boolean isReturn) {
        int dx, dy;
        // dx 水平方向滑动的距离，负值会使滚动向左滚动
        // dy 垂直方向滑动的距离，负值会使滚动向上滚动
        if (mCornerX > 0) {
//			dx = -(int) (mWidth + x);
            dx = isReturn ? (int) (mWidth - x) : -(int) (mWidth + x);
        } else {
//			dx = (int) (mWidth - x + mWidth);
            dx = isReturn ? (int) -x : (int) (mWidth - x + mWidth);
        }
        if (mCornerY > 0) {
            if (y > mHeight / 5.0f * 2
                    && y < mHeight / 5.0f * 3) {
                y = mHeight - 1;
            }
            dy = (int) (mHeight - y - 1);
        } else {
            if (y > mHeight / 5.0f * 2
                    && y < mHeight / 5.0f * 3) {
                y = 1;
            }
            dy = (int) (1 - y); // 防止mTouch.y最终变为0
        }
        //DebugLog.d("PageWidget", "start.x:" + x + ",start.y:" + y + ",to.x:" + dx + ",to.y:" + dy);
        mScroller.startScroll((int) x, (int) y, dx, dy, delayMillis);
    }

    private void startAnimationShift(int delayMillis, float x, float y, boolean isReturn) {
        int dx;
        Log.i("pagewidget","isReturn = "+isReturn+" ,mCornerX="+mCornerX);
        dx = mCornerX > 0 ? isReturn ? (int) (mWidth - x) : -(int) (x + mShiftOffset)+30 : isReturn ? -(int) (x) : (int) (mWidth - x);
        mScroller.startScroll((int) x, (int) y, dx, (int) y, delayMillis-500);
    }

    private void startAnimationFade(int delayMillis) {
        mScroller.startScroll(0, 0, 512, 0, delayMillis);
    }

    public void abortAnimation() {
        if (!mScroller.isFinished()) {
            mScroller.abortAnimation();
//			mTouch.x =mScroller.getFinalX();
//			mTouch.y =mScroller.getFinalY();
        }
    }

    /**
     * 是否从左边翻向右边
     */
    public boolean DragToRight() {
        if (mCornerX > 0)
            return false;
        return true;
    }

//	public void drawOnBitmap(Bitmap bitmap, PageIndex index) {
//
//	}

}
