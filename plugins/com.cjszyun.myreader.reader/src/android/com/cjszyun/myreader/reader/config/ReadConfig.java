package com.cjszyun.myreader.reader.config;

import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Typeface;

import com.cjszyun.myreader.reader.AppData;
import com.cjszyun.myreader.reader.utils.DisplayUtil;
import com.cjszyun.myreader.reader.utils.FileUtil;
import com.cjszyun.myreader.reader.views.PageWidget;


/**
 * Created by zhuzd on 15/5/17.
 */
public class ReadConfig {

	private final static String KEY_TEXT_SIZE         = "text_size";
	private final static String KEY_TEXT_COLOR        = "text_color";
	private final static String KEY_LINE_SPACING      = "line_spacing";
	private final static String KEY_IS_NIGHT          = "night";
	private final static String KEY_IS_PORTRAIT       = "portrait";
	private final static String KEY_IS_SYS_BRIGHTNESS = "system_brightness";
	private final static String KEY_READ_BRIGHTNESS   = "brightness";
	private final static String KEY_SCROLL_MODE       = "scroll_mode";
	private final static String KEY_BG_COLOR_INDEX    = "bg_color_index";
	private final static String KEY_TEXT_TYPE_INDEX    = "bg_text_type";
	private final static String KEY_CHAR_SPACING      = "char_spacing";
	private final static String KEY_NORMAL_LINE_SPACING_RATE  = "normal_line_spacing_rate";
	private final static String KEY_BIG_LINE_SPACING_RATE     = "big_line_spacing_rate";

	private final static int TEXT_SIZE_MIN_SP = 20;
	private final static int TEXT_SIZE_MAX_SP = 160;
	private final static int TEXT_SIZE_DEFAULT_SP = 50;

	private final static int LINE_SPACING_MIN = 2;
	public  final static int LINE_SPACING_MAX = 32;
	public  final static int LINE_SPACING_DEFAULT = 20;
	private final static float CHAR_SPACING = 1f;

	private final static int EXTRA_SIZE_DEFAULT_SP = 10;

	private final static float NORMAL_LINE_SPACING_RATE = 0.5f;
	private final static float BIG_LINE_SPACING_RATE = 1f;

    private int textTypeIndex;
    private final Typeface[] textTypes;

    private PageWidget.Mode scrollMode; // 翻页模式
	private boolean portrait; // 屏幕方向 true:竖屏，false:横屏
	private boolean sysBrightness;
	private int readBrightness;

	private int width, height;                 // 需设置; see: setSize(int w, int h)
	private float marginWidth, marginHeight;   // 左右边距,上下边距;
	private float visibleWidth, visibleHeight; // 绘制内容的宽,高; 计算后获取
	private int lineCount;                     // 行数,计算后获取
	private float normalLineSpacing;           // 正常行间距
	private float bigLineSpacing;              // 段落行间距
	private float charSpacing;                 // 字符间距
	private float normalLineSpacingRate;       // 正常行间距比例
	private float bigLineSpacingRate;          // 段落行间距比例

	private int lineSpacing;

	private int textSize; // 单位sp

	private float batteryWidth, batteryHeight;
	private float batteryPercent = 0.0f;

	private boolean night; // true : 黑夜模式

	private int bgColor[];
	private int backColorIndex;
	private int nightBgColor = Color.BLACK;

	private int textColor = Color.BLACK; // 默认黑色
	private int nightTextColor;

	private Paint textPaint;
	private Paint extraPaint;
	private Paint picPaint;
	private Bitmap bitmapBackground;

	private Context context;
	private SharedPreferences sp;


    public ReadConfig(Context context) {
		this.context = context;
		sp = context.getSharedPreferences("read_action", Context.MODE_PRIVATE);

		//init
		portrait       = sp.getBoolean(KEY_IS_PORTRAIT, true);
		night          = sp.getBoolean(KEY_IS_NIGHT, false);
		textSize       = sp.getInt(KEY_TEXT_SIZE, TEXT_SIZE_DEFAULT_SP);
		lineSpacing    = sp.getInt(KEY_LINE_SPACING, LINE_SPACING_DEFAULT);
		backColorIndex = sp.getInt(KEY_BG_COLOR_INDEX, 0);
		textTypeIndex  = sp.getInt(KEY_TEXT_TYPE_INDEX, 0);
		readBrightness = sp.getInt(KEY_READ_BRIGHTNESS, 255);
		sysBrightness  = sp.getBoolean(KEY_IS_SYS_BRIGHTNESS, true);
		int mode       = sp.getInt(KEY_SCROLL_MODE, 0);
		scrollMode     = PageWidget.Mode.getMode(mode);
		charSpacing    = sp.getFloat(KEY_CHAR_SPACING, CHAR_SPACING);
		normalLineSpacingRate  = sp.getFloat(KEY_NORMAL_LINE_SPACING_RATE, NORMAL_LINE_SPACING_RATE);
		bigLineSpacingRate     = sp.getFloat(KEY_BIG_LINE_SPACING_RATE, BIG_LINE_SPACING_RATE);

		//initBgColor
		bgColor = new int[4];
		bgColor[0] = context.getResources().getColor(context.getResources().getIdentifier("read_bg1","color",context.getPackageName()));
		bgColor[1] = context.getResources().getColor(context.getResources().getIdentifier("read_bg2","color",context.getPackageName()));
		bgColor[2] = context.getResources().getColor(context.getResources().getIdentifier("read_bg3","color",context.getPackageName()));
		bgColor[3] = context.getResources().getColor(context.getResources().getIdentifier("read_bg4","color",context.getPackageName()));
		//bgColor[4] = context.getResources().getColor(R.color.read_bg_night);
		nightTextColor = context.getResources().getColor(context.getResources().getIdentifier("read_text_night","color",context.getPackageName()));

		//如果选的背景是图片
		if (backColorIndex==0){
			Bitmap bitmap = BitmapFactory.decodeResource(context.getResources(), context.getResources().getIdentifier("read_bg","drawable",context.getPackageName()));
			Bitmap bm = FileUtil.fitBitmap(bitmap, AppData.getInstance().getScreenWidth(), AppData.getInstance().getScreenHeight());
			setBitmapBackground(bm);
		}

        //initTextType
        textTypes = new Typeface[4];
        textTypes[0] = Typeface.DEFAULT;
		textTypes[1] = Typeface.createFromAsset(AppData.getInstance().getAssets(), "fzkt.ttf");
		textTypes[2] = Typeface.createFromAsset(AppData.getInstance().getAssets(), "fzst.ttf");
		textTypes[3] = Typeface.DEFAULT_BOLD;

		//initExtra,设置字体setTypeface(Typeface typeface)
		textPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
		textPaint.setTextAlign(Paint.Align.LEFT);
        textPaint.setTextSize(textSize);
		textPaint.setColor(textColor);
        textPaint.setTypeface(textTypes[textTypeIndex]);


		//去锯齿
		picPaint = new Paint();
		picPaint.setAntiAlias(true);

		extraPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
		extraPaint.setTextAlign(Paint.Align.LEFT);
		extraPaint.setTextSize(DisplayUtil.dip2px(context, EXTRA_SIZE_DEFAULT_SP));
		extraPaint.setColor(Color.GRAY);

		marginHeight = DisplayUtil.dip2px(context, 28.0f);
		marginWidth = DisplayUtil.dip2px(context, 15.0f);

		float textHeight = getExtraTextHeight();
		batteryHeight = textHeight * 2 / 3;
		batteryWidth = 2 * batteryHeight;
		//初次进去如果是夜间模式改字体颜色
		if (isNight())setTextColor(nightTextColor);
	}

	//You must first set before use!
	public void setSize(int w, int h) {
		if (w != width || h != height) {
			width = w;
			height = h;
			calVisible();
			calLineCount();
			calLineSpacing();
		}
	}

	public int getWidth() {
		return width;
	}
	public int getHeight() {
		return height;
	}

	private void calVisible() {
		visibleWidth = width - marginWidth * 2;
		visibleHeight = height - marginHeight * 2;
	}

	private void calLineCount() {
		lineCount = (int) (visibleHeight / (textSize + lineSpacing));
	}

	public float getCharSpacing() {
		return charSpacing;
	}

	public void setCharSpacing(float charSpacing) {
		this.charSpacing = charSpacing;
	}

	public void calLineSpacing() {
		normalLineSpacing = normalLineSpacingRate * textSize;
		bigLineSpacing = bigLineSpacingRate * textSize;
	}

	//http://mikewang.blog.51cto.com/3826268/871765
	public float getExtraTextHeight() {
		Paint.FontMetrics fm = extraPaint.getFontMetrics();
		return (float) Math.ceil(fm.descent - fm.ascent + fm.leading);
	}

	public float getLineSpacingScale() {
		return bigLineSpacingRate / normalLineSpacingRate;
	}

	public float getNormalLineSpacing() {
		return normalLineSpacing;
	}

	public float getBigLineSpacing() {
		return bigLineSpacing;
	}

	public void setNormalLineSpacing(float normalLineSpacing) {
		this.normalLineSpacing = normalLineSpacing;
	}

	public void setBigLineSpacing(float bigLineSpacing) {
		this.bigLineSpacing = bigLineSpacing;
	}

	public int getTextSize() {
		return textSize;
	}
	public boolean setTextSize(int textSize) {
		if (this.textSize == textSize) {
			return true;
		}
		if (textSize < TEXT_SIZE_MIN_SP || textSize > TEXT_SIZE_MAX_SP) {
			return false;
		}
		this.textSize = textSize;
		this.textPaint.setTextSize(textSize);
		calLineCount();
		calLineSpacing();
		SharedPreferences.Editor editor = sp.edit();
		editor.putInt(KEY_TEXT_SIZE, this.textSize);
		editor.commit();
		return true;
	}

	public int getLineSpacing() {
		return lineSpacing;
	}

	public boolean isNight() {
		return night;
	}
	public void setNight(boolean night) {
		if (this.night == night) {
			return;
		}
		this.night = night;
		if (night) {
			setTextColor(nightTextColor); //night
		} else {
			setTextColor(Color.BLACK); //day
		}
		SharedPreferences.Editor editor = sp.edit();
		editor.putBoolean(KEY_IS_NIGHT, this.night);
		editor.commit();
	}

	public boolean isPortrait() {
		return portrait;
	}
	public void setPortrait(boolean portrait) {
		if (this.portrait == portrait) {
			return;
		}
		this.portrait = portrait;
		SharedPreferences.Editor editor = sp.edit();
		editor.putBoolean(KEY_IS_PORTRAIT, this.portrait);
		editor.commit();
	}

	public PageWidget.Mode getScrollMode() {
		return scrollMode;
	}
	public void setScrollMode(PageWidget.Mode scrollMode) {
		if (this.scrollMode == scrollMode) {
			return;
		}
		this.scrollMode = scrollMode;
		SharedPreferences.Editor editor = sp.edit();
		editor.putInt(KEY_SCROLL_MODE, this.scrollMode.index);
		editor.commit();
	}

	public boolean isSysBrightness() {
		return sysBrightness;
	}
	public void setSysBrightness(boolean sysBrightness) {
		if (this.sysBrightness == sysBrightness) {
			return;
		}
		this.sysBrightness = sysBrightness;
		SharedPreferences.Editor editor = sp.edit();
		editor.putBoolean(KEY_IS_SYS_BRIGHTNESS, this.sysBrightness);
		editor.commit();
	}

	public int getReadBrightness() {
		return readBrightness;
	}
	public void setReadBrightness(int readBrightness) {
		if (this.readBrightness == readBrightness) {
			return;
		}
		this.readBrightness = readBrightness;
		SharedPreferences.Editor editor = sp.edit();
		editor.putInt(KEY_READ_BRIGHTNESS, this.readBrightness);
		editor.commit();
	}

	public int getBackColorIndex() {
		return backColorIndex;
	}

	public int getBackColor() {
		if (night) {
			return nightBgColor;
		} else {
			return bgColor[backColorIndex];
		}
	}

	public void setBackColorIndex(int index) {
		if (this.backColorIndex == index) {
			return;
		}
		if (index < 0 || index > bgColor.length) {
			throw new RuntimeException("this color is not exist");
		}
		this.backColorIndex = index;
		SharedPreferences.Editor editor = sp.edit();
		editor.putInt(KEY_BG_COLOR_INDEX, this.backColorIndex);
		editor.commit();
	}

	public float getMarginWidth() {
		return marginWidth;
	}
	public void setMarginWidth(float w) {
		marginWidth = w;
		calVisible();
	}

	public void setNormalLineSpacingRate(float normalLineSpacingRate) {
		this.normalLineSpacingRate = normalLineSpacingRate;
		calLineSpacing();
	}

	public float getBigLineSpacingRate() {
		return bigLineSpacingRate;
	}

	public float getNormalLineSpacingRate() {
		return normalLineSpacingRate;
	}

	public void setBigLineSpacingRate(float bigLineSpacingRate) {
		this.bigLineSpacingRate = bigLineSpacingRate;
		calLineSpacing();
	}

	public float getMarginHeight() {
		return marginHeight;
	}

	public float getVisibleWidth() {
		return visibleWidth;
	}
	public float getVisibleHeight() {
		return visibleHeight;
	}

	public int getLineCount() {
		return lineCount;
	}

	public float getBatteryHeight() {
		return batteryHeight;
	}
//	public void setBatteryHeight(float batteryHeight) {
//		this.batteryHeight = batteryHeight;
//	}

	public float getBatteryWidth() {
		return batteryWidth;
	}
//	public void setBatteryWidth(int batteryWidth) {
//		this.batteryWidth = batteryWidth;
//	}

	public float getBatterPercent() {
		return batteryPercent;
	}
	public void setBatteryPercent(float percent) {
		batteryPercent = percent;
	}

	public Paint getTextPaint() {
		return textPaint;
	}
	public Paint getPicPaint() {
		return picPaint;
	}

	public Paint getExtraPaint() {
		return extraPaint;
	}

	public Bitmap getBitmapBackground() {
		return bitmapBackground;
	}
	public void setBitmapBackground(Bitmap bitmapBackground) {
		this.bitmapBackground = bitmapBackground;
	}

	public int getTextColor() {
		return textColor;
	}
	private void setTextColor(int textColor) {
		if (this.textColor == textColor) {
			return;
		}
		this.textColor = textColor;
		textPaint.setColor(textColor);
		SharedPreferences.Editor editor = sp.edit();
		editor.putInt(KEY_TEXT_COLOR, this.textColor);
		editor.commit();
	}

	public int getTextTypeIndex() {
		return textTypeIndex;
	}
	//设置字体
	public void setTextType(int typeIndex) {
		if (this.textTypeIndex == typeIndex) {
			return;
		}
        this.textTypeIndex = typeIndex;
            textPaint.setTypeface(textTypes[textTypeIndex]);

		SharedPreferences.Editor editor = sp.edit();
		editor.putInt(KEY_TEXT_TYPE_INDEX, this.textTypeIndex);
		editor.commit();
	}

}
