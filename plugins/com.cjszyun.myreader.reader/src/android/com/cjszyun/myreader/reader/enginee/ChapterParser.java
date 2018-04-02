package com.cjszyun.myreader.reader.enginee;

import android.graphics.Bitmap;
import android.graphics.Paint;
import android.os.Handler;
import android.text.TextUtils;

import com.cjszyun.myreader.reader.AppData;
import com.cjszyun.myreader.reader.beans.LinePosition;
import com.cjszyun.myreader.reader.model.BookMsg;
import com.cjszyun.myreader.reader.utils.FileUtil;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Vector;

import static com.cjszyun.myreader.reader.model.BookMsg.HTML_BR;
import static com.cjszyun.myreader.reader.model.BookMsg.PUNCTUATION;

/**
 * Created by zhuzd on 15/9/29.
 */
public class ChapterParser {

    private final float LINE_NORMAL_SPACING;
    private final float LINE_BIG_SPACING;
    private final float MAX_LINE_HEIGHT;
    private final float MAX_LINE_WIDTH;
    private final float CHAR_SPACING;
    private final Paint textPaint;

    private List<Vector<LinePosition>> pageList;
    private List<Vector<LinePosition>> finalPageList;
    private int pagePosition;
    private static final int DEFAULT_LOAD_PAGE = 3;
    private int mPageCount;

    private volatile boolean isFinish;

    private Handler mHandler;
    private final Paint picPaint;

    public void setHandler(Handler mHandler) {
        this.mHandler = mHandler;
    }

    public boolean isFinish() {
        return isFinish;
    }

    public List<Vector<LinePosition>> getPageList() {
        return finalPageList;
    }

    public void setPageList(List<Vector<LinePosition>> pageList) {
        finalPageList.clear();
        finalPageList.addAll(pageList);
    }

    public ChapterParser(float normalSpacing, float bigSpacing, float visibleWidth, float visibleHeight, final Paint textPaint, final Paint picPaint, float charSpacing) {
        this.LINE_NORMAL_SPACING = normalSpacing;
        this.LINE_BIG_SPACING = bigSpacing;
        this.MAX_LINE_WIDTH = visibleWidth;
        this.MAX_LINE_HEIGHT = visibleHeight;
        this.CHAR_SPACING = charSpacing;
        this.textPaint = textPaint;
        this.picPaint = picPaint;
        pagePosition = 0;
        pageList = new ArrayList<Vector<LinePosition>>();
        finalPageList = new ArrayList<Vector<LinePosition>>();
    }

    public void setPagePosition(int mPagePosition) {
        this.pagePosition = mPagePosition;
    }

    public synchronized void parse(final String strChapter) {
        parse(strChapter, HTML_BR);
    }

    private void parse(final String strChapter, final String feed) {
        pageList.clear();
        isFinish = false;

        parseParagraph(pagePosition, strChapter, feed, true, DEFAULT_LOAD_PAGE + 1);
        parseParagraph(pagePosition, strChapter, feed, false, DEFAULT_LOAD_PAGE);

        setPageList(pageList);

        new Thread() {
            @Override
            public void run() {
                int start = pageList.get(0).firstElement().begin;
                int end = pageList.get(pageList.size() - 1).lastElement().begin
                        + pageList.get(pageList.size() - 1).lastElement().str.length();
                parseParagraph(end, strChapter, feed, true, -1);
                parseParagraph(start, strChapter, feed, false, -1);

                isFinish = true;

                if (mHandler != null) {
                    setPageList(pageList);
                    mHandler.sendEmptyMessage(BookMsg.PARSER_FINAL_PAGE_SUCCESS);
                }
            }
        }.start();
    }

    /*将章节内容分段**/
    private void parseParagraph(int para_pos, String strChapter, String feed, boolean order, int pageCount) {
        mPageCount = 0;
        lineHeight = 0;
        Vector<LinePosition> page = new Vector<LinePosition>();
        while (order ? para_pos < strChapter.length() : para_pos > 0) {
            String strParagraph;
            int offset;
            int end = order ? strChapter.indexOf(feed, para_pos) : strChapter.substring(0, para_pos).lastIndexOf(feed);
            if (end != -1) {
                strParagraph = order ? strChapter.substring(para_pos, end) : strChapter.substring(end + feed.length(), para_pos);
                offset = order ? end + feed.length() : end;
            } else {
                strParagraph = order ? strChapter.substring(para_pos) : strChapter.substring(0, para_pos);
                offset = order ? strChapter.length() : 0;
            }
            if (strParagraph.length() == 0) {
                //add empty line
                LinePosition line = new LinePosition(para_pos, 0);
                boolean condition = order ? page.size() > 0 && page.get(page.size() - 1).size != 0 : page.size() > 0 && page.get(0).size > 0;
                if (condition) {
                    page = addLine2Page(line, page, order);
                }
            } else {
                page = parseParagraphLineByLine(strParagraph, order ? para_pos : para_pos - strParagraph.length(), page, order);
            }

            para_pos = offset;

            if (mPageCount == pageCount) {
                break;
            }
        }

        if (page.size() > 0 && (mPageCount < pageCount || pageCount == -1)) {
            for (int i = 0; i < page.size(); i++) {
            }
            if (order) {
                pageList.add(page);
            } else {
                // 从第一个字开始 获取第一页内容
                page.clear();
                parseParagraph(0, strChapter, feed, true, 1);
                page = pageList.get(pageList.size() - 1);
                pageList.add(0, page);
                pageList.remove(pageList.size() - 1);
            }
        }
    }

    private float lineHeight = 0;

    private Vector<LinePosition> addLine2Page(LinePosition line, Vector<LinePosition> page, boolean order) {
        if (line.size > 0) {
            if (!TextUtils.isEmpty(line.picUrl)) {
                File file = new File(line.picUrl);
                if (file.exists()) {
//					Bitmap bitmap = BitmapFactory.decodeFile(line.picUrl);
                    try {
                        Bitmap bitmap = FileUtil.File2BitmapUpload(line.picUrl, AppData.getConfig().getReadConfig().getVisibleWidth(), AppData.getConfig().getReadConfig().getVisibleHeight());
                        lineHeight += bitmap.getHeight() + LINE_NORMAL_SPACING;
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            } else {
                lineHeight += (getTextSize() + LINE_NORMAL_SPACING);

            }
            if (lineHeight > MAX_LINE_HEIGHT) {
                lineHeight -= LINE_NORMAL_SPACING;
            }
        } else {
            lineHeight += (LINE_BIG_SPACING - LINE_NORMAL_SPACING);
            // 如果段+一行>总高度 强行加一行
            if (lineHeight < MAX_LINE_HEIGHT && (lineHeight + getTextSize()) > MAX_LINE_HEIGHT) {
                lineHeight = MAX_LINE_HEIGHT - getTextSize() - 5;
            }
        }

        if (lineHeight > MAX_LINE_HEIGHT) {
            //DebugLog.d("-----------page add---------------");
            if (order) {
                pageList.add(page);
            } else {
                pageList.add(0, page);
            }
            mPageCount++;

            page = new Vector<LinePosition>();
            lineHeight = 0;
            if (line.size > 0) {
                page = addLine2Page(line, page, order);
            }
        } else {
            if (order) {
                page.add(line);
            } else {
                page.add(0, line);
            }
        }
        return page;
    }

    private Vector<LinePosition> addParagraph2Page(Vector<LinePosition> paragraph, Vector<LinePosition> page, boolean order) {
        for (int i = order ? 0 : paragraph.size() - 1; order ? i < paragraph.size() : i >= 0; i = order ? i + 1 : i - 1) {
            LinePosition line = paragraph.get(i);
            page = addLine2Page(line, page, order);
        }

        return page;
    }

    /*将段落内容分行**/
    private Vector<LinePosition> parseParagraphLineByLine(final String strParagraph, final int para_pos, Vector<LinePosition> page, boolean order) {
        Vector<LinePosition> paragraph = new Vector<LinePosition>();
        final int num = strParagraph.length();
        float[] character_width = new float[1]; //用以保存每个字的宽度
        float lineWidth = 0;
        int offset = 0;
        if (strParagraph.contains("￼")) {//如果是一张图片
            LinePosition line = new LinePosition(para_pos,
                    1,
                    true,
                    "￼",
                    CHAR_SPACING,
                    0);
            line.picUrl = strParagraph.substring(strParagraph.indexOf("￼") + 1);
            paragraph.add(line);
            return addParagraph2Page(paragraph, page, order);
        }
        for (int i = 0; i < num; i++) {
            String str = String.valueOf(strParagraph.charAt(i));
            textPaint.getTextWidths(str, character_width); // character_width 保存字str的宽度
            lineWidth += (character_width[0] + CHAR_SPACING);
            if ((lineWidth - CHAR_SPACING) > MAX_LINE_WIDTH) {//超出一行长度就换行
                ////////////////////////////////////////////////////////////////////////////////////
                int enhanceIndex = enhancePunctuation(i, num, strParagraph);
                for (int j = 0; j < Math.abs(enhanceIndex - 1); j++) {
                    String subStr = String.valueOf(strParagraph.charAt(i - j));
                    textPaint.getTextWidths(subStr, character_width);
                    lineWidth -= (character_width[0] + CHAR_SPACING);
                }
                i += enhanceIndex;
                ////////////////////////////////////////////////////////////////////////////////////
                int size = i - offset;
                int position = para_pos + offset;
                LinePosition line = new LinePosition(position,
                        size,
                        false,
                        strParagraph.substring(offset, offset + size),
                        (MAX_LINE_WIDTH - lineWidth + size * CHAR_SPACING) / (size - 1),
                        lineWidth - CHAR_SPACING);

                paragraph.add(line);
                offset = i;
                i--;
                lineWidth = 0;
            } else {
                if (i == num - 1) { //循环至段落的最后一个字
                    int size = i - offset + 1;
                    int position = para_pos + offset;
                    LinePosition line = new LinePosition(position,
                            size,
                            true,
                            strParagraph.substring(offset),
                            CHAR_SPACING,
                            lineWidth - CHAR_SPACING);
                    int lastCharCount = (int) ((MAX_LINE_WIDTH - lineWidth) / (getTextSize() + CHAR_SPACING));
                    line.spacing = (MAX_LINE_WIDTH - lineWidth + (line.str.length() + lastCharCount) * CHAR_SPACING - (getTextSize() + CHAR_SPACING) * lastCharCount) / (line.str.length() + lastCharCount - 1);
                    paragraph.add(line);

                    offset = i;
                }
            }
        }

        return addParagraph2Page(paragraph, page, order);
    }

    private int enhancePunctuation(int pos, final int num, final String strParagraph) {
        if (pos >= num)
            return 0;
        char c = strParagraph.charAt(pos);
        if (PUNCTUATION.indexOf(c) > -1) {
            if (pos - 1 < num
                    && pos - 1 >= 0) {
                c = strParagraph.charAt(pos - 1);
                if (PUNCTUATION.indexOf(c) > -1) {
                    return -2;
                }
            }
            return -1;
        }
        return 0;
    }

    private float getTextSize() {
        float[] character_width = new float[1]; //用以保存每个字的宽度
        textPaint.getTextWidths("我", character_width);
        return character_width[0];
    }
}
