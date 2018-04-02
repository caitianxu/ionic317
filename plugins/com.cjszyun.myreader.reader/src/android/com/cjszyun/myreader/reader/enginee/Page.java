package com.cjszyun.myreader.reader.enginee;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.text.TextUtils;

import com.cjszyun.myreader.reader.AppData;
import com.cjszyun.myreader.reader.beans.LinePosition;
import com.cjszyun.myreader.reader.config.ReadConfig;
import com.cjszyun.myreader.reader.utils.FileUtil;

import java.io.File;
import java.util.Vector;

/**
 * Created by zhuzd on 15/6/1.
 */
abstract public class Page {

    protected ReadConfig mReadConfig;
    protected ChapterManager mChapterManager;

    public Page(ChapterManager chapterManager) {
        this.mChapterManager = chapterManager;
        init();
    }

    private void init() {
        mReadConfig = AppData.getConfig().getReadConfig();
    }

    public boolean pageUp() {
        return mChapterManager.getChapter(ChapterManager.PageJump.CURRENT).pageUp();
    }

    public boolean pageDown() {
        return mChapterManager.getChapter(ChapterManager.PageJump.CURRENT).pageDown();
    }

    abstract protected void drawHead(final Canvas canvas);

    abstract protected void drawFoot(final Canvas canvas);

    public void draw(final Canvas canvas) {
        Vector<LinePosition> linePositions = mChapterManager.getChapter(ChapterManager.PageJump.CURRENT).getCurPageLinePositions();
        if (linePositions == null) {
            throw new RuntimeException("page draw text is null");
        }
        // 1.绘制背景
        Bitmap bg = mReadConfig.getBitmapBackground();
        if (bg == null||mReadConfig.isNight()) {
            canvas.drawColor(mReadConfig.getBackColor());
        } else {
            canvas.drawBitmap(bg, 0, 0, null);
        }

        // 2.绘制文字和图片
        float x = mReadConfig.getMarginWidth();
        float y = mReadConfig.getMarginHeight();
        int pageCount = mChapterManager.getChapter(ChapterManager.PageJump.CURRENT).getPageCount();
        int curPage = mChapterManager.getChapter(ChapterManager.PageJump.CURRENT).getCurPageIndex();
        if (pageCount > 1 && pageCount - 1 != curPage) {
            calcLineSpacingDelta(linePositions, mReadConfig.getVisibleHeight(), mReadConfig.getTextSize());
        } else {
            mReadConfig.calLineSpacing();
        }
        for (int i = 0; i < linePositions.size(); i++) {
            LinePosition linePosition = linePositions.get(i);
            if (linePosition.size > 0) {
                if (!TextUtils.isEmpty(linePosition.picUrl)) {//如果这一段是个图片则画一张图片上去
                    int v = drawEpubPic(canvas, mReadConfig.getPicPaint(), linePosition.picUrl, x, y );
                    y += v + mReadConfig.getNormalLineSpacing();
                    continue;
                }
                y += (mReadConfig.getTextSize() + mReadConfig.getNormalLineSpacing());
                drawLine(canvas, mReadConfig.getTextPaint(), linePosition, x, y - mReadConfig.getNormalLineSpacing());
            } else {
                y += (mReadConfig.getBigLineSpacing() - mReadConfig.getNormalLineSpacing());
            }
        }

        // 3. 绘制头部
        drawHead(canvas);

        // 4. 绘制底部
        drawFoot(canvas);
    }

    //画epub中的图片
    private int drawEpubPic(Canvas canvas, Paint picPaint, String picUrl, float x, float y) {
        File file = new File(picUrl);
        if (file.exists()){
            Bitmap bitmap = FileUtil.File2BitmapUpload(picUrl, mReadConfig.getVisibleWidth(),mReadConfig.getVisibleHeight());
//            Bitmap bitmap = BitmapFactory.decodeFile(picUrl);
            canvas.drawBitmap(bitmap, x, y, picPaint);
            return bitmap.getHeight();
        }
        return 0;
    }


    private void drawLine(final Canvas canvas, final Paint paint, final LinePosition linePosition,
                          final float x, final float y) {
        float[] character_width = new float[1]; //用以保存每个字的宽度
        float w = 0;
        for (int i = 0; i < linePosition.size; i++) {
            char c = linePosition.str.charAt(i);
            canvas.drawText(String.valueOf(c), x + w, y, paint);
            paint.getTextWidths(String.valueOf(c), character_width);
            w += character_width[0] + linePosition.spacing;
        }
    }

    private float calcSpacingDelta(final float actualWidth, final float maxWidth, final int num) {
        //TEST Point 2, for to test the Chinese punctuation typesetting.
//		DebugLog.d(String.format("actualWidth:%s, maxWidth:%s, num:%s", actualWidth, maxWidth, num));
        float extendWidth = maxWidth - actualWidth;
        if (extendWidth <= 0) {
            return 0.0f;
        }
        return extendWidth / (num - 1);
    }

    // 计算行间距
    private void calcLineSpacingDelta(Vector<LinePosition> linePositions, float maxHeight, float lineHeight) {
        if (linePositions.size() > 0) {
            int normal = 0, big = 0, pic = 0, picCount = 0;
            for (int i = 0; i < linePositions.size(); i++) {
                LinePosition linePosition = linePositions.get(i);
                if (linePosition.size > 0) {
                    if (!TextUtils.isEmpty(linePosition.picUrl)){//如果该段是张图片则加上图片的高度
                        File file = new File(linePosition.picUrl);
                        if (file.exists()){
//                            Bitmap bitmap = BitmapFactory.decodeFile(linePosition.picUrl);
                            Bitmap bitmap = FileUtil.File2BitmapUpload(linePosition.picUrl, AppData.getConfig().getReadConfig().getVisibleWidth(), AppData.getConfig().getReadConfig().getVisibleHeight());
                            pic +=bitmap.getHeight();
                            picCount++;
                            continue;
                        }
                    }
                    normal++;
                } else {
                    big++;
                }
            }
            float extendHeight = maxHeight - normal * lineHeight - pic;
            float standard;
            if (linePositions.get(linePositions.size() - 1).size == 0) {
                big -= 1;
            }
            standard = (extendHeight - 5) / (normal - 1 + picCount+(mReadConfig.getLineSpacingScale() - 1) * big);
            mReadConfig.setNormalLineSpacing(standard);
            mReadConfig.setBigLineSpacing(mReadConfig.getLineSpacingScale() * standard);
        }
    }
}
