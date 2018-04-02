package com.cjszyun.myreader.reader.enginee;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Environment;
import android.util.DisplayMetrics;

import com.cjszyun.myreader.reader.config.ReadConfig;
import com.cjszyun.myreader.reader.utils.DebugLog;

import java.io.File;
import java.util.HashMap;

/**
 * Created by zhuzd on 15/5/16.
 */
public class Config {

	public String getAppName() {
		return "cjreader";
	}

	private final static String KEY_USERID = "userid";
	private final static String KEY_HAS_PUSHED = "hasPushed";


	public static final float BannerScale = 340 * 1.0f / 718;
	public static final float ShelfScale = 276 * 1.0f / 198;

//	private final static int FT_WIDTH = 690;
//	private final static int FT_HEIGHT = 120;

	private final static int FT_WIDTH = 685;
	private final static int FT_HEIGHT = 260;

	private String mPageCacheFileDir;     // 页面数据的缓存文件路径
	private String mLocalContentsFileDir; // 本地小说生成的目录文件存放路径
	private String mReadCacheRoot;
	private String mDownloadFileDir;      // 下载目录
	private String mShelfCacheDir;      // 下载目录

	public String getReadCacheRoot() {
		return mReadCacheRoot;
	}

	public String getShelfCacheDir() {
		return mShelfCacheDir;
	}

	private static final String mUrlBase = "http://www.cjzww.com/interface/MobInterface/AppContent.php?";
	private static final String basePath = Environment.getExternalStorageDirectory() + "/" + "Mycjreader";


	private HashMap<String, String> mUrlMap;
	private ClientUser mClientUser;
	private ReadConfig mReadConfig;
	private int mTopicHeight;
	private SharedPreferences sp;
	private int mUserID;
	private boolean mHasPushed; // 是否已获取推送书籍

	private Context context;

	public Config(Context context) {
		super();
		this.context = context;
		if (! init(context)) {
			DebugLog.d("应用程序配置数据未初始化");
		}
	}

	private boolean init(Context context) {
//		mPageCacheFileDir = context.getFilesDir().toString();
//		mLocalContentsFileDir = context.getFilesDir().toString();
		mPageCacheFileDir = basePath+"/pageCache";
		mLocalContentsFileDir = basePath+"/localContents";
		//mReadCacheRoot = Environment.getExternalStorageDirectory() + "/" + "cjreader";
		mShelfCacheDir = basePath+"/shelfCache";
//		File dir = context.getExternalFilesDir("book");
		File dir = new File(basePath+"/book");

		if (dir == null) {
//			mReadCacheRoot = context.getFilesDir().toString() + "/book" ;
			mReadCacheRoot = basePath + "/book" ;
		} else {
			mReadCacheRoot = dir.toString();
		}
//		dir = context.getExternalFilesDir("download");
		dir = new File(basePath+"/download");
		if (dir == null) {
//			mDownloadFileDir = context.getFilesDir().toString() + "/download" ;
			mDownloadFileDir = basePath + "/download" ;
		} else {
			mDownloadFileDir = dir.toString();
		}
		loadUrl(context);
		loadXmlConfig(context);
		mClientUser = new ClientUser(context, mUserID);
		mReadConfig = new ReadConfig(context);
		DisplayMetrics dm = context.getResources().getDisplayMetrics();
		mTopicHeight = (int)(FT_HEIGHT * dm.widthPixels / FT_WIDTH);
		return true;
	}

	private void loadXmlConfig(Context context) {
		sp = context.getSharedPreferences("config", Context.MODE_PRIVATE);
		mUserID = sp.getInt(KEY_USERID, 0);
		mHasPushed = sp.getBoolean(KEY_HAS_PUSHED, false);
	}

	public final static String URL_COMPOSITE        = "composite";
	public final static String URL_COLLECTION       = "collection";
	public final static String URL_CLASSIFY_PAGE    = "ClassifyPage";
	public final static String URL_HOT_UPDATE       = "HotUpdate";
	public final static String URL_SHORT_BOOK       = "ShortBook";
	public final static String URL_MONTHLY          = "Monthly";
	public final static String URL_CHANNEL_GIRL     = "ChannelGirl";
	public final static String URL_CHANNEL_BOY      = "ChannelBoy";
	public final static String URL_CHANNEL_LETTER   = "letter";
	public final static String URL_LETTER_MORE      = "letterMore";
	public final static String URL_BOOK_WEEK        = "bookWeek";
	public final static String URL_BOOK_DISCOUNT    = "bookDiscount";
	public final static String URL_MORE_RANK        = "moreRank";
	public final static String URL_PUSH_PAGE        = "pushPage";

	private void loadUrl(Context context) {
		mUrlMap = new HashMap<String, String>();
		String urlComposite = "act=Index";
		String urlCollection = "act=collection";
		String urlClassifyPage = "act=ClassPage";
		String urlHotUpdate = "act=HotUpdate";
		String urlShortBook = "act=DpBook";
		String urlMonthly = "act=Monthly";
		String urlChannelGirl = "act=NVIndex";
		String urlChannelBoy = "act=NANIndex";
		String urlChannelLetter = "act=WENIndex";
		String urlLetterMore = "act=WenXueMore";
		String urlBookWeek = "act=WeekBook";
		String urlBookDiscount = "act=Discount";
		String urlMoreRank = "act=MoreRanks";
		String urlPushPage = "act=PushPage";

		mUrlMap.put(URL_COMPOSITE, urlComposite);
		mUrlMap.put(URL_COLLECTION, urlCollection);
		mUrlMap.put(URL_CLASSIFY_PAGE, urlClassifyPage);
		mUrlMap.put(URL_HOT_UPDATE, urlHotUpdate);
		mUrlMap.put(URL_SHORT_BOOK, urlShortBook);
		mUrlMap.put(URL_MONTHLY, urlMonthly);
		mUrlMap.put(URL_CHANNEL_GIRL, urlChannelGirl);
		mUrlMap.put(URL_CHANNEL_BOY, urlChannelBoy);
		mUrlMap.put(URL_CHANNEL_LETTER, urlChannelLetter);
		mUrlMap.put(URL_LETTER_MORE, urlLetterMore);
		mUrlMap.put(URL_BOOK_WEEK, urlBookWeek);
		mUrlMap.put(URL_BOOK_DISCOUNT, urlBookDiscount);
		mUrlMap.put(URL_MORE_RANK, urlMoreRank);
		mUrlMap.put(URL_PUSH_PAGE, urlPushPage);
	}


	public ClientUser getClientUser() {
		return mClientUser;
	}

	public ReadConfig getReadConfig() {
		return mReadConfig;
	}

}
